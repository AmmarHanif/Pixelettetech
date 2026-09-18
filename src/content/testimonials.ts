import { clutch } from '@/content/company';

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
 *
 * ---------------------------------------------------------------------------
 * ONE ATTRIBUTION WAS WRONG. CORRECTED 2026-09-14.
 * ---------------------------------------------------------------------------
 *
 * The live profile was read on 14 September 2026, and the review this file
 * links to as #review-365839 was read in the page's own DOM. The row below used
 * to say:
 *
 *     name: 'Anonymous',
 *     role: 'CEO, System Soft Technologies',
 *     initials: 'SS',
 *
 * Clutch displays that review as "Smart Contract Development & Blockchain for
 * IT Services Co", and the review's own node contains neither "System Soft" nor
 * "Anonymous". Clutch anonymised that client to a SECTOR DESCRIPTOR. The
 * company name is therefore an attribution THE SOURCE DOES NOT SUPPORT, and it
 * was being published beside a "Verify on Clutch" link that takes the reader to
 * a review naming no such company. Item 2 above asked exactly this question of
 * exactly this row, and the answer is the bad one: the name came from somewhere
 * other than the source.
 *
 * WHERE IT CAME FROM, which also says where else it still is. The identical
 * string sits in the previous site's data at repo/src/data/testimonialData.js
 * (`user_role: 'CEO, System Soft Technologies'`), which is where this row was
 * carried across from — read there on 14 September 2026, not assumed. That file
 * is rendered by repo/src/components/Home/Testimonial/Testimonial.tsx both as
 * visible copy and inside a JSON-LD `review` array, so the same unsupported
 * attribution is in the previous build, in two channels, and it is the
 * founder's to fix there. This repository cannot reach it. Same shape as
 * ADR-0006: correct it here, report it there.
 *
 * THE ROW NOW READS role: 'CEO, IT services company', initials: 'IT'. Four
 * judgements sit in that, each stated so the next person can disagree with a
 * reason instead of guessing:
 *
 *   - THE REVIEW IS NOT DELETED. It is genuine, the quote and the rating are
 *     untouched, and only the caption was wrong. Deleting real evidence to tidy
 *     up a labelling error is a worse trade than the error.
 *   - "IT Services Co" is rendered lower case, as "IT services company",
 *     because it is a descriptor of a sector and title case reads as a proper
 *     noun — which is the whole defect being corrected. The sibling anonymous
 *     row keeps its "Executive, Healthcare Company" casing: it was not compared
 *     with the source in this pass (see the table below), and re-casing a row
 *     nobody has checked is an edit with no evidence behind it.
 *   - "CEO" IS KEPT AND IS NOT EVIDENCED. The read reported what that review's
 *     node does not contain; it did not report a reviewer title either way. The
 *     rule applied across this whole pass is: correct what the evidence
 *     CONTRADICTS, record what the evidence does not REACH. Applied the other
 *     way round it would strip "Executive" off the row beside it and the names
 *     off all four named rows, none of which any evidence disputes. "CEO"
 *     identifies no person and no company. If the pre-launch re-read shows no
 *     title on that review, drop it then.
 *   - "Anonymous" in `name` is this site's own word for a reviewer the source
 *     does not identify, not a quotation from Clutch — the node does not
 *     contain it either. It is kept because it is true and because the other
 *     anonymous row already says it. `initials` follow the attribution on every
 *     row, so 'SS' could not stay: it spelled out the company name being
 *     removed. 'IT' follows the 'HC' precedent.
 *
 * No `publication` value, no `permission` field anywhere and no claims-register
 * status changed. This corrects what a published row SAYS. It does not move
 * what is cleared, and it does not release `clutch-rating`: the same read also
 * showed the profile's aggregate, which matches content/company.ts, and that
 * number is deliberately not written into this file, this comment or any render
 * path. A matching number is not a released claim.
 *
 * ---------------------------------------------------------------------------
 * ALL SIX ROWS AGAINST THE SOURCE, 2026-09-14. ONE DEFECT, FIVE NOT REACHED.
 * ---------------------------------------------------------------------------
 *
 * The read confirmed that all five #review-NNNNNN anchors in this file still
 * resolve, and that each resolves BECAUSE of the sort its own URL carries:
 * 255279, 275026 and 365839 are on the loaded page under ?sort_by=date_desc;
 * 158221 and 178359 are on it under the default sort. The profile paginates ten
 * reviews at a time out of the twenty-four it holds. What the read did NOT do
 * is compare the displayed attribution of the other five reviews with the five
 * rows here; only 365839's node was read in full. The verdicts, in the order
 * the rows appear below:
 *
 *   255279  David Elcombe, Managing Director, WindWorkX Industry
 *           Anchor resolves under date_desc. Attribution NOT COMPARED with the
 *           source. Nothing contradicts it. Unchanged.
 *   275026  Anthony Bevan, CEO, The BlockGuard Technologies
 *           Anchor resolves under date_desc. Attribution NOT COMPARED. Nothing
 *           contradicts it. Unchanged.
 *   158221  Mushtaq Khalil, Co-Founder, Buttersmiles Marketplace
 *           Anchor resolves under the default sort. Attribution NOT COMPARED at
 *           source. Corroborated inside this project by ADR-0006, which records
 *           "its own Clutch review from Mushtaq Khalil, Co-Founder of
 *           Buttersmiles Marketplace", and the client name is founder-approved
 *           in content/clients.ts. A project record is not the source, and the
 *           row that turned out to be wrong had a project record behind it too.
 *           Unchanged.
 *   341615  Julien Braun, Co-Founder, Carmentis
 *           The one /go-to-review/ address. NOT OPENED: the read covered the
 *           five anchors. Attribution NOT COMPARED. Unchanged, and item 1 of
 *           the open gate is still owed on this row in particular.
 *   365839  was "Anonymous, CEO, System Soft Technologies"
 *           DEFECT. The source shows a sector descriptor and no company name.
 *           CORRECTED above. This is the only row whose displayed attribution
 *           was read at the source.
 *   178359  Anonymous, Executive, Healthcare Company
 *           Anchor resolves under the default sort. Attribution NOT COMPARED.
 *           It is the same sector-descriptor shape the source used on 365839,
 *           so it is CONSISTENT with what Clutch does to an anonymised client.
 *           Consistent is not verified. Deliberately UNCHANGED rather than
 *           confirmed, and not to be reported as checked.
 *
 * So item 2 is ANSWERED for the row that actually carried the question, and the
 * wider question — does every published attribution match what the source
 * displays — is OPEN on five rows. It costs one visit. The pre-launch re-read
 * of the profile that releases `clutch-rating` should read all six attributions
 * while it is there, and this file should be dated again that day.
 *
 * The string item 2 quotes, "Anonymous, CEO, System Soft Technologies", no
 * longer appears in any row. Item 2's wording is left standing anyway: that is
 * how this file has handled every previous correction, and a founder gate is
 * not narrowed by the file it governs.
 *
 * ---------------------------------------------------------------------------
 * LINK DURABILITY: WHAT THE LINKS PROMISE, AND WHAT WAS TRADED. 2026-09-14.
 * ---------------------------------------------------------------------------
 *
 * THE PROPERTY, written down once so that nobody has to rediscover it. A
 * #review-NNNNNN fragment is not an address for a review. It is an instruction
 * to scroll to an element IF that element is on the page that loaded. The
 * profile loads ten reviews at a time out of twenty-four and which ten depends
 * on the sort, so one of these anchors resolves only while its review is among
 * the ten its sort puts on the loaded page. Every new review pushes the
 * date_desc rows one place further down, and the 14 September read recorded one
 * of the six already sitting sixth on its page. These links WILL stop finding
 * their reviews, on a date nobody will be told about, and NOTHING WILL BREAK
 * WHEN THEY DO: a fragment is resolved by the browser and is never sent to the
 * server (RFC 3986 section 3.5), so an anchor that matches nothing is a no-op,
 * not an error and not a 404. The reader is left on the profile, the link looks
 * like it worked, and this file's own rule — that a stranger can open and read
 * the review — has quietly stopped being true.
 *
 * ---------------------------------------------------------------------------
 * CORRECTED 18 September 2026. ITEM 1 BELOW WAS WRONG, AND SO WAS THE DECISION
 * THAT RESTED ON IT. ALL SIX ROWS ARE NOW PERMALINKS AND NONE OF THEM DECAYS.
 * ---------------------------------------------------------------------------
 *
 * Item 1 refused the /go-to-review/ form because it "needs a per-review UUID",
 * this repository held exactly one, and "a UUID cannot be reasoned out". The
 * first half is the error: the UUID is not per-review, it is the COMPANY's.
 * The same value, 258ba1ac-898a-4a98-8359-19cf91fc3ced, appears inside all ten
 * reviews rendered on the profile page, and the second path segment is simply
 * the review id this file already held for every row.
 *
 * Nor did it have to be derived at all. Clutch PUBLISHES the finished permalink
 * in each review's own Share control:
 *
 *   <button class="profile-review__share-button"
 *           data-url="https://clutch.co/go-to-review/<company-uuid>/<review-id>">
 *
 * So the address was sitting in the markup of the page the anchors already
 * pointed at, one attribute away, for the whole time this note said it was
 * unavailable. The lesson is the ordinary one: the blocker was never tested,
 * only reasoned about, and the reasoning was plausible and wrong.
 *
 * WHY THE PERMALINK IS ACTUALLY DURABLE, observed rather than assumed. It is a
 * server-side redirect that COMPUTES the page the review currently sits on:
 *
 *   /go-to-review/<uuid>/255279  ->  /profile/pixelette-technologies-0?page=2#review-255279
 *
 * An anchor hopes its review is on the page that loads. A permalink asks the
 * server where the review is now, so new reviews move the answer instead of
 * breaking it. That is the whole difference.
 *
 * EACH ONE WAS OPENED, 18 September 2026, and landed on its own review:
 *
 *   255279  Content Marketing for Renewable Energy Company              -> ?page=2
 *   275026  Blockchain & Gold-Backed Tokens Dev for Blockchain Company   -> ?page=2
 *   158221  Blockchain Dev, Web Design & Dev for NFT Art Marketplace     -> page 1
 *   365839  Smart Contract Development & Blockchain for IT Services Co   -> ?page=2
 *   178359  Web Development for Healthcare Company                       -> page 1
 *   341615  Social Media Marketing for Financial Services Company        -> ?page=2
 *
 * That discharges the "a stranger can open and read each review" rule for all
 * six rows, and it discharges gate item 1. What it does NOT discharge is the
 * separate re-read of the aggregate rating and review count behind
 * `clutch.published`; the profile showed 24 reviews on this visit, which is a
 * data point and not that verification.
 *
 * The text below is preserved as written, including the reasoning that was
 * wrong, because the file's own rule is that a record is corrected in place and
 * not quietly rewritten.
 *
 * WHAT WAS CONSIDERED, and what was refused.
 *
 *   1. Build /go-to-review/<uuid>/<id> addresses for the other five, like the
 *      Julien Braun row. REFUSED, and this is the important one. That form
 *      needs a per-review UUID. This repository holds exactly one — the one in
 *      the Braun row, carried across from the previous site's data — and holds
 *      no way to derive another. A UUID cannot be reasoned out, and a URL that
 *      LOOKS like a stable address and resolves to nothing is worse than a
 *      fragile link, because it is fragile and it also claims not to be.
 *      Nothing was invented here. If the pre-launch profile visit can copy the
 *      five real addresses out of the page, that is a five-minute job and it is
 *      the actual fix; this file is written so that it is a two-field change
 *      per row when someone does it — the url, and the linkKind beside it.
 *   2. Replace the anchors with the bare profile URL. Stable, and REJECTED as a
 *      straight loss: the bare profile is precisely what an anchor degrades TO.
 *      While the anchor works the reader lands on the review; when it stops
 *      working the reader lands on the same profile page the bare URL would
 *      have given them on day one. Trading the working case away buys nothing,
 *      and it would also throw away the review id, which is the only thing in
 *      the URL that identifies which review a row is quoting.
 *   3. Change the sort so the reviews stop drifting down it. NOT DONE:
 *      date_desc is the value three of these URLs actually carry and were
 *      verified under, and the parameter value for any other order is not
 *      something this repository knows. Guessing one would break three links
 *      that work today in exchange for a URL nobody has ever opened.
 *
 * THE DECISION. The six URLs are kept EXACTLY as verified on 14 September 2026,
 * byte for byte, query string included — the sort is not decoration on three of
 * them, it is the reason they resolve, and stripping it would break them today.
 * The precision is kept; the durability was never available to keep. WHAT WAS
 * TRADED IS SILENCE: this file now says out loud that five of the six links
 * decay, so the next person inherits the property instead of rediscovering it,
 * and the shapes are machine-checked so the record cannot rot quietly.
 *
 * THE GATE. `linkKind` below is a required field with no default, on the same
 * reasoning as `publication`, and `assertLinkInvariants` at the foot of this
 * file runs at module load and FAILS THE BUILD if a row's URL is not one of the
 * two shapes that have actually been read on the live profile, if a row's
 * declared `linkKind` disagrees with its own URL, or if two rows share a URL.
 * That is the same mechanism as `assertPublicationInvariants` in content/work.ts
 * and it is there for the same reason: a rule a build cannot enforce lasts
 * exactly as long as the person who wrote it stays in the room. What the gate
 * CANNOT do is tell you whether a link still finds its review. That needs the
 * network and a human, which is item 1, and item 1 stays open.
 *
 * PROVENANCE, because this file asks it of everything else. The session that
 * made this correction had no network egress — raw fetches are refused as a
 * supply-chain control — so it did not and could not re-open the profile
 * itself. Every statement above about what Clutch displays is the 14 September
 * 2026 read reported into this work package, recorded here as exactly that and
 * not upgraded. Everything attributed to a path in this repository, or in the
 * previous site's repository beside it, was opened here on the same day.
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

