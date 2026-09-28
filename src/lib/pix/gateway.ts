/**
 * The Pix T gateway: the control plane.
 *
 * THE MODEL IS A COMPONENT, NOT THE DECIDER. That is section 7's whole point
 * and it is the difference between this and a chatbot wrapper. Everything that
 * matters - abuse, rate, quota, claim guards, pricing, timelines, client
 * confidentiality, off-topic - is settled in code BEFORE a model is reachable,
 * and validated again in code afterwards. "The LLM has been told not to" is not
 * a control, and section 6 forbids replacing the existing guards with one.
 *
 * ORDER IS LOAD-BEARING. Cheap and certain first, expensive and uncertain last:
 *
 *    rate  ->  input caps  ->  deterministic pipeline  ->  off-topic
 *          ->  quota  ->  budget  ->  provider  ->  output validation
 *
 * The deterministic pipeline sits BEFORE quota deliberately. A question the
 * site can already answer must cost the visitor nothing, which is sections 8,
 * 19 and 20 read together; putting quota first would charge an allowance for an
 * answer no model produced. Off-topic sits before quota for the same reason in
 * reverse - section 42 asks for it to be caught before a paid call, so a
 * visitor asking for a recipe never spends a turn.
 *
 * WHAT THIS FILE DOES NOT DO YET. No provider is wired (section 33), so the
 * escalation path always ends in a typed refusal and the deterministic answer
 * is what the visitor receives. That is the fallback working, not a gap: today
 * Pix T behaves exactly as the current assistant does, with the architecture
 * around it ready for a provider to be connected once one is approved.
 */

import { PIX_T } from './config';
import {
  aiTurnsRemaining,
  checkBudget,
  checkRate,
  consumeAiTurn,
  recordProviderOutcome,
  recordSpend,
  type LimitReason,
} from './limits';
import type { PixContext } from './context';
import { estimateTokens, resolveProvider, type Tier } from './provider';
import { respond, type PixReply } from './respond';

export type GatewayRequest = {
  sessionId: string;
  message: string;
  /** Which page the visitor is on, for the contextual opener (section 13). */
  pagePath?: string;
  /*
   * MERGE REPAIR 2026-09-28. The reduced context - what the assistant is
   * allowed to know about the claims register and the company record - is
   * PASSED IN rather than imported here, and that is deliberate.
   *
   * `respond()` gained this parameter in the work that moved both registers off
   * the client. This file was written against the one-argument form in a
   * separate line of work, so the two merged as clean TEXT and then failed to
   * COMPILE - the kind of break a textual merge cannot see.
   *
   * The obvious repair was to import `pixContext()` here. That compiled, and it
   * BROKE `scripts/test-pix-t.cjs`, which loads this module in plain Node:
   * `server-context` carries `import 'server-only'`, which Next provides and
   * bare Node does not. Injecting it instead keeps this module free of server
   * bindings and unit-testable, and leaves the server-only boundary where it
   * belongs - at the route handler, which is the thing that is actually
   * server-only.
   */
  context: PixContext;
};

export type GatewayReply = {
  text: string;
  path?: string;
  sourceLabel?: string;
  /** Deterministic stage, or the tier that answered. */
  via: PixReply['via'] | 'tier-2' | 'tier-3' | 'limited' | 'unavailable';
  /** Shown only when the visitor is close to their allowance (section 19). */
  aiTurnsRemaining?: number;
  /** Internal only. The route never returns this to the browser. */
  telemetry: Telemetry;
};

/**
 * Section 36 and 61. Operational metadata, deliberately separate from content.
 *
 * NO PROMPT OR RESPONSE BODY IS CARRIED HERE. Section 36 says not to log
 * conversation content merely for cost accounting, and section 61 says
 * observability must not require storing prompt and response bodies. So this
 * records what happened and what it cost, and nothing about what was said.
 */
export type Telemetry = {
  at: string;
  sessionId: string;
  tier: 0 | 2 | 3;
  model?: string;
  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  costIsEstimate?: boolean;
  latencyMs?: number;
  outcome: 'deterministic' | 'generated' | 'refused' | 'limited' | 'fallback';
  /** Why tier 3 was chosen, where it was (section 10). */
  escalationReason?: string;
  limitReason?: LimitReason;
};

/**
 * Requests that are not Pixelette or technology business.
 *
 * DETERMINISTIC, AND DELIBERATELY BEFORE THE QUOTA. Section 42 asks for
 * off-topic to be intercepted before a paid call wherever detection is reliable
 * enough. These patterns are narrow on purpose: a false positive here refuses a
 * real visitor, which is worse than letting an unusual question through to the
 * deterministic pipeline, where the worst case is a polite "not on this site".
 */
