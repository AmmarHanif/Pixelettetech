/**
 * The claims register — the single source of truth for what this site is
 * allowed to publish about itself.
 *
 * Every badge, rating, award, count and outcome metric the site could print is
 * listed here with a publication status, and nothing renders unless its row
 * says VERIFIED. This is the mechanism behind the rule the founder set in the
 * 8 September 2026 implementation handoff: "Every number, badge and
 * accreditation is either VERIFIED, HELD FOR EVIDENCE, or NOT PUBLISHED."
 *
 * Why a register and not a comment in each file. An unverified claim is a legal
 * exposure, not a copy preference. The Digital Markets, Competition and
 * Consumers Act 2024 s.226 (in force 6 April 2025) makes an overall
 * presentation likely to deceive a misleading action even where each individual
 * statement is true, and the CMA can act directly. The Business Protection from
 * Misleading Marketing Regulations 2008 reg. 3(5) pulls an advertiser's own
 * "qualifications" and "awards and distinctions" into the B2B test — which is
 * the regime that actually fits this audience. Scattered comments do not
 * survive a rewrite; a typed register that a component has to consult does.
 *
 * How a component uses it: map over `publishedClaims()`. That list is empty
 * today, and an empty list must render nothing rather than an empty frame —
 * the handoff's DEVELOPER RULE is that cards and badges can be switched on
 * individually and "the absence of a badge must not leave a broken layout".
 *
 * How to publish something: obtain the evidence, write into `evidenceNote` the
 * date and the source a stranger could check for themselves, then change
 * `status` to 'VERIFIED'. Do not soften `publicationInstruction` — it is quoted
 * from the founder's handoff and is his instruction, not ours.
 *
 * ---------------------------------------------------------------------------
 * Estate audit, 8 September 2026. Every `evidenceNote` below was re-checked
 * against the code by grepping src/ and public/ for the claim itself, not by
 * reading the note. Three were wrong, and the one that matters is why this
 * paragraph exists: `appg-parliament-reference` said "Not currently rendered
 * anywhere in src/" while the claim rendered twice on /about, one of those
 * inside an FAQ answer that also feeds FAQPage JSON-LD. A register that
 * misdescribes the estate it governs is worse than no register, because the
 * next reader trusts it instead of looking.
 *
 * So an `evidenceNote` now carries two things and they are kept apart: what
 * evidence exists (or does not), and WHERE the claim currently renders, named
 * by route and file. A note that asserts a claim renders nowhere is a factual
 * statement about this repository on the date given, and it has to be re-run,
 * not assumed, whenever a row is touched. Rendering is not the same as being
 * mentioned: a claim id in a guard, a regex in a scanner, a comment recording
 * a removal and a line in public/llms.txt telling answer engines NOT to repeat
 * a claim are all references, and none of them publishes anything.
 * ---------------------------------------------------------------------------
 */

/**
 * VERIFIED       — evidence exists for this exact claim and it may be rendered.
 * HELD           — the claim may be true; the evidence is not in hand. Do not render.
 * NOT_PUBLISHED  — the claim is not to be made at all on the strength of what exists.
 */
export type ClaimStatus = 'VERIFIED' | 'HELD' | 'NOT_PUBLISHED';

export type Claim = {
  /** Stable key a component or a review can refer to. Never renumbered. */
  id: string;
  /** The claim itself, written as the thing that would be published. */
  label: string;
  status: ClaimStatus;
  /** What exists today, and what would have to exist to move this to VERIFIED. */
  evidenceNote: string;
  /**
   * The publication instruction, quoted from the TECHNOLOGIES CLAIMS REGISTER
   * in `design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt`. Quoted, not
   * paraphrased, so that a later reader can see the original standard.
   */
  publicationInstruction?: string;
};

/**
 * Seeded from the handoff's TECHNOLOGIES CLAIMS REGISTER, plus the two entries
 * from its "Hold until verified" list that the register table does not repeat.
 * Every row is HELD or NOT_PUBLISHED: as at 8 September 2026 no claim in this
 * register has evidence in the repository, so `publishedClaims()` is empty by
 * design rather than by omission.
 *
 * RE-RUN 11 September 2026, because a row was touched and this file does not
 * let a dated statement be inherited. Every row is still HELD or
 * NOT_PUBLISHED and `publishedClaims()` is still empty. The sentence above
 * needs one qualification: evidence has since entered the repository for PART
 * of one row. The founder decided on 11 September 2026 to keep seven named
 * clients published, and `client-logos` records that decision, its date and
 * its attribution while staying HELD — because he cleared seven names, not
 * the claim class that row governs. Evidence for part of a row's scope does
 * not move the row; that is the register working, not a backlog.
 */
