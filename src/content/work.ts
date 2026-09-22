import { claimById, isPublishable } from '@/content/claims';

/**
 * Case studies.
 *
 * The site's standing rule, stated on the Work page itself: name the client
 * where we are permitted to, state the process, show the number before and
 * after. Where a figure is not yet measured it stays a `Placeholder` and
 * renders visibly unfilled. We do not use stock case studies.
 *
 * Content and imagery are carried across from the previous Pixelette
 * Technologies website's own case-study library. Two defects in that source
 * were found and NOT carried across:
 *
 *  - `chain-legal` and `smart-contractor` each pointed at another case study's
 *    banner image. Every entry here uses its own artwork.
 *  - The £500,000 / "80% sold in the first hour" figures were attributed to
 *    Butter Smiles on one design board. They belong to the 'Stay Sane' NFT
 *    collection, which is a different engagement entirely. They are attributed
 *    correctly below.
 *
 * Metrics that were commented out in the source (BlockGuard, Beyorch) were left
 * out rather than revived — they had been withdrawn deliberately.
 *
 * ---------------------------------------------------------------------------
 * 2026-09-08. The founder's implementation handoff
 * (design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt) is now the authority for
 * case-study copy. It supplies four narratives — 2Connect, Fusio Wallet, Ayni
 * Gold and AIA — written in two layers: a publication-safe narrative for the
 * site, and an internal evidence note for every stronger claim that still
 * needs approval. Its non-negotiable publication rule is:
 *
 *   "Client name/logo, quotes and numerical results require approval. If
 *    permission or evidence is not available, anonymise the client while
 *    keeping the challenge, engineering work and non-quantified result."
 *
 * That rule is carried here as types rather than as prose, because a comment
 * cannot stop a figure rendering and a type can. Three mechanisms do the work:
 *
 *  - `MetricStatus` on every figure. `HELD` never reaches a page.
 *  - `namePermission` with a required `anonymisedName` on the PENDING branch,
 *    so a gated study cannot exist without the copy that replaces its name.
 *  - `internalEvidence`, which keeps the handoff's own evidence notes in the
 *    repo, off the render path, so the provenance survives the session.
 *
 * `assertPublicationInvariants` at the foot of this file enforces all three at
 * module load, so a violation fails the build rather than reaching the site.
 *
 * ---------------------------------------------------------------------------
 * 2026-09-08, later the same day. The gate above and the claims register in
 * `src/content/claims.ts` were contradicting each other.
 *
 * When `MetricStatus` was introduced, every figure already in this file was
 * carried across as 'VERIFIED'. That was a mechanical migration, not an
 * assessment: nothing was checked against the register, which is the mechanism
 * the handoff actually mandates. The register holds the whole class —
 *
 *   "Case-study metrics — EVIDENCE GATE — Keep internal metrics in CMS but
 *    hide until evidence and permission are approved."
 *   "All case studies | Client logo / quote / numerical result — APPROVAL GATE"
 *
 * — so 43 figures were rendering on /case-studies under a status that said
 * they were evidenced while the register said the opposite. Three of them
 * ($14M tokenised, £500,000 in sales, 80% in the first hour) also sat inside
 * the register's separate blockchain-volumes hold.
 *
 * Every one of the 43 was reassessed against the evidence actually in this
 * repository. There is none: no measurement record, no client permission
 * record, no evidence directory. The only provenance any of them has is an
 * earlier Pixelette marketing artefact — the previous site's case-study
 * library or the 2026 design board — and this repository's own
 * GO-LIVE-CHECKLIST.md documents four separate instances of one engagement's
 * figures appearing on another engagement's page, plus a published "170%
 * retention" rate that is arithmetically impossible. A number restated by an
 * earlier page is the same claim one hop back, not evidence for it. So all 43
 * are HELD, moved into `internalEvidence.heldMetrics` with a per-figure
 * release condition, and the prose that quoted them is rewritten to the
 * non-quantified version the handoff's publication rule asks for.
 *
 * The durable fix is that the two mechanisms can no longer disagree silently.
 * Every measured figure now names the register rows that govern it
 * (`claimIds`), and `assertPublicationInvariants` fails the build if a figure
 * says VERIFIED while any row governing it does not. It also fails the build
 * on a percentage, currency amount, formatted count or multiplier appearing in
 * published prose while the metrics row is held — which is the hole the prose
 * rewrites would otherwise have reopened one careless edit later.
 */

/**
 * Publication status of a single figure.
 *
 * The handoff's claims gate: "Every number, badge and accreditation is either
 * VERIFIED, HELD FOR EVIDENCE, or NOT PUBLISHED."
 *
 *  - `VERIFIED`      evidence and the right to publish are both in hand, and
 *                    every claims-register row governing the figure is itself
 *                    VERIFIED. It renders as a figure.
 *  - `HELD`          the figure exists internally but is not approved. It never
 *                    renders. Held figures belong in
 *                    `internalEvidence.heldMetrics`, off `metrics` entirely, so
 *                    that a page iterating `cs.metrics` directly cannot reach
 *                    one; `publishedMetrics()` is the second line of defence
 *                    for any that are put in `metrics` anyway.
 *  - `NOT_MEASURED`  no figure exists. Renders as the site's visible
 *                    placeholder, which is the existing `pending` idiom.
 */
export type MetricStatus = 'VERIFIED' | 'HELD' | 'NOT_MEASURED';

/**
 * A row id in the claims register, `src/content/claims.ts`.
 *
 * Written out as a union rather than derived from the register, because
 * `claims.ts` types its ids as `string` and this file is not the owner of that
 * file. The gap that leaves — a row renamed there and not here — is closed at
 * module load instead: `assertPublicationInvariants` looks every id below up
 * in the register and fails the build if one no longer resolves.
 */
export type ClaimId =
  | 'iso-cyber-essentials-badges'
  | 'clutch-rating'
  | 'client-logos'
  | 'case-study-metrics'
  | 'ai-project-count'
  | 'top-ai-company-award'
  | 'appg-parliament-reference'
  | 'blockchain-volumes-and-chain-counts'
  | 'smart-contract-audit'
  | 'certified-cross-sell'
  | 'geography-count'
  | 'case-study-outcome-percentages';

/** Every id this file may reference, so the register can be checked for drift. */
const ALL_CLAIM_IDS: readonly ClaimId[] = [
  'iso-cyber-essentials-badges',
  'clutch-rating',
  'client-logos',
  'case-study-metrics',
  'ai-project-count',
  'top-ai-company-award',
  'appg-parliament-reference',
  'blockchain-volumes-and-chain-counts',
  'smart-contract-audit',
  'certified-cross-sell',
  'geography-count',
  'case-study-outcome-percentages',
];

/**
 * The register row that governs every case-study figure, without exception.
 *
 * The register's row is "Case-study metrics — EVIDENCE GATE" and it carves out
 * nothing, so every measured figure in this file has to name it. A figure that
 * named only a narrower row would otherwise slip the class gate by being
 * specific.
 */
const METRIC_CLAIM_ID: ClaimId = 'case-study-metrics';

type WorkMetricBase = {
  value: string;
  /** The fuller label. Used on the case-study page, where there is room. */
  label: string;
  /**
   * Compressed label for a card, where the metric sits in a narrow tile beside
   * two or three others. For example "sentiment analysis errors" on the
   * case-study page, "sentiment errors" on the index card. Falls back to
   * `label` when a metric reads the same either way.
   */
  shortLabel?: string;
};

/**
 * A figure that has actually been measured, whether or not it may be published.
 *
 * `claimIds` is required, and that is the point of the type. A figure that
 * names no register row is a figure nobody checked against the register, which
 * is exactly how 43 unevidenced numbers came to be marked VERIFIED. Naming the
 * rows makes the check mechanical: see `assertPublicationInvariants`.
 */
export type MeasuredMetric = WorkMetricBase & {
  status: 'VERIFIED' | 'HELD';
  /**
   * Every claims-register row that governs this figure. Must include
   * `METRIC_CLAIM_ID`; add the narrower rows too where they bite — a token
   * count or a tokenised value is also inside
   * `blockchain-volumes-and-chain-counts`.
   */
  claimIds: readonly ClaimId[];
  /** Never a measured figure. See `UnmeasuredMetric`. */
  pending?: false;
};

/**
 * The visible placeholder for a figure that does not exist yet.
 *
 * It asserts nothing, so it names no register row — the union makes that
 * unrepresentable rather than merely discouraged.
 */
export type UnmeasuredMetric = WorkMetricBase & {
  status: 'NOT_MEASURED';
  /**
   * Mirrors `status === 'NOT_MEASURED'`, and is required on this arm so the
   * compiler keeps the two in step rather than the invariant catching it later.
   *
   * @deprecated Retained only because three practice pages outside this module
   * (/ai-automation, /blockchain, /engineering) still read `m.pending` to pick
   * the placeholder styling. Delete it once those pages read the status.
   */
  pending: true;
  claimIds?: undefined;
};

/**
 * A figure on a case study.
 *
 * A union rather than one type with a required `status`, so that the two
 * things a figure can be — measured, or a placeholder for one that is not —
 * carry different obligations. A measured figure must name its register rows;
 * a placeholder must not pretend to have any.
 */
export type WorkMetric = MeasuredMetric | UnmeasuredMetric;

/**
 * A measured figure sitting behind the evidence gate, in
 * `internalEvidence.heldMetrics`, with the note saying what would release it.
 *
 * Normally `status: 'HELD'`. Changing that one word to 'VERIFIED' publishes the
 * figure — `publishedMetrics()` reads released rows out of this list — which is
 * the whole ergonomic point: the founder releases a number by editing the line
 * the number is already written on, and nothing has to be moved or retyped.
 *
 * The build still stops him releasing one before the register agrees. A row
 * here that says VERIFIED while `claims.ts` still holds its claim class fails
 * `assertPublicationInvariants` with a message naming the register row to move
 * first. Two locks, one for the class and one for the figure.
 */
export type GatedMetric = MeasuredMetric & {
  /** What must be proved or approved before this figure can be published. */
  evidenceNote: string;
};

/** @deprecated Use `GatedMetric`: a row here is not necessarily still held. */
export type HeldMetric = GatedMetric;

export type WorkFilter =
  | 'Production systems'
  | 'Data & integration'
  | 'Financial services'
  | 'Blockchain';

/**
 * Where the handoff's evidence register puts a claim.
 *
 * The four values are the register's own, in its own words: READY, READY
 * subject to name / public-use permission, HOLD, and DO NOT INVENT — the last
 * one meaning no figure exists and none is to be created.
 */
export type EvidenceStatus =
  | 'READY'
  | 'READY_SUBJECT_TO_PERMISSION'
  | 'HOLD'
  | 'DO_NOT_INVENT';

/** One row of the handoff's INTERNAL CASE-STUDY EVIDENCE REGISTER. */
export type EvidenceRegisterEntry = {
  claim: string;
  status: EvidenceStatus;
  /** The register's evidence note, kept in its own words. */
  note: string;
};

