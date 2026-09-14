import Link from 'next/link';

import { ArrowRight } from '@/components/Icons';
import { LiveDiagram } from '@/components/LiveDiagram';
import {
  CertifiedHandoff,
  ClientLogos,
  TrustStrip,
  ValueModelCards,
} from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  MediaSlot,
  Section,
  SectionHead,
  SourceNote,
  StatTile,
} from '@/components/ui';
import { certified } from '@/content/company';
import { gapStats } from '@/content/sources';
import {
  displayCardCta,
  displayKicker,
  displayName,
  homepageCaseStudies,
  publishedImage,
  publishedMetrics,
} from '@/content/work';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_SURFACES,
  BUYER_ROUTES,
  analyticsAttrs,
  type BuyerRoute,
} from '@/lib/analytics';
import { faqSchema, homepageServiceSchema } from '@/lib/schema';
import { homepageMetadata } from '@/lib/seo';

/*
 * The homepage, rebuilt 2026-09-08 to the fourteen-section architecture in
 * `design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt`.
 *
 * Read that document before editing this file. It is the founder's approved
 * copy deck and it is the authority for every string here: the sections are in
 * its order, and the wording is its wording. Where a sentence has been adapted
 * it is because the handoff wrote it as an instruction to the developer rather
 * than as copy for a reader, and each of those is commented at the point it
 * happens rather than left for someone to spot.
 *
 * Two rules govern what may appear here and neither is a style preference:
 *
 *  - No badge, count, percentage, rating, client name or case-study figure
 *    enters this page except through the gate that owns it —
 *    `src/content/claims.ts` for corporate claims and the accessors in
 *    `src/content/work.ts` for case studies. Nothing is typed as a literal.
 *  - Every claim component must render correctly when its claim is withheld.
 *    The handoff's DEVELOPER RULE is that "the absence of a badge must not
 *    leave a broken layout". From 8 to 14 September 2026 the register published
 *    nothing at all, so the withheld state was the state this page shipped in
 *    and the rule was being exercised on every render. Since 14 September the
 *    register publishes two certification rows and this page shows them, so the
 *    withheld state is no longer the default — which makes the rule MORE
 *    important here, not less. It is now a path that only runs when a row comes
 *    back down, and an untaken path is the one that rots. Both certificates
 *    carry dated expiries (1 January 2027 and 11 March 2027), so the withheld
 *    state has a date in the diary rather than being hypothetical.
 */

export const metadata = homepageMetadata();

/**
 * The buyer-routing table — handoff section 03, "What are you trying to
 * change?". Six rows, verbatim.
 *
 * `routeHref` sends the reader to the capability; `cta` sends them to a
 * conversation. Both are given because the handoff's own columns are "Route"
 * and "CTA" and they do different jobs: one explains, one converts.
 *
 * `analyticsRoute` is the same row's stable identifier in
 * `src/lib/analytics.ts`, and it is what makes checklist item 22 —
 * "measure conversion by route" — answerable from the data rather than by
 * guessing from a URL. The display label above it may be re-worded at any
 * time; the slug may not, because renaming a dimension value orphans its own
 * history. Typed as `BuyerRoute`, so the six rows here cannot drift away from
 * the six routes declared there.
 */
const buyerRoutes: {
  trigger: string;
  route: string;
  routeHref: string;
  meaning: string;
  cta: string;
  analyticsRoute: BuyerRoute;
}[] = [
  {
    trigger: 'We need a new platform, product or app',
    route: 'Build Software',
    routeHref: '/engineering',
    meaning: 'SaaS, web, mobile, internal platforms and customer-facing products.',
    cta: 'Scope a build',
    analyticsRoute: BUYER_ROUTES.BUILD_SOFTWARE,
  },
  {
    trigger: 'A manual process needs automating',
    route: 'AI & Automation',
    routeHref: '/ai-engineering',
    meaning: 'Agents, workflow automation, decision support and system integration.',
    cta: 'Map the workflow',
    analyticsRoute: BUYER_ROUTES.AI_AUTOMATION,
  },
  {
    trigger: 'We want AI inside an existing product',
    route: 'AI Engineering',
    routeHref: '/ai-engineering/llm-integration-rag',
    meaning: 'LLM/model integration, RAG, prediction, personalisation and agentic features.',
    cta: 'Add AI to a product',
    analyticsRoute: BUYER_ROUTES.AI_ENGINEERING,
  },
  {
    trigger: 'Our existing system needs modernising',
    route: 'Modernise & Integrate',
    routeHref: '/engineering/modernisation-integration',
    meaning: 'Architecture, APIs, cloud, data migration and legacy replacement.',
    cta: 'Modernise a system',
    analyticsRoute: BUYER_ROUTES.MODERNISE_INTEGRATE,
  },
  {
    trigger: 'We need tokenisation, smart contracts or a dApp',
    route: 'Blockchain',
    routeHref: '/blockchain',
    meaning: 'Specialist decentralised architecture where blockchain genuinely creates value.',
    cta: 'Scope blockchain',
    analyticsRoute: BUYER_ROUTES.BLOCKCHAIN,
  },
  {
    trigger: 'We need someone to keep improving what exists',
    route: 'Run & Improve',
    routeHref: '/engineering/managed-engineering',
    meaning: 'Managed engineering, monitoring, support, optimisation and roadmap delivery.',
    cta: 'Discuss ongoing engineering',
    analyticsRoute: BUYER_ROUTES.RUN_IMPROVE,
  },
];

