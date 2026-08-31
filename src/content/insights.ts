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

export const featuredInsight = insights.find(i => i.featured)!;
export const otherInsights = insights.filter(i => !i.featured);
