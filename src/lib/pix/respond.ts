import type { PixContext } from './context';
import { MIN_COVERAGE, hasEnoughSignal, pageDoc, search } from './retrieve';
import { CLAIM_GUARDS, TOPIC_ROUTES, publishableFacts, rules } from './rules';

/**
 * Turns one visitor message into one reply. Pure, synchronous, offline.
 *
 * PURE ON PURPOSE. Same input, same output, every time, with no clock, no
 * randomness and no network. That is what makes the assistant testable: the
 * suite in scripts/test-pix.cjs can assert what it says to a price question and
 * know the answer will not drift. A chatbot whose replies cannot be asserted is
 * a chatbot whose guardrails cannot be proved.
 *
 * THE REGISTERS ARE AN ARGUMENT, NOT AN IMPORT. What the claims register allows
 * and the company facts the replies quote arrive in `ctx`, built on the server
 * (see `context.ts`). This module runs in the browser, so importing the
 * registers here would ship them to every visitor - which it once did.
 *
 * THE ORDER OF THE STAGES IS THE DESIGN:
 *   1. nothing to go on          - ask
 *   2. rules                     - refusals and redirects, which pre-empt everything
 *   3. claim guards              - only where the register says a claim is NOT published
 *   4. publishable facts         - the handful the register does allow
 *   5. retrieval above the floor - the site's own words, with the page it came from
 *   6. topic routes              - the right page's own description, when 5 found nothing
 *   7. too little to go on       - ask, rather than guess at one word
 *   8. an honest "I don't know"  - and a route to a person
 *
 * STAGE 8 IS A FEATURE. Most of the value of this design is in what it refuses
 * to say, so the fallback is not an apology for a gap; it is the mechanism
 * working. It now also offers to take the enquiry, because a question the site
 * cannot answer is usually one the team can.
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
    | 'route'
    | 'no-answer';
  /** The rule, claim or route id, where one fired. */
  ruleId?: string;
  /** Offer to take the enquiry in the chat, alongside the link. */
  offer?: 'enquiry';
};

/**
 * A readable name for a page the assistant offers.
 *
 * Rules and facts carry a destination but no title, so without this every link
 * in the panel read "Open the page" - which tells a visitor nothing about where
 * they are being sent, and makes four different answers look like the same one.
 */
function labelForPath(p: string): string {
  if (p.endsWith('security.txt')) return 'security.txt';
  const last = p.split('/').filter(Boolean).pop();
  if (!last) return 'the homepage';
  return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/*
 * THE OTHER HALF OF THE TIMELINE GUARD. The rule catches timing questions as
 * they are usually asked; this catches the reply. If the visitor asked WHEN and
 * the passage about to be offered contains a duration, the passage is not
 * offered: a published fact about something else, placed under a question about
 * someone's delivery date, reads as a promise. Both halves are narrow on
 * purpose - "What is a Value Discovery?" still gets its published four weeks,
 * because nobody asked when.
 */
const TIMING_ASKED =
  /\b(when|how (long|soon|quickly|fast)|deadline|ready|timeline|time ?frame|turnaround|go live|asap|urgent(ly)?|in (\d+|a|one|two|three|four|five|six|a few|several) (days?|weeks?|months?))\b/i;
const DURATION =
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|a few|several)[- ](days?|weeks?|months?|quarters?|years?)\b/i;

const noAnswer = (email: string) =>
  'I do not have enough current Pixelette information to answer that accurately, and I would rather not guess. ' +
  `You are welcome to use the contact page or email ${email}, or I would be glad to take your details here.`;