export const claims: Claim[] = [
  {
    id: 'iso-cyber-essentials-badges',
    label: 'ISO 9001, ISO 27001 and Cyber Essentials Plus certification badges',
    status: 'HELD',
    publicationInstruction:
      'HOLD — Publish only with current certificate for exact legal entity, scope and validity.',
    evidenceNote:
      'No certificate is held anywhere in this project. Corrected 8 September 2026: this note said "design/certificates/ is empty", but there is no design/certificates/ directory in the repository at all; the empty folder is certificates/ in the project directory one level above it. Badge artwork exists but is no longer on the public surface. CORRECTED later the same day: this note said the artwork "does exist, at public/certifications/..., and is referenced by nothing in src/", which read as reassurance and was not. It was at public/certifications/iso-9001.svg and public/certifications/iso-27001.svg, referenced by nothing in src/ but served all the same, because everything under public/ is a web root and is retrievable at a guessable URL whether or not a page links to it. The claim in those two files is also machine-readable rather than artwork: it sits in SVG text elements reading CERTIFIED, ISO, 9001:2015 / 27001:2022 and COMPANY, so a crawler reads it as characters. Both files were moved to design/held-assets/, which is not served, with a README recording what they are, why they moved and the four steps that release them. They were moved rather than deleted so the artwork is there the day the claim is. The legal review of 7 September 2026 recorded that IAF CertSearch needs an account and the IASME register sat behind bot protection, and concluded: not doubted, not verified. Where it renders as at 8 September 2026: nowhere. CORRECTED later the same day. This note said src/app/opengraph-image.tsx prints "ISO 9001 · ISO 27001 · Cyber Essentials Plus" across the default social card, which every route without its own image inherits, contradicting public/llms.txt ("No certification badge is published by Pixelette Technologies"), and raised it as a blocking finding outside that work package. The finding was closed the same day: that row is now wrapped in an isPublishable() check on this claim id, so it renders nothing while this row is HELD and returns of its own accord if the row is ever released. One property of the fix is worth knowing — the card is generated at build time, so a released claim reaches it on the next build rather than the next request. Everywhere else is gated and prints nothing: no row in the certificationRegister in src/content/company.ts is published, so `certifications` is empty and VerificationTable prints its no-certification paragraph instead of a table, and SiteFooter renders no badge pills. To publish, hold the certificate number, the issuing certification body and the expiry date for Pixelette Technologies Ltd, and print them beside the badge.',
  },
  {
    id: 'clutch-rating',
    label: 'Clutch aggregate rating and review count',
    status: 'HELD',
    publicationInstruction: 'HOLD — Verify live profile, current score and review count.',
    evidenceNote:
      'The figures in src/content/company.ts (clutch) were read off the live profile on 2026-09-03. Corrected 8 September 2026: this note said "the rendered copy prints that date", which is no longer true — `clutch.published` is false, so the aggregate renders nowhere. Both sites that print it are behind that gate: the StatTile on /about (src/app/about/page.tsx) and the source note under the review row (`Testimonials` in src/components/sections.tsx, which falls back to a line pointing at the profile without a score). src/lib/schema.ts emits the profile URL as a `sameAs` identity signal and emits no `aggregateRating`. The individual review cards are a separate claim and still render, each linking to the review it came from. To publish the aggregate: re-read the live profile immediately before launch, re-date `lastVerified`, set `clutch.published`, and move this row on the same day — printing the read date beside the score is the practice the 7 September legal review judged sound under the DMCCA fake-review provisions.',
  },
  {
    id: 'client-logos',
    label: 'Named client logos and wordmarks',
    status: 'HELD',
    publicationInstruction:
      'APPROVAL GATE — Confirm genuine engagement + public-use permission/legitimate basis.',
    evidenceNote:
      'CORRECTED 11 September 2026. The status is deliberately unchanged; the note is not. This note used to read that src/content/clients.ts records a required `permission` field per row and that "every row reads UNCONFIRMED, so `approvedClients()` is empty", and that the names rendering anyway was "a deliberate open gate, not an oversight: removing seven clients from the homepage is the founder\'s decision, and the file says so". Both clauses stopped being true on 11 September 2026. WHAT EVIDENCE EXISTS. The founder was asked whether the seven names then rendering with no recorded permission should be hidden or kept, and answered "Keep them — I\'m confident we have the basis". On that basis, and on that alone, the seven rows in src/content/clients.ts — gowalkies, SIB360, One-Stop CCTV, Butter Smiles, Beowulf, CAST Perimeter and Lytics — were set to APPROVED on 11 September 2026, and `approvedClients()` returns all seven. The evidence IS that decision, attributed and dated in that file. No per-client release document exists anywhere in this project, this note does not assert one, and the founder\'s decision of 11 September 2026 is what would have to be produced if the basis for a particular name were ever challenged. An eighth name, Akashic Knowing, is NOT covered by it: it sits in `additionalClients`, nothing imports that array, this build has never published it, and it stays UNCONFIRMED because the founder was not asked about it. Nothing has been confirmed about any logo IMAGE. WHERE IT RENDERS, re-run on 11 September 2026 rather than inherited: the same seven names render as text wordmarks through `ClientLogos` on / (src/app/page.tsx) and /ai-engineering (src/app/ai-engineering/page.tsx). That component reads `approvedClients()` in src/content/clients.ts — not this register — so the names do not render through this row, and this row\'s status gates none of them. CORRECTED later the same day, and the correction is confined to the mechanism on purpose. This note used to say "That component reads `clients` directly — not `approvedClients()`, and not this register", and it supported that with "Rendering the homepage with every row flipped back to UNCONFIRMED on 11 September 2026 produced byte-identical HTML, which is the check behind that sentence rather than an inference from it". Both were true when written and neither survived the same day: `ClientLogos` was switched onto `approvedClients()` on 11 September 2026. The cited check has actually reversed, which is worth stating rather than quietly dropping — rebuilding the site on that date with all seven rows flipped back to UNCONFIRMED now removes the client section from / and /ai-engineering altogether, because the accessor empties and the component returns null. Measured by building it, not inferred. THE CONCLUSION IS UNCHANGED, and that is exactly why this correction is so narrow: `approvedClients()` filters the `permission` field in src/content/clients.ts, not this register, so the switch moved the render from one file that is not this register to another file that is not this register. This row gates none of those names either way, its status is deliberately unchanged by this correction, and the reasons it stays HELD are set out next and are untouched by the switch. No logo image renders anywhere: the artwork in public/logos is white-on-transparent and unusable on this light design. WHY THIS STAYS HELD, which is a decision and should be read as one. The founder approved seven named clients; this row governs a claim CLASS, "Named client logos and wordmarks". VERIFIED would assert that the class is cleared — covering the eighth name he was never asked about, every name added after today, and logo images for which there is neither usable artwork nor permission. Nor would it be inert: `publishedClaims()` feeds `ProofStrip`, so VERIFIED publishes a badge reading "Named client logos and wordmarks" in the Verified proof strip on / and under "Verified and published" on /certifications — the site advertising its own permission as a proof point. That was measured by rendering it on 11 September 2026, not reasoned about. HELD keeps the gate fail-closed for the next name and for the first image, which is what the instruction above asks of it, and leaves the per-name record where it belongs, in src/content/clients.ts. To move this row, the class needs the engagement and the public-use basis confirmed for every name and every mark it covers, not one decision about seven of them.',
  },
  {
    id: 'case-study-metrics',
    label: 'Numerical case-study results (savings, percentages, ratings, adoption)',
    status: 'HELD',
    publicationInstruction:
      'EVIDENCE GATE — Keep internal metrics in CMS but hide until evidence and permission are approved.',
    evidenceNote:
      'Includes the AIA figures the handoff names explicitly ($20k savings, 98% integration, 4.7/5), which it holds pending methodology, denominator and client permission. Where they sit as at 8 September 2026: in src/content/work.ts under `internalEvidence.heldMetrics`, which no component reads, so they render nowhere. The case-study route (src/app/case-studies/[slug]/page.tsx) renders `publishedMetrics(cs)` and guards on that list being non-empty, so a study with no publishable figure prints its narrative and no metric band; work.ts also asserts the register invariants at module load, which is what makes a held figure in the wrong array a build failure rather than a publication. Publication-safe narrative copy is unaffected: the challenge, the engineering and an unquantified result can ship without this row moving. (work.ts was being rewritten by another work package while this note was written, so no line number or per-study count is quoted here — check it, do not cite this.)',
  },
  {
    id: 'ai-project-count',
    label: '200+ AI and emerging-technology projects',
    status: 'HELD',
    publicationInstruction: 'HOLD — Require project register and definition of "project".',
    evidenceNote:
      'No project register exists in the repository and "project" is undefined, so the count cannot be reproduced by anyone checking it. Re-checked 8 September 2026 by grepping src/ and public/: it renders nowhere. The only occurrences are references rather than publications — the claim-scanner in src/content/work.ts, which greps case-study copy for counts of this shape, and public/llms.txt, which states that no project count is published.',
  },
  {
    id: 'top-ai-company-award',
    label: '"Top AI company in the UK", or any award or ranking claim',
    status: 'HELD',
    publicationInstruction: 'HOLD — Require exact award/ranking, year, publisher and wording.',
    evidenceNote:
      'Awards and distinctions fall inside BPMMR 2008 reg. 3(5), so the exact award, year, publisher and their own wording are needed before any form of this claim is made. Re-checked 8 September 2026 by grepping src/ and public/: it renders nowhere. The only occurrences are references rather than publications — the claim-scanner regex in src/content/work.ts, the standing rule stated on /certifications ("a certification, badge, rating or award only where there is evidence for the precise claim"), and public/llms.txt, which tells answer engines not to repeat "top AI company" or any ranking or list placement for this company.',
  },
  {
    id: 'appg-parliament-reference',
    label: 'APPG and Parliamentary references',
    status: 'HELD',
    publicationInstruction:
      'WORDING GATE — Use only the exact substantiated relationship. Do not imply Parliamentary endorsement.',
    evidenceNote:
      'A wording gate rather than a badge: only the exact substantiated relationship may be described, and nothing that reads as Parliamentary endorsement. CORRECTED 8 September 2026. This note said "Not currently rendered anywhere in src/", which was false. It renders twice, both on /about (src/app/about/page.tsx): once as the answer to "What is Pixelette Technologies’ connection to UK AI policy?" in that page\'s `faqs` array, which `faqSchema(faqs)` also emits as FAQPage JSON-LD, so the claim is machine-readable as well as visible; and once as the body of the "Policy exposure" section. Both give the same relationship — the founder holds a shareholding in Big Innovation Centre, which acts as Secretariat to the All-Party Parliamentary Group on Artificial Intelligence — and both state in terms that it is not an accreditation, an endorsement or a partnership. That is the wording gate being met rather than breached, which is why the row stays HELD rather than moving: the gate is on the wording, so any edit to either instance has to be re-checked against the substantiated relationship, and the JSON-LD copy has to move with the visible one.',
  },
  {
    id: 'blockchain-volumes-and-chain-counts',
    label:
      'Blockchain production counts, value tokenised, transaction volumes and the number of live chains or protocols',
    status: 'HELD',
    publicationInstruction:
      'HOLD — Require production/economic evidence and clear definitions.',
    evidenceNote:
      'src/content/company.ts lists the chains and protocols the practice works with as a capability list, which is not a production claim. It renders as an uncounted pill row on /blockchain (src/app/blockchain/page.tsx), with no number attached to it and no "in production" wording, and the FAQ there answers which chains the practice works with rather than how many are live. The held figures — value tokenised, token counts, sales volume, and "twenty-four chains and protocols in production use" — render nowhere as at 8 September 2026: they sit in src/content/work.ts under `internalEvidence.heldMetrics`, and on /blockchain and / they survive only in comments recording their removal. Wording that turns the capability list into a count "in production use" is the held claim, and the handoff holds it until there is production evidence and a definition of what counts as production.',
  },
  {
    id: 'smart-contract-audit',
    label: 'Smart contract "audit"',
    status: 'HELD',
    publicationInstruction:
      'HOLD / REWORD — Use "review/testing" unless the precise audit competence and scope is evidenced.',
    evidenceNote:
      'Reword rather than hold where the work is real: "review" and "testing" describe what was done without asserting an independent audit competence. The reword is done, and refusing the word is now itself published copy — /blockchain (src/app/blockchain/page.tsx) offers "structured review and testing of contracts written by someone else. We do not call our own testing an audit", and /blockchain/smart-contracts-dapps carries the same refusal three times over: in a capability card, in a section heading ("We do not call our own testing an audit."), and in the answer to "Do you audit smart contracts?", which also feeds that page\'s FAQPage JSON-LD. Re-checked 8 September 2026: no page claims an audit competence for a Pixelette company. The word returns only with the competence and scope evidenced.',
  },
  {
    id: 'certified-cross-sell',
    label: 'Pixelette Certified cross-sell wording',
    status: 'HELD',
    publicationInstruction:
      'SAFE WORDING ONLY — Use readiness/governance/coordination language; independent assurance remains independent.',
    evidenceNote:
      'Held claim: that a Group company holds an accreditation, issues a certificate, performs an independent audit or has a named certified-practice status. What may be published instead is the handoff section 12 wording — Certified helps scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment. That wording lives in `certified` in src/content/company.ts and is imported rather than retyped, so there is one sentence to keep safe: it renders on /assurance, /certifications, / and /ai-engineering through `CertifiedHandoff`, and in the group line in src/content/nav.ts. Corrected 8 September 2026: the LIVE diagram (src/app/ai-engineering/LiveDiagram.tsx), which /ai-engineering and /method/live both render, was still outside that arrangement — it said "Certification of it sits with Pixelette Certified" and labelled its evidence layer "certified separately by Pixelette Certified", publishing the held claim on two pages from one hardcoded string. It now composes `certified.name` and `certified.positioningLine`, so both pages move together. Moving this row to VERIFIED requires the exact legal entity and status, not a general belief that the practice is competent.',
  },
  {
    id: 'geography-count',
    label: '"Thirteen countries", or any other geography count',
    status: 'HELD',
    publicationInstruction:
      'HOLD — 13 countries or any other geography count (handoff, "Hold until verified").',
    evidenceNote:
      'The 7 September 2026 legal review lists "Thirteen countries" among the claims it could not verify and says the figure needs a source. Removed from the group blurb in src/content/nav.ts on 8 September 2026 and emptied in src/content/company.ts (`countriesDelivered`, now an empty string). Re-checked 8 September 2026: it renders nowhere, and the follow-on defect is closed too — the trust pill row that printed a bare " countries" off the emptied string now reads this register through `ProofStrip` and renders nothing at all rather than an empty frame. To publish, name the countries and the engagements that put the company in them.',
  },
  {
    id: 'case-study-outcome-percentages',
    label: 'Match accuracy, adoption or commercial-outcome percentages for 2Connect',
    status: 'NOT_PUBLISHED',
    publicationInstruction: 'DO NOT INVENT — No approved metric basis used in this handoff.',
    evidenceNote:
      'Distinct from the held rows above: there is no metric basis at all, so there is nothing to gather and nothing to approve. Re-checked 8 September 2026: the 2Connect entry in src/content/work.ts publishes an empty `metrics` array, so /case-studies/2connect renders the narrative with no metric band at all, and the percentage and completion claims the previous site made are carried only as held rows with the reason each was withdrawn. The narrative ships without numbers.',
  },
];

/**
 * The claims a component may render. Empty until a row is moved to VERIFIED —
 * which is the intended state, not a gap. A proof component must handle the
 * empty case by rendering nothing at all, not an empty frame.
 */
export function publishedClaims(): Claim[] {
  return claims.filter(claim => claim.status === 'VERIFIED');
}

/** Look up a single row. Returns undefined for an id that is not registered. */
export function claimById(id: string): Claim | undefined {
  return claims.find(claim => claim.id === id);
}

/**
 * Whether a single claim may be rendered. Fails closed on purpose: an id that
 * is not in the register is not publishable, so a typo in a component hides a
 * badge rather than publishing an unregistered claim.
 */
export function isPublishable(id: string): boolean {
  return claimById(id)?.status === 'VERIFIED';
}
