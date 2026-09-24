import { contactEmail } from '@/content/company';
import { MIN_COVERAGE, hasEnoughSignal, search } from './retrieve';
import { CLAIM_GUARDS, RULES, publishableFacts } from './rules';
import { isPublishable } from '@/content/claims';

/**
 * Turns one visitor message into one reply. Pure, synchronous, offline.
 *
 * PURE ON PURPOSE. Same input, same output, every time, with no clock, no
 * randomness and no network. That is what makes the assistant testable: the
 * suite in scripts/test-pix.cjs can assert what it says to a price question and
 * know the answer will not drift. A chatbot whose replies cannot be asserted is
 * a chatbot whose guardrails cannot be proved.
 *
 * THE ORDER OF THE STAGES IS THE DESIGN:
 *   1. too little to go on      - ask, rather than guess at one word
 *   2. rules                    - refusals and redirects, which pre-empt everything
 *   3. claim guards             - only where the register says a claim is NOT published
 *   4. publishable facts        - the handful the register does allow
 *   5. retrieval above the floor- the site's own words, with the page it came from
 *   6. a pointer                - the question is known, the answer lives on a page
 *   7. an honest "I do not know"- and a route to a person
 *
 * STAGE 7 IS A FEATURE. Most of the value of this design is in what it refuses
 * to say, so the fallback is not an apology for a gap; it is the mechanism
 * working.
 */

export type PixReply = {
  text: string;
  /** A page worth offering alongside the answer. */
  path?: string;
  /** Where the answer came from, shown to the visitor so nothing looks conjured. */
  sourceLabel?: string;
  /** Which stage produced this, for tests and for the transparency note. */
  via:
    | 'ask-more'
    | 'rule'
    | 'claim-guard'
    | 'fact'
    | 'kb'
    | 'pointer'
    | 'no-answer';
  /** The rule or claim id, where one fired. */
  ruleId?: string;
};

/**
 * A readable name for a page the assistant offers.
 *
 * Rules and facts carry a destination but no title, so without this every link
 * in the panel read "Open the page" - which tells a visitor nothing about where
 * they are being sent, and makes four different answers look like the same one.
 */
function labelForPath(p: string): string {
  const last = p.split('/').filter(Boolean).pop();
  if (!last) return 'the homepage';
  return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const NO_ANSWER =
  'I do not have that on this site, and I am not going to guess at it. ' +
  `The team can answer properly: the contact page is the quickest route, or ${contactEmail}.`;

export function respond(messageRaw: string): PixReply {
  /*
   * Strip markup before anything else looks at the text. Nothing here renders
   * HTML, so this is not an XSS control; it stops a pasted tag from being
   * treated as content words and skewing retrieval.
   */
  const message = String(messageRaw || '')
    .replace(/<[^>]*>/g, ' ')
    .slice(0, 2000)
    .trim();

  if (!message) {
    return { via: 'ask-more', text: 'Ask me anything about the engineering, AI or blockchain work on this site.' };
  }

  // ---------------------------------------------------------------- 2. rules
  // Before the length check: a one-word insult is still abuse.
  for (const rule of RULES) {
    if (rule.test.test(message)) {
      return {
        via: 'rule',
        ruleId: rule.id,
        text: rule.reply,
        path: rule.path,
        sourceLabel: rule.path ? labelForPath(rule.path) : undefined,
      };
    }
  }

  // -------------------------------------------------------- 3. claim guards
  for (const guard of CLAIM_GUARDS) {
    // Only guards a claim the register currently withholds. If it is released,
    // this stage falls silent and retrieval answers from the page instead.
    if (!isPublishable(guard.id) && guard.test.test(message)) {
      return {
        via: 'claim-guard',
        ruleId: guard.id,
        text: guard.whenHeld,
        path: '/contact',
        sourceLabel: 'Contact',
      };
    }
  }

  // ------------------------------------------------------ 4. published facts
  for (const fact of publishableFacts()) {
    if (fact.test.test(message)) {
      return {
        via: 'fact',
        text: fact.reply,
        path: fact.path,
        sourceLabel: fact.path ? labelForPath(fact.path) : undefined,
      };
    }
  }

  /*
   * THE SIGNAL GATE SITS HERE, AFTER the rules, guards and facts rather than
   * before them, and the order was wrong at first with a visible cost. Those
   * three stages match on the raw message and need no token signal at all, so
   * gating in front of them meant "What does Pixelette actually do?" was met
   * with "tell me a bit more" - a question the facts layer answers directly.
   * Only RETRIEVAL needs enough signal to rank on, so only retrieval is gated.
   */
  if (!hasEnoughSignal(message)) {
    return {
      via: 'ask-more',
      text: 'Tell me a bit more and I will find the right page. What are you trying to build, or what do you want to know about how the firm works?',
    };
  }

  // ---------------------------------------------------------- 5/6. retrieval
  const hits = search(message, 3);
  const best = hits[0];

  if (best && best.coverage >= MIN_COVERAGE) {
    if (best.doc.kind === 'pointer') {
      return {
        via: 'pointer',
        text: `That one is answered on the ${best.doc.page ?? 'relevant'} page rather than in a line I can quote back to you. It is worth reading there.`,
        path: best.doc.path ?? undefined,
        sourceLabel: best.doc.page ?? undefined,
      };
    }
    if (best.doc.text) {
      return {
        via: 'kb',
        text: best.doc.text,
        path: best.doc.path ?? undefined,
        sourceLabel: best.doc.kind === 'faq' ? best.doc.page : best.doc.title,
      };
    }
  }

  // ------------------------------------------------------------ 7. no answer
  return { via: 'no-answer', text: NO_ANSWER, path: '/contact', sourceLabel: 'Contact' };
}

/** Openers shown in the panel, each one chosen because the site can answer it. */
export const STARTERS: readonly string[] = [
  'What does Pixelette actually do?',
  'How do you evaluate an AI system?',
  'Do you work with blockchain?',
  'What certifications do you hold?',
];
