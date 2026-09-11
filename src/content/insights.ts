/**
 * Insights.
 *
 * Publication dates and authors are deliberately unset until each piece is
 * actually written and signed off. A `null` date renders as a visible
 * placeholder rather than as an invented date, which would be the one thing a
 * page about publishing your methodology cannot afford to get wrong.
 */

export type Insight = {
  slug: string;
  category: 'Methodology' | 'Regulation' | 'Operations' | 'Engineering' | 'Archive';
  title: string;
  summary: string;
  readingMinutes: number | null;
  publishedOn: string | null;
  author: string | null;
  featured?: boolean;
};

export const insights: Insight[] = [
  {
    slug: 'how-we-evaluate-ai-systems',
    category: 'Methodology',
    title:
      'How we evaluate AI systems, and why we grade pass or fail rather than one to five',
    summary:
      'Our complete evaluation methodology: error analysis, golden datasets, judge calibration against human labels, the failure modes of LLM-as-judge, and how we detect judge drift. Cited throughout to Anthropic, OpenAI, NIST, OWASP and the UK AI Security Institute rather than asserted.',
    readingMinutes: null,
    publishedOn: null,
    author: null,
    featured: true,
  },
  {
    slug: 'eu-ai-act-deadline',
    category: 'Regulation',
    title: 'The EU AI Act deadline most suppliers are still quoting wrongly',
    summary:
      'High-risk obligations moved to December 2027. Article 50 transparency did not move. What that means if you sell into the EU.',
    readingMinutes: 9,
    publishedOn: null,
    author: null,
  },
  {
    slug: 'judge-drift',
    category: 'Operations',
    title: 'Judge drift: when your evaluator quietly changes its mind',
    summary:
      'Everyone watches input drift. Almost nobody watches the model doing the grading. How we detect it and what it costs when you do not.',
    readingMinutes: 12,
    publishedOn: null,
    author: null,
  },
  {
    slug: 'agentic-only-where-it-earns-it',
    category: 'Engineering',
    title: 'Agentic only where it earns it: a decision test before you build one',
    summary:
      'Four questions that decide whether a workflow needs an agent or a deterministic pipeline, and what the wrong answer costs you in production.',
    readingMinutes: 15,
    publishedOn: null,
    author: null,
  },
  {
    slug: 'monthly-ai-operating-report',
    category: 'Operations',
    title: 'What a monthly AI operating report should contain',
    summary:
      'The metrics that belong in front of a sponsor every month, and the ones that only ever flatter the supplier.',
    readingMinutes: 8,
    publishedOn: null,
    author: null,
  },
  {
    slug: 'why-we-baseline-before-we-build',
    category: 'Methodology',
    title: 'Why we baseline before we build, and what we do when the numbers say do not',
    summary:
      'The commercial logic of selling the counting first, and the engagements we have talked ourselves out of.',
    readingMinutes: 7,
    publishedOn: null,
    author: null,
  },
  {
    slug: 'entitlement-aware-retrieval',
    category: 'Engineering',
    title: 'Entitlement-aware retrieval: the part of enterprise RAG that actually stops rollouts',
    summary:
      'Why permissions have to be modelled before the index is built, and what goes wrong when they are not.',
    readingMinutes: 14,
    publishedOn: null,
    author: null,
  },
];

/**
 * The lead article, or `undefined` when no row carries `featured`.
 *
 * 2026-09-08 (WP13). This was `insights.find(i => i.featured)!`. The `!` was a
 * promise to the compiler that this list always contains a featured row, and
 * nothing enforces that promise: `featured` is an optional field, any editor
 * can clear it, and a piece pulled from the list for review takes the flag with
 * it. The result was a failure the type checker could not see —
 * `tsc --noEmit` green, /insights throwing "TypeError: Cannot read properties
 * of undefined (reading 'category')" at src/app/insights/page.tsx on the first
 * read of the featured article.
 *
 * Typing it honestly as `Insight | undefined` is the point of the change: it
 * converts an invisible runtime crash into a compile error at the one place
 * that consumes it, so the build catches the next person who breaks it rather
 * than a visitor. The consumer now renders the featured card only when there is
 * one, and the list below it is unaffected because `otherInsights` filters
 * rather than indexes and already degrades to the full list.
 *
 * The alternative considered was asserting the invariant here — throw at module
 * load if nothing is featured. Rejected: this module is imported for its list
 * as well as its lead, so a throw would take down every consumer over a missing
 * decoration, and the handoff's DEVELOPER RULE is that the absence of one piece
 * of content must not break the layout around it.
 */
export const featuredInsight: Insight | undefined = insights.find(i => i.featured);
export const otherInsights = insights.filter(i => !i.featured);
