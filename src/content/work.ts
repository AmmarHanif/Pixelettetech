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
   * (/ai-engineering, /blockchain, /engineering) still read `m.pending` to pick
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
  | 'Support & run'
  | 'Evaluation'
  | 'Production systems'
  | 'Data & integration'
  | 'Professional services'
  | 'Financial services'
  | 'Blockchain'
  | 'Healthcare'
  | 'Legal';

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
   * Every name that must not appear in public copy while `namePermission` is
   * 'PENDING' — the client, the product, the token, the end customer.
   * `assertPublicationInvariants` checks the published strings against this
   * list and fails the build on a leak.
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
 * The name gate, as a discriminated union rather than as two loose fields.
 *
 * A study cannot be marked 'PENDING' without supplying the copy that stands in
 * for its name, because the compiler will not let it. That is the difference
 * between a policy and a comment about a policy.
 */
type NameGate =
  | {
      namePermission: 'CONFIRMED';
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

export const caseStudies: CaseStudy[] = [
  /*
   * ------------------------------------------------------------------------
   * The four case studies supplied by the 8 September 2026 implementation
   * handoff, in the order it sets: 2Connect, Fusio Wallet and Ayni Gold as the
   * three selected-work cards, then AIA as the fourth proof point on this
   * page but not on the homepage (`homepageCaseStudies`, at the foot of this
   * file, is the list the homepage reads).
   *
   * For 2Connect, Fusio Wallet and Ayni Gold, every sentence in `problem`,
   * `built`, `delivery` and `measured` is the handoff's own wording, with two
   * deliberate omissions: its closing instructions to the developer ("Treat
   * completion status feature-by-feature as a separate evidence gate", "Do not
   * add financial-performance or production-volume claims without evidence")
   * are directions to us, not copy for a reader, so they live in
   * `internalEvidence` instead. Each is noted on the entry it affects.
   *
   * AIA is the exception, because the handoff gives it one paragraph rather
   * than a full narrative. Its challenge and summary are the previous record's,
   * which the handoff does not replace; its delivery and result are the
   * handoff's paragraph, and its result no longer carries the three figures the
   * evidence register holds.
   *
   * `summary` is written here for those three, because the handoff supplies
   * card titles and narratives but no card summary. Each one is a compression
   * of the handoff's own sentences and introduces no fact that is not in them.
   *
   * All four are `namePermission: 'PENDING'`. Nothing in this repository
   * evidences a confirmed public-use basis for any of the four names, and the
   * handoff makes permission the gate rather than the assumption. Flipping one
   * to 'CONFIRMED' restores the client name, the client's screenshot and the
   * named wording in `detail`, and changes nothing else about the page.
   *
   * `title`, `metaTitle` and `summary` are authored name-free for all four, so
   * the same string is safe in either state. When a permission lands, the name
   * can be worked back into those three as well.
   * ------------------------------------------------------------------------
   */
  {
    slug: '2connect',
    client: '2Connect',
    namePermission: 'PENDING',
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
        'Professional networks can create high volumes of connections without enough relevance. The product needed to understand what users want, what they can offer and whether two professionals are likely to create value for one another — while keeping matching scalable, privacy-aware and commercially usable.',
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
      evidenceBasis: GATED_EVIDENCE_BASIS,
      anonymised: {
        measured:
          'The engagement moved the platform from concept and discovery into a structured AI product architecture and MVP development programme, with defined matching flows, a working development environment and later-phase product planning recorded in the project trail.',
      },
    },
    internalEvidence: {
      publicationNote:
        'Internal project records include repeated discovery and development meetings, defined onboarding/persona flows, vector and compatibility matching, controlled AI-agent interaction, feedback loops, dashboard requirements, event-platform integration routes and a working development environment. Publish the client name/logo only where the public-use basis is confirmed; do not invent match-accuracy or adoption percentages.',
      sourceBasis:
        '2Connect / FindReciprocity client meeting notes and Pixelette AI portfolio material, supporting the agentic-AI matchmaking architecture, development route and later-phase planning.',
      register: [
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
    namePermission: 'PENDING',
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
    namePermission: 'PENDING',
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
    client: 'AIA',
    namePermission: 'PENDING',
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
        'AIA, a gamified cognitive mapping tool for DiverSCInnova that assesses up to ten cognitive skills — focus, attention, logical reasoning among them — and produces detailed reports for inclusive hiring, role alignment and vocational guidance.',
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
          'A gamified cognitive mapping tool that assesses up to ten cognitive skills — focus, attention, logical reasoning among them — and produces detailed reports for inclusive hiring, role alignment and vocational guidance.',
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
    slug: 'lytics',
    client: 'Lytics',
    namePermission: 'CONFIRMED',
    kicker: 'Lytics · Media intelligence · Production system',
    sector: 'Media intelligence',
    service: 'Production AI Systems',
    title: 'Sentiment classification analysts stopped overriding',
    metaTitle: 'Lytics: real-time news monitoring',
    summary:
      'Real-time news monitoring rebuilt so the sentiment classification could be trusted again, with the throughput headroom to keep adding sources.',
    /*
     * Empty. All four figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Production systems', 'Evaluation'],
    image: '/work/lytics.png',
    imageLabel: 'Product screenshot · the actual interface',
    pendingQuote: true,
    detail: {
      problem:
        'Monitoring coverage was limited by how much could be processed in real time, and the sentiment classification was wrong often enough that analysts stopped trusting it. Adding sources made both problems worse.',
      built:
        'A scraping and classification pipeline rebuilt for real-time throughput, with the sentiment models moved into the ingest path rather than bolted on afterwards, and capacity headroom designed for source growth rather than the source count on the day.',
      measured:
        'Sentiment analysis error rates fell and AI-based scraping efficiency improved, and the rebuilt pipeline took on a materially wider set of monitored sources while holding real-time responsiveness — headroom designed in, rather than a source count fixed on the day. The figures behind each of those movements are held for evidence.',
      next: null,
      stack: 'Python, TensorFlow, React, Node.js, AWS',
      duration: 'Six months',
      architectureLabel: 'Architecture diagram',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Sentiment-error, source-count, scraping-efficiency and capacity figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '-60%',
          label: 'sentiment analysis errors',
          shortLabel: 'sentiment errors',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the error rate before and after, the labelled sample both were measured on, and the period — then the client’s permission to publish it.',
        },
        {
          value: '+200%',
          label: 'monitored news sources',
          shortLabel: 'sources monitored',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the source count before and the source count after, each with the date it was taken. A count is the easiest of these to evidence and the one most often quoted without a date.',
        },
        {
          value: '+70%',
          label: 'AI scraping efficiency',
          shortLabel: 'scraping efficiency',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs a definition of “efficiency” — throughput, cost per source, or time per pass — before the figure means anything, and then the before-and-after readings on that measure.',
        },
        {
          value: '3×',
          label: 'real-time data handling capacity',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the capacity measure, the two readings it is a ratio of, and the hardware or plan they were taken on. A capacity multiple is meaningless without the platform it was measured on.',
        },
      ],
      gatedNames: [],
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
    slug: 'adwatch',
    client: 'AdWatch',
    namePermission: 'CONFIRMED',
    kicker: 'AdWatch · Media · Production AI system',
    sector: 'Media',
    service: 'Production AI Systems',
    title: 'Automated ad removal from live media streams',
    metaTitle: 'AdWatch: ad-free streaming',
    summary:
      'An ad detection and removal engine built into live input streams, cutting viewer interruptions and unwanted content without a human in the loop on every frame.',
    /*
     * Empty. Both figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Production systems', 'Evaluation'],
    image: '/work/adwatch.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Interruptive advertising damages the campaigns it is meant to serve: viewers disengage, and the effect on the numbers is invisible until it has already happened. Detecting and removing that content across live streams at speed was the part nobody had solved.',
      built:
        'An ad detection and removal engine embedded in live input streams, combining computer vision and audio fingerprinting so that intrusive advertising and unwanted content are identified and stripped in real time rather than flagged for review afterwards.',
      measured:
        'Viewer interruptions and unwanted content both came down across the input streams, with detection and removal happening in the live path rather than in a review queue afterwards. The reduction figures are held for evidence.',
      next: null,
      stack: 'Python, VGG-16, OpenAI, audfprint, FFmpeg, Linux',
      duration: 'Four months',
      architectureLabel: 'Detection pipeline architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Viewer-interruption and unwanted-content reduction figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '95%',
          label: 'reduction in viewer interruptions',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the interruption count before and after, taken on the same streams over the same duration, and a stated rule for what counts as one interruption.',
        },
        {
          value: '75%',
          label: 'reduction in unwanted content across input streams',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs a definition of “unwanted content” and the before-and-after measurement on the same stream set. GO-LIVE-CHECKLIST.md records that this engagement’s live page also carries a metric belonging to an unrelated project, so its published figures are not a source.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'neurostack',
    client: 'NeuroStack',
    namePermission: 'CONFIRMED',
    kicker: 'NeuroStack · AI & automation · Production AI system',
    sector: 'AI & automation',
    service: 'Production AI Systems',
    title: 'Text-to-speech that content teams will actually ship',
    metaTitle: 'NeuroStack: text-to-speech',
    summary:
      'Lifelike voice synthesis with real-time processing, built into a content pipeline rather than sold as a standalone tool.',
    /*
     * Empty. All four figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Production systems', 'Data & integration'],
    image: '/work/neurostack.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'The first version of the platform was limited on speech clarity, processing speed and day-to-day usability. Manual steps in the workflow meant the technology could not keep pace with the content teams meant to be using it.',
      built:
        'A scalable text-to-speech platform with real-time conversion and lifelike output, built into the content pipeline so that generation is part of the workflow rather than a separate manual step.',
      measured:
        'Speech clarity and processing speed both improved, more of the content workflow ran without a manual step, and data discrepancies fell. The figures behind each of those are held for evidence.',
      next: null,
      /* Corrected against the design board's tech stack row, which shows PHP,
         Laravel, CodeIgniter, Go and C++. The previous value named React and
         Hyperledger, neither of which appears on the board, and omitted four
         that do. Go was the only overlap. */
      stack: 'PHP, Laravel, CodeIgniter, Go, C++',
      duration: 'Six months',
      architectureLabel: 'Processing pipeline architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Speech-clarity, automation, decision-making and discrepancy figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '80%',
          label: 'speech clarity enhancement',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the clarity measure — MOS, word error rate or an equivalent — and the two readings taken on it.',
        },
        {
          value: '3×',
          label: 'content automation boost',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs a definition of the automation measure and the two readings it is a ratio of.',
        },
        {
          value: '65%',
          label: 'improved decision-making',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs a decision-quality measure and the study that produced it. “Improved decision-making” is not a measurable quantity as written, so this one may not be releasable at all in its current form.',
        },
        {
          value: '-40%',
          label: 'data discrepancies',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the discrepancy count before and after, and the reconciliation process that counted them.',
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
  /*
   * `fusio` used to sit here as "Smart-contract portfolio management, made
   * usable", with a 200% adoption figure and a 90% access figure carried from
   * the previous site's record. The 8 September 2026 handoff supplies its own
   * Fusio Wallet narrative for the same client, so the entry moved to the top
   * of this array with the handoff's copy and the handoff's evidence gate. The
   * URL is unchanged; the two withdrawn figures are held, with the reason, in
   * that entry's `internalEvidence`.
   */
  {
    slug: 'law-ledger',
    client: 'LawLedger',
    namePermission: 'CONFIRMED',
    kicker: 'LawLedger · LegalTech · Production system',
    sector: 'Legal services',
    service: 'Production AI Systems',
    title: 'Legal transaction management practitioners actually adopted',
    metaTitle: 'LawLedger: legal transactions',
    summary:
      'Reinventing how legal transactions are managed end to end, in a sector where adoption fails unless practitioners trust the system.',
    /*
     * Empty. Both figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Legal', 'Professional services', 'Production systems'],
    image: '/work/law-ledger.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Legal transaction management carries inefficiency, security exposure and compliance risk at the same time. Without an immutable verification step, firms absorb fraud risk and operational delay as a cost of doing business.',
      built:
        'A blockchain-backed transaction platform combining smart contracts, real-time verification and a decentralised ledger, so that each step in a transaction is verifiable rather than attested.',
      measured:
        'Legal transactions completed faster, and — the part that matters more — practitioners adopted the system rather than working around it, because a legal system nobody trusts does not get used. Both figures are held for evidence.',
      next: null,
      stack: 'Solidity, Hardhat, Web3.js, Node.js, IPFS, Moralis',
      duration: null,
      architectureLabel: 'Transaction and verification architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Transaction-speed and adoption figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '50%',
          label: 'faster legal transactions',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the transaction type being timed, the two timings, and the sample they were taken over.',
        },
        {
          value: '92%',
          label: 'user adoption and trust',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the two things separated before either can be published: adoption is a count against a denominator, trust is a survey result. Neither is evidenced, and GO-LIVE-CHECKLIST.md records this figure appearing verbatim on an unrelated wellness platform’s live page.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'chain-legal',
    client: 'ChainLegal',
    namePermission: 'CONFIRMED',
    kicker: 'ChainLegal · LegalTech · Blockchain',
    sector: 'Legal services',
    service: 'Blockchain engineering',
    title: 'Blockchain-backed legal documents',
    metaTitle: 'ChainLegal: legal docs on chain',
    summary:
      'Bringing verifiable document handling to legal work, so a document’s history is provable rather than asserted.',
    /*
     * Empty. All three figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Legal', 'Blockchain', 'Professional services'],
    image: '/work/chain-legal.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Legal document management still runs on manual process in many firms: changes are hard to track, access is hard to control, and compliance failure is a live risk rather than a theoretical one.',
      built:
        'A blockchain-integrated document management system using smart contracts and decentralised storage to structure document security, user access and change tracking.',
      measured:
        'Document handling got faster, operational costs came down, and users rated the system above the manual process it replaced. The handling, cost and satisfaction figures are all held for evidence.',
      next: null,
      stack: 'Solidity, Hyperledger Fabric, IPFS, Web3, MySQL, AWS',
      duration: null,
      architectureLabel: 'Document and access architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Document-handling, operational-cost and satisfaction figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '40%',
          label: 'faster document handling',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the handling step being timed, the two timings, and the sample.',
        },
        {
          value: '-30%',
          label: 'operational costs',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the cost base, what is counted inside it, and the period each reading covers.',
        },
        {
          value: '90%',
          label: 'user satisfaction',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the sample size, the survey instrument, and the client’s permission to publish a satisfaction score.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'mind-coach-ai',
    client: 'MindCoach AI',
    namePermission: 'CONFIRMED',
    kicker: 'MindCoach AI · HealthTech · Production AI system',
    sector: 'Healthcare',
    service: 'Production AI Systems',
    title: 'Making mental health support reachable',
    metaTitle: 'MindCoach AI: mental health',
    summary:
      'An AI-supported mental health service designed around engagement, because a wellbeing tool nobody opens twice changes nothing.',
    /*
     * Empty. Both figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Healthcare', 'Production systems'],
    image: '/work/mind-coach-ai.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Conventional mental health provision struggles on access, immediacy and tracking. People under stress rarely get timely support, and intervention arrives late when it arrives at all.',
      built:
        'A platform offering real-time emotional support and behavioural insight, using sentiment analysis to deliver coaching and continuous tracking rather than point-in-time assessment.',
      measured:
        'Engagement rose and users reported lower stress. Engagement is the leading indicator here: a wellbeing tool nobody opens twice changes nothing. Both figures are held for evidence.',
      next: null,
      stack: 'Node.js, Solidity, Hardhat, Web3.js, IPFS, Moralis',
      duration: null,
      architectureLabel: 'Platform architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Engagement and reported-stress figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '70%',
          label: 'higher engagement rates',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the engagement measure, the thing it is higher than, and the period.',
        },
        {
          value: '40%',
          label: 'stress reduction reported',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'A health-adjacent claim, and the strictest on this page: needs the instrument, the cohort, the period and the client’s permission. Self-reported stress reduction should never be published as a bare percentage.',
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
  /*
   * The five below were reinstated by founder decision on 2026-09-01 ("new site
   * have these case studies"), which closed the redirect question outright:
   * all 16 live URLs now exist here, zero redirects needed. Content was carried
   * from the live records with the known copy-paste defects stripped, not
   * repeated: Life Optimizer's "92% among legal professionals" box (LawLedger's),
   * Beyorch's impact description (Lytics'), Smart Contractor's banner
   * (law-ledger's — it has no artwork of its own, so it ships without an image),
   * and the identical ML stack pasted across three unrelated projects (kept only
   * at its natural home, Life Optimizer; Smart Contractor uses the stack its own
   * live page publishes; Ragnar keeps only what its narrative grounds). Beyorch's
   * metrics were commented out in the source — withdrawn deliberately — so none
   * are shown rather than revived.
   */
  /*
   * AIA used to sit here, publishing a $20k saving, a 98% integration rate and
   * a 4.7/5 satisfaction score. The handoff's evidence register puts all three
   * on HOLD until the methodology, the denominator and the client's permission
   * are verified, so the entry moved to the top of this array, the three
   * figures moved into its `internalEvidence.heldMetrics`, and the result
   * paragraph is now non-quantified. The URL is unchanged.
   */
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
        'A blockchain-powered investment platform integrating smart contracts, automated financial processes and secure tokenomics — real-time asset tracking, instant transactions, and security designed in rather than added on.',
      measured:
        'The engagement’s outcome figures were withdrawn from publication and are not repeated here.',
      next: null,
      stack: 'Polkadot, Hyperledger, Go, C++, React',
      duration: null,
      architectureLabel: 'Platform architecture',
    },
  },
  {
    slug: 'life-optimizer-ai',
    client: 'LifeOptimizer AI',
    namePermission: 'CONFIRMED',
    kicker: 'LifeOptimizer AI · HealthTech · Production AI system',
    sector: 'HealthTech',
    service: 'Production AI Systems',
    title: 'Wellness plans people still follow six months later',
    metaTitle: 'LifeOptimizer: AI wellness platform',
    summary:
      'Personalised fitness, nutrition and stress management driven by behavioural analysis — measured on whether people keep using it, not whether they sign up.',
    /*
     * Empty. All three figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Production systems', 'Healthcare'],
    image: '/work/life-optimizer-ai.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Generic wellness programmes fail because they do not adapt: without personalised guidance, motivation fades and progress tracking becomes a chore rather than a habit.',
      built:
        'An AI-powered wellness platform that adapts to each user’s health goals and daily routines — machine learning over health data with real-time feedback, delivering customised fitness, nutrition and mental wellbeing plans with AI-driven coaching.',
      measured:
        'Engagement rose, driven by interactive tracking and personalised recommendations; users held on to their wellness routines beyond the first months; and the stress-management features brought reported anxiety levels down. The engagement, retention and anxiety figures are all held for evidence.',
      next: null,
      stack: 'Python, TensorFlow, PyTorch, AWS, PostgreSQL, React',
      /* Stays null. The live record's only "six months" here is "60% of users
         maintained their wellness routines for over six months" — a retention
         window, not a build duration. Founder-supplied duration only. */
      duration: null,
      architectureLabel: 'Platform architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Engagement, six-month retention and reported-anxiety figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '+75%',
          label: 'user engagement',
          shortLabel: 'engagement',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the engagement measure, the baseline it rose from, and the period.',
        },
        {
          value: '60%',
          label: 'of users maintained routines beyond six months',
          shortLabel: 'six-month retention',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the cohort, a definition of “maintained”, and the date the cohort was measured at.',
        },
        {
          value: '-40%',
          label: 'reported anxiety levels',
          shortLabel: 'anxiety levels',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'A health claim: needs the instrument, the cohort and the period, and it should not be published as a bare percentage without all three.',
        },
      ],
      gatedNames: [],
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
        'Ragnar Token ($RAG), an ERC-20 token on Ethereum designed for transactions and capital raising, alongside a web platform with real-time price tracking and transaction history — the familiarity of traditional banking with the flexibility of crypto.',
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
  {
    slug: 'smart-contractor',
    client: 'SmartContractor',
    namePermission: 'CONFIRMED',
    kicker: 'SmartContractor · LegalTech · Blockchain',
    sector: 'LegalTech',
    service: 'Blockchain engineering',
    title: 'Contract execution automated, with the audit trail built in',
    metaTitle: 'SmartContractor: automated contracts',
    summary:
      'Blockchain-backed contract management that automates execution and validation — with the audit trail built in rather than reconstructed afterwards.',
    /*
     * Empty. All four figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Blockchain', 'Legal'],
    image: '/work/smart-contractor.png',
    imageLabel: 'Product screenshot',
    detail: {
      problem:
        'Manual contract processes meant delays, human error and compliance risk: contracts needed continuous oversight, costs rose with every intermediary, and enforcement depended on records that could be disputed.',
      built:
        'A blockchain-integrated smart contract management system that automates execution with real-time tracking and tamper-proof records — contracts created, executed and monitored with complete transparency, and automated validation replacing manual checking.',
      measured:
        'Contract execution time came down, automated validation took manual processing errors out of the loop, management costs fell and legal professionals adopted the system — with audit trails produced automatically in support of regulatory compliance rather than reconstructed for it. The execution-time, error, cost and adoption figures are all held for evidence.',
      next: null,
      stack: 'Solidity, Hyperledger Fabric, Web3.js, IPFS, PostgreSQL, AWS',
      duration: null,
      architectureLabel: 'Contract lifecycle architecture',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: PREVIOUS_SITE_RECORD_BASIS,
      register: [
        {
          claim: 'Execution-time, error-elimination, cost and adoption figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '-60%',
          label: 'contract execution time',
          shortLabel: 'execution time',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the contract type being timed, the two timings, and the sample.',
        },
        {
          value: '95%',
          label: 'of manual processing errors eliminated',
          shortLabel: 'errors eliminated',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the error count before and after, and the process that counted them.',
        },
        {
          value: '-40%',
          label: 'contract management costs',
          shortLabel: 'management costs',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the cost base and what is counted inside it.',
        },
        {
          value: '94%',
          label: 'adoption among legal professionals',
          shortLabel: 'adoption',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the denominator and the period. A near-identical adoption figure appears on this engagement’s sibling record and, per GO-LIVE-CHECKLIST.md, on an unrelated wellness platform’s live page — which is why it is held rather than trusted.',
        },
      ],
      gatedNames: [],
    },
  },
  /*
   * Sandoz and NEOM are carried across from the 2026 design file's case-study
   * board ("Case Studies (moved to dev)"), which held sixteen studies against
   * the eighteen already here. Every claim below is that board's own copy.
   *
   * Hero artwork for both was exported from those Figma frames. The exports
   * are 512x287 (1.78:1) against the media slot's 16/10, so each is padded to
   * 512x320 on the transparent ground the mockups already carry — `cover`
   * would otherwise clip the laptop's edges, the same class of framing fault
   * fixed in "Stop cropping every case-study mockup".
   *
   * Neither carries a quote. The design shows a client testimonial on both,
   * but it is the same Anthony Bevan / BlockGuard block pasted onto every
   * board, and the Figma layer is still named after a third client's quote
   * about Ehya. Attributing one client's praise to another is not a gap to
   * fill, it is a claim not to make.
   */
  {
    slug: 'sandoz',
    client: 'Sandoz',
    namePermission: 'CONFIRMED',
    kicker: 'Sandoz · Pharmaceuticals · Production system',
    sector: 'Pharmaceuticals',
    service: 'Production AI Systems',
    title: 'Decisions made off one dashboard instead of siloed systems',
    metaTitle: 'Sandoz: centralised analytics dashboard',
    summary:
      'Campaign data spread across systems that did not talk to each other, consolidated into one real-time dashboard, so reporting and decisions came off one source.',
    /*
     * Empty. Both figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Data & integration', 'Production systems', 'Healthcare'],
    image: '/work/sandoz.png',
    imageLabel: 'Analytics dashboard screenshot',
    detail: {
      problem:
        'Sandoz had no integrated way to compile and analyse real-time business data. The existing platforms ran in silos, which made campaign performance hard to track and insight hard to extract, and it held back operational efficiency and scalability in the South African market.',
      built:
        'A real-time analytics dashboard built to Sandoz’s operational needs, consolidating campaign data into a single interface with visualisation tools over the top, so the reporting and the decisions came off the same source rather than off whichever system was asked.',
      measured:
        'Decision-making got faster and revenue in the market improved, both attributed internally to the move to real-time analytics. Both figures are held for evidence.',
      next: null,
      stack: 'Datorama, Moqups',
      duration: 'Four months',
      architectureLabel: 'Analytics pipeline',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: DESIGN_BOARD_BASIS,
      register: [
        {
          claim: 'Decision-speed and revenue figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '+40%',
          label: 'decision-making speed',
          shortLabel: 'decision speed',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs a decision-cycle measure and the two readings taken on it. “Decision-making speed” is not measurable as written.',
        },
        {
          value: '+20%',
          label: 'revenue in the pharmaceutical market',
          shortLabel: 'revenue',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'A client revenue figure, which is the highest bar on this page: needs the client’s own finance record, the market and period it covers, a stated attribution basis linking it to this engagement, and the client’s written permission.',
        },
      ],
      gatedNames: [],
    },
  },
  {
    slug: 'neom',
    client: 'NEOM',
    namePermission: 'CONFIRMED',
    kicker: 'NEOM · Marketing technology · Data & integration',
    sector: 'Marketing technology',
    service: 'Production AI Systems',
    title: 'Ad analytics reporting shortened by removing the manual step',
    metaTitle: 'NEOM: automated ad analytics pipeline',
    summary:
      'Hand-aggregated ad data from TikTok, Snapchat and Facebook, replaced with an automated pipeline, so the time went into acting on the analytics, not compiling them.',
    /*
     * Empty. Both figures are held against the claims register, in
     * `internalEvidence.heldMetrics` below, each with the condition that would
     * release it. Changing one `status` there to
     * 'VERIFIED' — once the register row in claims.ts is released — puts that
     * figure straight back on the card and the page.
     */
    metrics: [],
    filters: ['Data & integration', 'Production systems'],
    image: '/work/neom.png',
    imageLabel: 'Data pipeline screenshot',
    detail: {
      problem:
        'Collecting, processing and visualising ad analytics across TikTok, Snapchat and Facebook was inefficient. Compiling the data by hand consumed the time that should have gone into acting on it, delayed insight and cost reporting accuracy, and left the workflow fragmented.',
      built:
        'An automated data processing system on Azure Databricks and Azure Blobs, with Datorama over the top for visualisation. Data retrieval and compilation run without a person in the loop, so analytics are centralised and the repetitive step is gone rather than reassigned.',
      measured:
        'The manual aggregation step went away and reporting time came down with it, with retrieval and compilation running without a person in the loop. Both figures are held for evidence.',
      next: null,
      stack: 'Azure Databricks, Azure Blob Storage, Datorama',
      duration: 'Three months',
      architectureLabel: 'Data processing pipeline',
      evidenceBasis: HELD_FIGURES_EVIDENCE_BASIS,
    },
    internalEvidence: {
      sourceBasis: DESIGN_BOARD_BASIS,
      register: [
        {
          claim: 'Manual-aggregation and reporting-time figures',
          status: 'HOLD',
          note: 'Carried into this file as VERIFIED when the metric gate was introduced on 8 September 2026. That was a mechanical migration, not an assessment: nothing was checked against src/content/claims.ts. Reassessed the same day against the register’s “Case-study metrics — EVIDENCE GATE” row and the “all case studies — numerical result — APPROVAL GATE” row. No evidence for any of them exists in this repository, so every one is held.',
        },
      ],
      heldMetrics: [
        {
          value: '-70%',
          label: 'time spent manually aggregating ad analytics data',
          shortLabel: 'manual aggregation',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the hours before and the hours after, over a stated reporting cycle.',
        },
        {
          value: '-75%',
          label: 'time required for ad analytics reporting',
          shortLabel: 'reporting time',
          status: 'HELD',
          claimIds: ['case-study-metrics'],
          evidenceNote:
            'Needs the reporting cycle being timed and the two timings.',
        },
      ],
      gatedNames: [],
    },
  },
  /*
   * Ayni Gold and 2Connect used to sit here, written from published sources
   * only — ayni.gold, 2connect.ai and Pixelette Holdings' own portfolio page —
   * with the engagement paperwork deliberately left unread, because commercial
   * terms are not case-study copy. That reading discipline still holds and is
   * recorded in each entry's `internalEvidence`.
   *
   * Both moved to the top of this array on 8 September 2026 to take the
   * handoff's own narratives, which are drawn from Pixelette's internal project
   * records rather than from the public sites. Their URLs are unchanged. Ayni
   * Gold's headline numbers — grams extracted, dollars distributed — are still
   * not published: they are the client's production results, not the result of
   * the engineering, and putting them in a metric tile would claim credit for a
   * gold mine.
   */
  /*
   * The nine below come from the Portfolio UI Designs Figma file, which
   * holds fifteen product landing pages. Five of those products already had
   * case studies here. SuccessPath was added alongside these and then
   * withdrawn; its mockup is kept in design/mockups/ rather than deleted.
   *
   * Read what is and is not claimed. Client, sector and what the product does
   * are taken from each product's own landing page. Nothing else is: those
   * frames are product marketing, not case-study boards, so unlike Sandoz and
   * NEOM they carry no problem, no process, no duration and no measured figure.
   *
   * So none of them sets `detail`, which makes the page render its "FULL
   * WRITE-UP PENDING CLIENT SIGN-OFF" placeholder, and every metric is
   * `pending`. The gaps are deliberate and visible, and the audit lists them.
   * Filling them needs the engagement detail, not more design files.
   */
  {
    slug: 'health-chain',
    client: 'Health Chain',
    namePermission: 'CONFIRMED',
    kicker: 'Health Chain · Healthcare · Blockchain',
    sector: 'Healthcare',
    service: 'Blockchain engineering',
    title: 'Healthcare records secured on a chain',
    metaTitle: 'Health Chain: health data on-chain',
    summary:
      'Patient and clinical data exchanged over blockchain infrastructure, so records move between parties without the custody of each transfer being taken on trust.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Blockchain', 'Healthcare'],
    image: '/work/health-chain.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'finchain',
    client: 'FinChain',
    namePermission: 'CONFIRMED',
    kicker: 'FinChain · Financial services · Blockchain',
    sector: 'Cross-border payments',
    service: 'Blockchain engineering',
    title: 'Cross-border transactions settled on-chain',
    metaTitle: 'FinChain: cross-border settlement',
    summary:
      'Cross-border payment infrastructure built on blockchain rails, with the transfer, the settlement and the reporting of each transaction handled in one system.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/finchain.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'crypto-audit',
    client: 'CryptoAudit',
    namePermission: 'CONFIRMED',
    kicker: 'CryptoAudit · Financial services · Blockchain',
    sector: 'Digital asset audit',
    service: 'Blockchain engineering',
    title: 'Engineering a digital-asset audit platform for a compliance standard',
    metaTitle: 'CryptoAudit: digital asset auditing',
    summary:
      'A financial auditing platform for digital assets, built so that what a holding is worth and where it came from can both be evidenced rather than asserted.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Blockchain', 'Financial services'],
    image: '/work/crypto-audit.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'legal-mind-ai',
    client: 'Legal Mind AI',
    namePermission: 'CONFIRMED',
    kicker: 'Legal Mind AI · LegalTech · Production AI system',
    sector: 'LegalTech',
    service: 'Production AI Systems',
    title: 'AI brought into legal decision-making',
    metaTitle: 'Legal Mind AI: legal decision support',
    summary:
      'Decision support for legal teams, with the model set inside the work of reaching a position rather than bolted on as a search box beside it.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Production systems', 'Legal'],
    image: '/work/legal-mind-ai.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'juris-predict',
    client: 'JurisPredict',
    namePermission: 'CONFIRMED',
    kicker: 'JurisPredict · LegalTech · Production AI system',
    sector: 'LegalTech',
    service: 'Production AI Systems',
    title: 'Predicting the outcome of a legal matter',
    metaTitle: 'JurisPredict: legal outcomes',
    summary:
      'Outcome prediction for legal matters, so a case can be weighed against what comparable ones actually did rather than against instinct alone.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Production systems', 'Legal'],
    image: '/work/juris-predict.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'medi-analyze-ai',
    client: 'Medi Analyze AI',
    namePermission: 'CONFIRMED',
    kicker: 'Medi Analyze AI · Healthcare · Production AI system',
    sector: 'Medical diagnostics',
    service: 'Production AI Systems',
    title: 'Diagnostic imaging read with a model in the loop',
    metaTitle: 'Medi Analyze AI: diagnostic imaging',
    summary:
      'Medical diagnostics with AI in the reading path, built for the setting where a clinician stays accountable for what the model proposes.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Production systems', 'Healthcare'],
    image: '/work/medi-analyze-ai.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'health-predictor',
    client: 'Health Predictor',
    namePermission: 'CONFIRMED',
    kicker: 'Health Predictor · Healthcare · Production AI system',
    sector: 'Healthcare',
    service: 'Production AI Systems',
    title: 'Patient care planned on predicted risk',
    metaTitle: 'Health Predictor: predictive care',
    summary:
      'Predictive analytics over patient data, so care can be planned against where a patient is heading rather than only where they are today.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Production systems', 'Healthcare'],
    image: '/work/health-predictor.png',
    imageLabel: 'Product screenshot',
  },
  {
    slug: 'credit-smart-ai',
    client: 'Credit Smart AI',
    namePermission: 'CONFIRMED',
    kicker: 'Credit Smart AI · Financial services · Production AI system',
    sector: 'Credit risk',
    service: 'Production AI Systems',
    title: 'Credit scored by model rather than by rulebook',
    metaTitle: 'Credit Smart AI: AI credit scoring',
    summary:
      'Credit scoring driven by a model, in a domain where the reason for a decision has to be defensible to the applicant and to a regulator.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Production systems', 'Financial services'],
    image: '/work/credit-smart-ai.png',
    imageLabel: 'Product screenshot',
  },

  {
    slug: 'transact-secure',
    client: 'Transact Secure',
    namePermission: 'CONFIRMED',
    kicker: 'Transact Secure · Financial services · Production AI system',
    sector: 'Payments security',
    service: 'Production AI Systems',
    title: 'Transaction fraud caught while the payment is live',
    metaTitle: 'Transact Secure: AI payment security',
    summary:
      'Transaction security with AI in the authorisation path, where a decision has to be reached inside the window a payment stays open.',
    metrics: [{ value: '[MEASURED RESULT]', label: 'pending write-up', status: 'NOT_MEASURED', pending: true }],
    filters: ['Production systems', 'Financial services'],
    image: '/work/transact-secure.png',
    imageLabel: 'Product screenshot',
  },
];

