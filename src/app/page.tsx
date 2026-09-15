
import { LiveDiagram } from '@/components/LiveDiagram';
import {
  CertifiedHandoff,
  ValueModelCards,
} from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  Section,
  SectionHead,
  SourceNote,
  StatTile,
} from '@/components/ui';
import { certified } from '@/content/company';
import { gapStats } from '@/content/sources';
import { displayKicker, homepageCaseStudies } from '@/content/work';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_SURFACES,
  BUYER_ROUTES,
  analyticsAttrs,
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

/**
 * The three the homepage renders, and the ORDER IS LOAD-BEARING.
 *
 * The order is an engagement arc: how we take the brief, what we choose to
 * build with, what happens after launch. It also keeps the anchors of an
 * earlier and stronger pattern — the gap paragraph above names three failures
 * in sequence, and the FIRST and LAST tiles still answer its first and last
 * ("the work was never redesigned" -> product thinking; "nobody owns whether it
 * still works next quarter" -> built to keep operating). The paragraph ends on
 * "next quarter" and so does this row.
 *
 * THE MIDDLE MAPPING IS GONE AND THIS IS NOT A 3/3 RHYME ANY MORE. It was one
 * until 2026-09-15, when 'AI-native where useful' returned on founder
 * instruction; it answers none of the three named failures, so it takes the
 * middle slot, which is the weakest position in a 3-up. Reordering still breaks
 * the section without breaking the build, so do not sort this array.
 *
 * It replaced 'Engineering before theatre', which is NOT the swap originally
 * specified — that named 'Built to keep operating', and it was wrong. Two
 * reasons, recorded so the swap is not reversed later:
 *  - 'Built to keep operating' is the tightest of the three answers ("owns"
 *    against "remain inside the same engineering relationship"). Cutting it
 *    would have broken the pattern at its strongest point.
 *  - 'Engineering before theatre' argued substance over presentation ~90px
 *    below a blockquote that argues it harder: "An AI practice with no
 *    engineering underneath it is essentially a slide deck." Same claim twice
 *    on one screen, spending one of only three tiles.
 *
 * CONSEQUENCE: that blockquote is now the section's ONLY carrier of the
 * substance-over-theatre argument. If it is ever trimmed, this position leaves
 * the homepage entirely. Trim the quote and you must restore a tile.
 *
 * Six were rendering here until 2026-09-15 — the array above is the handoff
 * record and keeps all six, and the handoff itself prints them as two blocks of
 * three. Block one is what rendered after the merge; 'AI-native where useful'
 * heads block two, so its return is a PROMOTION across that grouping, made on
 * founder instruction about his own deck. The four not rendered:
 *
 *  - 'Governance route available' -> `CertifiedHandoff variant="compact"`, this
 *    page, section 12, in the accreditation-safe wording claims.ts requires.
 *  - 'Blockchain depth' -> /blockchain's hero: "Pixelette began as a blockchain
 *    studio and it remains our deepest specialism", under an h1 dated "since
 *    2018". Stronger than this tile and on the page that owns the claim.
 *    VERIFIED AT SOURCE, because the first survival citation offered for it was
 *    the DECENTRALISE card, which says something else — "a specialist tool, not
 *    a default answer" is restraint, not heritage.
 *  - 'Engineering before theatre' -> the blockquote above, same section. Its
 *    sentence is homepage-only and dies with it; grep confirms "theatre",
 *    "before the demo" and "production readiness" appear nowhere else in src.
 *    The ARGUMENT survives on the same screen; the enumerated craft list
 *    (architecture, integration, testing, production readiness) does NOT, and
 *    that is accepted rather than glossed — this section argues, it does not
 *    scope, and scope belongs to the BUILD card above and to /engineering. If
 *    the homepage is ever said to have gone vague about what engineering means,
 *    THIS CUT IS THE CAUSE, and the fix is /engineering, not a fourth tile.
 *  - 'AI-native where useful' -> RETURNED 2026-09-15. It had been the honest
 *    loss: AUTOMATE carries the capability, but the RESTRAINT applied to AI
 *    exists nowhere else on the site. Every published "earns its place" is
 *    about blockchain (/blockchain, /blockchain/tokenisation, the DECENTRALISE
 *    headline). This tile is the only place the site applies that discipline to
 *    AI itself. None of the six appear in llms.txt, so a tile cut here leaves
 *    the site outright rather than surviving on a machine-readable surface.
 *
 * Throws at module load rather than silently rendering a short row, the same
 * way `homepageCaseStudies` fails closed on a slug.
 */
