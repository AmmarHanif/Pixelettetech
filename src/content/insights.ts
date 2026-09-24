/**
 * Insights.
 *
 * REBUILT 2026-09-24 to the founder's Insights brief. The brief asks for an
 * editorial hub; this file is the part that decides what may appear in it.
 *
 * THE ONE RULE THIS FILE EXISTS TO ENFORCE. A piece is `published` only when it
 * has a body, a date and an attribution. Everything else is `pipeline`, and a
 * pipeline entry RENDERS BUT DOES NOT LINK. The brief says it three separate
 * ways — "never display a clickable article that leads to an empty page" (§4),
 * "do not publish them as completed articles unless the article content actually
 * exists" (§6), "do not populate the page with fabricated article cards" (§17) —
 * and the type makes the wrong thing hard rather than merely discouraged:
 * `publishedOn`, `author` and `body` are only reachable on a published entry.
 *
 * AS AT 2026-09-24 NOTHING IS PUBLISHED. Seven pipeline concepts and one archive
 * marker. That is the honest state and the page is built to show it without
 * looking broken — §17's "3 articles, 6, 20, 100, without a redesign" cuts both
 * ways, and zero is the case it has to survive first.
 *
 * ATTRIBUTION (§12) is deliberately NOT a free string. An article carries one of
 * three shapes the founder authorised, and "Pixelette Technologies Editorial"
 * alone is a legitimate one — what is impossible here is naming a reviewer who
 * did not review, because a named reviewer is a separate field that a writer has
 * to fill in on purpose.
 */

import { ARCHIVE_PATH } from './archive';

/** The six the brief puts in the filter bar, plus two that have their own homes. */
export type InsightCategory =
  | 'Engineering'
  | 'AI & Automation'
  | 'Blockchain'
  | 'Quantum & Emerging Tech'
  | 'Security'
  | 'Regulation'
  /* Not filter chips: methodology has its own section (§8) and the archive has
     its own (§9). Kept in the union so those pieces carry a real category. */
  | 'Methodology'
  | 'Archive';

/** The filter bar, in the brief's order. "All" is rendered separately. */
export const FILTER_CATEGORIES: readonly InsightCategory[] = [
  'Engineering',
  'AI & Automation',
  'Blockchain',
  'Quantum & Emerging Tech',
  'Security',
  'Regulation',
];

/**
 * §12's three attribution models. A missing reviewer is `null`, never an
 * optimistic default — "where no named technical reviewer has yet approved an
 * article, do not falsely claim technical review".
 */
export type Attribution =
  | { kind: 'author'; author: string }
  | { kind: 'house-reviewed'; reviewedBy: string }
  | { kind: 'editorial'; technicallyReviewedBy: string | null };

type Base = {
  slug: string;
  category: InsightCategory;
  title: string;
  /** The standfirst. Shown on the card and at the top of the article. */
  summary: string;
};

/**
 * The restrained contextual section at the end of an article.
 *
 * TWO LINKS AND A SENTENCE, not a sales block. An article that argues for
 * narrowing scope and testing honestly, and then closes by selling hard,
 * undermines the argument it just made. The shape is deliberately small so it
 * cannot grow into a pitch without somebody noticing.
 */
export type ServiceBridge = {
  heading: string;
  body: string;
  links: readonly { href: string; label: string }[];
};

/**
 * A piece that is actually written. Everything a reader-facing article needs is
 * REQUIRED here, so a half-finished entry cannot be marked published and quietly
 * render with gaps.
 */
export type PublishedInsight = Base & {
  status: 'published';
  /** ISO date. The date it was actually published — never back-dated, never bumped. */
  publishedOn: string;
  /** Only where a substantive revision genuinely happened (§11, §15). */
  updatedOn?: string;
  readingMinutes: number;
  attribution: Attribution;
  /** The service page this piece legitimately relates to (§16). Optional. */
  relatedService?: { href: string; label: string };
  /** Marked where the content is materially out of date (§9). */
  archived?: boolean;
  /**
   * A shorter title for the <title> tag, where the editorial headline is too
   * long to survive a search result.
   *
   * ADDED 2026-09-24 BECAUSE THESE TWO HEADLINES BUILT 106 AND 107 CHARACTER
   * TITLES. The founder had six over-long page titles corrected earlier the same
   * day, and shipping two more would have undone that instruction while
   * technically following the brief, which supplied the headlines. So the
   * headline stays exactly as written as the H1 and the on-page display, and
   * only the browser-tab and search-result title is shortened. They are allowed
   * to differ; a headline argues and a title label locates.
   */
  seoTitle?: string;
  /**
   * A shorter meta description, where the standfirst runs past what a search
   * result displays.
   *
   * ADDED 2026-09-24 with the agents rewrite: its standfirst is 260 characters,
   * which reads well at the top of the article and is cut off in a search
   * result. Same separation as `seoTitle` - the page shows the full thing, the
   * tab and the search result get a version that fits.
   */
  seoDescription?: string;
  /** The contextual service section at the end of the piece. */
  serviceBridge?: ServiceBridge;
};

