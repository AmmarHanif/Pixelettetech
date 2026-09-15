
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

        {/*
          MERGED 2026-09-15 on founder instruction. "The gap" and a separate
          "Differentiation" section are now one block, and the turn between them
          is the blockquote rather than a section boundary.

          WHY. They were always a matched pair - this states the problem, that
          answered it - but they were spending a section boundary, a second h2
          and 192px of padding on the turn. Measured before the merge: 97 words
          and 543px here, 174 words and 945px there, so 271 words of argument
          before the reader saw a single piece of work, on a page an external
          audit measured at 18.6 viewport screens against a 6.7-14.5 comparator.

          THE STATS AND THE CITATION ARE THE REASON THIS SECTION EXISTS, and
          they survive the merge untouched. They are the ONLY third-party
          evidence on the whole homepage - one SourceNote on the page. They were
          added 2026-09-14 to close an audit finding that the front page carried
          no citation of any kind while the rest of the site cites McKinsey,
          DORA, METR, HFS, G2, Thomson Reuters and the Bank of England. The
          client row and a verified-proof block have since been removed on
          founder instruction, so the page has LESS proof than when that finding
          was written. Do not move them below the blockquote, do not paraphrase
          the attribution, and do not read `gapStats` by index if that array ever
          becomes filterable.

          The second h2 went, not the idea it carried. "AI is stronger when there
          is engineering underneath it" says what the blockquote below says, and
          the blockquote says it harder - the handoff flags that line "KEEP THIS
          IDEA FROM THE CURRENT SITE". Full width at 21px serif it now carries
          more weight than it did inside a half-width column.

          The origin paragraph went: "Pixelette Technologies began with difficult
          engineering problems...". The SENTENCE was homepage-only; the ARGUMENT
          was not. /about's hero already carries it dated and evidenced - "built
          production software since 2018... that operating discipline is why we
          can build AI into a client system and still stand behind it a year
          later". A sentence lost, not a position.
        */}
        <blockquote className="quote" style={{ marginTop: 48 }}>
          “An AI practice with no engineering underneath it is essentially a slide deck.”
        </blockquote>

        <div className="grid grid-4" style={{ marginTop: 44 }}>
          {homepageDifferentiators.map(item => (
            <div key={item.t} className="tile">
              {/* 16px overrides `.tile b`, which is a 26px mono brand numeral
                  for StatTile. Without it these titles render as statistics. */}
              <b style={{ fontSize: 16 }}>{item.t}</b>
              <p className="small" style={{ marginTop: 8 }}>
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════ 03 · Selected work ══════════════════ */}
      {/*
        RESTORED 2026-09-15 on founder instruction, as a compact row rather than
        the three full cards removed earlier the same day. ~32 words against 158.

        POSITION IS LOAD-BEARING. It sits between the argument and the ask. The
        gap section above closes on four differentiator tiles, which are CLAIMS;
        work placed immediately after them is the evidence for the claims just
        read, beside the page's only third-party citation. And it must stay ABOVE
        the priced section, because proof precedes price.

        EVERY STRING GOES THROUGH THE work.ts GATE. `displayKicker` resolves name
        permission by itself: 2Connect is CONFIRMED and renders named, Fusio
        Wallet and Ayni Gold are PENDING and render anonymised kickers in the same
        shape. Nothing here is a literal, and `homepageCaseStudies` throws at
        module load if a slug stops resolving. If 2Connect's permission is ever
        withdrawn, this row re-renders anonymised with no edit and no layout
        change.

        NO MediaSlot, AND THAT IS A RECORDED DECISION RATHER THAN AN OMISSION:
        an intentional typographic card reads as a choice, a bracket reads as a
        gap. It is measured, not stylistic — `publishedImage` returns nothing for
        the two PENDING studies, so a media row would print a placeholder twice
        beside one real screenshot, which reads as broken rather than withheld.
        The /case-studies index does show those brackets; the homepage must not.

        NO FIGURES. `publishedMetrics` returns empty for all three today — every
        figure is HELD — and this row is deliberately too short to carry a
        conditional. Neither accessor is called, because nothing here renders an
        image or a figure; calling one and discarding it would be theatre.

        The kickers are LABELS, not cards, so they are not individually
        clickable: with no title, image or figure there is not enough on a tile
        to choose between three. One link, to the index, where the work is
        presented properly.
      */}
      <Section labelledBy="work-heading" style={{ background: '#F7FAFA' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <SectionHead
            eyebrow="Selected work"
            id="work-heading"
            title="Challenge &rarr; build &rarr; result"
          />
          <FLink href="/case-studies">All work</FLink>
        </div>
        <div className="grid grid-3" style={{ marginTop: 32 }}>
          {homepageCaseStudies.map(cs => (
            <div key={cs.slug} className="tile">
              {/* A <p>, not a <span>: `.tile span` is a 13px muted block written
                  for StatTile's caption and `.tile b` a 26px brand numeral.
                  Either would restyle this label. */}
              <p
                className="mono"
                style={{ fontSize: 12.5, letterSpacing: '0.1em', color: 'var(--ink)', margin: 0 }}
              >
                {displayKicker(cs)}
              </p>
            </div>
          ))}
        </div>
      </Section>


      {/* ═════════════════ 04 · Start here (method + entry offer) ══════ */}
      {/*
        COLLAPSED 2026-09-15 on founder instruction, from three sections to one.
        "The method", "Start here" and "Commercial products" are now this.

        WHY THE METHOD AND THE OFFER MERGED: the proof is inside the diagram.
        `LiveDiagram` stage 01 is named 'Land' with the service 'Value Baseline'
        — which IS the offer the next section was selling. The page told one
        story twice, across two headings and a section boundary.

        ORDER INSIDE THE SECTION IS DELIBERATE: price first, diagram second. The
        card is the reader's action; the diagram is the context that makes stage
        01 legible. Meeting "Value Baseline" in the rail AFTER the priced card is
        recognition. Before it, it is an introduction the reader has to hold.

        THE BRIDGE SENTENCE IS LOAD-BEARING, not a transition. The compact
        variant never prints the word "LIVE" in visible text — it exists only in
        the list's aria-label — so with the old h2 gone, "See how LIVE works"
        would be a stray proper noun. Delete the sentence and you must restore a
        heading.

        THE /contact CTA WAS REMOVED HERE, not lost. "Book a value baseline" was
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
      <Section labelledBy="baseline-heading">
        {/*
          "CFO" replaced 2026-09-15 on founder instruction — he does not accept
          that finance always signs off, and the chief exec often does. "Exec
          team" is not new wording: /ai-engineering/ai-value-baseline already
          publishes "Readout to your exec team, and the deck is yours".

          The FRAMING, not just the headline, was finance-led: the body said "the
          business case written for finance" and the card said "Board-ready".
          Both are changed, because swapping the heading alone would leave the
          section addressed to finance underneath a heading that is not.
        */}
        <SectionHead
          eyebrow="Start here"
          id="baseline-heading"
          title="Four weeks. Fixed price. A number your exec team can sign off."
        />
        <div className="grid grid-2" style={{ marginTop: 34, gap: 40, alignItems: 'start' }}>
          <div>
            <p className="body">
              We instrument two or three of your processes, measure what they actually cost today,
              and hand you a costed roadmap and a readout to your exec team, with the deck included.
              If the numbers do not support going further, we tell you that.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/ai-value-baseline">See what is included</Cta>
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
              {/* Was "Board-ready business case naming what it displaces".
                  "Board-ready" renders nowhere else on this site, and "what it
                  displaces" is the vague form of a published line. This is the
                  baseline page's own inclusions wording, verbatim. */}
              <li>Business case naming the budget line it displaces</li>
            </ul>
          </div>
        </div>

        <p className="body" style={{ marginTop: 48, maxWidth: '72ch' }}>
          The baseline is stage one of LIVE: land, integrate, verify, evolve.
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