export const workFilters: WorkFilter[] = [
  'Production systems',
  'Blockchain',
  'Evaluation',
  'Data & integration',
  'Financial services',
  'Professional services',
  'Legal',
  'Healthcare',
  'Support & run',
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
  const released = (cs.internalEvidence?.heldMetrics ?? []).filter(m => m.status === 'VERIFIED');
  return [...cs.metrics.filter(m => m.status !== 'HELD'), ...released];
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
 * The three selected-work case studies for the homepage, in the handoff's
 * order: 2Connect, then Fusio Wallet, then Ayni Gold.
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
const HOMEPAGE_SLUGS = ['2connect', 'fusio', 'ayni-gold'] as const;

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
 *  3. No gated name appears in any string a gated case study publishes. This
 *     is the check that would have caught the two places the handoff's own
 *     approved wording carries a client name.
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

    // 3.
    if (cs.namePermission !== 'PENDING') continue;

    const gatedNames = [cs.client, ...(cs.internalEvidence?.gatedNames ?? [])];
    for (const name of gatedNames) {
      const pattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      for (const { field, text } of published) {
        if (pattern.test(text)) {
          faults.push(
            `${cs.slug}: name "${name}" is gated but appears in published copy (${field}): "${text.slice(0, 90)}…"`,
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