/**
 * What a row's URL actually is. See LINK DURABILITY above.
 *
 *   'PERMALINK'      a /go-to-review/<uuid>/<id> URL, which names one review
 *                    and so cannot be moved by anything happening on the
 *                    profile page around it.
 *   'PROFILE_ANCHOR' a #review-<id> fragment on the profile, which is a scroll
 *                    instruction rather than an address: it resolves only while
 *                    that review is on the page its sort loads, and when it
 *                    stops resolving it degrades silently to the profile.
 *
 * This classifies the SHAPE of the URL, which is a property of the string and
 * is checkable here. It does not assert that the link was opened — the Braun
 * permalink has not been — and it must not be read as a link check. That is
 * item 1 of the open gate and it is owed on all six rows.
 *
 * Required, with no default, so that adding a review forces whoever adds it to
 * say which kind of link they pasted. `assertLinkInvariants` at the foot of the
 * file then checks the answer against the URL rather than trusting it.
 */
export type TestimonialLinkKind = 'PERMALINK' | 'PROFILE_ANCHOR';

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
  /**
   * Whether that link is an address or a scroll instruction, and so whether
   * it decays as the profile fills up. See LINK DURABILITY above.
   */
  linkKind: TestimonialLinkKind;
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
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/255279',
    linkKind: 'PERMALINK',
    publication: 'PUBLISHED',
  },
  {
    quote: 'We couldn’t ask for a more professional service.',
    name: 'Anthony Bevan',
    role: 'CEO, The BlockGuard Technologies',
    initials: 'AB',
    rating: 5,
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/275026',
    linkKind: 'PERMALINK',
    publication: 'PUBLISHED',
  },
  {
    quote: 'Pixelette Technologies has been the perfect partner so far.',
    name: 'Mushtaq Khalil',
    role: 'Co-Founder, Buttersmiles Marketplace',
    initials: 'MK',
    rating: 5,
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/158221',
    linkKind: 'PERMALINK',
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
    //
    // Still owed, and since 2026-09-14 also the point: this is the only row
    // whose URL names a review rather than a position on a page, and that form
    // cannot be built for the other five without a per-review UUID this
    // repository does not hold and will not invent. See LINK DURABILITY above.
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/341615',
    linkKind: 'PERMALINK',
    publication: 'PUBLISHED',
  },
  {
    quote: 'They were very reliable.',
    name: 'Anonymous',
    // CORRECTED 2026-09-14. This row read `role: 'CEO, System Soft
    // Technologies'` with `initials: 'SS'`. Clutch displays this review as
    // "Smart Contract Development & Blockchain for IT Services Co" and its own
    // node names no company, so the site was publishing a client the source had
    // anonymised. The quote, the rating and the link are untouched; only the
    // caption was wrong. The full record, including what is kept here without
    // evidence and why, is at the head of this file under "ONE ATTRIBUTION WAS
    // WRONG".
    role: 'CEO, IT services company',
    initials: 'IT',
    rating: 5,
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/365839',
    linkKind: 'PERMALINK',
    publication: 'PUBLISHED',
  },
  {
    quote: 'Working with them has been a good experience.',
    name: 'Anonymous',
    role: 'Executive, Healthcare Company',
    initials: 'HC',
    rating: 5,
    url: 'https://clutch.co/go-to-review/258ba1ac-898a-4a98-8359-19cf91fc3ced/178359',
    linkKind: 'PERMALINK',
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

/**
 * The /go-to-review/<uuid>/<id> shape: one review's own address.
 *
 * The uuid is written as a uuid rather than as `.+` on purpose. The failure
 * this gate exists to catch is not a typo, it is an invented link, and the
 * cheapest invented link is a plausible-looking one.
 */
const PERMALINK_PATTERN =
  /^https:\/\/clutch\.co\/go-to-review\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/\d+$/;

/**
 * The #review-<id> shape: this firm's own profile, an optional sort, a
 * fragment.
 *
 * Built from `clutch.profileUrl` rather than spelled out a second time, so the
 * profile this file links to and the profile the site links to cannot drift
 * apart — and so that repointing the profile fails the build here rather than
 * leaving six anchors hanging off an address nobody uses. The escape is the
 * same idiom `assertPublicationInvariants` uses in content/work.ts.
 */
const PROFILE_ANCHOR_PATTERN = new RegExp(
  `^${clutch.profileUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?sort_by=[a-z_]+)?#review-\\d+$`,
);

/**
 * The link gate. Runs at module load; fails the build, not the page.
 *
 * It enforces three things and deliberately not a fourth:
 *
 *   1. Every URL is one of the two shapes above. A bare profile link, a
 *      tracking-parameter URL, another firm's profile, a relative path or an
 *      invented address all land here.
 *   2. Every row's declared `linkKind` matches its own URL, so the durability
 *      recorded against a row cannot quietly stop describing it.
 *   3. No two rows share a URL — two reviews cannot have one address, and
 *      `Testimonials` in components/sections.tsx keys its cards on this field.
 *
 * The fourth, whether a link still finds its review, is not checkable from
 * here: it needs the network and a human, it is item 1 of the open gate, and it
 * is open. A green build says these URLs are well formed. It does not say they
 * resolve, and this gate must never be reported as if it did.
 */
function assertLinkInvariants(rows: Testimonial[]): void {
  const faults: string[] = [];
  const seen = new Map<string, string>();

  for (const row of rows) {
    const who = `${row.name} (${row.role})`;
    const isPermalink = PERMALINK_PATTERN.test(row.url);
    const isProfileAnchor = PROFILE_ANCHOR_PATTERN.test(row.url);

    if (!isPermalink && !isProfileAnchor) {
      faults.push(
        `${who}: url "${row.url}" is neither a /go-to-review/<uuid>/<id> address nor a ` +
          `#review-<id> anchor on ${clutch.profileUrl}. Those are the only two shapes anyone has ` +
          'read on the live profile. If a new shape is genuinely right, open it first, then add ' +
          'it here with the date it was opened — do not widen this pattern to fit a URL.',
      );
    } else if (isPermalink && row.linkKind !== 'PERMALINK') {
      faults.push(
        `${who}: the url is a /go-to-review/ address but linkKind says '${row.linkKind}'.`,
      );
    } else if (isProfileAnchor && row.linkKind !== 'PROFILE_ANCHOR') {
      faults.push(
        `${who}: the url is a #review-<id> anchor, which resolves only while that review is on ` +
          `the page its sort loads, but linkKind says '${row.linkKind}' — claiming a durability ` +
          'this link does not have.',
      );
    }

    const firstUse = seen.get(row.url);
    if (firstUse !== undefined) {
      faults.push(`${who}: url "${row.url}" is already used by ${firstUse}.`);
    } else {
      seen.set(row.url, who);
    }
  }

  if (faults.length > 0) {
    throw new Error(
      `testimonials.ts link gate failed:\n  - ${faults.join('\n  - ')}\n` +
        'See "LINK DURABILITY" at the head of this file: the two admitted shapes are the two that ' +
        'have been read on the live profile, and a URL nobody has opened is not a third.',
    );
  }
}

assertLinkInvariants(testimonials);