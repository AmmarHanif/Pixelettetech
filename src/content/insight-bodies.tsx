import type { ReactNode } from 'react';

/**
 * Article bodies, keyed by slug.
 *
 * EMPTY, AND THAT IS THE CURRENT TRUTH. Nothing in the Insights pipeline has
 * been written yet, so nothing appears here, and `/blog/[slug]` returns a
 * 404 for every slug rather than rendering a shell. The brief is explicit twice
 * over: "never display a clickable article that leads to an empty page" (§4) and
 * "no unpublished article appears clickable" (§20).
 *
 * WHY THE BODY LIVES HERE RATHER THAN IN content/insights.ts. That file is plain
 * `.ts` and a body needs JSX — headings, lists, links, the occasional table.
 * Splitting them also means the index page imports only metadata and never pulls
 * article prose into its bundle.
 *
 * TO PUBLISH A PIECE, three things change together and the types enforce it:
 *
 *   1. write the body here, keyed by the slug;
 *   2. in content/insights.ts change that entry's `status` to 'published' and
 *      supply `publishedOn`, `readingMinutes` and an `attribution` — all three
 *      are REQUIRED on PublishedInsight, so a half-finished entry will not
 *      compile;
 *   3. once the first piece is live, remove `noIndex: true` from
 *      app/insights/page.tsx.
 *
 * ATTRIBUTION IS NOT DECORATION (§12). `{ kind: 'editorial',
 * technicallyReviewedBy: null }` is a legitimate and honest shape — house
 * editorial with no named technical reviewer. What the types make awkward is
 * naming a reviewer who did not review, because that name is a separate field
 * somebody has to type on purpose.
 *
 * Example of the shape, deliberately commented out rather than left as a live
 * stub that could be mistaken for content:
 *
 *   export const INSIGHT_BODIES: Record<string, () => ReactNode> = {
 *     'agentic-ai-or-workflow-automation': () => (
 *       <>
 *         <p className="body">Standfirst-adjacent opening paragraph…</p>
 *         <h2 className="h3">The decision most teams get backwards</h2>
 *         <p className="body">…</p>
 *       </>
 *     ),
 *   };
 */
export const INSIGHT_BODIES: Record<string, () => ReactNode> = {};

/**
 * Sources for a piece, keyed by slug (§11, §13 check 2).
 *
 * Separate from the body so a reviewer can read what a claim rests on without
 * reading the prose around it, and so an article that cites nothing is visibly
 * an article that cites nothing rather than one where the references were
 * forgotten.
 */
export const INSIGHT_SOURCES: Record<
  string,
  { label: string; href: string }[]
> = {};