/**
 * The evidence record behind a case study.
 *
 * `publicationNote`, `sourceBasis`, `register` and `gatedNames` are INTERNAL
 * ONLY: never rendered, never serialised into a page, never put in JSON-LD.
 * Their job is to keep the provenance of a narrative in the repo next to the
 * narrative itself, so the next person to touch this file can see what a claim
 * rests on and what is still gated, instead of rediscovering it from a document
 * that may not be to hand.
 *
 * `heldMetrics` is the one exception and is documented as such on the field:
 * it is the gate's holding pen, not a private note, and a row in it renders
 * once both locks are open.
 */
export type InternalEvidence = {
  /**
   * The handoff's INTERNAL EVIDENCE / PUBLICATION NOTE block, near-verbatim.
   *
   * Optional: only the four case studies the 8 September 2026 handoff supplied
   * have one. Writing a publication note for the studies carried across from
   * the previous site would be inventing provenance, which is the failure this
   * file exists to prevent.
   */
  publicationNote?: string;
  /** Which internal material the published narrative was drawn from. */
  sourceBasis: string;
  /** The rows of the evidence register that concern this case study. */
  register: EvidenceRegisterEntry[];
  /**
   * Figures that have been measured but are not cleared for publication.
   *
   * They are held here rather than in `metrics` so that no page iterating
   * `cs.metrics` directly can reach a held figure, however this data is used in
   * future. `publishedMetrics()` is the only reader, and it returns a row from
   * this list only once that row says VERIFIED — which the invariant will not
   * allow while the register still holds its claim class.
   *
   * Nothing is ever deleted from here. A withdrawn figure with its release
   * condition is a record; a deleted one is a number somebody will eventually
   * reinvent from memory.
   */
  heldMetrics: GatedMetric[];
  /**
   * Every name that must not appear in public copy — the client, the product,
   * the token, the end customer.
   *
   * `assertPublicationInvariants` checks the published strings against this
   * list and fails the build on a leak. The scan is scoped to NAMES, not to
   * studies: a name leaves this list's protection only where `releasedNames`
   * on the study records a decision releasing that exact name. A study whose
   * `namePermission` is 'CONFIRMED' is therefore still scanned for every
   * other name listed here.
   *
   * Corrected 2026-09-11. This note used to read "Every name that must not
   * appear in public copy while `namePermission` is 'PENDING'", and the check
   * matched it — it skipped any study that was not 'PENDING'. Confirming one
   * name consequently disarmed the guard on every other name in the same
   * study. See `NameRelease` for what replaced that.
   */
  gatedNames: string[];
};

/**
 * The narrative fields, split out so that the anonymised variants can reuse
 * exactly the same shape without the type referring to itself.
 */
type CaseStudyNarrative = {
  /** The challenge. */
  problem: string;
  /** What Pixelette built. */
  built: string;
  /**
   * The delivery approach. Optional: the studies carried across from the
   * previous site do not record one, and inventing a delivery sequence for
   * them would be writing fiction into a case study.
   */
  delivery?: string;
  /** The result. */
  measured: string;
  next: string | null;
  /**
   * Publication-safe statement of what the narrative rests on, rendered in the
   * "Tech and evidence" block the handoff's page structure asks for.
   */
  evidenceBasis?: string;
};

export type CaseStudyDetail = CaseStudyNarrative & {
  /**
   * Optional. The page already falls back to a visible [STACK] placeholder,
   * and for the handoff's own case studies the source material describes the
   * engineering without naming the toolchain. An absent stack is a gap someone
   * can fill; a guessed one is a fact nobody can retract.
   */
  stack?: string;
  duration: string | null;
  /**
   * NOT RENDERED ANYWHERE, since 2026-09-18.
   *
   * This described the architecture diagram a case study would carry, and its
   * only consumer was a MediaSlot with no `src` on the case-study page, which
   * therefore rendered a dashed "[ LABEL ]" placeholder rather than a diagram.
   * The founder had that removed: a labelled empty box announces a gap instead
   * of holding a space for one, and it shows an internal content note to a
   * client.
   *
   * The strings are kept because they describe artwork that may still be
   * commissioned, and they remain in the claim scanner's sweep. If a diagram is
   * ever produced, render it WITH a src; do not reinstate the empty slot.
   */
  architectureLabel: string;
  /**
   * Name-free variants of any narrative field whose approved wording carries a
   * gated name. Used while `namePermission` is 'PENDING'; the approved wording
   * above is published verbatim once it is 'CONFIRMED'.
   *
   * Read this through `publishedDetail()`, never directly — that is the whole
   * point of it existing.
   */
  anonymised?: Partial<CaseStudyNarrative>;
};

/**
 * Whether we may publish the client's name and logo.
 *
 * 'PENDING' is the safe default and the handoff requires it: a name goes live
 * only where genuine engagement, evidence and a public-use basis are all
 * confirmed. Nothing about the page changes when a study is gated except the
 * words in the name slots and whether the client's own screenshot is shown.
 */
export type NamePermission = 'CONFIRMED' | 'PENDING';

/**
 * One name, released by one decision, with the decision attached.
 *
 * A permission is about a NAME, not about a case study. A study can carry
 * several gated names — the client, the product it was white-labelled as, the
 * end customer whose data it processes — and a founder asked about one of them
 * has answered about one of them. This type exists so that "confirmed" has to
 * say *what* was confirmed, and so the gate can release that string and keep
 * scanning the rest.
 *
 * Matching against `gatedNames` is whole-string and case-insensitive, never by
 * substring: releasing 'Ayni' does not release 'Ayni Gold', because they are
 * two names and a founder asked about one of them was asked about one of them.
 *
 * Every field is required. An approval nobody can attribute, date and quote is
 * the thing `src/content/clients.ts` calls "not an approval at all", and the
 * invariant rejects one with any field blank.
 */
export type NameRelease = {
  /** The gated string this release covers, exactly as `gatedNames` spells it. */
  name: string;
  /** Who gave the permission. The founder, or a named document — not "the team". */
  approvedBy: string;
  /** ISO date the permission was given. */
  approvedOn: string;
  /** What was asked and what was answered, in the words it was answered in. */
  basis: string;
};

/**
 * The name gate, as a discriminated union rather than as two loose fields.
 *
 * A study cannot be marked 'PENDING' without supplying the copy that stands in
 * for its name, because the compiler will not let it. That is the difference
 * between a policy and a comment about a policy.
 *
 * `releasedNames` lives on the 'CONFIRMED' branch alone, so the compiler will
 * not let a study that is still PENDING carry a release record at all.
 */
type NameGate =
  | {
      namePermission: 'CONFIRMED';
      /**
       * The gated names this study's confirmation actually released, one entry
       * per name, each with the decision behind it.
       *
       * Optional only because most studies here gate no name at all
       * (`gatedNames` is empty) and have nothing to release. It is not
       * optional in effect: invariant 3 scans every name in `gatedNames` that
       * no entry here releases, whatever `namePermission` says, so a study
       * flipped to 'CONFIRMED' without a release record fails the build the
       * moment its own client name appears in published copy — which, for any
       * study that was PENDING, it does the instant the flip is made.
       *
       * Confirming one name releases THAT name. It is not blanket permission
       * for every gated string the study happens to contain.
       */
      releasedNames?: NameRelease[];
      /** May be prepared in advance, so a study can be gated without losing copy. */
      anonymisedName?: string;
      anonymisedKicker?: string;
    }
  | {
      namePermission: 'PENDING';
      /** Stands in wherever the client name would appear, e.g. "an AI professional-networking platform". */
      anonymisedName: string;
      /** Stands in for `kicker`, in the same `subject · sector · service` shape, so the card is unchanged. */
      anonymisedKicker: string;
    };

type CaseStudyFields = {
  slug: string;
  client: string;
  /** Kicker above the title, e.g. "LYTICS · MEDIA INTELLIGENCE · PRODUCTION SYSTEM" */
  kicker: string;
  sector: string;
  service: string;
  title: string;
  /**
   * Short title for the <title> tag. The on-page headline is written to be
   * read; this one is written to survive truncation in a search result, where
   * roughly 60 characters survive including the site-name suffix.
   */
  metaTitle: string;
  /**
   * One-paragraph description of the engagement. This is the case study's
   * meta description as well as its card and hero standfirst — the route
   * handler passes it straight to `pageMetadata({ description })` — so it is
   * held to the 165 characters `scripts/audit.py` allows before a search
   * result truncates. Seven summaries were rewritten on 2026-09-08 to come
   * back inside it; each was shortened by editing rather than by cutting,
   * because a description that stops mid-clause is worse than a long one.
   * Rewrite, do not truncate, and measure rather than estimate.
   */
  summary: string;
  metrics: WorkMetric[];
  filters: WorkFilter[];
  image?: string;
  imageLabel: string;
  /**
   * The handoff's per-case CTA label for a selected-work card, e.g. "Read the
   * 2Connect case study". Resolve it through `displayCardCta()`, which drops
   * back to a name-free label while the study is gated.
   */
  cardCta?: string;
  /** Present only where the detail page has real content behind it. */
  detail?: CaseStudyDetail;
  /**
   * Render the "what happened next" and client-quote sections as visible
   * placeholders, prompting someone to go and get them.
   *
   * Opt-in rather than automatic. The approved design boards those two sections
   * for its own example case study, so they are shown there. Stamping an empty
   * quote block onto every case study carried across from the previous site
   * would manufacture gaps the design never asked for and bury the real ones in
   * the go-live checklist.
   */
  pendingQuote?: boolean;
  /** Internal work is labelled as internal, on the card and on the page. */
  internal?: boolean;
  /**
   * The older, narrower NDA idiom: a client we are contractually barred from
   * naming. `namePermission` is the broader gate and covers this case too; the
   * flag is kept because the page still has a distinct line for an NDA, which
   * says something different from "permission not yet confirmed".
   */
  anonymised?: boolean;
  /** INTERNAL ONLY. See `InternalEvidence`. Never rendered. */
  internalEvidence?: InternalEvidence;
};

export type CaseStudy = CaseStudyFields & NameGate;

/**
 * What a gated case study says about its own evidence, in place of the client
 * name and the numbers it is not yet allowed to publish.
 *
 * One sentence, shared by all four, because it states the site's rule rather
 * than anything specific to an engagement. It is the handoff's publication
 * rule turned outward: we would rather tell a reader what is being withheld
 * and why than quietly present a thinner case study.
 */
const GATED_EVIDENCE_BASIS =
  'This write-up is drawn from Pixelette’s own project records for the engagement. Under the site’s publication rule the client name, logo, quotes and any numerical result go live only once permission and evidence are both confirmed, so what is published here is the challenge, the engineering and a non-quantified result.';

/**
 * Where the figures carried across from the previous site came from, and why
 * that provenance is not evidence for them.
 *
 * This is the finding that put 43 figures behind the gate on 8 September 2026.
 * It is stated once, here, because it is the same finding for all of them.
 */
