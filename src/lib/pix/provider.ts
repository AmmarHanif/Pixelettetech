/**
 * The model-provider boundary for Pix T.
 *
 * WHY AN INTERFACE RATHER THAN A CLIENT. Section 34 forbids hard-wiring the
 * application to one provider, and the reason is not portability for its own
 * sake: it is that the gateway's logic - routing, budgets, validation, fallback
 * - has to be testable and reviewable without a network, a key or a bill. With
 * a boundary, MockProvider exercises every path in the gateway deterministically
 * and the production adapter is the only part that is ever unverified.
 *
 * NOTHING HERE READS A CREDENTIAL AND NOTHING HERE CALLS OUT. Section 33 is
 * explicit: paid inference is authorised in principle, but no account is to be
 * provisioned, no key created, no production cost incurred. So the production
 * adapter below is a DECLARED BOUNDARY that refuses. It exists so the shape is
 * fixed and reviewed now; it does not exist to be quietly switched on later by
 * someone setting a variable. Turning it on is a deliberate act that replaces
 * the body of one function, and the test suite asserts it currently refuses.
 *
 * THE FALLBACK IS NOT AN ERROR PATH. If no provider is configured - which is
 * the state today and the state of any fresh deployment - Pix T is the existing
 * deterministic assistant, working exactly as it does now. That is section 33's
 * requirement that the deterministic assistant remain operational, and it is
 * why every failure in this file returns a typed refusal rather than throwing.
 */

import { PIX_T, paidInferenceConfigured } from './config';

/** What the gateway asks a model to do. Deliberately small. */
export type Tier = 2 | 3;

export type GenerateRequest = {
  tier: Tier;
  /** The full prompt the gateway has already bounded and assembled. */
  system: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  maxOutputTokens: number;
};

export type Usage = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  /** Provider-reported where available; otherwise an estimate, flagged as one. */
  estimatedCost: number;
  costIsEstimate: boolean;
  latencyMs: number;
  model: string;
};

export type GenerateResult =
  | { ok: true; text: string; usage: Usage }
  | { ok: false; reason: ProviderRefusal; detail?: string };

/**
 * Why a generation did not happen.
 *
 * A closed set, because the gateway must map each one to visitor-facing
 * behaviour, and an open-ended error string invites a stack trace reaching a
 * visitor - which section 66 forbids.
 */
export type ProviderRefusal =
  | 'not-configured'
  | 'disabled-by-budget'
  | 'circuit-open'
  | 'timeout'
  | 'provider-error';

export interface ModelProvider {
  readonly id: string;
  generate(req: GenerateRequest): Promise<GenerateResult>;
  /** Short label for a routing or intent decision. */
  classify(input: string, labels: string[]): Promise<{ ok: boolean; label?: string }>;
  /** Compress older conversation into a bounded summary (section 26). */
  summarise(input: string, maxChars: number): Promise<{ ok: boolean; text?: string }>;
}

/* ------------------------------------------------------------------ mock -- */

/**
 * The development and test provider.
 *
 * DETERMINISTIC ON PURPOSE. A mock that returns random text cannot be asserted
 * against, so every response here is a pure function of its input: the same
 * request gives the same answer and the same token counts. That is what lets
 * the gateway's budget arithmetic, output caps and fallback paths be tested
 * exactly rather than approximately.
 *
 * It never reaches the network and has no credentials.
 */
export class MockProvider implements ModelProvider {
  readonly id = 'mock';

  async generate(req: GenerateRequest): Promise<GenerateResult> {
    const joined = req.messages.map(m => m.content).join(' ');
    const inputTokens = estimateTokens(req.system) + estimateTokens(joined);
    const last = req.messages[req.messages.length - 1]?.content ?? '';
    const text =
      `[mock tier ${req.tier}] ` +
      `This is a deterministic development response to: ${last.slice(0, 120)}`;
    const outputTokens = Math.min(estimateTokens(text), req.maxOutputTokens);
    return {
      ok: true,
      text,
      usage: {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens,
        estimatedCost: 0,
        costIsEstimate: true,
        latencyMs: 0,
        model: `mock-tier-${req.tier}`,
      },
    };
  }

  async classify(input: string, labels: string[]) {
    // Longest label whose word appears in the input; stable and inspectable.
    const lower = input.toLowerCase();
    const hit = labels.filter(l => lower.includes(l.toLowerCase())).sort((a, b) => b.length - a.length)[0];
    return { ok: true, label: hit ?? labels[0] };
  }

  async summarise(input: string, maxChars: number) {
    return { ok: true, text: input.replace(/\s+/g, ' ').slice(0, maxChars) };
  }
}

/* ------------------------------------------------------- production edge -- */

/**
 * The single place a real provider would be wired, and it currently refuses.
 *
 * DELIBERATELY NOT IMPLEMENTED. The brief authorises paid inference in
 * principle and forbids provisioning, credentials and live cost in the same
 * breath. Writing a working adapter now would mean either committing a
 * provider choice nobody has made, or leaving code that becomes live the moment
 * an environment variable is set - which is exactly how an unbudgeted bill
 * starts.
 *
 * WHEN IT IS TIME, the work is: implement generate() against the chosen
 * provider's SDK, read the key from a server-side secret at the point of use,
 * map the provider's usage figures onto Usage, and delete the refusal below.
 * The gateway needs no change, and pix-t.provider.test.ts asserts the refusal
 * is still in place, so switching it on cannot happen silently.
 */
export class UnconfiguredProvider implements ModelProvider {
  readonly id = 'unconfigured';

  async generate(): Promise<GenerateResult> {
    return { ok: false, reason: 'not-configured' };
  }

  async classify() {
    return { ok: false };
  }

  async summarise() {
    return { ok: false };
  }
}

/**
 * Which provider the gateway gets.
 *
 * The mock is available only when explicitly asked for, so a production
 * deployment cannot answer visitors with "[mock tier 2]" because somebody left
 * a default in place.
 */
export function resolveProvider(): ModelProvider {
  if (process.env.PIX_T_PROVIDER === 'mock') return new MockProvider();
  if (!paidInferenceConfigured()) return new UnconfiguredProvider();
  // No production adapter is wired. See the note on UnconfiguredProvider: this
  // returning `unconfigured` even when the environment looks complete is the
  // intended state until a provider and budget are approved.
  return new UnconfiguredProvider();
}

/**
 * A rough token count, used for bounding and for cost estimation.
 *
 * FOUR CHARACTERS PER TOKEN IS AN APPROXIMATION AND IS LABELLED AS ONE
 * throughout: Usage.costIsEstimate carries that fact to the telemetry so a
 * figure derived from this is never presented as a provider-reported number.
 * When a real provider is wired, its own reported usage replaces this.
 */
export function estimateTokens(s: string): number {
  return Math.ceil((s || '').length / 4);
}

export const PROVIDER_TIMEOUT_MS = PIX_T.providerTimeoutMs;