/** A commissioned concept. No date, no author, no body, and NOT clickable. */
export type PipelineInsight = Base & {
  status: 'pipeline';
};

export type Insight = PublishedInsight | PipelineInsight;

export const isPublished = (i: Insight): i is PublishedInsight =>
  i.status === 'published';

/**
 * THE EDITORIAL PIPELINE (§6), plus the concepts already recorded here before
 * this rebuild.
 *
 * Where the brief's concept and an existing entry were plainly the same piece,
 * they are ONE entry carrying the brief's title rather than two — §17 forbids
 * inflating the list, and two slugs for one article is exactly that. The merges:
 * the agentic-vs-workflow concept absorbed `agentic-only-where-it-earns-it`, and
 * the enterprise-retrieval concept absorbed `entitlement-aware-retrieval`.
 */
export const insights: Insight[] = [
  /* The brief's featured example (§4). Pipeline, so the featured card renders
     WITHOUT a link until the piece exists. */
  {
    status: 'pipeline',
    slug: 'quantum-and-ai-where-they-meet',
    category: 'Quantum & Emerging Tech',
    title: "Quantum computing isn't replacing AI. Here's where the two could meet.",
    summary:
      'Quantum computing is advancing rapidly, but the commercial opportunity is often misunderstood. We look at where quantum, AI and conventional computing could work together, and where today’s technology still wins.',
  },
  /*
   * THE TWO PUBLISHED PIECES, 2026-09-24.
   *
   * Both replace pipeline entries rather than joining them. The methodology
   * concept kept its slug because the piece is the one that was commissioned;
   * the agents piece supersedes `agentic-ai-or-workflow-automation`, which was
   * the same argument under a comparison title, and two slugs for one article is
   * exactly the inflation §17 forbids.
   *
   * ATTRIBUTION IS `editorial` WITH NO NAMED REVIEWER, which is one of the three
   * shapes §12 authorises and is the honest one today. Naming a technical
   * reviewer is a separate field somebody has to fill in on purpose, precisely
   * so that a reviewer who did not review cannot be credited by default.
   *
   * `readingMinutes` IS MEASURED, not estimated: 1,054 and 905 words at 200 a
   * minute.
   */
  {
    status: 'published',
    slug: 'where-ai-agents-should-work',
    category: 'AI & Automation',
    title: 'Where should AI agents actually work?',
    /* 'Where should AI agents actually work?' builds a 62-character title once
       the brand is appended. The short form keeps it to 53 and still reflects
       the revised headline. */
    seoTitle: 'Where should AI agents work?',
    summary:
      'AI agents can improve a business process or create a more responsive experience in a digital product. The starting point is the same in either case: define the problem, decide what better looks like and establish whether an agent is the right way to get there.',
    seoDescription:
      'Define the problem and what better looks like before deciding whether an AI agent, fixed automation or conventional software is the right way to get there.',
    publishedOn: '2026-09-24',
    readingMinutes: 6,
    attribution: { kind: 'editorial', technicallyReviewedBy: null },
    serviceBridge: {
      heading: 'Have an idea that needs to work in the real world?',
      body: 'Pixelette Technologies designs and builds AI-enabled products and workflows around a defined purpose. We can help examine the problem, establish what success looks like and determine whether software, automation or an AI agent is the appropriate approach, then build, evaluate and improve the solution.',
      links: [
        { href: '/ai-automation', label: 'Explore AI and Automation' },
        { href: '/contact', label: 'Talk to Pixelette Technologies' },
      ],
    },
  },
  {
    status: 'published',
    slug: 'how-we-evaluate-ai-systems',
    category: 'Methodology',
    title: 'How we evaluate AI systems, and why we use pass or fail',
    seoTitle: 'How we evaluate AI systems',
    summary:
      'Before an AI system performs a job for a client, there must be a clear answer to a practical question: has it met the requirements for this particular use? Here is how we would reach that decision, what we measure along the way and why an overall score cannot make the decision on its own.',
    seoDescription:
      'How we would decide whether an AI system has met the agreed requirements for a defined job, what we measure along the way and why a score cannot decide alone.',
    publishedOn: '2026-09-24',
    readingMinutes: 6,
    attribution: { kind: 'editorial', technicallyReviewedBy: null },
    serviceBridge: {
      heading: 'Building AI that has to work in practice?',
      body: 'Pixelette Technologies can help define the job, design and build the system, agree how it will be evaluated and establish the controls needed for its intended use. We can then verify the result before launch and improve it as the system is used.',
      links: [
        { href: '/ai-automation', label: 'Explore AI and Automation' },
        {
          href: '/ai-automation/evaluation-and-observability',
          label: 'Explore Evaluation and Observability',
        },
        { href: '/contact', label: 'Talk to Pixelette Technologies' },
      ],
    },
  },
  {
    status: 'pipeline',
    slug: 'architecture-when-ai-is-cheap',
    category: 'Engineering',
    title: 'Why good software architecture becomes more valuable as AI gets cheaper',
    summary:
      'AI can accelerate development. It does not remove the need for sound engineering decisions, and it raises the cost of the ones made badly at speed.',
  },
  {
    status: 'pipeline',
    slug: 'enterprise-retrieval-is-harder',
    category: 'AI & Automation',
    title: 'RAG is easy to demo. Enterprise retrieval is harder',
    summary:
      'Permissions, entitlement, evidence and evaluation are what separate a demonstration from a production retrieval system, and they are what stop rollouts.',
  },
  {
    status: 'pipeline',
    slug: 'does-your-business-need-quantum',
    category: 'Quantum & Emerging Tech',
    title: 'Does your business actually need quantum computing?',
    summary:
      'The classes of computational problem worth exploring, and the far larger set where conventional computing remains the better answer today.',
  },
  {
    status: 'pipeline',
    slug: 'post-quantum-cryptography-now',
    category: 'Security',
    title: 'Post-quantum cryptography: what businesses should understand now',
    summary:
      'Why organisations may need to prepare their cryptography before large-scale quantum computing becomes mainstream, and what "harvest now, decrypt later" actually implies.',
  },
  {
    status: 'pipeline',
    slug: 'after-software-goes-live',
    category: 'Engineering',
    title: 'What happens after software goes live?',
    summary:
      'The practical difference between maintenance, support, optimisation and continuous improvement, and which of them you are actually buying.',
  },
  {
    status: 'pipeline',
    slug: 'eu-ai-act-deadline',
    category: 'Regulation',
    title: 'The EU AI Act deadline most suppliers are still quoting wrongly',
    summary:
      'Which obligations bite when, which systems they apply to, and why the date most often quoted is not the one that matters for most buyers.',
  },
  {
    status: 'pipeline',
    slug: 'monthly-ai-operating-report',
    category: 'AI & Automation',
    title: 'What a monthly AI operating report should contain',
    summary:
      'What you should expect to be told each month about a production AI system, and what an operating report that omits it is concealing.',
  },
];

