import Link from 'next/link';

import { ArrowRight } from '@/components/Icons';
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
} from '@/components/ui';
import { certified } from '@/content/company';
import { groupEntities } from '@/content/nav';
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

/** Handoff section 06, "AI engineered in". Capability + implementation wording. */
const aiCapabilities = [
  {
    t: 'Agentic AI & orchestration',
    d: 'Single- and multi-agent systems that plan, call tools, coordinate steps and operate within defined controls.',
    href: '/ai-engineering/agentic-ai-multi-agent',
  },
  {
    t: 'Workflow automation',
    d: 'Automate repetitive or high-friction business processes across systems, data and human approvals.',
    href: '/ai-engineering/workflow-automation',
  },
  {
    t: 'LLM integration & RAG',
    d: 'Add model intelligence to existing products and knowledge environments with retrieval, permissions and grounded context.',
    href: '/ai-engineering/llm-integration-rag',
  },
  {
    t: 'Predictive intelligence',
    d: 'Forecasting, scoring, recommendation and decision-support systems built around business data.',
    href: '/ai-engineering/predictive-intelligence',
  },
  {
    t: 'Language, speech & vision',
    d: 'NLP, sentiment, extraction, classification, speech and image/video intelligence where the use case supports it.',
    href: '/ai-engineering/language-speech-vision',
  },
  {
    t: 'Data & integration',
    d: 'Pipelines, APIs, model-serving layers and integrations into existing systems of record.',
    href: '/ai-engineering/data-and-integration',
  },
  {
    t: 'Evaluation & observability',
    d: 'Measure output quality, reliability, latency, cost, drift and human escalation rather than trusting a demo.',
    href: '/ai-engineering/evaluation-and-observability',
  },
  {
    t: 'AI Value Baseline',
    d: 'Define the current manual cost, cycle time, error rate or conversion baseline before automating so value can be measured afterwards.',
    href: '/ai-engineering/ai-value-baseline',
  },
];