const PREVIOUS_SITE_RECORD_BASIS =
  'The previous Pixelette Technologies website’s own case-study library, which is the only record of these figures held in this repository. It is a marketing artefact, not a measurement record: it states each number without a baseline, a method, a period or a client permission. This repository’s own GO-LIVE-CHECKLIST.md then documents four separate instances of one engagement’s figures appearing on another engagement’s page, and a published “170% retention” rate that is arithmetically impossible — so the library is not merely thin as a source, it is demonstrably unreliable. A number restated by an earlier marketing page is the same claim one hop back, never evidence for it.';

/**
 * The other source the carried-across figures come from, and the same problem.
 */
const DESIGN_BOARD_BASIS =
  'The 2026 design file’s own case-study board. A board states the figure it was handed; it does not record how the figure was measured, over what period, or whether the client agreed to publish it. It is the same class of source as the previous site’s record and carries the same defects — board 05 attributes one engagement’s sales figures to an entirely different client, and board 06 publishes an impossible “170% retention”.';

/**
 * What a case study says in place of the figures it is not yet allowed to
 * publish, rendered in the handoff’s “Tech and evidence” section.
 *
 * The companion to GATED_EVIDENCE_BASIS below, for the studies whose client is
 * named but whose numbers are not cleared. Telling a reader that a figure is
 * being withheld and why is a stronger page than quietly presenting a thinner
 * one, and it is the same argument the Work page makes at the top.
 */
const HELD_FIGURES_EVIDENCE_BASIS =
  'The figures for this engagement are recorded in Pixelette’s own project material and are held behind this site’s evidence gate. Under the publication rule set on 8 September 2026 a numerical result goes live only once its measurement basis and the client’s permission are both confirmed, so what is published here is the challenge, the engineering and the result without a number on it. The figures are kept, not discarded, and go up when the evidence does.';

/**
 * For a study whose figures were WITHDRAWN at source rather than held pending
 * evidence. Added 2026-09-14 for Beyorch, which had no `evidenceBasis` at all.
 *
 * The distinction is this file's own, stated at Beyorch's `metrics: []`: "a
 * withdrawn figure is not a pending one". So neither existing constant fits.
 * GATED_EVIDENCE_BASIS says the client name goes live once permission is
 * confirmed, and Beyorch's name IS confirmed and published.
 * HELD_FIGURES_EVIDENCE_BASIS promises the figures "are kept, not discarded, and
 * go up when the evidence does" — which would be a promise this engagement
 * cannot keep, because the numbers were struck from the source record, not
 * parked behind a gate. Reusing it would have been the tidier-looking mistake.
 *
 * The consequence of having none was not cosmetic: the "Tech and evidence"
 * section renders only where `evidenceBasis` is set, so Beyorch was the one
 * detailed study on the site that silently published no evidence statement at
 * all — confirmed from its built page, which contains no such section.
 */
const WITHDRAWN_FIGURES_EVIDENCE_BASIS =
  'This write-up is drawn from Pixelette’s own project records for the engagement, and the client is named with permission. The outcome figures that once accompanied it were withdrawn from publication at source and are not repeated here or held for later release. A withdrawn figure is not a pending one. What is published is the challenge, the engineering and the stack.';