const homepageDifferentiators = [
  'Product thinking, not ticket delivery',
  'AI-native where useful',
  'Built to keep operating',
  'Governance route available',
].map(title => {
  const found = differentiators.find(item => item.t === title);
  if (!found) throw new Error(`Homepage differentiator not found: ${title}`);
  return found;
});


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
            <span style={{ display: 'block' }}>Engineering that ships</span>
            <span style={{ display: 'block' }}>Chains that hold</span>
            <span style={{ display: 'block' }}>AI built into both</span>
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
              Book a conversation
            </Cta>
            {/*
              RETARGETED 2026-09-15 on founder instruction: "scoping a build
              should take us first to the form". It pointed at /engineering, the
              capability page.

              IT WAS ALSO THE ODD ONE OUT. Every other "Scope a build" on this
              site already goes to /contact - /engineering itself and its four
              child pages, five call sites - so the homepage was the only one
              sending a reader who had decided to a page that explains rather
              than one that asks.

              The analytics distinguish it from the primary button beside it, so
              two buttons to one destination is legible in the data: `route`
              stays BUILD_SOFTWARE and the event stays HERO_SECONDARY_CTA, which
              is what separates "I want a build" from the primary's "I want a
              conversation". Do not merge the two buttons on the grounds that
              they share a href; the intent is the point, not the destination.

              WHAT THIS COSTS, recorded rather than discovered later: the hero no
              longer links to /engineering at all. That page is still reachable
              from the BUILD card immediately below and from the header, so it is
              one scroll or one hover away, not orphaned.
            */}
            <Cta
              href="/contact"
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
      {/*
      {/*
        CLIENT ROW AND VERIFIED PROOF SECTION REMOVED 2026-09-15, on founder
        instruction, pointing at both blocks on the live page.

        What went: the seven-name TRUSTED BY row, and the VERIFIED PROOF
        section carrying the claims-register statement plus the demoted
        certificate line added the day before.

        NOTHING IS WITHDRAWN FROM THE SITE and no gate changed. The seven
        names are still APPROVED in src/content/clients.ts and still render on
        /ai-engineering through the same accessor, so this is a homepage
        composition decision rather than a permissions one - withdraw a
        permission there and the name leaves everywhere at once, which is still
        the only mechanism that should remove one.

        The evidence-gate statement and both certificates remain published in
        full on /certifications and /security-and-data, with number, issuing
        body, accrediting body and expiry - which is where a reviewer goes and
        what llms.txt instructs any reader to cite. The homepage no longer
        states the gate; the pages that hold the evidence still do.
      */}


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
          title="One engineering company, four ways we create value"
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
      {/*
        THE PROBLEM AND ITS PROOF, merged 2026-09-15 on founder instruction.
        Was two sections: "The gap" (white) and "Selected work" (tinted).

        WHY ONE SECTION. The gap closed on four differentiator tiles, which are
        CLAIMS. Selected work is the ONLY first-party evidence on this page;
        everything else here is a third-party statistic about the market. So a
        section boundary was sitting exactly between a claim and its proof. One
        movement now: the problem, how we are different, what we have built.

        THE STATS AND THE CITATION ARE WHY THIS SECTION EXISTS and they survive
        untouched, in order, above the blockquote. They are the only SourceNote
        on the homepage, added 2026-09-14 to close an audit finding that the
        front page carried no citation at all. The client row and a
        verified-proof block have since been removed on founder instruction, so
        this page has LESS proof than when that finding was written.

        WHAT SEPARATES THE WORK ROW, now the tint no longer can. NOT a rule and
        NOT an inner tinted block, and the reason is the same for both: they are
        SECTION-BOUNDARY TOKENS. `.sec` draws border-top 1px var(--line) and
        `.rule` is height 1px background var(--line), so the section boundary on
        this site IS that glyph. And #F7FAFA appears at 14 call sites in src/,
        every one a Section background, never an inner block. Using either here
        would redraw the boundary the merge just removed, in the site's own
        vocabulary. So the separator is HIERARCHY instead: 72px of air, the
        eyebrow, an h3 with a lead, a 4-up to 3-up column change, and a type
        step on the kicker. Hierarchy is the one separator that cannot be
        mistaken for a section break.

        THE TINT MOVED TO THE WHOLE SECTION, and it is not a new treatment:
        /ai-engineering already renders this headline, this paragraph, these
        gapStats figures and this attribution inside a #F7FAFA section. Two
        pages sharing the content now share its ground. It also keeps the page
        alternating white, tint, white, tint, white, and gives the nine white
        tile cards in here a ground to sit on instead of white on white.
      */}
      <Section labelledBy="gap-heading" style={{ background: '#F7FAFA' }}>
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

        <blockquote className="quote" style={{ marginTop: 48 }}>
          &ldquo;An AI practice with no engineering underneath it is essentially a slide deck.&rdquo;
        </blockquote>

        <div className="grid grid-4" style={{ marginTop: 44 }}>
          {homepageDifferentiators.map(item => (
            <div key={item.t} className="tile">
              {/* 16px overrides `.tile b`, a 26px mono brand numeral for
                  StatTile. Without it these titles render as statistics. */}
              <b style={{ fontSize: 16 }}>{item.t}</b>
              <p className="small" style={{ marginTop: 8 }}>
                {item.d}
              </p>
            </div>
          ))}
        </div>

        {/*
          72px IS the separator, and the number is chosen rather than picked. The
          internal rhythm above it runs 20, 32, 14, 48, 44, so this is the widest
          opening in the section by half again. A reader does not measure it,
          they feel that nothing else here opens this wide, which is what a beat
          is once a line and a tonal change have both been refused. The merge
          removed 192px of section padding; this returns 72 of it.
        */}
        <div
          style={{
            marginTop: 72,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          {/*
            level 3, because a section has one h2 and it is the founder's line
            above. The old heading id is RETIRED rather than moved onto this h3:
            it was referenced at exactly two places, the Section and the h2 both
            replaced here, so no skip link, anchor, test or nav entry loses a
            target, and an id nothing references is dead wiring.

            "Challenge to build to result" is not deleted, it moves to the lead,
            where it does the job it was always doing, telling the reader what
            shape a case study has, and adds back a line of header mass.
          */}
          <SectionHead
            eyebrow="Selected work"
            level={3}
            title="The work behind those claims"
            lead="Challenge &rarr; build &rarr; result"
          />
          <FLink href="/case-studies">Read the full case studies</FLink>
        </div>
        <div className="grid grid-3" style={{ marginTop: 32 }}>
          {homepageCaseStudies.map(cs => (
            <div key={cs.slug} className="tile">
              {/* A p, not a span: `.tile span` is a 13px muted block for
                  StatTile's caption and `.tile b` a 26px brand numeral. Either
                  would restyle this label.

                  15px, up from 12.5px, and this is the merge's most load-bearing
                  number. The differentiator tiles directly above render .small
                  at 14px under 16px titles, so at 12.5px the ONLY first-party
                  evidence on the homepage was the SMALLEST type in the section,
                  sitting under larger type. That inversion survived only because
                  a boundary and a tint told the reader to look again. Both are
                  gone, so the type has to carry it. */}
              <p
                className="mono"
                style={{ fontSize: 15, letterSpacing: '0.08em', color: 'var(--ink)', margin: 0 }}
              >
                {displayKicker(cs)}
              </p>
            </div>
          ))}
        </div>
      </Section>
      {/*
        COLLAPSED 2026-09-15 on founder instruction, from three sections to one.
        "The method", "Start here" and "Commercial products" are now this.

        WHY THE METHOD AND THE OFFER MERGED: the proof is inside the diagram.
        `LiveDiagram` stage 01 is named 'Land' with the service 'Value Discovery'
        — which IS the offer the next section was selling. The page told one
        story twice, across two headings and a section boundary.

        ORDER INSIDE THE SECTION IS DELIBERATE: price first, diagram second. The
        card is the reader's action; the diagram is the context that makes stage
        01 legible. Meeting "Value Discovery" in the rail AFTER the priced card is
        recognition. Before it, it is an introduction the reader has to hold.

        THE BRIDGE SENTENCE IS LOAD-BEARING, not a transition. The compact
        variant never prints the word "LIVE" in visible text — it exists only in
        the list's aria-label — so with the old h2 gone, "See how LIVE works"
        would be a stray proper noun. Delete the sentence and you must restore a
        heading.

        THE /contact CTA WAS REMOVED HERE, not lost. "Book a conversation" was
        word-for-word the hero's primary button and, unlike the hero's, carried
        NO analytics props — so it spent a call to action and reported nothing.
        The conversion paths are the hero, the close below, and the baseline page
        itself, which carries the same button.

        WHAT WENT WITH "Commercial products", and where each survives. Checked by
        opening the file, not by assertion:
         - Engineering diagnostic, Build & launch programme and Managed
           engineering partner all render at /engineering/custom-software-saas
           under "Ways to work with us — Three commercial shapes, chosen around
           the problem".
         - Rescue & Modernise renders at /engineering/modernisation-integration
           under its own "Rescue and modernise — Assessment before further
           investment", in fuller copy than the box had. It ALSO survives on this
           page, in the FAQ below: "Can you take over an existing or stalled
           build?"
         - Three of the four also restated the value cards at the top of this
           page: MANAGED ENGINEERING PARTNER is the RUN card, BUILD & LAUNCH is
           the BUILD card, and Rescue & Modernise is BUILD's "modernisation of
           systems you already run".

        ONE HONEST RESIDUAL, named rather than glossed: the deleted box said "a
        scoped product, AUTOMATION OR MODERNISATION programme with milestones,
        working releases, acceptance criteria and launch". The survivor says "a
        scoped PRODUCT programme" with those attributes. Automation and
        modernisation survive as subjects, not as a programme shape with that
        wording. If that matters the fix is one word on custom-software-saas,
        not a homepage section.
      */}
      <Section labelledBy="process-heading">
        {/*
          "CFO" replaced 2026-09-15 on founder instruction — he does not accept
          that finance always signs off, and the chief exec often does. "Exec
          team" is not new wording: /ai-engineering/value-discovery already
          publishes "Readout to your exec team, and the deck is yours".

          The FRAMING, not just the headline, was finance-led: the body said "the
          business case written for finance" and the card said "Board-ready".
          Both are changed, because swapping the heading alone would leave the
          section addressed to finance underneath a heading that is not.
        */}
        {/*
          REWRITTEN 2026-09-15 on founder instruction, and the price came OUT.
          He asked to merge the offer and the method into one narrative - "this
          is the process that we undertake, but the first step is to really help
          you understand where you are" - and separately ruled that the
          GBP6,000-12,000 figure comes off this site entirely.

          THE HEADLINE HAD TO GO WITH IT. It read "Four weeks. Fixed price. A
          number your exec team can sign off." - built entirely on a number that
          no longer exists. A heading is not a factual claim, so new wording is
          allowed here; it asserts no figure, no duration and no outcome.

          THE CARD SURVIVES, RE-PURPOSED FROM A PRICE CARD INTO A STAGE CARD.
          The mono slot that held the product name now reads STAGE ONE, and the
          26px slot that held the figure now holds the name. So it no longer
          says "here is a thing to buy" beside a diagram; it says "here is the
          first box in the diagram below", and the reader meets Value Discovery
          again seconds later in the rail under LAND. Deleting the card instead
          would leave a lone paragraph beside an empty column and remove the only
          concrete content in the section.

          "Our AI work", NOT "every engagement". This page also sells fixed-scope
          software builds, which do not run LIVE. The broader claim would be
          false on this page.

          LIVE is named in visible prose in the first paragraph deliberately: the
          compact diagram prints the word only in the list's aria-label, so
          without it the "See how LIVE works" link refers to nothing on screen.

          The line he quoted back - "If the numbers do not support going further,
          we tell you that" - is now its own paragraph rather than the tail of a
          sentence, which is the weight he clearly attaches to it.
        */}
        <SectionHead
          eyebrow="How we work"
          id="process-heading"
          title="First we find out where you are, then we agree what is worth doing"
        />
        <div className="grid grid-2" style={{ marginTop: 34, gap: 40, alignItems: 'start' }}>
          <div>
            <p className="body">
              Our AI work runs the same four stages every time: land, integrate, verify, evolve. We
              call it LIVE, and it always starts in the same place.
            </p>
            <p className="body" style={{ marginTop: 20 }}>
              Value Discovery is that first stage. We review the processes you already run,
              instrument two or three of them, and measure what they actually cost you today. You
              get a clear picture of where you are, a costed roadmap of what the next steps would
              be, and a readout to your exec team with the deck included.
            </p>
            <p className="body" style={{ marginTop: 20 }}>
              If the numbers do not support going further, we tell you that.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/value-discovery">See what is included</Cta>
            </div>
          </div>
          <div className="card" style={{ padding: 28 }}>
            <span className="mono" style={{ fontSize: 12.5, letterSpacing: '0.1em', color: 'var(--ink)' }}>
              STAGE ONE
            </span>
            <h3 className="h4" style={{ marginTop: 10, fontSize: 22 }}>
              Value Discovery
            </h3>
            <p className="small" style={{ marginTop: 4 }}>Four weeks, start to readout.</p>
            <ul className="small" style={{ marginTop: 18, paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
              <li>Two to three processes instrumented and measured</li>
              <li>Measurement left running, and yours to keep</li>
              <li>Prioritised opportunity map with a costed roadmap</li>
              <li>Business case naming the budget line it displaces</li>
            </ul>
          </div>
        </div>

        <p className="body" style={{ marginTop: 48, maxWidth: '72ch' }}>
          The whole process, and the service that delivers each stage.
        </p>
        <div style={{ marginTop: 24 }}>
          <LiveDiagram variant="compact" />
        </div>
        <p style={{ marginTop: 26 }}>
          <FLink href="/method/live">See how LIVE works</FLink>
        </p>
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
      {/*
        GOVERNANCE COMPRESSED 2026-09-14, on the external audit, by switching to
        a variant this component already had rather than writing new copy.

        The full variant rendered the long Certified paragraph, a support-areas
        disclaimer and five standard chips — near-verbatim with the /assurance
        hero and the governance block on /security-and-data, so the same
        paragraph ran three times across the site with the homepage getting the
        longest version of it.

        `variant="compact"` is what /engineering, /ai-engineering and /blockchain
        already render. Using it here means the homepage is no longer the odd one
        out, and no fourth wording of this handoff enters the codebase.

        WHY THE BLOCK STAYS AT ALL. The separation between building a system and
        assuring it is a genuine differentiator and survives review better than
        most claims on this site — it is the reason /certifications can say
        plainly that this company does not hold ISO/IEC 42001. It needs one
        strong statement here, not the full paragraph for a third time.

        The five standard chips go with the full variant, and that is a gain
        rather than a loss: they put ISO 42001 and Cyber Essentials on the
        homepage as bare pills, which is the presentation `claims.ts` singles out
        as highest risk and the same construction removed from
        /ai-engineering/services earlier today.
      */}
      <CertifiedHandoff variant="compact" />

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
            <Eyebrow>The next step</Eyebrow>
            <h2 className="h2" id="close-heading" style={{ marginTop: 18 }}>
              If you know the problem, we can help you engineer the fix
            </h2>
            <p className="body" style={{ marginTop: 20 }}>
              You may already be able to name the problem precisely. The harder part is usually
              which route actually resolves it, what it depends on and what has to happen first.
              That is what this conversation is for. We work through the options with you, say which
              one we would start with and why, and agree what evidence would show it had worked.
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
                Send us the details
              </Cta>
            </div>
            <p className="small" style={{ marginTop: 20 }}>
              No specification required. Being clear on the problem is enough to start. If a brief,
              requirements document, process map or architecture note already exists, say so and we
              will ask for it when we reply.
            </p>
            <p className="src" style={{ marginTop: 18 }}>
              No obligation. If the honest answer is that you should not build this yet, we will
              say so.
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
          eyebrow="FAQs"
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
