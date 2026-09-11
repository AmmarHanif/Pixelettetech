/**
 * Testimonials.
 *
 * These are the firm's real Clutch reviews, carried across verbatim from the
 * live site's verified data with their per-review Clutch permalinks intact.
 * Nothing here is written for the website: if a quote cannot be opened and
 * read on Clutch by a stranger, it does not go on the page.
 *
 * ---------------------------------------------------------------------------
 * WHAT THE CLAIMS REGISTER HOLDS, AND WHAT IT DOES NOT (added 2026-09-08)
 * ---------------------------------------------------------------------------
 *
 * The register holds `clutch-rating`: "Clutch aggregate rating and review
 * count — HOLD — Verify live profile, current score and review count". The
 * handoff's "Hold until verified" list says the same thing in the same words:
 * "Clutch rating and review count".
 *
 * Both of those are FIRM-LEVEL ROLLUPS. Neither the handoff nor the register
 * holds an individually attributed, permalinked, verbatim third-party review,
 * and the two claims are different in kind. An aggregate is a number this
 * company asserts about itself and a reader cannot reconstruct; a quoted review
 * is a statement someone else published, under their own name, at an address
 * the reader can open. The 7 September 2026 legal review reached the same
 * conclusion from the other direction, finding dated reproduction of genuine
 * third-party reviews to be sound practice under the DMCCA 2024 fake-review
 * provisions. So the reviews below stay, and the rollup stays off.
 *
 * THEREFORE, THE HARD LINE FOR THIS FILE AND ANYTHING THAT CONSUMES IT:
 *
 *   - No aggregate rating. No review count. No star average. No "rated 4.8",
 *     no "24 reviews", no "all five stars", in copy or in JSON-LD. Those live
 *     behind `clutch.published` in `content/company.ts`, which is false, and
 *     behind `PublishedOrgClaims.aggregateRating` in `lib/schema.ts`, which is
 *     omitted by default. Do not reintroduce either from here.
 *   - `testimonials.length` IS NOT A REVIEW COUNT. Six reviews are carried
 *     here; the profile carried twenty-four at the last read. Printing the
 *     length would be both a held claim and a wrong number.
 *   - `rating` below is one reviewer's own score on their own review, rendered
 *     on their own card next to their own link. That is part of the quoted
 *     review, not a rollup. It must never be summed, averaged or counted.
 *
 * ---------------------------------------------------------------------------
 * OPEN GATE — FOR THE FOUNDER, NOT FOR THIS FILE TO DECIDE
 * ---------------------------------------------------------------------------
 *
 * `publication` below is explicit on every row so that the decision is a
 * recorded one rather than an accident of which array a component imported.
 * Every row says PUBLISHED, which is the position the site is already in and
 * which the reasoning above supports. Two things are nevertheless owed, and
 * neither is a decision to take on the founder's behalf:
 *
 *   1. LINK CHECK. This file's own rule is that a stranger can open and read
 *      each review. That has not been recorded as done. Five of the six URLs
 *      are `#review-NNNNNN` anchors on the profile page, which resolve only
 *      while that review is on the page the anchor lands on, and the sixth is
 *      a `/go-to-review/` redirect rather than a permalink. The check costs
 *      minutes and belongs with the pre-launch re-read of the live profile
 *      that releases `clutch-rating` — same profile, same visit.
 *   2. ATTRIBUTION ON THE TWO ANONYMOUS ROWS. Both name a client company while
 *      withholding the reviewer ("Anonymous, CEO, System Soft Technologies").
 *      If Clutch itself shows the company on an anonymised review, this is a
 *      faithful reproduction and nothing more is needed. If it does not, the
 *      company name came from somewhere else and is a named client reference,
 *      which the register puts behind the `client-logos` approval gate. This
 *      was not verifiable from the repository.
 *
 * Nothing in this file was checked against the live Clutch profile as part of
 * the 8 September 2026 work; the reasoning above is about which claim class
 * these entries fall into, which is a question the repository can answer.
 * Whether the reviews are checkable today is a question only the profile can.
 *
 * ---------------------------------------------------------------------------
 * COUNT CORRECTED IN ITEM 1, 2026-09-11. BOTH GATE ITEMS REMAIN OPEN.
 * ---------------------------------------------------------------------------
 *
 * Item 1 used to read "Four of the six URLs are `#review-NNNNNN` anchors on the
 * profile page ... and one is a `/go-to-review/` redirect". Counted from the
 * rows below rather than from memory: FIVE are `#review-NNNNNN` anchors
 * (255279, 275026, 158221, 365839 and 178359) and the sixth is the
 * `/go-to-review/` redirect. Five plus one accounts for every row; four plus one
 * accounted for five of six and left one row unexplained, which is how the
 * arithmetic gave the error away. Item 1 is corrected, NOT discharged — no URL
 * in this file has been opened, and the check is still owed.
 *
 * Item 2's description is inaccurate and it is likewise NOT discharged. "Both
 * name a client company" holds for one of the two anonymous rows rather than
 * both: "CEO, System Soft Technologies" names a company, whereas "Executive,
 * Healthcare Company" names a SECTOR in Clutch's usual anonymisation and
 * discloses no client identity at all. The wording of item 2 is left exactly as
 * it stands, because narrowing a founder gate is the founder's call and not this
 * file's; the observation is recorded here so that whoever answers item 2 knows
 * which row actually carries the question.
 */