export const caseStudies: CaseStudy[] = [
  {
    slug: '2connect',
    client: '2Connect',
    /*
     * NAME PERMISSION CONFIRMED — founder decision, 2026-09-11.
     *
     * Approved by: the founder. Approved on: 2026-09-11. He confirmed that
     * 2Connect is a normal client he is content to be publicly associated
     * with, and, asked whether they could be named in the case study,
     * answered "Yes — name them in the case study". That is the basis for
     * this line and the only basis for it.
     *
     * What flipping this does, all of it through the display accessors:
     *   - `displayName()`    — '2Connect' instead of the anonymised phrase.
     *   - `displayKicker()`  — the named kicker.
     *   - `displayCardCta()` — un-suppressed, so the selected-work card now
     *     reads 'Read the 2Connect case study' rather than the name-free label.
     *   - `publishedImage()` — un-suppressed, so /work/2connect.png renders on
     *     the card, the hero and the og:image. That file was confirmed present
     *     on disk on 2026-09-11 before this line was changed; un-gating an
     *     image that does not exist is how a card ships broken.
     *   - `publishedDetail()` — the approved named wording in `detail`, rather
     *     than the `detail.anonymised` overlay.
     * The page keeps the same sections and the same layout either way.
     *
     * What it does NOT do, and must not be read as doing:
     *   - It releases no figure. `metrics` is empty and stays empty; the
     *     register row below still reads DO_NOT_INVENT.
     *   - It does not lift the HOLD on "taken from concept to live on the web
     *     and both app stores". That is a completion claim, it was withdrawn
     *     on 2026-09-08 pending completion evidence, and a name permission is
     *     not completion evidence.
     *   - It confirms nothing about Fusio Wallet, Ayni Gold or AIA.
     *
     * CORRECTED 2026-09-11, later the same day. A correction, not a deletion.
     *
     * This paragraph used to read: "Known consequence, recorded rather than
     * discovered later: invariant 3 in `assertPublicationInvariants` is
     * per-study and skips any study that is not PENDING, so the gated-name
     * scan no longer guards this entry — and that includes the SECOND name in
     * `gatedNames`, 'FindReciprocity', which the founder was not asked about.
     * … Anyone editing the copy below should keep it that way by hand, because
     * the automatic check that used to do it is off for this study."
     *
     * It described a real defect accurately, and the defect has now been fixed
     * rather than documented. Invariant 3 is scoped to NAMES, not to studies:
     * it runs over every study whatever its permission, and skips only the
     * names a `releasedNames` record released. The record below releases
     * '2Connect' and nothing else, so 'FindReciprocity' is scanned across this
     * study's published strings on every build, and the build fails if it ever
     * reaches one.
     *
     * Nothing is owed by hand any more. It remains true that 'FindReciprocity'
     * appears today only in `internalEvidence.sourceBasis`, which no page
     * reads and which `publishedStrings()` does not collect — the difference
     * is that the build now proves that on every run instead of relying on it,
     * so an edit that publishes the name fails loudly rather than quietly.
     */
    namePermission: 'CONFIRMED',
    /*
     * WHAT THE CONFIRMATION RELEASED, name by name.
     *
     * One entry, for one name. The founder was asked about 2Connect and
     * answered about 2Connect. 'FindReciprocity' is deliberately absent: he was
     * never asked about it, and an answer about one client cannot release
     * another. Leaving it out is not an omission to tidy up later — it is what
     * keeps the gated-name scan running over it.
     *
     * If permission for 'FindReciprocity' is ever obtained, add a second entry
     * here recording who gave it and when, in the same shape. Do not delete it
     * from `gatedNames`; the release record is the permission's home, and a
     * name removed from the gated list leaves no trace of ever having been
     * gated.
     */
    releasedNames: [
      {
        name: '2Connect',
        approvedBy: 'The founder',
        approvedOn: '2026-09-11',
        basis:
          'Asked whether the client could be named in the case study, having confirmed 2Connect as a normal client he is content to be publicly associated with, he answered "Yes — name them in the case study". That decision is the entire basis for this release, and it names one client.',
      },
    ],
    /*
     * Kept, not deleted, and the type allows exactly this — the 'CONFIRMED'
     * branch of `NameGate` makes both fields optional rather than forbidding
     * them, "so a study can be gated without losing copy".
     *
     * If the permission is ever withdrawn, the fallback is already written and
     * the study goes back to 'PENDING' as a one-word change. Deleting these two
     * lines would turn that into a copywriting job done under pressure, which
     * is the worst moment to be inventing name-free wording.
     */
    anonymisedName: 'an AI professional-networking platform',
    anonymisedKicker: 'AI professional networking · Agentic AI · Production AI system',
    kicker: '2Connect · Agentic AI · Production AI system',
    sector: 'Professional networking',
    service: 'Production AI Systems',
    title:
      'Engineering an AI matchmaking platform that understands intent before making an introduction',
    metaTitle: 'Agentic AI matchmaking platform',
    summary:
      'Structured onboarding, profile intelligence, compatibility scoring and controlled agent-to-agent interaction, so an introduction is made on intent, not volume.',
    /*
     * Empty, and it stays empty. The evidence register's row for this case
     * study reads "Match accuracy / adoption / commercial-outcome percentages
     * — DO NOT INVENT", because no approved metric basis exists. An empty
     * metrics array publishes nothing; a placeholder tile would advertise a
     * number that is coming, and none is.
     */
    metrics: [],
    filters: ['Production systems', 'Data & integration'],
    image: '/work/2connect.png',
    imageLabel: 'Product screenshot',
    cardCta: 'Read the 2Connect case study',
    detail: {
      problem:
        'Professional networks can create high volumes of connections without enough relevance. The product needed to understand what users want, what they can offer and whether two professionals are likely to create value for one another, while keeping matching scalable, privacy-aware and commercially usable.',
      built:
        'Pixelette designed and developed the AI architecture and MVP route around structured onboarding, professional-profile intelligence, persona/vector creation, compatibility scoring, AI-assisted matchmaking, controlled agent-to-agent interaction, feedback-led refinement, dashboards and B2B event/API integration routes.',
      delivery:
        'Discovery workshops → onboarding/persona design → matchmaking architecture → LLM/NLP and compatibility logic → agent interaction controls → dashboard/integration design → iterative MVP development and Phase 2 planning.',
      measured:
        'The engagement moved 2Connect from concept and discovery into a structured AI product architecture and MVP development programme, with defined matching flows, a working development environment and later-phase product planning recorded in the project trail.',
      next: null,
      /* No stack is published. The handoff describes LLM/NLP and compatibility
         logic without naming the technologies, and naming them from memory
         would be inventing a fact into a case study. The aside shows its
         [STACK] placeholder instead, which is this file's existing idiom. */
      duration: null,
      architectureLabel: 'Matchmaking and agent-interaction architecture',
      /*
       * Moved off GATED_EVIDENCE_BASIS 2026-09-14, because that constant had
       * become self-contradicting on this page.
       *
       * It reads "the client name, logo, quotes and any numerical result go
       * live only once permission and evidence are both confirmed" — printed on
       * a page that names 2Connect in its title, its kicker and its body. The
       * name permission was confirmed on 2026-09-11 and the name went live; the
       * evidence statement underneath it went on describing the name as gated.
       *
       * HELD_FIGURES_EVIDENCE_BASIS is the constant written for exactly this
       * state and its own docstring says so: "for the studies whose client is
       * named but whose numbers are not cleared". The figures here are still
       * gated — no match-accuracy or adoption percentage is published — which is
       * what that wording describes, accurately, without also claiming the name
       * is withheld.
       */
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
      anonymised: {
        measured:
          'The engagement moved the platform from concept and discovery into a structured AI product architecture and MVP development programme, with defined matching flows, a working development environment and later-phase product planning recorded in the project trail.',
      },
    },
    internalEvidence: {
      publicationNote:
        'Internal project records include repeated discovery and development meetings, defined onboarding/persona flows, vector and compatibility matching, controlled AI-agent interaction, feedback loops, dashboard requirements, event-platform integration routes and a working development environment. Publish the client name/logo only where the public-use basis is confirmed; do not invent match-accuracy or adoption percentages. NAME PERMISSION CONFIRMED 2026-09-11 by the founder, who confirmed 2Connect as a normal client he is content to be publicly associated with and answered "Yes — name them in the case study"; namePermission is CONFIRMED from that date. The second half of this instruction is untouched by it: no match-accuracy, adoption or commercial-outcome figure is published, and the completion claim in the register below stays on HOLD.',
      sourceBasis:
        '2Connect / FindReciprocity client meeting notes and Pixelette AI portfolio material, supporting the agentic-AI matchmaking architecture, development route and later-phase planning.',
      register: [
        {
          claim: 'Public use of the client name 2Connect in this case study',
          status: 'READY',
          note: 'Confirmed by the founder on 2026-09-11. He confirmed 2Connect as a normal client he is content to be publicly associated with, and answered "Yes — name them in the case study". This is a permission for the NAME. It releases no figure and no completion claim, and the two rows below that read READY_SUBJECT_TO_PERMISSION are left as written, as the record of what was true before this date.',
        },
        {
          claim: 'Challenge / product architecture narrative',
          status: 'READY_SUBJECT_TO_PERMISSION',
          note: 'Detailed client meeting notes + AI portfolio material.',
        },
        {
          claim: 'Working development environment / Phase 2 planning',
          status: 'READY_SUBJECT_TO_PERMISSION',
          note: 'Project notes record dev URL and later Phase 2 discussions.',
        },
        {
          claim: 'Match accuracy / adoption / commercial-outcome percentages',
          status: 'DO_NOT_INVENT',
          note: 'No approved metric basis used in this handoff. None is published and none is to be created.',
        },
        {
          claim: 'Taken from concept to live on the web and both app stores',
          status: 'HOLD',
          note: 'The previous site’s summary made this claim. It is a completion claim, and the handoff’s publication-safe result stops at a structured MVP development programme. Withdrawn from publication 2026-09-08 pending completion evidence.',
        },
      ],
      heldMetrics: [],
      gatedNames: ['2Connect', 'FindReciprocity'],
    },
  },
  {
    slug: 'fusio',
    client: 'Fusio Wallet',
    namePermission: 'CONFIRMED',
    releasedNames: [
      {
        name: 'Fusio Wallet',
        approvedBy: 'The founder',
        approvedOn: '2026-09-17',
        basis:
          'Asked whether to confirm permission for these three studies - which publishes the client name and the image together - or to leave them gated and replace the placeholder, he answered "add them". He had been shown, in the same message, that option one returns "names and images both". That decision is the entire basis for this release.',
      },
      {
        name: 'Fusio',
        approvedBy: 'The founder',
        approvedOn: '2026-09-17',
        basis:
          'Asked whether to confirm permission for these three studies - which publishes the client name and the image together - or to leave them gated and replace the placeholder, he answered "add them". He had been shown, in the same message, that option one returns "names and images both". That decision is the entire basis for this release.',
      },
    ],
    anonymisedName: 'a FinTech wallet and financial-planning programme',
    anonymisedKicker:
      'FinTech product programme · Digital finance · Mobile, web and AI product engineering',
    kicker: 'Fusio Wallet · Digital finance · Mobile, web and AI product engineering',
    sector: 'Digital finance',
    service: 'Mobile, web and AI product engineering',
    title:
      'Bringing mobile, web, AI, financial planning and digital-asset functionality into one product programme',
    metaTitle: 'Mobile, web and AI financial product',
    summary:
      'A phased engineering programme across native iOS, Android and web, covering asset categorisation, financial-data aggregation, forecasting and AI recommendations.',
    /*
     * Empty. The two figures the previous record published here — 200% growth
     * in user adoption, 90% simplified access to portfolio tools — are held in
     * `internalEvidence.heldMetrics` below with the reason. The register also
     * puts "every documented feature completed/live" on HOLD, so the narrative
     * describes a documented programme and a phased scope, not a finished
     * feature list.
     */
    metrics: [],
    filters: ['Financial services', 'Production systems', 'Blockchain'],
    image: '/work/fusio.png',
    imageLabel: 'Product screenshot',
    cardCta: 'Read the Fusio Wallet programme case study',
    detail: {
      problem:
        'The programme needed to bring traditional financial information, digital assets, planning tools, AI recommendations, adviser functionality and secure user access into one coherent product experience across mobile and web.',
      built:
        'Pixelette led a phased engineering programme spanning native iOS/Android applications and web interfaces, with documented scope covering asset categorisation, off-chain financial-data aggregation, cash-flow forecasting, goal planning, authentication, adviser tooling, AI recommendations, administration and later-stage product functionality.',
      delivery:
        'Product architecture and phased scope → mobile/web engineering → financial and data integrations → AI recommendation features → adviser/admin tooling → testing, deployment planning and post-release support route.',
      /* The handoff's next sentence — "Treat completion status feature-by-feature
         as a separate evidence gate" — is an instruction to us, not copy for a
         reader. It is held in `internalEvidence.register` instead. */
      measured:
        'The documented programme created a connected product architecture and phased delivery route from launch-oriented core functionality into more advanced financial-management, adviser and AI capability.',
      next: null,
      /* Carried from the previous site's own record for this client. It is not
         a claim class the handoff gates, and dropping it would lose real
         content. */
      stack: 'Next.js, Node.js, Solidity, Ethers.js, Hyperledger, BSC, AWS',
      /* The previous record's "Six months" belonged to the smart-contract
         portfolio product, not to the programme described above. Carrying it
         onto a differently scoped narrative would state a wrong fact, so the
         row is omitted until a duration for this programme is on record. */
      duration: null,
      architectureLabel: 'Product and integration architecture',
      evidenceBasis: GATED_EVIDENCE_BASIS,
    },
    internalEvidence: {
      publicationNote:
        'The underlying programme documentation sets out native iOS/Android and web delivery, asset categorisation, financial-data aggregation, cash-flow forecasting, goal planning, authentication, adviser tooling, AI recommendations, administration and later-stage functionality. Describe this as a documented engineering programme and phased product scope unless separate completion evidence is approved.',
      sourceBasis:
        'Fusio Wallet Pixelette-side service agreement and programme documentation, supporting the mobile/web product scope, AI recommendations, integrations, adviser/admin tooling and phased delivery model.',
      register: [
        {
          claim: 'Programme scope / mobile-web-AI architecture narrative',
          status: 'READY',
          note: 'Pixelette-side service agreement + portfolio / ecosystem documentation.',
        },
        {
          claim: 'Every documented feature completed/live',
          status: 'HOLD',
          note: 'A scope/roadmap is not automatically completion evidence. Treat completion status feature-by-feature as a separate evidence gate.',
        },
        {
          claim: '200% growth in user adoption / 90% simplified access to portfolio tools',
          status: 'HOLD',
          note: 'Published on the previous site’s Fusio record. Withdrawn 2026-09-08: the handoff gates every numerical result behind approval, and no evidence basis for either figure is recorded here.',
        },
      ],
      heldMetrics: [
        {
          value: '+200%',
          label: 'growth in user adoption',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Carried from the previous site’s Fusio record. Needs the measurement window, the baseline and the client’s permission before it can be published.',
        },
        {
          value: '90%',
          label: 'simplified access to portfolio tools',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Carried from the previous site’s Fusio record. Needs a stated method — 90% of what, measured how — and the client’s permission.',
        },
      ],
      gatedNames: ['Fusio Wallet', 'Fusio'],
    },
  },
  {
    slug: 'ayni-gold',
    client: 'Ayni Gold',
    namePermission: 'CONFIRMED',
    releasedNames: [
      {
        name: 'Ayni Gold',
        approvedBy: 'The founder',
        approvedOn: '2026-09-17',
        basis:
          'Asked whether to confirm permission for these three studies - which publishes the client name and the image together - or to leave them gated and replace the placeholder, he answered "add them". He had been shown, in the same message, that option one returns "names and images both". That decision is the entire basis for this release.',
      },
      {
        name: 'Ayni',
        approvedBy: 'The founder',
        approvedOn: '2026-09-17',
        basis:
          'Asked whether to confirm permission for these three studies - which publishes the client name and the image together - or to leave them gated and replace the placeholder, he answered "add them". He had been shown, in the same message, that option one returns "names and images both". That decision is the entire basis for this release.',
      },
      {
        name: 'AYNI',
        approvedBy: 'The founder',
        approvedOn: '2026-09-17',
        basis:
          'Asked whether to confirm permission for these three studies - which publishes the client name and the image together - or to leave them gated and replace the placeholder, he answered "add them". He had been shown, in the same message, that option one returns "names and images both". That decision is the entire basis for this release.',
      },
    ],
    anonymisedName: 'a real-world-asset gold tokenisation ecosystem',
    anonymisedKicker: 'Real-world asset tokenisation · Gold and commodities · Blockchain engineering',
    kicker: 'Ayni Gold · Gold and commodities · Blockchain engineering',
    sector: 'Gold and commodities',
    service: 'Blockchain engineering',
    title: 'Connecting physical gold-mining activity to a transparent on-chain participation model',
    metaTitle: 'Gold-mining tokenisation on chain',
    summary:
      'A real-world-asset architecture joining physical gold-mining to tokenised participation, staking and reward logic, with investor and treasury views.',
    /*
     * Empty. The register holds investment returns, token value, mining output
     * and production volume, all of which need independent evidence and
     * approval. The client's own production figures are held too, and for a
     * second reason: they are the mine's results, not the engineering's.
     */
    metrics: [],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/ayni.png',
    imageLabel: 'Platform screenshot',
    cardCta: 'Read the Ayni Gold case study',
    detail: {
      problem:
        'The product needed to connect a physical gold-mining proposition with transparent digital participation. Reward calculations, investor visibility, treasury activity and on-chain logic had to work as one coherent RWA architecture rather than as a standalone token.',
      built:
        'Pixelette’s portfolio material documents an architecture around the AYNI ERC-20 token, staking and PAXG-linked reward logic, vesting, investor dashboards, treasury views and administration capability for mining and finance operations.',
      delivery:
        'RWA/product architecture → token and reward mechanics → investor/treasury interfaces → administration flows → on-chain components structured for independent security review and production deployment.',
      /* The handoff's closing line — "Do not add financial-performance or
         production-volume claims without evidence" — is an instruction to us.
         It is held in `internalEvidence.register` rather than published. */
      measured:
        'The resulting architecture created a structured digital layer around a physical mining proposition, bringing tokenisation, investor participation, treasury visibility and reward mechanics into one auditable product model.',
      next: null,
      /* No stack published: the portfolio material names the token standard and
         the reward link, not the toolchain. */
      duration: null,
      architectureLabel: 'Token, reward and treasury architecture',
      evidenceBasis: GATED_EVIDENCE_BASIS,
      anonymised: {
        built:
          'Pixelette’s portfolio material documents an architecture around the project’s ERC-20 token, staking and PAXG-linked reward logic, vesting, investor dashboards, treasury views and administration capability for mining and finance operations.',
      },
    },
    internalEvidence: {
      publicationNote:
        'Pixelette’s blockchain portfolio material describes Ayni Gold as an RWA platform linking licensed gold-mining throughput in Peru to on-chain participation, including the AYNI token, staking/PAXG reward logic, vesting, investor dashboards, treasury views and admin tooling. Do not publish investment-return, token-value, mining-output or production-volume claims without independent evidence and approval.',
      sourceBasis:
        'Pixelette Blockchain Portfolio material for Ayni Gold. The previous entry here was written from the public sites rather than the engagement paperwork; the invoices, SLAs, internal estimates and change requests were deliberately left unread, because commercial terms are not case-study copy.',
      register: [
        {
          claim: 'RWA architecture / token-reward-dashboard narrative',
          status: 'READY_SUBJECT_TO_PERMISSION',
          note: 'Pixelette blockchain portfolio material.',
        },
        {
          claim: 'Investment returns / token value / mining output / production volume',
          status: 'HOLD',
          note: 'Require independent evidence and approval.',
        },
        {
          claim: 'Licensed Peruvian concession, grams extracted, dollars distributed',
          status: 'HOLD',
          note: 'The client’s production results, not the result of the engineering. Naming the concession also names the client while permission is pending.',
        },
      ],
      heldMetrics: [],
      gatedNames: ['Ayni Gold', 'Ayni', 'AYNI'],
    },
  },
  {
    /*
     * The handoff's fourth proof point: "Keep AIA as a strong fourth proof
     * point rather than a homepage lead." It is therefore in this array, and
     * on this page, but deliberately absent from `homepageCaseStudies`.
     *
     * The challenge and summary are the previous record's, which the handoff
     * does not replace. The result paragraph is not: it published all three
     * held figures in prose, so it was rewritten to the handoff's own
     * non-quantified wording.
     */
    slug: 'accessible-intelligence-assessment',
    /*
     * AIA IS THE PRODUCT. DiverSCInnova IS THE CLIENT ORGANISATION, and it is
     * still gated — see `gatedNames` below and ADR-0036.
     *
     * When this study was confirmed on 2026-09-17, `detail.built` read "AIA, a
     * gamified cognitive mapping tool FOR DiverSCInnova". That is published page
     * copy, so confirming the study as it stood would have named a second
     * organisation the founder was never asked about: "add them" was an answer
     * about three images.
     *
     * So the release below covers 'AIA' alone and the phrase came out of the
     * sentence. Do not add DiverSCInnova to `releasedNames` to make a copy edit
     * easier — the build-time scan failing is the point, and naming that
     * organisation is a founder decision nobody has taken.
     */
    client: 'AIA',
    namePermission: 'CONFIRMED',
    releasedNames: [
      {
        name: 'AIA',
        approvedBy: 'The founder',
        approvedOn: '2026-09-17',
        basis:
          'Asked whether to confirm permission for these three studies - which publishes the client name and the image together - or to leave them gated and replace the placeholder, he answered "add them". He had been shown, in the same message, that option one returns "names and images both". That decision is the entire basis for this release.',
      },
    ],
    anonymisedName: 'an accessible cognitive-assessment platform',
    anonymisedKicker: 'Accessible assessment SaaS · Inclusive hiring · Production AI system',
    kicker: 'AIA · Inclusive hiring · Production AI system',
    sector: 'HR technology',
    service: 'Production AI Systems',
    title: 'Gamified cognitive assessment for inclusive hiring',
    metaTitle: 'Inclusive hiring: cognitive assessment',
    summary:
      'A science-backed assessment tool for candidates with auditory, visual or dual impairments — meeting diversity hiring quotas with evidence.',
    /* The $20k, 98% and 4.7/5 figures are HOLD in the evidence register. They
       are held below, not rendered. */
    metrics: [],
    filters: ['Production systems'],
    image: '/work/aia.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Organisations struggle to meet mandated hiring quotas for people with disabilities: assessing candidates with sensory, physical or intellectual impairments fairly is hard, and the compliance requirement makes getting it wrong expensive in both directions.',
      built:
        'AIA, a gamified cognitive mapping tool that assesses up to ten cognitive skills, among them focus, attention and logical reasoning, and produces detailed reports for inclusive hiring, role alignment and vocational guidance.',
      delivery:
        'Accessibility research → product design → AI/model work → integrations → QA → deployment, across a seven-month programme.',
      measured:
        'Internal case-study material documents a seven-month SaaS and AI assessment programme spanning accessibility research, product design, AI/model work, integrations, QA and deployment. Any savings, integration-rate or satisfaction metrics remain behind an evidence gate.',
      next: null,
      stack: 'React, Node.js, MongoDB, Stripe, OpenAI',
      duration: 'Seven months',
      architectureLabel: 'Assessment pipeline',
      evidenceBasis: GATED_EVIDENCE_BASIS,
      anonymised: {
        built:
          'A gamified cognitive mapping tool that assesses up to ten cognitive skills, among them focus, attention and logical reasoning, and produces detailed reports for inclusive hiring, role alignment and vocational guidance.',
      },
    },
    internalEvidence: {
      publicationNote:
        'Internal case-study material documents Pixelette’s collaboration with DiverSCInnova on a seven-month SaaS/AI assessment programme spanning accessibility research, product design, AI/model work, integrations, QA and deployment. Any savings, integration-rate or satisfaction metrics remain behind an evidence gate.',
      sourceBasis: 'Dedicated AIA case-study document + AI portfolio.',
      register: [
        {
          claim: 'Challenge / solution / seven-month programme narrative',
          status: 'READY_SUBJECT_TO_PERMISSION',
          note: 'Dedicated AIA case-study document + AI portfolio. Ready for the wider Work page subject to name permission.',
        },
        {
          claim: '$20k savings / 98% integration / 4.7/5',
          status: 'HOLD',
          note: 'Verify methodology, denominator and client permission.',
        },
      ],
      heldMetrics: [
        {
          value: '$20k',
          label: 'average recruitment cost saving per organisation',
          shortLabel: 'saved per organisation',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Published on the previous site as an estimate. Needs the methodology, the denominator and the client’s permission before it can go back on a page.',
        },
        {
          value: '98%',
          label: 'successful integration with existing ATS tooling',
          shortLabel: 'ATS integration',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the denominator: 98% of how many integrations, over what period, verified by whom.',
        },
        {
          value: '4.7/5',
          label: 'post-assessment satisfaction rating',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the sample size, the survey instrument and the client’s permission to publish a rating.',
        },
      ],
      gatedNames: ['AIA', 'DiverSCInnova'],
    },
  },
  {
    slug: 'blockguard',
    client: 'BlockGuard',
    namePermission: 'CONFIRMED',
    kicker: 'BlockGuard · Digital assets · High-assurance platform',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'Fractional asset tokenisation with custody and compliance built in',
    metaTitle: 'BlockGuard: governed asset tokenisation',
    summary:
      'Cryptographic and distributed-systems engineering for fractional asset tokenisation, delivered under documented security, access and change-control discipline.',
    /*
     * Empty. All three figures are held, and sit inside two register holds at
     * once, in `internalEvidence.heldMetrics` below, each with the condition
     * that would release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Financial services', 'Production systems', 'Blockchain'],
    image: '/work/blockguard.png',
    imageLabel: 'Platform screenshot',
    pendingQuote: true,
    detail: {
      problem:
        'Fractional ownership of real assets needs custody, compliance and reporting around it before a single token is minted. The platform had to satisfy buyers who arrive with a security questionnaire rather than a wallet.',
      built:
        'An asset tokenisation platform with the custody, compliance and reporting layer built in, delivered under documented change control, access control and review discipline. Contracts written to be read by an auditor, because on chain a mistake is permanent.',
      measured:
        'The platform put real assets into fractional ownership with custody, compliance and reporting handled inside the system rather than around it, so a buyer arriving with a security questionnaire could be answered from the platform itself. The tokenised value, the token count and the average number of owners per asset are all held for evidence.',
      next: null,
      stack: 'Solidity, distributed systems, key management',
      duration: null,
      architectureLabel: 'Architecture diagram',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Tokenised value, token count and average owners per asset',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
        {
          claim: 'Tokenised value, token count and average owners per asset (blockchain hold)',
          status: 'HOLD',
          note: 'Also inside the register’s separate blockchain hold — “Blockchain volumes / values / chain counts — HOLD — Require production/economic evidence and clear definitions” — so these figures need production evidence and a stated definition of what is being counted, on top of the case-study evidence gate.',
        },
        {
          claim: 'ISO 9001 and ISO 27001 delivery',
          status: 'HOLD',
          note: 'The summary and the What-Pixelette-built paragraph stated that the platform was “delivered under our ISO 9001 and ISO 27001 management systems”. That is the register’s “Corporate ISO / Cyber Essentials badges — HOLD — Publish only with current certificate for exact legal entity, scope and validity” row, and no certificate is held in this repository. Reworded 2026-09-08 to describe the delivery discipline rather than assert a certification. Restore the certification wording only when the certificate for Pixelette Technologies Ltd is in hand and the claims-register row is moved to VERIFIED.',
        },
      ],
      heldMetrics: [
        {
          value: '$14M',
          label: 'assets tokenised',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the custodial or on-chain record the total is drawn from, the valuation basis and its date, and the client’s permission. Also needs the production evidence and the definition of “tokenised” that the blockchain hold requires.',
        },
        {
          value: '1,200+',
          label: 'tokens, first 6 months',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the contract addresses and the block range the count covers, a definition of “token issued”, and the date the six months run from.',
        },
        {
          value: '25',
          label: 'average owners per asset',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the denominator: how many assets, at what date, and whether an owner is an address or a person. Addresses and people are not the same number and the difference is the whole claim.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'chysler',
    client: 'Stay Sane',
    namePermission: 'CONFIRMED',
    kicker: 'Stay Sane · NFT marketplace · Blockchain',
    sector: 'Digital collectibles',
    service: 'Blockchain engineering',
    title: 'Fine art on chain, with provenance running both ways',
    metaTitle: 'Stay Sane: fine art on chain',
    summary:
      'Tokenising the physical artwork of Charles Salvador Bronson, with a marketplace that linked digital collectibles back to the physical pieces they represent.',
    /*
     * Empty. All three figures are held, and sit inside two register holds at
     * once, in `internalEvidence.heldMetrics` below, each with the condition
     * that would release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Blockchain', 'Production systems'],
    image: '/work/stay-sane.png',
    imageLabel: 'Marketplace screenshot',
    detail: {
      problem:
        'Connecting fine art to a chain is mostly a trust problem, not a minting problem. The collection needed high-resolution digital renderings of physical artwork, secure on-chain transactions, and a buying experience that would not feel alien to art collectors. Without a credible marketplace, the authenticity of the work was the thing at risk.',
      built:
        'A blockchain-backed NFT marketplace that authenticated ownership, settled transactions securely, and linked a share of the digital pieces directly to the physical works they represent, so provenance ran both ways.',
      measured:
        'The collection sold through the marketplace, with a share of the digital pieces linked directly to the physical works they represent so that provenance could be checked in both directions rather than asserted in one. The sales total, the launch-window share and the proportion of pieces linked to physical artwork are all held for evidence.',
      next: null,
      stack: 'Solidity, Hardhat, Web3.js, Node.js, IPFS, Go',
      duration: null,
      architectureLabel: 'Marketplace and contract architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Sales total, launch-hour share and physical-link proportion',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
        {
          claim: 'Sales total, launch-hour share and physical-link proportion (blockchain hold)',
          status: 'HOLD',
          note: 'Also inside the register’s separate blockchain hold — “Blockchain volumes / values / chain counts — HOLD — Require production/economic evidence and clear definitions” — so these figures need production evidence and a stated definition of what is being counted, on top of the case-study evidence gate.',
        },
      ],
      heldMetrics: [
        {
          value: '£500,000',
          label: 'total sales',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the settlement record the total is drawn from, the conversion basis and date if the sales settled on chain, and the artist’s and the client’s permission. This figure was attributed to a different client entirely on one design board, which is why it is documented here rather than trusted.',
        },
        {
          value: '80%',
          label: 'sold within the first hour',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the collection size, the launch timestamp and the sale record. A launch-velocity claim is the easiest on this page to check and the most damaging to get wrong.',
        },
        {
          value: '10%',
          label: 'of NFTs linked to physical artwork',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the collection size and the list of linked pieces. A proportion with no denominator is not a figure.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'diamond-nxt',
    client: 'DIAMOND NXT',
    namePermission: 'CONFIRMED',
    kicker: 'DIAMOND NXT · Commodities · Blockchain',
    sector: 'Commodity trading',
    service: 'Blockchain engineering',
    title: 'Provenance tracking for diamond trading, evidenced on chain',
    metaTitle: 'DIAMOND NXT: provenance',
    summary:
      'Tokenised diamond trading with provenance tracked on chain, in a market where the paper trail has always been the weak point.',
    /*
     * Empty. All four figures are held — two of them inside the blockchain hold
     * as well — in `internalEvidence.heldMetrics` below, each with the condition
     * that would release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/diamond-nxt.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Diamond trading has a long-standing transparency problem: proving origin and ethical sourcing is difficult, which discourages both buyers and investors. Without verifiable provenance, participants carry fraud risk they cannot price.',
      built:
        'A tokenised trading marketplace with provenance tracked on chain, using ERC-1155 and decentralised storage for the asset records, and a trading interface backed by real-time data services.',
      measured:
        'Origin and chain of custody became something a participant could check rather than take on trust, and the marketplace drew traders who stayed with it. The accuracy rate, the tokenisation growth, the number of traders engaged and the retention rate are all held for evidence.',
      next: null,
      stack: 'Solidity, Truffle, ERC-1155, IPFS, Web3.js, Node.js, Moralis',
      duration: null,
      architectureLabel: 'Provenance and tokenisation architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Provenance accuracy, tokenisation growth, trader count and retention',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
        {
          claim: 'Tokenisation growth and trader count (blockchain hold)',
          status: 'HOLD',
          note: 'Also inside the register’s separate blockchain hold — “Blockchain volumes / values / chain counts — HOLD — Require production/economic evidence and clear definitions” — so these figures need production evidence and a stated definition of what is being counted, on top of the case-study evidence gate.',
        },
      ],
      heldMetrics: [
        {
          value: '98%',
          label: 'provenance tracking accuracy',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the ground truth the accuracy is measured against, the sample size, and who verified it. An accuracy claim with no stated ground truth is unfalsifiable.',
        },
        {
          value: '$10M',
          label: 'tokenisation growth',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the on-chain record, the valuation basis and the period. “Growth” also needs a starting point, which is not recorded anywhere.',
        },
        {
          value: '1,500',
          label: 'traders engaged',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs a definition of “engaged” — registered, verified, or actually transacting — and the period it covers.',
        },
        {
          value: '70%',
          label: 'user retention',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the cohort, the retention window and the date. This repository’s own checklist records a “170% retention” figure on a design board, which is what an unchecked retention number looks like.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'digital-asset-vault',
    client: 'Digital Asset Vault',
    namePermission: 'CONFIRMED',
    kicker: 'Digital Asset Vault · Custody · Blockchain',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'Secure crypto custody people will actually move to',
    metaTitle: 'Digital Asset Vault: custody',
    summary:
      'Cold storage and custody engineering, with the migration path designed as carefully as the vault itself.',
    /* All three come from the design board's own "Our impact" section. Only the
       adoption figure had been carried across; the other two were dropped. */
    /*
     * Empty. All three figures are held — one of them an absence claim, the
     * hardest class to evidence — in `internalEvidence.heldMetrics` below, each
     * with the condition that would release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/digital-asset-vault.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Breaches, theft and lost private keys make custody the hardest part of holding digital assets. Existing options forced a choice between accessibility and enterprise-grade security.',
      built:
        'Cold-storage wallets, private key certificates and multi-signature control, so that assets are protected from compromise while ownership stays verifiable and control can be shared where an organisation needs it.',
      measured:
        'Active users moved their holdings into cold storage and businesses onboarded through the first months of operation. Adoption is the figure that tells you whether a custody product works in practice: a vault nobody migrates to protects nothing. The incident record, the migration rate and the onboarding count are all held for evidence.',
      next: null,
      /* Corrected against the design board's tech stack row, which shows PHP,
         Laravel, CodeIgniter, Go and C++. The previous value named React and
         Hyperledger, neither of which appears on the board, and omitted four
         that do. Go was the only overlap. */
      stack: 'PHP, Laravel, CodeIgniter, Go, C++',
      /* Stays null. The live record's only "6 months" here is "100+ businesses
         onboarded within the first 6 months" — an adoption window, not how long
         the build took. Founder-supplied duration only. */
      duration: null,
      architectureLabel: 'Custody architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: DESIGN_BOARD_BASIS,
      register: [
        {
          claim: 'Security-incident, cold-storage migration and onboarding figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
        {
          claim: 'Businesses onboarded (blockchain hold)',
          status: 'HOLD',
          note: 'Also inside the register’s separate blockchain hold — “Blockchain volumes / values / chain counts — HOLD — Require production/economic evidence and clear definitions” — so these figures need production evidence and a stated definition of what is being counted, on top of the case-study evidence gate.',
        },
      ],
      heldMetrics: [
        {
          value: '0',
          label: 'reported security incidents in the first year',
          shortLabel: 'security incidents',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'An absence claim, and the hardest class of figure on this site to evidence: it needs the monitoring and disclosure regime the absence is an absence under, the exact period, and the client’s permission. Published without those it is the most damaging single figure on this page.',
        },
        {
          value: '60%',
          label: 'of active users moved to cold storage',
          shortLabel: 'cold storage adoption',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs a definition of an active user, the denominator, and the date the proportion was taken at.',
        },
        {
          value: '100+',
          label: 'businesses onboarded in the first six months',
          shortLabel: 'businesses onboarded',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the onboarding record and the start date the six months run from, plus the production evidence the blockchain hold requires.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'beyorch',
    client: 'Beyorch',
    namePermission: 'CONFIRMED',
    kicker: 'Beyorch · Digital assets · Blockchain',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'A decentralised investment platform built for transparency',
    metaTitle: 'Beyorch: DeFi investment platform',
    summary:
      'Smart contracts, automated financial processes and secure tokenomics for an investment ecosystem that reduces reliance on intermediaries.',
    // Beyorch's outcome figures were withdrawn in the source record (commented
    // out, deliberately). None are shown here rather than revived — a withdrawn
    // figure is not a pending one.
    metrics: [],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/beyorch.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Traditional financial systems make it hard for investors to track assets and act quickly: manual processes, intermediaries and limited transparency all raise risk exposure and erode confidence.',
      built:
        'A blockchain-powered investment platform integrating smart contracts, automated financial processes and secure tokenomics: real-time asset tracking, instant transactions, and security designed in rather than added on.',
      measured:
        'The engagement’s outcome figures were withdrawn from publication and are not repeated here.',
      next: null,
      stack: 'Polkadot, Hyperledger, Go, C++, React',
      duration: null,
      architectureLabel: 'Platform architecture',
      evidenceBasis: WITHDRAWN_FIGURES_EVIDENCE_BASIS,
    },
  },
  {
    slug: 'ragnar-token',
    client: 'Ragnar Token',
    namePermission: 'CONFIRMED',
    kicker: 'Ragnar Token · Digital assets · Blockchain',
    sector: 'Digital assets',
    service: 'Blockchain engineering',
    title: 'A token and platform connecting banking with crypto',
    metaTitle: 'Ragnar Token: banking meets crypto',
    summary:
      'An ERC-20 token and its platform built end to end for Ragnar Trading Limited — buying, swapping and managing tokens as familiar as online banking.',
    /*
     * Empty. Both figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/ragnar-token.png',
    imageLabel: 'Platform screenshot',
    detail: {
      problem:
        'Ragnar Trading Limited needed an entire ecosystem from scratch: a token transaction system that worked efficiently, and a platform intuitive enough that people new to digital assets could adopt it without a learning curve.',
      built:
        'Ragnar Token ($RAG), an ERC-20 token on Ethereum designed for transactions and capital raising, alongside a web platform with real-time price tracking and transaction history, bringing the familiarity of traditional banking with the flexibility of crypto.',
      measured:
        'A share of platform visitors went on to become token holders, and buying or swapping the token runs as one uninterrupted flow rather than a multi-step exercise. The conversion rate and the transaction time are held for evidence.',
      next: null,
      stack: 'Ethereum (ERC-20), web platform',
      duration: null,
      architectureLabel: 'Token and platform architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Visitor-conversion and transaction-time figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
        {
          claim: 'Visitor conversion to token holders (blockchain hold)',
          status: 'HOLD',
          note: 'Also inside the register’s separate blockchain hold — “Blockchain volumes / values / chain counts — HOLD — Require production/economic evidence and clear definitions” — so these figures need production evidence and a stated definition of what is being counted, on top of the case-study evidence gate.',
        },
      ],
      heldMetrics: [
        {
          value: '12%',
          label: 'of visitors became token holders',
          shortLabel: 'visitor conversion',
          status: 'HELD',
          claimIds: ['case-study-metrics', 'blockchain-volumes-and-chain-counts'],
          evidenceNote:
            'Needs the visitor count, the holder count, the attribution window and the analytics source, plus the production evidence the blockchain hold requires.',
        },
        {
          value: '<1 min',
          label: 'to buy or swap a token',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the measurement: which flow, under what network conditions, at what fee level, and over how many runs. A best case and a median are different claims.',
        },
      ],
      gatedNames: [],
    },
  },
];

export const workFilters: WorkFilter[] = [
  'Production systems',
  'Blockchain',
  'Data & integration',
  'Financial services',
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(c => c.slug === slug);
}

/* ------------------------------------------------------------------------ *
 * The publication gate.
 *
 * Everything a page renders about a case study goes through one of the
 * accessors below. Reading `cs.client`, `cs.kicker`, `cs.image`, `cs.metrics`
 * or `cs.detail` directly bypasses the gate, which is exactly the mistake this
 * section exists to make hard to write.
 * ------------------------------------------------------------------------ */

/** True while the client's name and logo are not cleared for publication. */
export function isNameGated(cs: CaseStudy): boolean {
  return cs.namePermission === 'PENDING';
}

/** The name we are actually allowed to put on the page. */
export function displayName(cs: CaseStudy): string {
  return cs.namePermission === 'CONFIRMED' ? cs.client : cs.anonymisedName;
}

/** The kicker, in the same `subject · sector · service` shape either way. */
export function displayKicker(cs: CaseStudy): string {
  return cs.namePermission === 'CONFIRMED' ? cs.kicker : cs.anonymisedKicker;
}

/**
 * The CTA label for a selected-work card.
 *
 * The handoff's labels name the client ("Read the 2Connect case study"), so a
 * gated study falls back to the name-free label rather than leaking the name
 * into a button.
 */
export function displayCardCta(cs: CaseStudy): string {
  return cs.namePermission === 'CONFIRMED' && cs.cardCta ? cs.cardCta : 'Read the case study';
}

/**
 * The figures that may be rendered.
 *
 * Two sources, one gate. `metrics` holds the figures that are not behind the
 * evidence gate at all — today that is only the visible NOT_MEASURED
 * placeholders — and `internalEvidence.heldMetrics` holds the measured ones,
 * which join the published list the moment their own row says VERIFIED.
 *
 * The `status !== 'HELD'` filter on `metrics` is the second line of defence for
 * a held figure put there by mistake; `assertPublicationInvariants` fails the
 * build when that happens, so the second line should never be needed.
 */
export function publishedMetrics(cs: CaseStudy): WorkMetric[] {
  /*
   * TIGHTENED 2026-09-16 for launch. The filter was `status !== 'HELD'` alone,
   * which withheld evidence-gated figures but let an UNMEASURED one straight
   * through - and nine case studies carry a metric whose VALUE is the literal
   * string "[MEASURED RESULT]" with the label "pending write-up". Those
   * rendered as public body text on every one of those pages and on the work
   * index: eighteen placeholder strings on the detail pages alone.
   *
   * The gate was built to answer "is there evidence for this figure?" and had
   * no answer for "is there a figure at all?". A metric marked `pending`, or
   * NOT_MEASURED, is not a figure being withheld - it is an empty slot, and an
   * empty slot should render NOTHING rather than announce itself.
   *
   * This is deliberately surgical rather than an allowlist rewrite. The status
   * vocabulary in this file is wider than it looks - HOLD, DO_NOT_INVENT, READY
   * and READY_SUBJECT_TO_PERMISSION all currently pass - and narrowing to
   * VERIFIED only would blank metrics that legitimately publish today. That is
   * a content review, not a launch fix. Measured before and after: the four
   * complete studies keep every tile they had.
   */
  const released = (cs.internalEvidence?.heldMetrics ?? []).filter(m => m.status === 'VERIFIED');
  const publishable = cs.metrics.filter(
    m => m.status !== 'HELD' && m.status !== 'NOT_MEASURED' && !('pending' in m && m.pending),
  );
  return [...publishable, ...released];
}

/**
 * The client's own screenshot, or nothing at all while the name is gated.
 *
 * A product screenshot generally carries the client's name and logo inside the
 * image, so publishing it would defeat the anonymisation. `MediaSlot` renders a
 * labelled box at the same aspect ratio when there is no `src`, so the layout
 * is identical either way — which is what the handoff asks for.
 */
export function publishedImage(cs: CaseStudy): string | undefined {
  return cs.namePermission === 'CONFIRMED' ? cs.image : undefined;
}

/**
 * The narrative as it may be published: the approved wording where the name is
 * cleared, the name-free variants where it is not.
 */
export function publishedDetail(cs: CaseStudy): CaseStudyDetail | undefined {
  if (!cs.detail) return undefined;
  if (cs.namePermission === 'CONFIRMED' || !cs.detail.anonymised) return cs.detail;
  return { ...cs.detail, ...cs.detail.anonymised };
}

/**
 * The three selected-work case studies for the homepage.
 *
 * The handoff's order was 2Connect, Fusio Wallet, Ayni Gold. Founder instruction
 * 2026-09-22 replaced the third with BlockGuard: "Home page case study Ayni gold
 * with blockguard". Ayni Gold is not withdrawn - it keeps its own case study and
 * its card on /case-studies - it simply no longer leads the homepage.
 *
 * AIA is deliberately not here. The handoff keeps it "as a strong fourth proof
 * point rather than a homepage lead", so it appears on /case-studies with the
 * rest and nowhere on the homepage.
 *
 * The order lives in one place rather than as a rank on each entry, because
 * two ranks that disagree is a defect and one list cannot disagree with
 * itself. The throw guards the failure mode the repo has already had once:
 * a hardcoded slug that no longer matches anything renders an empty section
 * rather than an error.
 */
const HOMEPAGE_SLUGS = ['2connect', 'fusio', 'blockguard'] as const;

export const homepageCaseStudies: CaseStudy[] = HOMEPAGE_SLUGS.map(slug => {
  const cs = getCaseStudy(slug);
  if (!cs) {
    throw new Error(
      `work.ts: homepage case study '${slug}' is missing. The homepage's selected work is ` +
        'defined by HOMEPAGE_SLUGS and every slug in it must exist.',
    );
  }
  return cs;
});

/**
 * A figure written into published prose: a percentage, a currency amount, a
 * thousands-separated or open-ended count, a multiplier or a rating.
 *
 * These exist because the expensive half of holding a metric is not the metric
 * — `publishedMetrics()` handles that — it is the sentence that quoted it. The
 * result paragraph on this file's own case studies said "$14M in assets
 * tokenised" in prose while the tile beside it was gated, and nothing in the
 * type system could see it.
 */
const FIGURE_PATTERNS: readonly { name: string; re: RegExp }[] = [
  { name: 'a percentage', re: /\d+(?:[.,]\d+)?\s*%/ },
  { name: 'a currency amount', re: /[£$€]\s?\d/ },
  { name: 'a thousands-separated count', re: /\b\d{1,3}(?:,\d{3})+\b/ },
  { name: 'an open-ended count', re: /\b\d+\+/ },
  { name: 'a rating out of five or ten', re: /\b\d+(?:\.\d+)?\s*\/\s*(?:5|10)\b/ },
  {
    name: 'a multiplier',
    re: /\b\d+(?:\.\d+)?\s*(?:×|x)\b|\b(?:tripled|trebled|threefold|three-fold|doubled|twofold|two-fold|quadrupled|halved|cut in half)\b/i,
  },
];

/**
 * Vocabulary that belongs to a held claims-register row wherever it appears in
 * published copy, not only in a metric tile.
 *
 * This is the same defect class as the figures above, one level up: a case
 * study said its platform was "delivered under our ISO 9001 and ISO 27001
 * management systems" while `claims.ts` held the certification badges for want
 * of a certificate. Each pattern is checked only while its own register row is
 * unpublished, so a row moving to VERIFIED lifts its own scan and nothing else.
 */
const HELD_VOCABULARY: readonly { claimId: ClaimId; name: string; re: RegExp }[] = [
  { claimId: 'iso-cyber-essentials-badges', name: 'an ISO certification', re: /\bISO\s?\d{4,5}\b/i },
  { claimId: 'iso-cyber-essentials-badges', name: 'a Cyber Essentials claim', re: /\bcyber essentials\b/i },
  { claimId: 'clutch-rating', name: 'a Clutch rating', re: /\bclutch\b/i },
  {
    claimId: 'appg-parliament-reference',
    name: 'an APPG or Parliamentary reference',
    re: /\bAPPG\b|\bparliament/i,
  },
  {
    claimId: 'geography-count',
    name: 'a geography count',
    re: /\b(?:\d+|ten|eleven|twelve|thirteen|fourteen|fifteen)\s+countries\b/i,
  },
  {
    claimId: 'ai-project-count',
    name: 'an AI project count',
    re: /\b\d+\+?\s+(?:AI|emerging[- ]tech\w*)[\w\s-]{0,20}projects\b/i,
  },
  {
    claimId: 'top-ai-company-award',
    name: 'an award or ranking claim',
    re: /\btop[- ]rated\b|\btop \w+ (?:company|agency|firm|developer)\b|\baward[- ]winning\b/i,
  },
  {
    claimId: 'smart-contract-audit',
    name: 'a smart-contract audit claim',
    re: /\bsmart[- ]contract audit\w*\b|\baudit(?:ed|ing|s)? (?:the |a )?smart[- ]contract/i,
  },
];

/**
 * How a gated name and a released name are compared.
 *
 * Whole-string and case-insensitive, matching the case-insensitive scan below.
 * Never a substring test: 'Ayni' and 'Ayni Gold' are two entries in the same
 * `gatedNames` list and releasing one must not release the other.
 */
function normaliseName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Everything a page can actually put in front of a reader for one case study,
 * paired with the field it came from so a fault names a place to go and fix.
 *
 * Read through the display accessors on purpose: `displayName`,
 * `displayKicker` and `displayCardCta` resolve the name gate, so this returns
 * the anonymised strings for a gated study — the strings that are genuinely
 * published, rather than a hand-maintained list of fields that has to be kept
 * in step with the components.
 */
function publishedStrings(cs: CaseStudy): { field: string; text: string }[] {
  const out: { field: string; text: string }[] = [];
  const push = (field: string, text: string | null | undefined) => {
    if (typeof text === 'string' && text.length > 0) out.push({ field, text });
  };

  push('title', cs.title);
  push('metaTitle', cs.metaTitle);
  push('summary', cs.summary);
  push('sector', cs.sector);
  push('service', cs.service);
  push('imageLabel', cs.imageLabel);
  push('displayName()', displayName(cs));
  push('displayKicker()', displayKicker(cs));
  push('displayCardCta()', displayCardCta(cs));

  const detail = publishedDetail(cs);
  push('detail.problem', detail?.problem);
  push('detail.built', detail?.built);
  push('detail.delivery', detail?.delivery);
  push('detail.measured', detail?.measured);
  push('detail.next', detail?.next);
  push('detail.stack', detail?.stack);
  push('detail.duration', detail?.duration);
  push('detail.architectureLabel', detail?.architectureLabel);
  push('detail.evidenceBasis', detail?.evidenceBasis);

  for (const m of publishedMetrics(cs)) {
    push(`metric "${m.label}".value`, m.value);
    push(`metric "${m.label}".label`, m.label);
    push(`metric "${m.label}".shortLabel`, m.shortLabel);
  }

  return out;
}

/**
 * The gate, enforced.
 *
 * Runs once at module load, which means a violation fails the build rather
 * than reaching a page.
 *
 * The first three checks are the original ones. The rest were added on
 * 8 September 2026 after the two publication mechanisms on this site were
 * found contradicting each other: `claims.ts` held the whole case-study-metric
 * class, and 43 figures in this file said VERIFIED anyway, because the status
 * field had been populated by a migration rather than by an assessment. A
 * comment saying "check the register" would not have caught that. These do.
 *
 *  1. No metric marked HELD is sitting in `metrics`, where something could
 *     render it.
 *  2. The deprecated `pending` flag still mirrors `status === 'NOT_MEASURED'`,
 *     so the three practice pages that read it keep behaving.
 *  3. No gated name appears in any string a case study publishes. Scoped to
 *     NAMES, not to studies: it runs over every study whatever its permission,
 *     and skips a name only where that study's `releasedNames` records the
 *     decision that released THAT name. This is the check that would have
 *     caught the two places the handoff's own approved wording carries a
 *     client name.
 *
 *     Corrected 2026-09-11. It used to read "No gated name appears in any
 *     string a GATED case study publishes", and the code matched the wording:
 *     `if (cs.namePermission !== 'PENDING') continue`. Confirming one name
 *     therefore disarmed the guard on every other name in the same study,
 *     which is what happened to 'FindReciprocity' on the 2Connect entry the
 *     same morning — a second client name, never put to the founder, left
 *     protected by a code comment. A release is now per name and carries its
 *     approver, its date and its basis.
 *  4. Every `ClaimId` this file names still exists in `claims.ts`. Without it
 *     the checks below degrade silently into no-ops when a row is renamed.
 *  5. Every measured figure names at least one register row, and always the
 *     class row. A figure nobody bound to the register is a figure nobody
 *     assessed against it.
 *  6. THE CONTRADICTION CHECK. No figure may say VERIFIED while any register
 *     row governing it says otherwise. This is the one that makes the two
 *     mechanisms structurally unable to disagree.
 *  7. Every figure behind the evidence gate carries a release condition, so
 *     "what would it take to publish this" is answerable without asking.
 *  8. While the class row is held, no published string may contain a figure —
 *     percentage, currency amount, formatted count, multiplier or rating.
 *     Holding a metric and leaving the sentence that quoted it is not holding
 *     anything.
 *  9. No published string carries the vocabulary of a held claim (ISO, Cyber
 *     Essentials, Clutch, APPG, a geography or project count, an award, a
 *     smart-contract audit claim).
 * 10. Every release record in `releasedNames` names a string the study
 *     actually gated — its `client`, or an entry in `gatedNames` — and
 *     carries an approver, a date and a basis. A release that matches no gated
 *     name releases nothing and hides the typo that caused it; a release
 *     nobody can attribute and date is not a permission.
 *
 * Check 8 lifts when `case-study-metrics` is released, which is correct: at
 * that point figures are permitted, subject to each figure's own status. Its
 * honest limit is that it reads shapes, not meaning — a bare "25 owners" in
 * prose has no percent sign, no currency symbol and no comma, and would pass.
 * The per-figure checks above it are the primary control; this one is the net
 * under the prose.
 *
 * Also not checked, and worth knowing: `slug`, and therefore the case study's
 * URL. /case-studies/2connect still carries the client name. Those URLs are the
 * previous site's live URLs, kept deliberately so that nothing needs a
 * redirect (founder decision, 2026-09-01), so changing them is a founder call
 * rather than a code one. It is recorded here so the gap is visible rather
 * than assumed away.
 */
function assertPublicationInvariants(studies: CaseStudy[]): void {
  const faults: string[] = [];

  // 4. The register rows this file names must still be there. A renamed row
  //    would otherwise turn every check below it into a silent pass.
  for (const id of ALL_CLAIM_IDS) {
    if (!claimById(id)) {
      faults.push(
        `claims.ts has no row '${id}', but work.ts names it as a ClaimId. Either the row was ` +
          'renamed there or the union here is stale; the two must be reconciled by hand.',
      );
    }
  }

  const metricClassReleased = isPublishable(METRIC_CLAIM_ID);

  for (const cs of studies) {
    const gatedMetrics = cs.internalEvidence?.heldMetrics ?? [];

    for (const m of cs.metrics) {
      // 1.
      if (m.status === 'HELD') {
        faults.push(
          `${cs.slug}: metric "${m.label}" is HELD but sits in \`metrics\`. Held figures belong in \`internalEvidence.heldMetrics\`.`,
        );
      }
      // 2.
      if ((m.status === 'NOT_MEASURED') !== (m.pending === true)) {
        faults.push(
          `${cs.slug}: metric "${m.label}" has status ${m.status} but pending=${String(m.pending)}. The two must agree.`,
        );
      }
    }

    for (const m of [...cs.metrics, ...gatedMetrics]) {
      if (m.status === 'NOT_MEASURED') continue;
      const where = gatedMetrics.includes(m as GatedMetric)
        ? 'internalEvidence.heldMetrics'
        : 'metrics';

      // 5.
      if (m.claimIds.length === 0) {
        faults.push(
          `${cs.slug}: metric "${m.label}" (${where}) names no claims-register row. Every measured figure must name the rows that govern it.`,
        );
      }
      if (!m.claimIds.includes(METRIC_CLAIM_ID)) {
        faults.push(
          `${cs.slug}: metric "${m.label}" (${where}) does not name '${METRIC_CLAIM_ID}'. The register's case-study-metrics row carves out no exceptions, so every figure is inside it.`,
        );
      }

      for (const id of m.claimIds) {
        const row = claimById(id);
        if (!row) {
          faults.push(
            `${cs.slug}: metric "${m.label}" (${where}) names claims-register row '${id}', which does not exist.`,
          );
          continue;
        }
        // 6. The contradiction check.
        if (m.status === 'VERIFIED' && row.status !== 'VERIFIED') {
          faults.push(
            `${cs.slug}: metric "${m.label}" (${where}) is VERIFIED, but the claims register holds ` +
              `its claim class: '${id}' is ${row.status} — "${row.publicationInstruction ?? row.label}". ` +
              'Move that row in src/content/claims.ts to VERIFIED first, recording the evidence and the ' +
              'permission basis in its evidenceNote, or set this figure back to HELD.',
          );
        }
      }

      // 7.
      if (where === 'internalEvidence.heldMetrics' && !(m as GatedMetric).evidenceNote.trim()) {
        faults.push(
          `${cs.slug}: gated metric "${m.label}" has an empty evidenceNote. A held figure without a release condition is a figure nobody can ever publish.`,
        );
      }
    }

    const published = publishedStrings(cs);

    // 8.
    if (!metricClassReleased) {
      for (const { field, text } of published) {
        for (const pattern of FIGURE_PATTERNS) {
          const hit = pattern.re.exec(text);
          if (hit) {
            faults.push(
              `${cs.slug}: ${field} publishes ${pattern.name} ("${hit[0]}") while the claims register ` +
                `holds '${METRIC_CLAIM_ID}'. Rewrite the wording to the non-quantified version and hold ` +
                'the figure in internalEvidence.heldMetrics, or release the register row.',
            );
          }
        }
      }
    }

    // 9.
    for (const { field, text } of published) {
      for (const term of HELD_VOCABULARY) {
        if (isPublishable(term.claimId)) continue;
        const hit = term.re.exec(text);
        if (hit) {
          faults.push(
            `${cs.slug}: ${field} publishes ${term.name} ("${hit[0]}") while the claims register holds ` +
              `'${term.claimId}'. Reword it, or move that row to VERIFIED with the evidence recorded.`,
          );
        }
      }
    }

    // 3 and 10. THE NAME GATE, SCOPED TO NAMES RATHER THAN TO STUDIES.
    //
    //    `gatedNames` is the list of names this study may not publish. A name
    //    leaves that list through one route only: a `releasedNames` record
    //    naming that exact string. Never through the study's permission flag,
    //    which says a decision was taken without saying what it was about.
    const declaredGatedNames = cs.internalEvidence?.gatedNames ?? [];
    const releases: NameRelease[] =
      cs.namePermission === 'CONFIRMED' ? (cs.releasedNames ?? []) : [];

    // 10. A release must be about a name this study actually gated, and must
    //     carry its provenance.
    for (const r of releases) {
      const namesSomethingGated = [cs.client, ...declaredGatedNames].some(
        n => normaliseName(n) === normaliseName(r.name),
      );
      if (!namesSomethingGated) {
        faults.push(
          `${cs.slug}: releasedNames releases "${r.name}", which is neither this study's \`client\` ` +
            'nor an entry in `internalEvidence.gatedNames`. A release must name the gated string it ' +
            'releases, spelled the same way, or it releases nothing and the mismatch is invisible.',
        );
      }
      for (const [fieldName, value] of [
        ['approvedBy', r.approvedBy],
        ['approvedOn', r.approvedOn],
        ['basis', r.basis],
      ] as const) {
        if (!value.trim()) {
          faults.push(
            `${cs.slug}: the releasedNames entry for "${r.name}" has an empty ${fieldName}. A name ` +
              'permission nobody can attribute, date and quote is not a permission.',
          );
        }
      }
    }

    // 3. Every declared gated name no release covers, plus the client's own
    //    name while the permission is still pending.
    //
    //    Deduplicated on the normalised name, because most studies list their
    //    own client in `gatedNames` as well and a doubled entry produced two
    //    identical fault lines for one leak. Nothing is lost by it: the scan
    //    below is case-insensitive, so scanning 'Ayni' covers the 'AYNI' entry
    //    beside it in the same list.
    const stillGated = [
      ...new Map(
        (cs.namePermission === 'PENDING'
          ? [cs.client, ...declaredGatedNames]
          : declaredGatedNames
        )
          .filter(name => !releases.some(r => normaliseName(r.name) === normaliseName(name)))
          .map(name => [normaliseName(name), name] as const),
      ).values(),
    ];

    for (const name of stillGated) {
      const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      for (const { field, text } of published) {
        if (pattern.test(text)) {
          faults.push(
            cs.namePermission === 'CONFIRMED'
              ? `${cs.slug}: name "${name}" is gated but appears in published copy (${field}): ` +
                  `"${text.slice(0, 90)}…". This study is CONFIRMED, but its \`releasedNames\` records ` +
                  'no decision releasing THAT name. Confirming one name is not permission for every ' +
                  'other name in the same study: either record the release — who approved it, when, ' +
                  'and on what basis — or take the name out of the published copy.'
              : `${cs.slug}: name "${name}" is gated but appears in published copy (${field}): "${text.slice(0, 90)}…"`,
          );
        }
      }
    }
  }

  if (faults.length > 0) {
    throw new Error(
      `work.ts publication gate failed:\n  - ${faults.join('\n  - ')}\n` +
        'See design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt, "PUBLICATION RULE" and\n' +
        '"TECHNOLOGIES CLAIMS REGISTER", and the register itself at src/content/claims.ts.',
    );
  }
}

assertPublicationInvariants(caseStudies);