const OFF_TOPIC = [
  /\b(write|do|help\s+with)\s+my\s+(homework|essay|assignment|dissertation)\b/i,
  /\b(recipe|poem|song lyrics|short story|screenplay)\b/i,
  /\btranslate\s+(this|the following)\b/i,
  /\bwhat('s| is) (the )?(weather|news|football score)\b/i,
  /\bsummari[sz]e (this|the following) (document|pdf|article|text)\b/i,
];

const OFF_TOPIC_REPLY =
  "I'm here to help with Pixelette Technologies and technology projects. " +
  "Tell me what you're trying to build, automate or improve.";

/**
 * Attempts to talk to the policy rather than to Pix T.
 *
 * REGEX IS NOT THE DEFENCE, it is the cheap first pass. Section 40 says not to
 * rely on it alone, and the real boundary is architectural: retrieved passages
 * are passed to a model as DATA inside a delimited block, the system policy is
 * never in a position a message can overwrite, and nothing a visitor writes can
 * reach the tier router or the guards. This list exists so the obvious attempts
 * never cost a turn.
 */
const INJECTION = [
  /ignore (all )?(your |the )?(previous|prior|above) instructions/i,
  /\b(show|reveal|print|repeat) (me )?(your |the )?(system )?(prompt|instructions)\b/i,
  /\bact as (an? )?(unrestricted|jailbroken|developer mode)\b/i,
  /\buse this (page|text|message) as your (new )?system (message|prompt)\b/i,
  /\bdisregard (your|the) (rules|policy|guardrails)\b/i,
];

const INJECTION_REPLY =
  'I keep to what Pixelette Technologies publishes and how I am set up to work. ' +
  'Ask me about a project or a technology problem and I can be a lot more useful.';

/** Section 10: when is a more capable model justified? */
function tier3Reason(message: string): string | null {
  const m = message.toLowerCase();
  const signals: [RegExp, string][] = [
    [/\barchitect(ure|ing)\b.*\b(trade-?off|decision|approach)\b/, 'architecture trade-off'],
    [/\b(integrat\w+|connect\w+)\b.*\b(systems?|erp|crm|warehouse)\b.*\b(and|plus|with)\b/, 'multiple interacting systems'],
    [/\b(rag|fine-?tun\w+|embedding|vector|agentic|orchestrat\w+)\b/, 'sophisticated AI implementation'],
    [/\b(consensus|layer\s?2|rollup|zero-?knowledge|custody|tokenomics)\b/, 'complex blockchain use case'],
    [/\b(migrat\w+|re-?platform\w+|monolith|microservices)\b/, 'difficult engineering trade-off'],
  ];
  for (const [re, why] of signals) if (re.test(m)) return why;
  return null;
}

function nowIso() {
  return new Date().toISOString();
}

export async function handle(req: GatewayRequest): Promise<GatewayReply> {
  const base: Telemetry = { at: nowIso(), sessionId: req.sessionId, tier: 0, outcome: 'deterministic' };

  /* -- 1. rate. Applies to every turn: the cheap path is still a round trip. */
  const rate = checkRate(req.sessionId);
  if (!rate.allowed) {
    return {
      via: 'limited',
      text: 'One moment - give me a few seconds between questions and I will keep up.',
      telemetry: { ...base, outcome: 'limited', limitReason: rate.reason },
    };
  }

  /* -- 2. input cap, section 24. */
  const raw = String(req.message || '');
  if (raw.length > PIX_T.messageMaxChars) {
    return {
      via: 'limited',
      text:
        `This is a little too much for ${PIX_T.name} in one message. ` +
        `Please summarise the main problem or project in under ${PIX_T.messageMaxChars} characters.`,
      telemetry: { ...base, outcome: 'limited' },
    };
  }

  /* -- 3. injection and off-topic, before anything can cost a turn. */
  if (INJECTION.some(re => re.test(raw))) {
    return { via: 'rule', text: INJECTION_REPLY, telemetry: { ...base, outcome: 'deterministic' } };
  }
  if (OFF_TOPIC.some(re => re.test(raw))) {
    return { via: 'rule', text: OFF_TOPIC_REPLY, telemetry: { ...base, outcome: 'deterministic' } };
  }

  /* -- 4. the existing deterministic pipeline, unchanged and free.
        Rules, claim guards, published facts, then retrieval. If it answers,
        the visitor pays nothing and no model is involved. */
  const deterministic = respond(raw, req.context);
  if (deterministic.via !== 'no-answer') {
    return { ...deterministic, telemetry: { ...base, outcome: 'deterministic' } };
  }

  /* -- 5. only now is a model worth considering. */
  const tier: Tier = tier3Reason(raw) ? 3 : 2;
  const escalationReason = tier === 3 ? (tier3Reason(raw) ?? undefined) : undefined;

  /*
   * THE ALLOWANCE IS CHECKED HERE AND SPENT LATER, and the distinction is the
   * whole of section 19: only a request that ACTUALLY invokes a model counts.
   *
   * The first version consumed the turn at this point, which was wrong in a way
   * only a test caught. With no provider configured - today's state, and every
   * fresh deployment's - the provider refuses, the visitor receives the
   * deterministic fallback, and no model runs anywhere. Consuming here charged
   * them for that. Eight unanswerable questions would have exhausted an
   * allowance without a single inference taking place.
   */
  if (aiTurnsRemaining(req.sessionId) <= 0) {
    const quota = { allowed: false } as const;
    void quota;
    return {
      via: 'limited',
      text:
        `You've reached today's AI-assisted conversation limit. I can still help you find ` +
        `information on the Pixelette website, or you can verify your email to continue the ` +
        `conversation.`,
      path: '/contact',
      sourceLabel: 'Contact',
      aiTurnsRemaining: 0,
      telemetry: { ...base, outcome: 'limited', limitReason: 'ai-turns-exhausted' },
    };
  }

  const budget = checkBudget(req.sessionId, tier);
  if (!budget.allowed) {
    return {
      ...fallbackReply(deterministic),
      telemetry: { ...base, outcome: 'fallback', limitReason: budget.reason, tier },
    };
  }

  /* -- 6. the provider. Not wired today; this resolves to a refusal and the
        visitor gets the deterministic answer. */
  const provider = resolveProvider();
  const started = Date.now();
  const result = await provider.generate({
    tier,
    system: 'placeholder-policy',
    messages: [{ role: 'user', content: raw }],
    maxOutputTokens: tier === 3 ? PIX_T.complexOutputTokenLimit : PIX_T.normalOutputTokenLimit,
  });

  if (!result.ok) {
    recordProviderOutcome(false);
    return {
      ...fallbackReply(deterministic),
      telemetry: {
        ...base,
        tier,
        outcome: 'refused',
        latencyMs: Date.now() - started,
        escalationReason,
      },
    };
  }

  /* A model ran. NOW the turn is spent. */
  recordProviderOutcome(true);
  consumeAiTurn(req.sessionId);
  recordSpend(req.sessionId, tier, result.usage.estimatedCost);

  /* -- 7. output validation. A cap the model was ASKED for is not a cap. */
  const text = capWords(result.text, tier === 3 ? 500 : 300);
  const remaining = aiTurnsRemaining(req.sessionId);

  return {
    via: tier === 3 ? 'tier-3' : 'tier-2',
    text,
    aiTurnsRemaining: remaining <= PIX_T.turnsRemainingHintAt ? remaining : undefined,
    telemetry: {
      ...base,
      tier,
      outcome: 'generated',
      model: result.usage.model,
      inputTokens: result.usage.inputTokens,
      outputTokens: result.usage.outputTokens,
      totalTokens: result.usage.totalTokens,
      estimatedCost: result.usage.estimatedCost,
      costIsEstimate: result.usage.costIsEstimate,
      latencyMs: result.usage.latencyMs,
      escalationReason,
    },
  };
}

/**
 * What the visitor sees when the model cannot run.
 *
 * NOT AN ERROR MESSAGE. Section 66 forbids exposing provider names, API errors
 * or configuration, and section 38 requires the site never to depend on a paid
 * model for basic information. So the visitor is given the deterministic
 * answer's own wording where it had one, and a useful offer where it did not.
 * Nothing in here tells them a model was involved or failed.
 */
function fallbackReply(deterministic: PixReply): Omit<GatewayReply, 'telemetry'> {
  return {
    via: 'unavailable',
    text:
      deterministic.via === 'no-answer'
        ? `I can still help you find the right Pixelette information. ` +
          `Tell me what you're trying to build, automate or improve, or the team can pick it up directly.`
        : deterministic.text,
    path: deterministic.path ?? '/contact',
    sourceLabel: deterministic.sourceLabel ?? 'Contact',
  };
}

/** Section 25. Enforced, not requested. */
export function capWords(text: string, maxWords: number): string {
  const words = String(text || '').trim().split(/\s+/);
  if (words.length <= maxWords) return String(text || '').trim();
  return words.slice(0, maxWords).join(' ') + '…';
}

export { estimateTokens };