/** Published pieces only, newest first. Empty today, and the page handles that. */
export const publishedInsights: PublishedInsight[] = insights
  .filter(isPublished)
  .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

/** Everything commissioned but not yet written. */
export const pipelineInsights: PipelineInsight[] = insights.filter(
  (i): i is PipelineInsight => i.status === 'pipeline',
);

/**
 * The featured slot (§4), configurable rather than hard-coded to the methodology
 * piece — the brief is explicit that it must be changeable as new material ships.
 * Point it at a slug; the page renders whatever it finds and links it ONLY if
 * that piece is published.
 */
export const FEATURED_SLUG = 'where-ai-agents-should-work';

export const featuredInsight: Insight | undefined = insights.find(
  i => i.slug === FEATURED_SLUG,
);

/** Everything except the featured piece, for the main grid. */
export const listedInsights: Insight[] = insights.filter(
  i => i.slug !== FEATURED_SLUG,
);

/**
 * §9. The archive is real material from the previous site, not a placeholder —
 * but it has no home in this build yet, so this records what it is and the page
 * says so plainly rather than offering a link to nowhere.
 */
export const archive = {
  title: 'Earlier writing, March to July 2025',
  note: 'Thirty-six articles from the previous Pixelette Technologies site, covering AI, blockchain, software development and design. Retained so that links to them still resolve and the work is not lost. Original publication dates and bylines are preserved, and every article is marked as historical rather than current guidance.',
  /**
   * MIGRATED 2026-09-24. The articles now live at their ORIGINAL /blog/<slug>
   * URLs, with an index at /insights/archive.
   *
   * THE TITLE AND NOTE WERE CORRECTED AT THE SAME TIME, because harvesting the
   * articles made them checkable for the first time. The card previously said
   * 'Blockchain and distributed systems, 2018-2025'; the measured range is
   * 2025-03-03 to 2025-07-04, and the previous site's own categories split the
   * 36 as 13 AI, 13 blockchain, 7 software development and 3 mobile and web
   * design - so naming the archive after one of four subjects would have sent a
   * reader looking for the AI material straight past it.
   */
  href: ARCHIVE_PATH as string | null,
};