/** Handoff section 05, "Why Pixelette Technologies". Six differentiators. */
const differentiators = [
  {
    t: 'Engineering before theatre',
    d: 'Architecture, integration, testing and production readiness come before the demo.',
  },
  {
    t: 'Product thinking, not ticket delivery',
    d: 'We challenge the brief where a different product, workflow or architecture will create a better outcome.',
  },
  {
    t: 'Built to keep operating',
    d: 'Deployment, monitoring, observability, support and iterative improvement can remain inside the same engineering relationship.',
  },
  {
    t: 'AI-native where useful',
    d: 'AI can be part of the product, the workflow and the delivery process — but only where it earns its place.',
  },
  {
    t: 'Blockchain depth',
    d: 'The practice grew from blockchain engineering rather than adding Web3 language after the market moved.',
  },
  {
    t: 'Governance route available',
    d: 'Where formal governance, certification readiness or assurance is needed, Pixelette Certified provides a separate specialist route.',
  },
];



/** Handoff section 09, "Ways to work with us". Three commercial routes. */
const engagementRoutes = [
  {
    t: 'ENGINEERING / AI DIAGNOSTIC',
    d: 'For clients who know the problem but not the solution. Discovery, architecture, data/workflow review, feasibility and a prioritised build plan.',
    cta: 'Scope the problem',
  },
  {
    t: 'BUILD & LAUNCH PROGRAMME',
    d: 'A scoped product, automation or modernisation programme with milestones, working releases, acceptance criteria and launch.',
    cta: 'Scope a build',
  },
  {
    t: 'MANAGED ENGINEERING PARTNER',
    d: 'Ongoing product engineering, support and improvement for clients that need a continuing technical capability rather than a one-off project.',
    cta: 'Discuss ongoing engineering',
  },
];

/** Handoff section 10, "Who we work with". Four growth stages. */
const audiences = [
  {
    t: 'STARTUPS',
    d: 'Turn a validated idea into a production product without building every technical capability internally.',
  },
  {
    t: 'SCALE-UPS',
    d: 'Add product capacity, AI capability, integration or architecture as complexity and customer requirements increase.',
  },
  {
    t: 'ESTABLISHED BUSINESSES',
    d: 'Modernise systems, automate processes, integrate data and create new digital products around existing operations.',
  },
  {
    t: 'ENTERPRISE / PUBLIC SECTOR',
    d: 'Deliver scoped engineering, analytics, automation and assurance-aware programmes inside more complex operating environments.',
  },
];

const sectors = [
  'Financial services',
  'Retail',
  'Healthcare',
  'Public sector',
  'Media',
  'Professional services',
  'Technology',
  'Web3 / digital assets',
  'Pharmaceuticals',
  'Travel / tourism',
];


/**
 * The homepage FAQs.
 *
 * These are the handoff's HOMEPAGE FAQS section, verbatim and complete, and
 * they replace the five that were here before. That replacement is a fix, not
 * a rewrite: the previous set asserted that "Pixelette Technologies holds ISO
 * 9001:2015 … ISO 27001:2022 … and Cyber Essentials Plus", named a fixed price
 * band, and claimed delivery "across 13 countries". All of those are HELD in
 * `src/content/claims.ts`, and because this array also feeds `faqSchema`, they
 * were being asserted twice — once in prose and once as machine-readable
 * JSON-LD, which is the harder of the two to retract. The handoff's own
 * instruction is explicit: "Use the FAQ copy in this document; do not repeat
 * old 'top-rated company' or unverified certification language inside FAQs."
 *
 * Nothing here states a certification, a rating, a price or a count.
 */
/*
 * TRIMMED FROM EIGHT TO FIVE, 2026-09-14, on the external audit.
 *
 * Removed: mobile applications, developers by the day, and compliance or
 * certification. Each is answered better on the page that owns it, and one of
 * them was answered WEAKER here in a way that mattered. "Do you provide
 * developers by the day?" was a soft FAQ on this page while /engineering makes
 * it a hard positioning statement - "we do not sell developers by the day; if
 * what you want is bodies on a timesheet, we are the wrong supplier and we will
 * say so on the first call". A homepage that hedges what an inner page states
 * plainly is the weaker of the two answers winning the more-read surface.
 *
 * This array feeds BOTH the rendered <Faqs> and faqSchema(faqs), so page and
 * markup cannot disagree about how many questions exist - which is the failure
 * the audit warned about when it said to cut the JSON-LD to match. One array,
 * two consumers, nothing to keep in step by hand.
 */
const faqs = [
  {
    q: 'What does Pixelette Technologies do?',
    a: 'We design, build, integrate and operate custom software, AI-powered products, automation and specialist blockchain systems. Engagements can start with discovery or with an existing product, process or codebase.',
  },
  {
    q: 'Do you build AI agents and agentic workflows?',
    a: 'We scope and build AI-agent and workflow-automation solutions where the process, data, controls and expected value justify them. More autonomous operation is introduced according to risk and measurable performance, rather than as a default.',
  },
  {
    q: 'Can you add AI to an existing product or system?',
    a: 'Yes. A common engagement is to integrate model or agent capabilities into an existing application, knowledge base or workflow while preserving the systems and controls already in place.',
  },
  {
    q: 'Can you take over an existing or stalled build?',
    a: 'Yes. We can start with an independent technical assessment, architecture/code review and recovery plan before committing to continued development.',
  },
  {
    q: 'What happens after launch?',
    a: 'Support can continue through monitoring, incident response, optimisation, releases, roadmap delivery and managed product engineering.',
  },
];