/** Handoff section 08, "How we deliver". Six stages, verbatim. */
const deliverySteps = [
  {
    n: '01',
    t: 'DISCOVER',
    d: 'Define the business problem, users, systems, data, constraints, risks and success measures. Decide what should — and should not — be built.',
  },
  {
    n: '02',
    t: 'DESIGN',
    d: 'Architecture, UX, data model, workflow and delivery plan. For AI, define the baseline and evaluation method before model selection.',
  },
  {
    n: '03',
    t: 'BUILD & INTEGRATE',
    d: 'Engineering, model integration, APIs, automation, infrastructure and iterative product delivery with working evidence.',
  },
  {
    n: '04',
    t: 'VERIFY',
    d: 'Functional testing, security review, performance, model evaluation, human-control points and production-readiness evidence.',
  },
  {
    n: '05',
    t: 'LAUNCH',
    d: 'Deploy with observability, rollback, monitoring and agreed ownership. Production is treated as an operating state, not a demo.',
  },
  {
    n: '06',
    t: 'RUN & IMPROVE',
    d: 'Support, incident handling, optimisation, releases and roadmap delivery based on real usage and measured outcomes.',
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

/** Handoff section 11, "Blockchain specialist practice". Six capabilities. */
const blockchainCapabilities = [
  {
    t: 'Asset tokenisation',
    d: 'Architecture and implementation for representing and managing real-world or digital assets on-chain where the commercial/legal model supports it.',
    href: '/blockchain/tokenisation',
  },
  {
    t: 'Smart contracts & dApps',
    d: 'Programmable workflows and decentralised applications with testing, access controls and clear upgrade/ownership decisions.',
    href: '/blockchain/smart-contracts-dapps',
  },
  {
    t: 'Wallets & digital-asset products',
    d: 'User-facing wallet, portfolio and transaction experiences across mobile/web environments.',
    href: '/blockchain/wallets-digital-assets',
  },
  {
    t: 'Layer 1 / Layer 2 & protocol work',
    d: 'Specialist network and protocol engineering where a bespoke chain or scaling layer is justified.',
    href: '/blockchain/protocol-engineering',
  },
  {
    t: 'Interoperability & integrations',
    d: 'Connect blockchain components to existing applications, data and off-chain systems.',
    href: '/blockchain/integration',
  },
  {
    t: 'Blockchain product strategy',
    d: 'Decide whether blockchain is actually required before committing to architecture and delivery.',
    href: '/blockchain',
  },
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
    q: 'Do you build mobile applications?',
    a: 'Yes. Mobile can be a standalone product or part of a wider SaaS/platform programme across iOS, Android and web, with the architecture chosen around the product and operating requirements.',
  },
  {
    q: 'Can you take over an existing or stalled build?',
    a: 'Yes. We can start with an independent technical assessment, architecture/code review and recovery plan before committing to continued development.',
  },
  {
    q: 'Do you provide developers by the day?',
    a: 'We can structure dedicated engineering capacity where that is the right commercial model, but our default proposition is accountable delivery around a defined product, workflow or engineering outcome.',
  },
  {
    q: 'What happens after launch?',
    a: 'Support can continue through monitoring, incident response, optimisation, releases, roadmap delivery and managed product engineering.',
  },
  {
    q: 'Can you help with compliance or certification?',
    a: 'Where a project needs governance, certification readiness or assurance support, Pixelette Certified can help scope and coordinate the appropriate readiness and independent-assessment route. The exact assurance provider depends on the requirement.',
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
          <p className="lead" style={{ margin: '24px auto 0', maxWidth: '64ch' }}>
            Pixelette Technologies designs, builds, integrates and operates software products, AI
            systems and intelligent workflows. Software engineering is our foundation. AI and
            automation are both a major capability in their own right and engineered into the
            products we build. Our blockchain practice brings specialist depth where
            decentralisation, tokenisation or distributed infrastructure genuinely creates value.
          </p>

          {/* Primary and secondary CTA. Build and AI, in that order, are the
              two commercial engines the handoff reweights the page around. */}
          <div className="btn-row" style={{ marginTop: 36, justifyContent: 'center' }}>
            <Cta
              href="/engineering"
              analytics={analyticsAttrs(ANALYTICS_EVENTS.HERO_PRIMARY_CTA, {
                route: BUYER_ROUTES.BUILD_SOFTWARE,
                surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
              })}
            >
              Build a Product
            </Cta>
            <Cta
              href="/ai-engineering"
              variant="secondary"
              analytics={analyticsAttrs(ANALYTICS_EVENTS.HERO_SECONDARY_CTA, {
                route: BUYER_ROUTES.AI_AUTOMATION,
                surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
              })}
            >
              Automate a Workflow
            </Cta>
          </div>

          {/* The specialist route. Deliberately a text link rather than a third
              button: visible, immediately reachable, and not competing with the
              two commercial engines for the first screen. */}
          <p style={{ marginTop: 22 }}>
            <FLink
              href="/blockchain"
              analytics={analyticsAttrs(ANALYTICS_EVENTS.HERO_SPECIALIST_ROUTE, {
                route: BUYER_ROUTES.BLOCKCHAIN,
                surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
              })}
            >
              Explore Blockchain Engineering
            </FLink>
          </p>

          {/* The low-friction route, for the buyer who cannot yet name the
              service. It goes to section 03, which is the section built to
              answer exactly that. */}
          <p className="small" style={{ marginTop: 26 }}>
            Not sure which route fits?{' '}
            {/* No route on this one on purpose: the whole point of the
                low-friction line is that this visitor cannot yet name their
                route. Attaching one would invent an answer they have not
                given, and item 22's route breakdown would be counting it. */}
            <a
              href="#what-are-you-trying-to-change"
              {...analyticsAttrs(ANALYTICS_EVENTS.HERO_LOW_FRICTION_ROUTE, {
                surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
              })}
            >
              Tell us what needs to change.
            </a>
          </p>

          {/* The three route chips. Build and AI carry the brand accent and a
              filled treatment; Blockchain keeps the muted outline and says what
              it is, so it reads as specialist depth rather than as a third
              equal division of the company. */}
          <nav aria-label="Capability routes" style={{ marginTop: 34 }}>
            <ul
              className="filters"
              style={{ justifyContent: 'center', listStyle: 'none', padding: 0, margin: 0 }}
            >
              <li>
                <Link
                  href="/engineering"
                  className="filter"
                  style={{ borderColor: 'var(--brand)', color: 'var(--brand)', fontWeight: 600 }}
                  {...analyticsAttrs(ANALYTICS_EVENTS.HERO_ROUTE_CHIP, {
                    route: BUYER_ROUTES.BUILD_SOFTWARE,
                    surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
                  })}
                >
                  Build Software
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-engineering"
                  className="filter"
                  style={{ borderColor: 'var(--brand)', color: 'var(--brand)', fontWeight: 600 }}
                  {...analyticsAttrs(ANALYTICS_EVENTS.HERO_ROUTE_CHIP, {
                    route: BUYER_ROUTES.AI_AUTOMATION,
                    surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
                  })}
                >
                  AI &amp; Automation
                </Link>
              </li>
              <li>
                <Link
                  href="/blockchain"
                  className="filter"
                  {...analyticsAttrs(ANALYTICS_EVENTS.HERO_ROUTE_CHIP, {
                    route: BUYER_ROUTES.BLOCKCHAIN,
                    surface: ANALYTICS_SURFACES.HOMEPAGE_HERO,
                  })}
                >
                  Blockchain
                  <span className="mono" style={{ fontSize: 10, marginLeft: 8, opacity: 0.75 }}>
                    SPECIALIST
                  </span>
                </Link>
              </li>
            </ul>
          </nav>
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
          title="Built for real operating environments."
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
      <Section
        id="what-are-you-trying-to-change"
        labelledBy="routes-heading"
        style={{ background: '#F7FAFA', scrollMarginTop: 90 }}
      >
        <SectionHead
          eyebrow="Buyer route"
          id="routes-heading"
          title="What are you trying to change?"
          lead="Start with the problem, not the technology. Most clients do not arrive with a perfect technical specification."
        />
        <div className="table-scroll" style={{ marginTop: 36 }}>
          <table>
            <caption className="small" style={{ textAlign: 'left', paddingBottom: 12 }}>
              Six common starting points, and where each one goes.
            </caption>
            <thead>
              <tr>
                <th scope="col">Buyer trigger</th>
                <th scope="col">Route</th>
                <th scope="col">What it means</th>
                <th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              {buyerRoutes.map(row => (
                <tr key={row.trigger}>
                  <th
                    scope="row"
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 14.5,
                      textTransform: 'none',
                      letterSpacing: 0,
                      color: 'var(--ink)',
                      fontWeight: 600,
                      borderBottom: '1px solid var(--line)',
                      padding: '14px 16px',
                    }}
                  >
                    {row.trigger}
                  </th>
                  <td>
                    <Link
                      href={row.routeHref}
                      {...analyticsAttrs(ANALYTICS_EVENTS.BUYER_TRIGGER_ROUTE, {
                        route: row.analyticsRoute,
                        surface: ANALYTICS_SURFACES.HOMEPAGE_BUYER_TRIGGERS,
                      })}
                    >
                      {row.route}
                    </Link>
                  </td>
                  <td>{row.meaning}</td>
                  <td>
                    {/* The conversion step of the two. Same route slug as the
                        link beside it, so "read the capability" and "ask for a
                        conversation" are separable per route rather than
                        collapsed into one number. */}
                    <Link
                      href="/contact"
                      {...analyticsAttrs(ANALYTICS_EVENTS.BUYER_TRIGGER_CTA, {
                        route: row.analyticsRoute,
                        surface: ANALYTICS_SURFACES.HOMEPAGE_BUYER_TRIGGERS,
                      })}
                    >
                      {row.cta}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

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

      {/* ═════════════════════ 05 · Why Pixelette Technologies ═══════════ */}
      <Section labelledBy="why-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Differentiation"
              id="why-heading"
              title="AI is stronger when there is engineering underneath it."
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
      <Section labelledBy="ai-heading">
        <SectionHead
          eyebrow="AI &amp; automation proposition"
          id="ai-heading"
          title="AI should do useful work, not decorate the roadmap."
          lead="We design AI systems around a measurable job: remove repetitive work, accelerate a decision, create a new product capability, improve customer experience, or coordinate a workflow that would otherwise require multiple people and systems."
        />
        <div className="grid grid-2" style={{ marginTop: 36, gap: 14 }}>
          {aiCapabilities.map(item => (
            <Link key={item.href + item.t} href={item.href} className="mini-card">
              <span>
                <b style={{ display: 'block', fontSize: 16, color: 'var(--ink)' }}>{item.t}</b>
                <span className="small" style={{ display: 'block', marginTop: 7 }}>
                  {item.d}
                </span>
              </span>
            </Link>
          ))}
        </div>
        {/*
          The AI operating principle. The handoff's third sentence here — "Pixelette
          should sell autonomy as an engineered control decision, not as a slogan" —
          is an instruction to us about how to sell, not a sentence written for a
          reader, so it is not published. The two sentences that state the actual
          operating position are reproduced exactly.
        */}
        <div className="card" style={{ marginTop: 28 }}>
          <h3 className="h4">AI operating principle</h3>
          <p className="body" style={{ marginTop: 10, fontSize: 15 }}>
            Human oversight is the default where decisions are material. More autonomous operation
            is introduced where the workflow, risk level and evidence justify it.
          </p>
        </div>
      </Section>

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
                <MediaSlot
                  label={cs.imageLabel}
                  src={publishedImage(cs)}
                  alt={`${displayName(cs)} — ${cs.title}`}
                />
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
      <Section labelledBy="deliver-heading">
        <SectionHead
          eyebrow="From problem to production"
          id="deliver-heading"
          title="Discover. Design. Build. Verify. Launch. Improve."
        />
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {deliverySteps.map(step => (
            <div key={step.n} className="tile" style={{ padding: '22px 24px' }}>
              <span className="step__n">{step.n}</span>
              <b style={{ fontSize: 15 }}>{step.t}</b>
              <p className="small" style={{ marginTop: 8 }}>
                {step.d}
              </p>
            </div>
          ))}
        </div>
        <div className="btn-row" style={{ marginTop: 36 }}>
          <Cta href="/method/live">See how we work</Cta>
          <Cta href="/contact" variant="secondary">
            Discuss an engineering problem
          </Cta>
        </div>
      </Section>

      {/* ══════════════════════ 09 · Ways to work with us ════════════════ */}
      <Section labelledBy="engage-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Commercial products"
          id="engage-heading"
          title="Three clear ways to engage Pixelette Technologies."
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
      <Section labelledBy="who-heading">
        <SectionHead
          eyebrow="Broad market positioning"
          id="who-heading"
          title="Built around the problem, not the sector label."
          // The handoff's opening sentence here ("Pixelette Technologies should
          // not position itself as technology-company-only") is an instruction
          // about positioning rather than copy for a reader; the sentence that
          // states the actual position follows it and is reproduced exactly.
          lead="The offer applies wherever software, automation, AI or decentralised infrastructure can create a measurable business outcome."
        />
        <div className="grid grid-4" style={{ marginTop: 40 }}>
          {audiences.map(a => (
            <div key={a.t} className="tile" style={{ padding: '22px 24px' }}>
              <b style={{ fontSize: 14, fontFamily: 'var(--mono)', letterSpacing: '0.06em' }}>
                {a.t}
              </b>
              <p className="small" style={{ marginTop: 10 }}>
                {a.d}
              </p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 34 }}>
          <Eyebrow>Sector experience</Eyebrow>
          <div className="pill-row" style={{ marginTop: 16 }}>
            {sectors.map(s => (
              <span className="pill" key={s}>
                {s}
              </span>
            ))}
          </div>
          <p className="small" style={{ marginTop: 14 }}>
            And other data- and workflow-intensive sectors.
          </p>
        </div>
      </Section>

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
      <Section labelledBy="chain-heading" className="theme-amber" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Heritage without distortion"
          id="chain-heading"
          title="Chains that hold — when decentralisation has a reason to exist."
          lead="Pixelette’s engineering roots include blockchain: experience with trust, irreversible transactions, distributed systems and security-sensitive architecture. It is a specialist solution to a specific problem, not a mandatory ingredient in every technology project."
        />
        <div className="grid grid-3" style={{ marginTop: 40, gap: 14 }}>
          {blockchainCapabilities.map(item => (
            <Link key={item.t} href={item.href} className="mini-card">
              <span>
                <b style={{ display: 'block', fontSize: 15.5, color: 'var(--ink)' }}>{item.t}</b>
                <span className="small" style={{ display: 'block', marginTop: 7 }}>
                  {item.d}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Section>

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
      <Section labelledBy="group-heading">
        <SectionHead
          eyebrow="Group architecture"
          id="group-heading"
          title="Four businesses. Four distinct jobs."
        />
        <div className="grid grid-4" style={{ marginTop: 40 }}>
          {groupEntities.map(entity => (
            <div key={entity.name} className="tile" style={{ padding: '22px 24px' }}>
              <b style={{ fontSize: 15, fontFamily: 'var(--sans)' }}>{entity.name}</b>
              <span
                className="mono"
                style={{
                  display: 'block',
                  marginTop: 10,
                  fontSize: 10.5,
                  letterSpacing: '0.12em',
                  color: 'var(--brand)',
                }}
              >
                {entity.role}
              </span>
              <p className="small" style={{ marginTop: 10 }}>
                {entity.what}
              </p>
              {entity.isThisEntity ? (
                <p className="small" style={{ marginTop: 12, fontSize: 12.5 }}>
                  You are here.
                </p>
              ) : (
                <p style={{ marginTop: 12 }}>
                  <a
                    className="small"
                    href={entity.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12.5 }}
                  >
                    Visit site
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

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
              Bring us the problem, not the specification.
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
          title="Questions worth answering before a sales call."
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