export function respond(messageRaw: string, ctx: PixContext): PixReply {
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
    return { via: 'ask-more', text: 'Please ask me anything about the engineering, AI or blockchain work on this site.' };
  }

  const ruleSet = rules(ctx);
  const asReply = (rule: (typeof ruleSet)[number]): PixReply => ({
    via: 'rule',
    ruleId: rule.id,
    text: rule.reply,
    path: rule.path,
    sourceLabel: rule.path ? labelForPath(rule.path) : undefined,
    offer: rule.offer,
  });
  const timelineSafe = (reply: PixReply): PixReply => {
    if (!TIMING_ASKED.test(message) || !DURATION.test(reply.text)) return reply;
    const timeline = ruleSet.find(r => r.id === 'timeline');
    return timeline ? asReply(timeline) : reply;
  };

  // ---------------------------------------------------------------- 2. rules
  // Before the length check: a one-word insult is still abuse.
  for (const rule of ruleSet) {
    if (rule.test.test(message)) return asReply(rule);
  }

  // -------------------------------------------------------- 3. claim guards
  for (const guard of CLAIM_GUARDS) {
    // Only guards a claim the register currently withholds. If it is released,
    // this stage falls silent and retrieval answers from the page instead.
    if (!ctx.publishable.includes(guard.id) && guard.test.test(message)) {
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
  for (const fact of publishableFacts(ctx)) {
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
   * THE SIGNAL GATE guards RETRIEVAL only. Rules, guards and facts match on the
   * raw message and need no token signal at all, so gating in front of them
   * meant "What does Pixelette actually do?" was met with "tell me a bit more" -
   * a question the facts layer answers directly. Topic routes likewise match on
   * phrasing, so a question too thin to rank ("what is your process") can still
   * be sent to the right page before the assistant asks for more.
   */
  const enoughSignal = hasEnoughSignal(message);

  // ------------------------------------------------------------ 5. retrieval
  if (enoughSignal) {
    const best = search(message, 3)[0];
    /*
     * ABOVE THE FLOOR AND ABOUT THE SAME THING. Coverage says the question's
     * words are in the passage; it cannot say the passage is about them. "What
     * is your commercial model" scored full coverage against the tokenisation
     * page, whose description happens to say "commercial and legal model". So a
     * match must also share at least one word with the TITLE of what it
     * matched - the question for an FAQ, the page name for a page - which is
     * where "what this is about" actually lives.
     */
    if (best && best.coverage >= MIN_COVERAGE && best.titleHits > 0) {
      if (best.doc.kind === 'pointer') {
        return {
          via: 'pointer',
          text: `That one is answered on the ${best.doc.page ?? 'relevant'} page rather than in a single line I can quote back to you, so it is worth reading there.`,
          path: best.doc.path ?? undefined,
          sourceLabel: best.doc.page ?? undefined,
        };
      }
      if (best.doc.text) {
        return timelineSafe({
          via: 'kb',
          text: best.doc.text,
          path: best.doc.path ?? undefined,
          sourceLabel: best.doc.kind === 'faq' ? best.doc.page : best.doc.title,
        });
      }
    }
  }

  // --------------------------------------------------------- 6. topic routes
  for (const route of TOPIC_ROUTES) {
    if (!route.test.test(message)) continue;
    const doc = pageDoc(route.path);
    if (doc?.text) {
      return timelineSafe({
        via: 'route',
        ruleId: route.id,
        text: doc.text,
        path: route.path,
        sourceLabel: doc.title.replace(/\s*\|.*$/, ''),
      });
    }
  }

  // ------------------------------------------------------- 7. too little to go on
  if (!enoughSignal) {
    return {
      via: 'ask-more',
      text: 'If you could tell me a little more, I will find you the right page. What are you looking to build, or what would you like to know about how the firm works?',
    };
  }

  // ------------------------------------------------------------ 8. no answer
  return {
    via: 'no-answer',
    text: noAnswer(ctx.contactEmail),
    path: '/contact',
    sourceLabel: 'Contact',
    offer: 'enquiry',
  };
}

/**
 * Openers shown in the panel: the brief's commercially useful starters
 * (section 52), each one kept because the assistant can answer it - which
 * scripts/test-pix.cjs asserts.
 */
export const STARTERS: readonly string[] = [
  'Where could AI help my business?',
  'I need to replace an existing software system.',
  'We have a manual process we want to automate.',
  'Could blockchain make sense for our use case?',
];