export default function HomePage() {
  return (
    <>
      {/*
        The handoff's mandated schema for this page is "Organisation + WebSite +
        Service". Organisation and WebSite are emitted once in the root layout
        (`src/app/layout.tsx`), so only Service belongs here; emitting the other
        two again would duplicate the graph. FAQPage is additional and is the
        single highest-leverage block for answer engines.
      */}
      <JsonLd data={homepageServiceSchema()} />
      <JsonLd data={faqSchema(faqs)} />

      {/* ═══════════════════════════════════ 01 · Hero ═══════════════════ */}
      {/*
        The three-line hero is the brand manifesto and is reproduced exactly.
        The handoff is emphatic twice over — "Retain the full existing hero
        line" and "Do not flatten that line into a service menu" — so the
        rebalancing happens strictly underneath it.

        The DESIGN NOTE it carries is the reason the two 50/50 door cards that
        used to sit under this hero are gone: "Do not put Blockchain and
        Software in two equal hero boxes." What replaces them is the hierarchy
        the note asks for — Build and AI as the two buttons, Blockchain as a
        specialist text route, and three chips underneath with the same
        weighting.
      */}
      <div className="hero-glow" style={{ padding: '88px 0 64px' }}>
        <div className="wrap center">
          <Eyebrow>Software engineering • AI &amp; automation • Blockchain</Eyebrow>
          <h1 className="h1" style={{ marginTop: 26, fontSize: 'clamp(36px, 4.6vw, 54px)' }}>
            <span style={{ display: 'block' }}>Engineering that ships.</span>
            <span style={{ display: 'block' }}>Chains that hold.</span>
            <span style={{ display: 'block' }}>AI built into both.</span>
          </h1>
          {/*
            HERO TRIMMED 2026-09-14, on the external homepage audit.

            Six interactive elements became two. Removed: the 62-word paragraph,
            the "Explore Blockchain Engineering" text link, the "Not sure which
            route fits?" line and the three route chips. The headline stays
            untouched — the audit calls it the best line on the page and it is.

            The standfirst is 27 words in place of 62, recomposed only from
            wording already on this page and /blockchain. No new claim enters.

            THE PRIMARY BUTTON CHANGED, and that is the substantive edit rather
            than the deletions. It read "Build a Product", which matches no call
            to action anywhere else on this site — not in the nav, not on a
            service page, not in llms.txt. A primary CTA that exists only on the
            homepage is one the rest of the site cannot reinforce. "Book a value
            baseline" is the conversion action /ai-engineering, /contact and
            llms.txt all already name, and it is the one with a published price
            behind it.

            The blockchain route is not lost. It remains in the mega-menu, in
            the DECENTRALISE card below, and in the h1 — which is where a
            specialist practice belongs rather than competing with two
            commercial engines for the first screen.
          */}
          <p className="lead" style={{ margin: '24px auto 0', maxWidth: '54ch' }}>
            We design, build and run software products, AI systems and intelligent workflows.
            Engineering is the foundation. Blockchain is a specialist practice, used where it earns
            its place.
          </p>

          <div className="btn-row" style={{ marginTop: 36, justifyContent: 'center' }}>
            <Cta
              href="/contact"
              analytics={analyticsAttrs(ANALYTICS_EVENTS.HERO_PRIMARY_CTA, {
                route: BUYER_ROUTES.AI_AUTOMATION,
                surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
              })}
            >
              Book a value baseline
            </Cta>
            <Cta
              href="/engineering"
              variant="secondary"
              analytics={analyticsAttrs(ANALYTICS_EVENTS.HERO_SECONDARY_CTA, {
                route: BUYER_ROUTES.BUILD_SOFTWARE,
                surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
              })}
            >
              Scope a build
            </Cta>
          </div>
        </div>
      </div>

      {/* ═════════════════════════════ 02 · Verified proof ═══════════════ */}
      {/*
        Short by instruction: "The first proof section should be short … Avoid a
        badge wall that asks the visitor to work out what each certification or
        award actually means."

        `TrustStrip` reads the claims register. From 8 to 14 September 2026 it
        rendered NOTHING, because every row in `src/content/claims.ts` was HELD
        or NOT_PUBLISHED — the designed state rather than a gap, and the reason
        the heading and the lead were written to carry this section on their
        own: the handoff says in terms that "the first public release can be
        strong with client work + case studies alone".

        That comment closed with a prediction: "When a row moves to VERIFIED the
        badges appear here with no edit to this file." On 14 September 2026 two
        certification rows moved to VERIFIED and the badges appeared here, with
        no edit to this file. The prediction is left in place above and marked
        as kept, because a register that claims this property and has never been
        observed doing it is a design note; one that has is a mechanism.

        What renders now is ISO/IEC 27001:2022 and ISO 9001, each printing the
        row's `detail` — certificate number, issuing body and dates — under the
        badge, so this section is not the badge wall the handoff warned against.
        Nothing else in the register is VERIFIED, and nothing else shows.
      */}
      <Section labelledBy="proof-heading">
        <SectionHead
          eyebrow="Verified proof"
          id="proof-heading"
          title="Built for real operating environments"
          lead="Every number, badge and accreditation on this site is either verified, held for evidence, or not published. Where a claim is held, nothing is shown in its place."
        />
        <div style={{ marginTop: 30 }}>
          <TrustStrip />
        </div>
      </Section>

      {/* Client wordmarks, behind the approval gate in
          `src/content/clients.ts` — a gate that has now been answered. All
          seven rows there read APPROVED on the founder's decision of
          2026-09-11 ("Keep them — I'm confident we have the basis"), so
          `approvedClients()` returns exactly the seven names this line
          renders. `ClientLogos` reads `approvedClients()`, and the render
          is unchanged either way because every row is APPROVED — the
          accessor and the raw array hold the same seven names, in the same
          order.

          CORRECTED 2026-09-11, comment only. What follows is a correction,
          not a deletion. This comment used to read: "Held behind an approval
          gate in `src/content/clients.ts`, which records every name as
          UNCONFIRMED and raises the permission question to the founder rather
          than answering it silently. That decision belongs to that file, and
          is left as it stands." Both halves are now false. No row is
          UNCONFIRMED: all seven moved to APPROVED on 2026-09-11. And the
          question is no longer raised but answered — the founder was asked
          whether the seven names rendering with no recorded permission should
          be hidden or kept, and kept them.

          What has NOT changed is where the record lives. The decision still
          belongs to `src/content/clients.ts` and is written down there and
          nowhere else, so this page continues to assert no permission of its
          own. Read that file's gate note before quoting this one: what exists
          is a founder decision of 2026-09-11, NOT a per-client release
          document, and no such document exists in this repository. Nor does
          the decision reach the eighth name — 'Akashic Knowing' in
          `additionalClients` stays UNCONFIRMED, because he was not asked about
          it, and nothing imports that array.

          Nothing rendered by this line changed on 2026-09-11: the same seven
          names rendered before the decision and after it. Nothing is owed from
          this paragraph.

          CORRECTED AGAIN 2026-09-11, later the same day, comment only. The
          opening paragraph used to end: "`ClientLogos` still reads `clients`
          directly, which is why the render is unchanged either way." The
          conclusion was right and is kept — this line renders the same seven
          names it always did — but the reason given for it was overtaken the
          same day. `ClientLogos` was switched onto `approvedClients()`, so
          "still reads `clients` directly" is no longer true of it and can no
          longer be the reason for anything.

          The render is unchanged for a different and better reason: all seven
          rows are APPROVED, so the accessor returns the same seven names the
          raw array did. That reason is contingent where the old one was
          structural, and the difference is the point of the switch — this
          line is now fail-closed. Withdraw a permission and the name leaves
          this page in that one edit; withdraw all seven and `ClientLogos`
          renders nothing rather than an empty frame. Measured by building it
          on 2026-09-11, not assumed.

          Nothing else in this comment moves. The record still lives in
          `src/content/clients.ts`, this page still asserts no permission of
          its own, and nothing is owed from this paragraph either. */}
      <ClientLogos tight />

      {/* ══════════════════ 03 · What are you trying to change? ══════════ */}
      {/*
        Placed immediately after verified proof, per the implementation
        checklist. The handoff's whole thesis: "Most clients do not arrive with
        a perfect technical specification. Let them identify the business change
        they need, then route them to the relevant capability."
      */}
      {/*
        TWO MORE BLOCKS REMOVED 2026-09-14, on the audit re-check.

        BUYER ROUTE TABLE - "What are you trying to change?", six rows. It
        answered the same question as the four cards below it, and it held
        TWELVE of this page's links on its own, which made it the largest
        single contributor to call-to-action sprawl on a page the audit
        measured at 29 distinct CTAs against a comparator range of 2 to 21.
        Nothing is lost: all six triggers now sit on the card that answers
        them, verbatim, via `triggers` on ValueModelEntry. Six rows collapse to
        four because Modernise and AI Engineering already live inside Build and
        Automate.

        BROAD MARKET POSITIONING - four audience cards and ten sector names.
        Two faults in one block. It sold to startups, scale-ups, established
        businesses, enterprise and public sector, which CONTRADICTS the client
        profile published on /ai-engineering and in llms.txt: UK-headquartered,
        GBP100m to GBP500m, sponsored by a COO, approved by a CFO, reviewed by
        a CISO, with an explicit "who this is not for". A buyer who reads two
        pages found two companies. And the ten sector names rendered as plain
        spans with no destination while only two industry pages exist - ten
        dead terms on the highest-authority page on the site.

        DELETING IT DOES NOT DECIDE THE AUDIENCE. It removes the homepage's
        contradiction of a position already published in two other places. If
        the broad profile is the one the firm wants, the fix runs the other way
        and /ai-engineering and llms.txt change instead - a larger decision, and
        the founder's. Publishing both remains the only option that cannot work.
      */}

      {/* ═══════════ 04 · Build • Automate • Decentralise • Run ══════════ */}
      {/*
        Rendered from the shared component in `src/components/sections.tsx`
        rather than written out here, because the implementation checklist asks
        for "four reusable cards used across homepage and service pages" — one
        definition, one place to change it.
      */}
      <Section labelledBy="model-heading">
        <SectionHead
          eyebrow="Core offer"
          id="model-heading"
          title="One engineering company. Four ways we create value."
        />
        <div style={{ marginTop: 36 }}>
          <ValueModelCards />
        </div>
      </Section>

      {/*
        THE PROBLEM, added 2026-09-14 on the external audit. The only block this
        pass ADDS; everything else removed or relocated.

        The homepage carried NO third-party evidence of any kind - no citation,
        no client quote, no named result - while the rest of the site cites
        McKinsey, DORA, METR, HFS, G2, Thomson Reuters and the Bank of England.
        The machine-readable llms.txt sided with the inner pages. The front page
        was the least-evidenced surface on an otherwise well-sourced site.

        Copy and figures are lifted verbatim from /ai-engineering, including the
        attribution, and the figures come from `gapStats` rather than being
        retyped - so a corrected citation reaches both pages, and a figure
        withdrawn from the register disappears from both. `published` is already
        true on both rows; nothing new is asserted here.
      */}
      <Section labelledBy="gap-heading">
        <SectionHead
          eyebrow="The gap"
          id="gap-heading"
          title="Your people feel faster. Your P&amp;L does not."
        />
        <p className="body" style={{ marginTop: 20, maxWidth: '72ch' }}>
          Almost every organisation now has AI somewhere. Very few can point at a line in the
          accounts and say what it changed. The gap is not the model. It is that the work around the
          model was never redesigned, the data it needs was never made reachable, and nobody owns
          whether it still works next quarter.
        </p>
        <div className="grid grid-2" style={{ marginTop: 32, maxWidth: '72ch' }}>
          {gapStats.map(stat => (
            <StatTile key={stat.value} value={stat.value} label={stat.label} />
          ))}
        </div>
        <SourceNote>{gapStats[0].source}</SourceNote>
      </Section>

      {/* ═════════════════════ 05 · Why Pixelette Technologies ═══════════ */}
      <Section labelledBy="why-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Differentiation"
              id="why-heading"
              title="AI is stronger when there is engineering underneath it"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Pixelette Technologies began with difficult engineering problems. That matters now:
              clients do not need another AI presentation. They need systems that integrate with
              data, survive production, can be measured, and can be improved when the model or
              business changes.
            </p>
            {/* The handoff flags this line for retention — "KEEP THIS IDEA FROM
                THE CURRENT SITE" — and allows it to be softened for enterprise
                tone. It is kept exactly as written, because it is the sharpest
                sentence in the deck and the idea it carries is the section. */}
            <blockquote className="quote" style={{ marginTop: 30 }}>
              “An AI practice with no engineering underneath it is essentially a slide deck.”
            </blockquote>
          </div>

          <div className="grid" style={{ gap: 14 }}>
            {differentiators.map(item => (
              <div key={item.t} className="tile" style={{ padding: '20px 22px' }}>
                <b style={{ fontSize: 16 }}>{item.t}</b>
                <p className="small" style={{ marginTop: 8 }}>
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ══════════════════════════ 06 · AI engineered in ════════════════ */}

      {/* ═══════════════════════════ 07 · Selected work ══════════════════ */}
      {/*
        The three homepage case studies come from `homepageCaseStudies`, which
        fixes the handoff's order — 2Connect, then Fusio Wallet, then Ayni Gold
        — in one place and throws at module load if a slug ever stops
        resolving. AIA is deliberately absent: the handoff keeps it "as a strong
        fourth proof point rather than a homepage lead".

        Everything rendered per card goes through the publication accessors in
        `src/content/work.ts`, never off the record. All three studies are
        `namePermission: 'PENDING'` today, so the anonymised name, the
        anonymised kicker, the name-free CTA and a labelled media box are what
        render — and the card is structurally identical to the named version,
        which is what the handoff means by "support anonymised case-study
        presentation without changing layout".
      */}
      {/*
        THREE BLOCKS REMOVED HERE AND BELOW, 2026-09-14, on the external
        homepage audit of that date. Deletion only: no copy was rewritten, and
        nothing is lost from the site, because each reproduced a page that
        already exists in a sharper form. The data arrays they consumed
        (aiCapabilities, deliverySteps, blockchainCapabilities) went with them.

        AI & AUTOMATION PROPOSITION - eight capability tiles mapping one-to-one
        onto eight pages under /ai-engineering. That page deliberately narrows
        to five services plus one it refuses to sell; this block reinstated the
        long list the AI page was written to replace.

        FROM PROBLEM TO PRODUCTION - "Discover. Design. Build. Verify. Launch.
        Improve." was the THIRD competing process model on one site.
        /method/live publishes LIVE in four stages, each with a named
        commercial structure; /engineering publishes a four-step path. Three
        models is not three explanations, it is one company that has not
        decided. LIVE is the one that survives, and it survives everywhere.

        HERITAGE WITHOUT DISTORTION - six tiles, five reproducing the five
        child pages under /blockchain and the sixth a strategy line. Its actual
        argument, that blockchain is a specialist tool rather than a default
        answer, is already the second paragraph of the DECENTRALISE card above.
        The sentence stays; only the tiles go.

        Measured cause: the audit put this page at 18.6 viewport screens against
        a comparator range of 6.7 to 14.5, and 29 distinct calls to action in
        main against a range of 2 to 21 - an outlier on its own site as well as
        in the market, since every inner page here drives one or two actions.
      */}

      <Section labelledBy="work-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Challenge → build → result"
          id="work-heading"
          title="Selected work"
          lead="Three case studies to show agentic AI, product engineering and specialist blockchain depth."
        />
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {homepageCaseStudies.map(cs => {
            const metrics = publishedMetrics(cs).slice(0, 3);
            return (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="work-card"
                {...analyticsAttrs(ANALYTICS_EVENTS.CASE_STUDY_OPENED, {
                  surface: ANALYTICS_SURFACES.HOMEPAGE_SELECTED_WORK,
                  detail: cs.slug,
                })}
              >
                {/*
                  GUARDED 2026-09-14. A gated image is not a missing one, and the
                  page was presenting them identically.
                  `publishedImage()` returns the artwork only where
                  `namePermission === 'CONFIRMED'`, because a product screenshot
                  carries the client's branding and would name them by the back
                  door. That gate is correct and stays. What was wrong is what a
                  visitor saw when it fired: `MediaSlot` fell back to its
                  unfilled-slot form and rendered the literal string
                  "[ Product screenshot ]" on the homepage, on two of the three
                  selected-work cards.
                  A bracketed placeholder is this site's signal for "a real
                  engagement will fill this" (ADR-0003), and it is the right
                  signal for an unwritten case study. It is the WRONG signal
                  here: nothing is unfinished, the artwork exists on disk, and it
                  is deliberately withheld pending permission. An external audit
                  read the homepage as an unfinished page because of these two
                  strings, which is precisely the misreading they invite.
                  So a card whose image is gated renders no image frame at all
                  and leads with its kicker. An intentional typographic card
                  reads as a choice; a bracket reads as a gap. The frame returns
                  on its own the moment permission lands, with no edit here.
                */}
                {publishedImage(cs) ? (
                  <MediaSlot
                    label={cs.imageLabel}
                    src={publishedImage(cs)}
                    alt={`${displayName(cs)} — ${cs.title}`}
                  />
                ) : null}
                <span className="mono work-card__kicker">{displayKicker(cs)}</span>
                <h3 className="h3" style={{ marginTop: 12, fontSize: 21 }}>
                  {cs.title}
                </h3>
                <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                  {cs.summary}
                </p>
                {/* Guarded. All three publish no figure at all today, and an
                    empty metrics row would add a gap under the summary that
                    says nothing. */}
                {metrics.length > 0 ? (
                  <div className="work-card__metrics">
                    {metrics.map(m => (
                      <span key={m.label}>
                        <b
                          className={m.pending ? 'ph' : undefined}
                          style={m.pending ? { fontSize: 15 } : undefined}
                        >
                          {m.value}
                        </b>
                        <span>{m.shortLabel ?? m.label}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
                <span
                  className="mono"
                  style={{
                    marginTop: 18,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: 'var(--brand)',
                  }}
                >
                  {displayCardCta(cs)}
                  <ArrowRight size={14} />
                </span>
              </Link>
            );
          })}
        </div>
        <p style={{ marginTop: 30 }}>
          <FLink href="/case-studies">See all work</FLink>
        </p>
      </Section>

      {/* ═══════════════════════════ 08 · How we deliver ═════════════════ */}

      {/* ══════════════════════ 09 · Ways to work with us ════════════════ */}
      {/*
        ONE METHOD, 2026-09-14. This slot held "Discover. Design. Build. Verify.
        Launch. Improve." - the third competing process model on a site that also
        publishes LIVE on /method/live and a four-step path on /engineering.
        Deleting it without replacing it would have left the homepage publishing
        no method at all, so the compact LIVE strip takes the slot rather than
        the page simply losing a block.
        `LiveDiagram` is the component /ai-engineering and /method/live already
        render, reused rather than recreated, so the three surfaces cannot drift
        into three descriptions of one method. It moved to src/components/ in
        this commit for that reason: a component rendered by three routes should
        not live inside one route's folder.
      */}
      <Section labelledBy="method-heading">
        <SectionHead
          eyebrow="The method"
          id="method-heading"
          title="LIVE: land, integrate, verify, evolve"
        />
        <div style={{ marginTop: 40 }}>
          <LiveDiagram variant="compact" />
        </div>
        <div style={{ marginTop: 34 }}>
          <Cta href="/method/live" variant="secondary">
            See how LIVE works
          </Cta>
        </div>
      </Section>

      {/*
        THE PRICE, added 2026-09-14. The audit calls this the single
        highest-expected-revenue change in its register, and the reasoning is
        simple: a fixed price on the homepage is the difference between an
        enquiry and a quote request.

        Nothing here is new. The figure, the duration and all four inclusions are
        already published on /ai-engineering/ai-value-baseline, on /contact and
        in llms.txt - so the machine-readable version of this company quoted a
        price its own front page did not. Putting it here discloses nothing that
        was not already public; it stops the homepage being the one surface that
        makes a buyer ask.

        It leads the commercial block rather than replacing it. The three
        engagement modes below still name the larger routes; this is the entry
        offer, which is the one with a number attached.
      */}
      <Section labelledBy="baseline-heading">
        <SectionHead
          eyebrow="Start here"
          id="baseline-heading"
          title="Four weeks. Fixed price. A number your CFO can sign off."
        />
        <div className="grid grid-2" style={{ marginTop: 34, gap: 40, alignItems: 'start' }}>
          <div>
            <p className="body">
              We instrument two or three of your processes, measure what they actually cost today,
              and hand you a costed roadmap with the business case written for finance. If the
              numbers do not support going further, we tell you that.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/ai-value-baseline">See what is included</Cta>
              <Cta href="/contact" variant="secondary">
                Book a value baseline
              </Cta>
            </div>
          </div>
          <div className="card" style={{ padding: 28 }}>
            <span className="mono" style={{ fontSize: 12.5, letterSpacing: '0.1em', color: 'var(--ink)' }}>
              AI VALUE BASELINE
            </span>
            <p style={{ marginTop: 10, fontSize: 26, fontWeight: 600 }}>
              &pound;6,000 to &pound;12,000
            </p>
            <p className="small" style={{ marginTop: 4 }}>Fixed, four weeks.</p>
            <ul className="small" style={{ marginTop: 18, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
              <li>Two to three processes instrumented and measured</li>
              <li>Measurement left running, and yours to keep</li>
              <li>Prioritised opportunity map with a costed roadmap</li>
              <li>Board-ready business case naming what it displaces</li>
            </ul>
          </div>
        </div>
      </Section>


      <Section labelledBy="engage-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Commercial products"
          id="engage-heading"
          title="Three clear ways to engage Pixelette Technologies"
        />
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {engagementRoutes.map(route => (
            <div
              key={route.t}
              className="card"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <h3 className="mono" style={{ fontSize: 12.5, letterSpacing: '0.1em', color: 'var(--ink)' }}>
                {route.t}
              </h3>
              <p className="body" style={{ marginTop: 14, fontSize: 15 }}>
                {route.d}
              </p>
              <div style={{ flexGrow: 1 }} />
              <div style={{ marginTop: 20 }}>
                <FLink href="/contact">{route.cta}</FLink>
              </div>
            </div>
          ))}
        </div>
        {/* The handoff's optional fourth route, kept as a supporting line
            rather than a fourth card so the section still reads as "three
            clear ways", which is what its own heading promises. */}
        <div
          className="card"
          style={{ marginTop: 18, display: 'flex', gap: 28, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <div style={{ flex: '1 1 520px' }}>
            <h3 className="h4">Rescue &amp; Modernise</h3>
            <p className="body" style={{ marginTop: 10, fontSize: 15 }}>
              For stalled builds, legacy platforms, inherited codebases or projects that need an
              independent technical assessment before further investment.
            </p>
          </div>
          <Cta href="/contact" variant="secondary">
            Start a conversation
          </Cta>
        </div>
      </Section>

      {/* ═══════════════════════════ 10 · Who we work with ═══════════════ */}

      {/* ═════════════════ 11 · Blockchain specialist practice ═══════════ */}
      {/*
        Heritage without distortion. Two things the handoff supplies for this
        section are deliberately NOT published:

         - The "Programme highlight: BlockGuard / Fusio" paragraph, which it
           gates itself: "Use this as specialist heritage/proof only after the
           exact completed components and public attribution rights are
           confirmed." Neither is confirmed in this repository.
         - Any count of chains or protocols, value tokenised or transaction
           volume. Its "DO NOT PUBLISH UNTIL VERIFIED" list holds all of them,
           and so does `claims.ts` under `blockchain-volumes-and-chain-counts`.
           The previous version of this page carried both "Twenty-four chains
           and protocols in production use" and "$14M tokenised · 1,200+ tokens
           in 6 months"; neither has been carried across.
      */}

      {/* ══════════════════════ 12 · Governance when required ════════════ */}
      {/*
        The accreditation-safe cross-sell. `certified.positioningLine` is the
        handoff's replacement for "we build it, Certified proves it" and every
        variant of it, and it is quoted rather than paraphrased. Nothing in this
        block says any Pixelette company holds an accreditation, issues a
        certificate or performs an independent audit.
      */}
      <CertifiedHandoff
        eyebrow="Governance when required"
        title="Need governance and assurance around what you are building?"
        blurb={
          <>
            {certified.name} is{' '}
            {certified.blurb.charAt(0).toLowerCase() + certified.blurb.slice(1)}{' '}
            {certified.positioningLine}
          </>
        }
        ctaLabel="Explore Pixelette Certified"
      />

      {/* ═══════════════════════ 13 · Part of Pixelette Group ════════════ */}
      {/*
        Four companies, four roles. `role` and `what` both come from
        `src/content/nav.ts`, where they were set to the handoff's section 13
        wording — BUILD & AUTOMATE / PARTNER & VENTURE / GROW & CONVERT /
        GOVERN & ASSURE — so the group is described identically here, in the
        footer and in the copy deck.

        Referenced lightly, as instructed: this is a paragraph and a grid, not a
        holding-company page, and no route to buying engineering passes through
        another Group company.
      */}
      {/*
        GROUP ARCHITECTURE REMOVED 2026-09-14, and NOT moved to the footer as
        the audit proposed - because SiteFooter already renders it on every
        page. Verified from the built HTML: the footer carries "Part of
        Pixelette Group" and names Holdings, Marketing and Certified.

        So this was not a block in the wrong position, it was the same block
        twice on one page. Moving it would have produced two group bands in the
        footer region.

        The audit's reason for moving it stands and is the reason it goes:
        three outbound "Visit site" links to other domains sat immediately
        before the conversion block, at the exact point a warm visitor should
        be converting. In the footer they are a reference; here they were an
        exit. Entity distinctness is unaffected - the footer band, llms.txt and
        the subOrganization graph all still carry it.
      */}

      {/* ═══════════════════════════ 14 · Final CTA ══════════════════════ */}
      {/*
        Built inline rather than through `ClosingCta`, which carries a single
        CTA; the handoff's close needs a primary and a secondary.

        The handoff also asks for an optional file upload here, qualified "if
        technically feasible" (checklist 18). It does not exist — not on this
        page, and not on /contact, which is where it would have to live. Until
        2026-09-11 this section published the handoff's line "Upload a brief,
        requirements document, process map or architecture note." above two CTAs
        that both route to a form of text fields with no file input, and an
        earlier note here said the upload "belongs to the contact form on
        /contact". It did not: nothing was ever built there. The site was
        offering something it could not receive, which is the defect this
        project has already corrected once elsewhere.

        The line is gone and the copy below offers only what /contact can
        actually do. Whether the upload is built is a founder decision rather
        than an engineering one — it needs a storage or forwarding target, a
        size and type policy, a retention position and a privacy-page
        consequence — and the options are set out for him in
        `../UPLOAD-FEASIBILITY-2026-09-11.md`, in the project folder alongside
        this repository. Nothing here should promise an upload again until one
        of them is chosen and shipped.
      */}
      <Section labelledBy="close-heading" style={{ background: '#F7FAFA' }}>
        <div className="split split--cta">
          <div>
            <Eyebrow>Homepage close</Eyebrow>
            <h2 className="h2" id="close-heading" style={{ marginTop: 18 }}>
              Bring us the problem, not the specification
            </h2>
            <p className="body" style={{ marginTop: 20 }}>
              Tell us what needs to change — a product that needs building, a workflow that needs
              automating, a system that needs modernising, or a blockchain use case that needs
              testing. We’ll help you map the right engineering route and the evidence needed to
              know whether it worked.
            </p>
            <div className="btn-row" style={{ marginTop: 32 }}>
              <Cta
                href="/contact"
                analytics={analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
                  surface: ANALYTICS_SURFACES.HOMEPAGE_CLOSE,
                })}
              >
                Book an Engineering Conversation
              </Cta>
              {/*
                `SEND_US_A_BRIEF_INTENT`, and the name is load-bearing. There
                is no upload control on this site and no file can reach us —
                see the note above and `../UPLOAD-FEASIBILITY-2026-09-11.md`.
                This counts a button press. It must never be read, or
                renamed, as a brief having been received.
              */}
              <Cta
                href="/contact"
                variant="secondary"
                analytics={analyticsAttrs(ANALYTICS_EVENTS.SEND_US_A_BRIEF_INTENT, {
                  surface: ANALYTICS_SURFACES.HOMEPAGE_CLOSE,
                })}
              >
                Send Us a Brief
              </Cta>
            </div>
            <p className="small" style={{ marginTop: 20 }}>
              No specification required. Tell us what you are trying to change in your own words —
              and if a brief, requirements document, process map or architecture note already
              exists, say so and we will ask for it when we reply.
            </p>
            <p className="src" style={{ marginTop: 18 }}>
              No obligation. If the answer is “do not build this yet”, we should be willing to say
              so.
            </p>
          </div>
          {/*
            These four are the handoff's section 14 form qualifier, verbatim,
            and they are now the questions /contact actually asks
            (`src/app/contact/ContactForm.tsx`). They were not until 2026-09-11:
            the form asked Name, Company, Work email and "Which process is
            costing you most?", so this card told a visitor what would be asked
            and the form then asked something else. The spec's four are the
            authority, so the form moved to them rather than this card moving to
            the form. Change one of these strings and you must change it in both
            places, or the page is lying again.
          */}
          <div className="card">
            <h3 className="h4">What we will ask</h3>
            <ul style={{ padding: 0, margin: '16px 0 0', display: 'grid', gap: 12 }}>
              {[
                'What are you trying to build or change?',
                'What exists today?',
                'Is there a deadline?',
                'What would a successful result look like?',
              ].map(q => (
                <li key={q} className="small" style={{ listStyle: 'none' }}>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ══════════════════════════════ FAQs ═════════════════════════════ */}
      <Section labelledBy="faq-heading">
        <SectionHead
          eyebrow="Homepage FAQs"
          id="faq-heading"
          title="Questions worth answering before a sales call"
        />
        <div style={{ marginTop: 34, maxWidth: '80ch' }}>
          {faqs.map(faq => (
            <details key={faq.q} className="faq">
              <summary>{faq.q}</summary>
              <p className="body" style={{ marginTop: 12 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
