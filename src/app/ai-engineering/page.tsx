import Link from 'next/link';

import { AiMark, BuildMark, Database, Gauge, Measure, TrendChart } from '@/components/Icons';
import {
  CertifiedHandoff,
  ClosingCta,
  Testimonials,
  ValueModelCards,
} from '@/components/sections';
import {
  CheckList,
  Cta,
  Eyebrow,
  FLink,
  Faqs,
  JsonLd,
  MediaSlot,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { gapStats } from '@/content/sources';
import { caseStudies, displayKicker, displayName, publishedImage, publishedMetrics } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';


/*
 * Claims sweep, 2026-09-08 (WP6).
 *
 * Removed from this page: the ISO 9001 and ISO 27001 badge tiles, the Clutch
 * rating tile, the "countries delivered in" tile, and "with its own lead
 * auditors" from the FAQ — which also fed the FAQPage JSON-LD, so the held
 * claim was machine-readable as well as visible. All are HELD in
 * src/content/claims.ts. The Certified wording is now the handoff's own
 * section 12 language: scope, coordinate, and support the route to
 * independent assessment.
 *
 * CLOSED 2026-09-11. What follows is a correction, not a deletion.
 *
 * This paragraph used to read: "Still owed and NOT fixable from this file,
 * confirmed by rendering this page and reading the HTML: `LiveDiagram`
 * (./LiveDiagram.tsx, rendered by the method section below and by
 * /method/live) says 'Certification of it sits with Pixelette Certified' and
 * labels its evidence layer 'certified separately by Pixelette Certified'.
 * Both assert that a Group company issues certificates, which is what the
 * handoff's ACCREDITATION-SAFE RULE forbids until the exact legal entity and
 * status are verified. That file is outside this work package. Raised as a
 * blocking finding."
 *
 * It was true when it was written and it stopped being true on 2026-09-08,
 * when LiveDiagram was fixed in the same sweep. That file now imports
 * `certified` from src/content/company.ts and composes a single string,
 * GOVERNANCE_ROUTE, from `certified.name` and `certified.positioningLine`.
 * Both the compact and the full variant render that one string, so
 * /ai-engineering and /method/live can no longer drift apart, and its own
 * comment block records the old wording and the fix. Neither unsafe sentence
 * survives anywhere in src/ as rendered copy: the only occurrences left are
 * quotations kept deliberately as history — here, in LiveDiagram.tsx, and in
 * the `certified-cross-sell` row of src/content/claims.ts. Re-verified
 * 2026-09-11 by reading both files and by grepping src/ for the two strings.
 * NOTHING IS OWED FROM THIS PARAGRAPH AND NOTHING HERE IS BLOCKING.
 *
 * FOOTNOTE 2026-09-16: this page no longer renders `LiveDiagram` at all. The
 * method section was removed as duplication of the homepage, so the sentence
 * above about /ai-engineering and /method/live being unable to drift apart now
 * concerns only the homepage and /method/live. The quoted paragraph's reference
 * to "the method section below" is a quotation of superseded text and is left
 * as written.
 *
 * Corrected in place rather than quietly removed, because leaving it stale
 * has already cost this project a round: an agent read it, believed it over
 * the file it describes, and re-raised a finding that had been closed for
 * three days. The next reader should meet the history and its closure
 * together, in the place the false claim used to sit. A comment that asserts
 * an open defect is load-bearing; when the defect closes, the comment is a
 * defect of its own.
 *
 * What is still genuinely open is a founder fact rather than a code change,
 * and it lives in claims.ts, not here: `certified-cross-sell` is status
 * 'HELD', and moving it to VERIFIED needs the exact legal entity and status.
 * Nothing on this page asserts it either way, which is the correct state for
 * as long as it is held.
 *
 * `CertifiedHandoff variant="compact"` carried the same defect and was fixed
 * in src/components/sections.tsx while this sweep was running; it now renders
 * `certified.positioningLine` and `certified.blurb`, which are the handoff's
 * section 12 wording. Verified in the rendered output, not assumed.
 */
export const metadata = pageMetadata({
  title: 'AI engineering for UK businesses',
  description:
    'We engineer AI into the software you already run, measure what it changes and keep it working. Start with a four-week Value Discovery.',
  path: '/ai-engineering',
});

const services = [
  {
    tag: 'Run',
    icon: <Gauge size={32} />,
    title: 'Support & Run',
    href: '/ai-engineering/support-and-run',
    linkLabel: 'From £1,500 / month',
    body: 'We keep running what we built, AI components included. Somebody has to own whether it is still working, still affordable and still accurate. Under contract, with a monthly report showing the delta.',
    large: true,
  },
  {
    tag: 'Build',
    icon: <AiMark size={32} />,
    title: 'Production AI Systems',
    href: '/ai-engineering/production-ai-systems',
    linkLabel: 'See how we build',
    body: 'AI embedded in a named workflow, with the workflow redesigned around it. Human-in-the-loop by default, agentic only where it earns it, and reversible when it does not.',
    large: true,
  },
  {
    tag: 'Measure',
    icon: <Measure size={32} />,
    title: 'Value Discovery',
    href: '/ai-engineering/value-discovery',
    linkLabel: 'What the four weeks covers',
    body: 'Four weeks. We instrument the process, measure what it costs today, and write the business case your exec team will approve.',
  },
  {
    tag: 'Ready',
    icon: <Database size={32} />,
    title: 'Data & Integration',
    href: '/ai-engineering/data-and-integration',
    linkLabel: 'What we build',
    body: 'Entitlement-aware access, context layers, MCP integration into your systems of record, and the observability to know it works.',
  },
  {
    tag: 'Prove',
    icon: <TrendChart size={32} />,
    title: 'Evaluation & Observability',
    href: '/ai-engineering/evaluation-and-observability',
    linkLabel: 'How we measure',
    body: 'Test sets, regression checks and monitoring, so you find out that output quality has moved before your users and your regulator do.',
  },
];

const faqs = [
  {
    q: 'Why can so few organisations show a return on AI?',
    a: 'Because the work around the model was never redesigned, the data it needs was never made reachable, and nobody owns whether it still works next quarter. Around 80% of individual AI users report they are more productive, while only 37% of organisations can attribute any EBIT impact to it — a figure unchanged year on year (McKinsey State of AI, August 2026, n=1,719).',
  },
  {
    q: 'What is a Value Discovery?',
    a: 'A four-week engagement. Two or three processes are instrumented and measured, the measurement is left running and is yours to keep, and you receive a prioritised opportunity map, a costed roadmap and a board-ready business case naming the budget line it displaces. If the numbers do not support going further, Pixelette says so in writing.',
  },
  {
    q: 'Who is Pixelette Technologies AI engineering not for?',
    a: 'Organisations looking for developers by the day, a first AI experiment with no budget line behind it, or a supplier who will build something and leave. The typical client is a UK-headquartered business with £100m to £500m revenue, already investing in AI and not yet seeing the return, sponsored by a COO or Head of Transformation, approved by a CFO and reviewed by a CISO.',
  },
  {
    q: 'Does Pixelette Technologies audit or certify the AI it builds?',
    a: 'No, and it does not offer to. Where a programme needs formal governance, certification readiness, privacy or security-assurance support, Pixelette Certified — a separate practice in the same group — can scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment. Independent assurance stays independent: the firm that builds a system is not the firm that assesses it.',
  },
];

/**
 * The attribution line under the gap figures, derived rather than indexed.
 *
 * 2026-09-08 (WP13). This read used to be `gapStats[0]!.source`. The non-null
 * assertion is invisible to `tsc --noEmit` — an empty array type-checks
 * perfectly against it — so the compiler stayed green while the page threw
 * "TypeError: Cannot read properties of undefined (reading 'source')" the
 * moment the register behind it emptied. That is not hypothetical: it is what
 * happened to `runStats` on /ai-engineering/support-and-run this morning, when
 * three figures citing an unnameable publisher were held and the identical
 * `[0]!` read took the page down.
 *
 * Deriving the line removes the index, so there is no assertion left for a
 * future edit to falsify. It also closes a quieter fault: if the two figures
 * ever come from two studies, `[0]` would attribute both to whichever happened
 * to be first. Both rows cite McKinsey today, so the de-duplicated set is one
 * string and the rendered output is unchanged.
 */
function gapSources(): string[] {
  return Array.from(new Set(gapStats.map(stat => stat.source)));
}

export default function AiEngineeringPage() {
  /*
   * LYTICS ONLY since 2026-09-16. The other study here was blockchain work, not
   * AI, and it was standing as the proof on an AI page. Lytics IS AI: a
   * production sentiment-classification system that analysts stopped overriding.
   *
   * The founder's read was that NEITHER belonged. One did, and saying so was
   * the point: cutting both would have stripped this page of its only
   * first-party evidence, which is the mistake the homepage nearly made.
   * Everything else here is third-party research about the market.
   */
  const proof = caseStudies.filter(c => ['lytics'].includes(c.slug));
  const sources = gapSources();

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'AI engineering',
          description:
            'Production AI systems, data and integration, evaluation and observability, and support and run for AI in production.',
          path: '/ai-engineering',
          serviceType: 'Artificial intelligence engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>AI engineering · part of Build</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Most companies have bought AI. Very few are getting paid for it.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We engineer AI into the software UK mid-market businesses already run, measure what it
            changes, and keep it working. Governance around that AI, and the route to independent
            assessment where one is needed, sit with Pixelette Certified, our group practice, not
            with us.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            {/*
              WAS "See what we run", changed 2026-09-16. That promised WHOSE
              systems we run, which is a client list this site is correctly
              forbidden to show, so the label wrote a cheque the destination page
              cannot cash. It also named the destination a third way, alongside
              the nav's "Support & run" and that page's own heading.

              "See a sample report" is not new wording: it is the label already
              published on the destination page's own hero button, pointing at
              the same panel. So the door and the page now use identical words,
              and the reader clicks a phrase and lands on it.

              "Sample" is load-bearing. That panel is a captioned MOCK. A label
              promising "the report" would be the strongest wording on the site
              sitting over its weakest evidence.
            */}
            <Cta href="/ai-engineering/support-and-run" variant="secondary">
              See a sample report
            </Cta>
          </div>

          {/* The four-tile badge row that stood here (ISO 9001, ISO 27001, the
              Clutch rating and a "countries delivered in" tile that rendered
              blank once `company.countriesDelivered` was emptied) is gone: all
              four are HELD in src/content/claims.ts. Nothing replaces it,
              because this hero already runs straight into the client strip and
              then into two sourced figures — the proof below is real, and the
              badges were the weakest thing on the screen. */}
        </div>
      </div>

      {/*
        THE CLIENT ROW WAS REMOVED HERE 2026-09-16, on founder instruction:
        none of those names are AI clients.

        `ClientLogos` renders the WHOLE approved client list, so this page was
        showing seven names because the component exists, not because any of them
        belong to the subject. It rendered NOWHERE ELSE on the site, so nothing
        is lost and no other page changes.
      */}

      {/* ------------------------------------------------------------- gap */}
      <Section labelledBy="gap-heading" style={{ background: '#F7FAFA' }}>
        {/* Two columns while there are figures to put in the right one, a
            single full-width column when there are not. `grid-2` is
            `repeat(2, minmax(0, 1fr))`, so keeping it with one child would
            hold half the section open as empty space beside a squeezed
            paragraph — the broken layout the handoff's DEVELOPER RULE forbids
            when a claim is absent. With today's non-empty register this
            evaluates to exactly the class string it always had. */}
        <div
          className={gapStats.length > 0 ? 'grid grid-2' : 'grid'}
          style={{ gap: 56, alignItems: 'start' }}
        >
          <div>
            <SectionHead
              eyebrow="The gap"
              id="gap-heading"
              title="Your people feel faster. Your P&L does not."
            />
            <p className="body" style={{ marginTop: 20 }}>
              Almost every organisation now has AI somewhere. Very few can point at a line in the
              accounts and say what it changed. The gap is not the model. It is that the work around
              the model was never redesigned, the data it needs was never made reachable, and nobody
              owns whether it still works next quarter.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              <b>That gap is the whole of our business.</b>
            </p>
          </div>

          {/* The cards and their attribution are one unit: the column appears
              whole or not at all. An empty `.grid` here is not a neutral no-op
              — it is a second grid track holding open an empty band beside the
              prose. */}
          {gapStats.length > 0 ? (
            <div className="grid" style={{ gap: 16 }}>
              {gapStats.map(stat => (
                <div className="card" key={stat.value}>
                  <b
                    className="mono"
                    style={{
                      fontSize: 44,
                      fontWeight: 500,
                      color: 'var(--brand)',
                      letterSpacing: '-0.03em',
                      lineHeight: 1,
                      display: 'block',
                    }}
                  >
                    {stat.value}
                  </b>
                  <p className="body" style={{ marginTop: 14, fontSize: 15 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
              {sources.length > 0 ? (
                <SourceNote style={{ marginTop: 0 }}>{sources.join(' · ')}</SourceNote>
              ) : null}
            </div>
          ) : null}
        </div>
      </Section>

      {/* ------------------------------------------------------ what we do */}
      <Section labelledBy="what-heading">
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
            eyebrow="What we do"
            id="what-heading"
            title="Five things we do, and one we deliberately do not"
          />
          <FLink href="/ai-engineering/services">All AI services</FLink>
        </div>

        <div className="grid grid-2" style={{ marginTop: 40 }}>
          {services
            .filter(s => s.large)
            .map(s => (
              <Link key={s.href} href={s.href} className="card service-card">
                <span className="step__n">{s.tag}</span>
                <span className="icon-slot icon-slot--stacked" aria-hidden>
                  {s.icon}
                </span>
                <h3 className="h3">{s.title}</h3>
                <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                  {s.body}
                </p>
                <div style={{ flexGrow: 1 }} />
                <p className="flink" style={{ marginTop: 16, color: 'var(--brand)' }}>
                  {s.linkLabel} →
                </p>
              </Link>
            ))}
        </div>

        <div className="grid grid-3" style={{ marginTop: 18 }}>
          {services
            .filter(s => !s.large)
            .map(s => (
              <Link key={s.href} href={s.href} className="card service-card">
                <span className="step__n">{s.tag}</span>
                <h3 className="h4" style={{ marginTop: 4 }}>
                  {s.title}
                </h3>
                <p className="body" style={{ marginTop: 10, fontSize: 14.5 }}>
                  {s.body}
                </p>
                <div style={{ flexGrow: 1 }} />
                <p className="flink" style={{ marginTop: 14, color: 'var(--brand)', fontSize: 14 }}>
                  {s.linkLabel} →
                </p>
              </Link>
            ))}
        </div>

        {/* Cross-link to the other practice, plus the thing we hand away. */}
        <div className="grid grid-2" style={{ marginTop: 40, alignItems: 'stretch' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'var(--brand)', display: 'inline-flex', marginBottom: 16 }} aria-hidden>
              <BuildMark size={26} />
            </span>
            <h3 className="h3">Came for a build rather than for AI?</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              Web platforms, mobile applications, custom software and integration. The larger half of
              what we do.
            </p>
            <div style={{ flexGrow: 1 }} />
            <p style={{ marginTop: 18 }}>
              <FLink href="/engineering">Go to Engineering</FLink>
            </p>
          </div>
          <CertifiedHandoff variant="compact" />
        </div>
      </Section>

      {/* -------------------------------------------------- where this sits */}
      {/*
        Build • Automate • Decentralise • Run, reintroduced (2026-09-11); see
        the note on /engineering for why the model now reaches the hubs at all.

        It lands immediately after the two cross-link cards above, because those
        cards raise the "where does this sit?" question one destination at a
        time — Engineering, and Certified — and then leave it half answered.
        The four cards answer it completely, and mark Automate as the one the
        reader is already in. Deliberately not tinted: `The method` below is
        tinted and two tinted bands in a row would break the page's rhythm,
        whereas two white sections in sequence is the rhythm this site already
        uses (Proof and the verification table, further down, are both white).
      */}
      <Section labelledBy="ai-model-heading">
        {/*
            NOT the homepage's h2, which this used to repeat verbatim. That line
            is a POSITIONING statement and it is right on the page that
            introduces the company; on a hub the reader has already chosen, so
            they need to know where they are in the set, not what the company is.
            The same string was on all four pages until 2026-09-15.

            The homepage instance is deliberately unchanged.

            PAGE-SPECIFIC SINCE 2026-09-16, deliberately. Until then the h2 read
            "This is one of four services" -- one string on all three hubs, kept
            identical so it could not drift. It bought that too dearly.
            SectionHead renders `title` as the h2 whose id the wrapping Section
            points at, so this string IS the accessible name of the whole
            region, and "This is" has no referent read cold: in a heading list
            it announced a position without saying which one. Naming the
            practice here also lets the lead stop re-answering it, which removes
            one of the three places this section stated the reader's position
            (h2, lead, card marker). Two remain and both earn it.

            "our" is not decoration. `groupBlurb` renders in the footer of this
            very page and says "Pixelette Technologies is one of four companies
            in Pixelette Group", so an unqualified "one of four" would appear
            twice on one page against two different sets of four.

            The h2 and `current` below must always name the same practice.
            Nothing enforces that. Change one, change the other.
        */}
        <SectionHead
          eyebrow="Where this sits"
          id="ai-model-heading"
          title="Automate is one of our four services"
          lead="Build, Decentralise and Run are the other three."
        />
        <div style={{ marginTop: 36 }}>
          <ValueModelCards current="AUTOMATE" />
        </div>
      </Section>

      {/*
        THE LIVE SECTION WAS REMOVED HERE 2026-09-16, on founder instruction and
        a standing one: "I ask for duplication to be removed from any of the
        pages of the Pixelette Technologies website."

        `LiveDiagram variant="compact"` was rendering identically on the homepage
        and here, and the full variant has its own page at /method/live. Three
        renders of one diagram, two of them the same. The homepage tells the
        story for a first-time visitor and /method/live owns it in full, so this
        instance was the one with no distinct job.

        A reader on this page still reaches the method: the "Start here" section
        at the foot names LIVE in prose and links to /method/live.
      */}

      {/* ----------------------------------------------------------- proof */}
      <Section labelledBy="proof-heading">
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
            eyebrow="Proof"
            id="proof-heading"
            title="Named clients. Named processes. No invented numbers."
          />
          <FLink href="/case-studies">Read the full case studies</FLink>
        </div>

        {/* Through the work.ts publication gate. The client name, the kicker,
            the client's own screenshot and the figures all resolve through the
            accessors, so a PENDING study dropped into `proof` above renders
            anonymised instead of leaking a name and a logo-bearing image. */}
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {proof.map(cs => {
            const metrics = publishedMetrics(cs).slice(0, 2);
            return (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
                <MediaSlot
                  label={cs.imageLabel}
                  src={publishedImage(cs)}
                  alt={`${displayName(cs)} — ${cs.title}`}
                />
                {/* Internal work is labelled "Internal" here, as the board has
                    it. Falling back to the sector would quietly drop the
                    disclosure the design put on this card on purpose, so the
                    internal branch is kept and only the name goes through the
                    gate. */}
                <span className="mono work-card__kicker">
                  {cs.internal ? `${displayName(cs)} · Internal` : displayKicker(cs)}
                </span>
                <h3 className="h4" style={{ marginTop: 10 }}>
                  {cs.title}
                </h3>
                {metrics.length > 0 ? (
                  <div className="work-card__metrics">
                    {metrics.map(m => (
                      <span key={m.label}>
                        <b
                          className={m.pending ? 'ph' : undefined}
                          style={m.pending ? { fontSize: 17 } : undefined}
                        >
                          {m.value}
                        </b>
                        <span>{m.shortLabel ?? m.label}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </Section>

      {/*
        THE VERIFICATION TABLE WAS REMOVED HERE 2026-09-16, on founder
        instruction. He asked what it was doing on an AI page and the honest
        answer is nothing.

        It headed "Every claim on this page resolves to a link" and then showed
        ISO 9001 and ISO 27001 certificates. Those are COMPANY-WIDE
        certifications, not AI credentials, and they are already published on
        /certifications and /security-and-data, which own them. The
        security-review statistic above them is a claim about enterprise BUYING
        PROCESS, not about AI.

        Nothing is lost: the table renders on the two pages whose subject it is.
      */}

      {/* ------------------------------------------------- who we work with */}
      <Section labelledBy="who-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Who we work with"
          id="who-heading"
          title="Two sectors, one profile, and an honest note on who this is not for"
        />

        <div className="grid grid-3" style={{ marginTop: 40 }}>
          <div className="card">
            <h3 className="h4">Professional & business services</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              Your clients now expect AI-enabled quality improvement. 78% say it matters. 7% say they
              are getting it. We close that gap and give you the evidence to show it.
            </p>
            <SourceNote>Thomson Reuters Future of Professionals 2026</SourceNote>
            <p style={{ marginTop: 14 }}>
              <FLink href="/industries/professional-services">Sector work</FLink>
            </p>
          </div>

          <div className="card">
            <h3 className="h4">Insurance & specialist financial services</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              Nearly half of regulated firms report only partial understanding of the AI systems they
              already run. We make them explainable, monitored and defensible.
            </p>
            <SourceNote>Bank of England / FCA AI survey</SourceNote>
            <p style={{ marginTop: 14 }}>
              <FLink href="/industries/insurance-financial-services">Sector work</FLink>
            </p>
          </div>

          <div className="card" style={{ background: '#FBF8F4', borderColor: '#edd8de' }}>
            <h3 className="h4">Who this is not for</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              Organisations looking for developers by the day, a first AI experiment with no budget
              line behind it, or a supplier who will build something and leave. We sell the running of
              it, and that only works when someone owns the outcome.
            </p>
          </div>
        </div>

        <p className="small" style={{ marginTop: 30, maxWidth: '80ch' }}>
          Typical client: £100m to £500m revenue, UK-headquartered, already investing in AI and not
          yet seeing the return. Sponsored by a COO or Head of Transformation, approved by a CFO,
          reviewed by a CISO.
        </p>
      </Section>

      <Testimonials heading="Voices" />

      {/* ------------------------------------------------------------ close */}
      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta
        eyebrow="Start here"
        title="First we find out where you are, then we agree what is worth doing"
        aside={
          <div className="card">
            <Eyebrow>What it includes</Eyebrow>
            <h3 className="h3" style={{ marginTop: 16 }}>
              Value Discovery
            </h3>
            <p className="small" style={{ marginTop: 14 }}>Four weeks, start to readout.</p>
            <div style={{ marginTop: 22 }}>
              <CheckList
                items={[
                  'Two to three processes instrumented and measured',
                  'Measurement left running, and yours to keep',
                  'Prioritised opportunity map with a costed roadmap',
                  'Board-ready business case naming what it displaces',
                ]}
              />
            </div>
            <hr className="rule" style={{ margin: '24px 0 18px' }} />
            <p className="small">Four weeks · No procurement cycle required</p>
          </div>
        }
      >
        We instrument two or three of your processes, measure what they actually cost today, and hand
        you a costed roadmap with the business case written for your exec team. If the numbers do not support
        going further, we tell you that.
      </ClosingCta>
    </>
  );
}