/**
 * Whether a review may be rendered.
 *
 * A required field, on the same reasoning as `permission` in `content/clients.ts`
 * and `published` in `content/company.ts`: a quote cannot be added to this file
 * without someone stating where it stands. There is no default, deliberately —
 * a default is the thing nobody reads.
 */
export type TestimonialPublication = 'PUBLISHED' | 'WITHHELD';

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Initials shown in the avatar when there is no cleared portrait. */
  initials: string;
  /**
   * The reviewer's own score on their own review, out of five. Rendered as the
   * stars on that reviewer's card. Never aggregated — see the note above.
   */
  rating: number;
  /** Deep link to the individual review on Clutch. */
  url: string;
  /** Whether this review is cleared to render. See the open gate above. */
  publication: TestimonialPublication;
};

export const testimonials: Testimonial[] = [
  {
    // Punctuation matches the review verbatim, exclamation mark included. One
    // design board renders it with a full stop; the review is the authority.
    quote: 'The deliverables were there on time and at high quality!',
    name: 'David Elcombe',
    role: 'Managing Director, WindWorkX Industry',
    initials: 'DE',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0?sort_by=date_desc#review-255279',
    publication: 'PUBLISHED',
  },
  {
    quote: 'We couldn’t ask for a more professional service.',
    name: 'Anthony Bevan',
    role: 'CEO, The BlockGuard Technologies',
    initials: 'AB',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0?sort_by=date_desc#review-275026',
    publication: 'PUBLISHED',
  },
  {
    quote: 'Pixelette Technologies has been the perfect partner so far.',
    name: 'Mushtaq Khalil',
    role: 'Co-Founder, Buttersmiles Marketplace',
    initials: 'MK',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0#review-158221',
    publication: 'PUBLISHED',
  },
  {
    quote: 'The people were impressive.',
    name: 'Julien Braun',
    role: 'Co-Founder, Carmentis',
    initials: 'JB',
    rating: 4,
    // A /go-to-review/ redirect rather than a permalink: item 1 of the open
    // gate above applies to this row first.
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/341615',
    publication: 'PUBLISHED',
  },
  {
    quote: 'They were very reliable.',
    name: 'Anonymous',
    role: 'CEO, System Soft Technologies',
    initials: 'SS',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0?sort_by=date_desc#review-365839',
    publication: 'PUBLISHED',
  },
  {
    quote: 'Working with them has been a good experience.',
    name: 'Anonymous',
    role: 'Executive, Healthcare Company',
    initials: 'HC',
    rating: 5,
    url: 'https://clutch.co/profile/pixelette-technologies-0#review-178359',
    publication: 'PUBLISHED',
  },
];

/**
 * The reviews a component may render.
 *
 * Fails closed: only the exact string 'PUBLISHED' passes, so a row that is
 * withheld, mistyped or added by a later widening of the union renders nothing
 * rather than renders by default. Every render path should read this, or
 * `featuredTestimonials` below, and not the raw array.
 */
export function publishedTestimonials(): Testimonial[] {
  return testimonials.filter(testimonial => testimonial.publication === 'PUBLISHED');
}

/**
 * The two the design pulls onto the AI landing page — from the published set,
 * so withholding a review removes it from every surface at once.
 *
 * NOTE for whoever consumes this: it can be empty, and an empty list must
 * render nothing rather than an empty frame — the handoff's DEVELOPER RULE.
 *
 * CLOSED 2026-09-11. What follows is a correction, not a deletion.
 *
 * This note used to continue: "`Testimonials` in `components/sections.tsx` does
 * not yet guard its zero case: with no items it renders the eyebrow, an empty
 * grid and the source note. That component is owned by another work package on
 * 8 September 2026 and is reported rather than edited here."
 *
 * The guard has been live since 2026-09-08. `Testimonials` in
 * src/components/sections.tsx now opens with `if (items.length === 0) return
 * null;` — read at that line today, not assumed — and it covers the whole
 * block, eyebrow and source note included, rather than merely the grid, so the
 * DEVELOPER RULE above is satisfied by the consumer. The component's own
 * comment there records the reasoning. Nothing is owed from this paragraph.
 *
 * Worth knowing for next time: the claim was stale the moment it was committed,
 * not later. Both this file's note and that guard arrived in the SAME commit
 * (30347e8, "Rebuild the site onto the 8 September implementation handoff",
 * 2026-09-08) — the sweep fixed the component and left the report of the defect
 * standing beside it. A cross-file "X does not yet do Y" is only true until
 * someone does Y, and nothing in the language makes it fail loudly when they do.
 *
 * The wording is kept rather than deleted because deleting it is how the claim
 * comes back. This defect class — a comment asserting a state of the world that
 * has since changed — has now been corrected seven times in this project, once
 * producing a blocking finding three days after the defect it described had
 * already been closed.
 */
export const featuredTestimonials: Testimonial[] = publishedTestimonials().slice(0, 2);
