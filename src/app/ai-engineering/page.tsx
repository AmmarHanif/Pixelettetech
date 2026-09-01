import Link from 'next/link';

import { BuildMark, Cpu, Database, Gauge, Layers } from '@/components/Icons';
import {
  CertifiedHandoff,
  ClientLogos,
  ClosingCta,
  Testimonials,
  VerificationTable,
} from '@/components/sections';
import {
  CheckList,
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  MediaSlot,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
  StatTile,
} from '@/components/ui';
import { clutch, company } from '@/content/company';
import { gapStats } from '@/content/sources';
import { caseStudies } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

import { LiveDiagram } from './LiveDiagram';

export const metadata = pageMetadata({
  title: 'AI engineering for UK businesses',
  description:
    'We engineer AI into the software you already run, measure what it changes and keep it working. Start with a four-week AI Value Baseline, £6,000 to £12,000.',
  path: '/ai-engineering',
});

const services = [
  {
    tag: 'Run',
    icon: <Gauge size={24} />,
    title: 'Support & Run',
    href: '/ai-engineering/support-and-run',
    linkLabel: 'From £1,500 / month',
    body: 'We keep running what we built, AI components included. Somebody has to own whether it is still working, still affordable and still accurate. Under contract, with a monthly report showing the delta.',
    large: true,
  },
  {
    tag: 'Build',
    icon: <Cpu size={24} />,
    title: 'Production AI Systems',
    href: '/ai-engineering/production-ai-systems',
    linkLabel: 'See how we build',
    body: 'AI embedded in a named workflow, with the workflow redesigned around it. Human-in-the-loop by default, agentic only where it earns it, and reversible when it does not.',
    large: true,
  },
  {
    tag: 'Measure',
    icon: <Layers size={22} />,
    title: 'AI Value Baseline',
    href: '/ai-engineering/ai-value-baseline',
    linkLabel: 'Four weeks, fixed price',
    body: 'Four weeks, fixed price. We instrument the process, measure what it costs today, and write the business case your CFO will approve.',
  },
  {
    tag: 'Ready',
    icon: <Database size={22} />,
    title: 'Data & Integration',
    href: '/ai-engineering/data-and-integration',
    linkLabel: 'What we build',
    body: 'Entitlement-aware access, context layers, MCP integration into your systems of record, and the observability to know it works.',
  },
  {
    tag: 'Prove',
    icon: <Gauge size={22} />,
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
    q: 'What is an AI Value Baseline?',
    a: 'A four-week, fixed-price engagement costing £6,000 to £12,000. Two or three processes are instrumented and measured, the measurement is left running and is yours to keep, and you receive a prioritised opportunity map, a costed roadmap and a board-ready business case naming the budget line it displaces. If the numbers do not support going further, Pixelette says so in writing.',
  },
  {
    q: 'Who is Pixelette Technologies AI engineering not for?',
    a: 'Organisations looking for developers by the day, a first AI experiment with no budget line behind it, or a supplier who will build something and leave. The typical client is a UK-headquartered business with £100m to £500m revenue, already investing in AI and not yet seeing the return, sponsored by a COO or Head of Transformation, approved by a CFO and reviewed by a CISO.',
  },
  {
    q: 'Does Pixelette Technologies audit or certify the AI it builds?',
    a: 'No. ISO/IEC 42001, AI governance, security review and audit are delivered by Pixelette Certified, a separate practice in the same group with its own lead auditors. Pixelette Technologies will not sell you an audit of its own build.',
  },
];

export default function AiEngineeringPage() {
  const proof = caseStudies.filter(c =>
    [
      'lytics-real-time-ad-detection',
      'blockguard-asset-tokenisation',
      'pixelette-group-bid-cycle',
    ].includes(c.slug),
  );

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
            changes, and keep it working. Certification and governance of that AI sit with Pixelette
            Certified, our group practice, not with us.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            <Cta href="/ai-engineering/support-and-run" variant="secondary">
              See what we run
            </Cta>
          </div>

          <div className="grid grid-4" style={{ marginTop: 48 }}>
            <StatTile value="ISO 9001" label="Certified · verify on the IAF registry" />
            {/* See ADR-0012: certificates are not published on the site. */}
            <StatTile value="ISO 27001" label="Certified · verifiable on the register" />
            <StatTile
              value={String(clutch.ratingValue)}
              label={`Clutch rating across ${clutch.reviewCount} verified reviews`}
            />
            <StatTile
              value={String(company.countriesDelivered)}
              label={`Countries delivered in since ${company.incorporated}`}
            />
          </div>
        </div>
      </div>

      <ClientLogos heading="Clients" tight />

      {/* ------------------------------------------------------------- gap */}
      <Section labelledBy="gap-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
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
            <SourceNote style={{ marginTop: 0 }}>{gapStats[0]!.source}</SourceNote>
          </div>
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
            title="Five things we do, and one we deliberately do not."
          />
          <FLink href="/ai-engineering/services">All AI services</FLink>
        </div>

        <div className="grid grid-2" style={{ marginTop: 40 }}>
          {services
            .filter(s => s.large)
            .map(s => (
              <Link key={s.href} href={s.href} className="card service-card">
                <span className="step__n">{s.tag}</span>
                <span style={{ color: 'var(--brand)', display: 'inline-flex', margin: '4px 0 14px' }} aria-hidden>
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

      {/* ---------------------------------------------------------- method */}
      <Section labelledBy="method-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="The method"
          id="method-heading"
          title="LIVE: land, integrate, verify, evolve."
        />
        <div style={{ marginTop: 40 }}>
          {/* Board 04 carries the compact variant: stages mapped to the service
              that delivers each, on a pilot-to-production rail. */}
          <LiveDiagram variant="compact" />
        </div>
        <div style={{ marginTop: 34 }}>
          <Cta href="/method/live" variant="secondary">
            See how LIVE works
          </Cta>
        </div>
      </Section>

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
            title="Named clients. Named processes. Measured results."
          />
          <FLink href="/case-studies">All work</FLink>
        </div>

        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {proof.map(cs => (
            <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
              <MediaSlot label={cs.imageLabel} src={cs.image} alt={`${cs.client} — ${cs.title}`} />
              {/* Internal work is labelled "Internal" here, as the board has it.
                  Falling back to the sector would quietly drop the disclosure
                  the design put on this card on purpose. */}
              <span className="mono work-card__kicker">
                {cs.client} · {cs.internal ? 'Internal' : cs.sector}
              </span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                {cs.title}
              </h3>
              <div className="work-card__metrics">
                {cs.metrics.slice(0, 2).map(m => (
                  <span key={m.label}>
                    <b className={m.pending ? 'ph' : undefined} style={m.pending ? { fontSize: 17 } : undefined}>
                      {m.value}
                    </b>
                    <span>{m.shortLabel ?? m.label}</span>
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- verification */}
      <Section labelledBy="verify-heading">
        <VerificationTable />
      </Section>

      {/* ------------------------------------------------- who we work with */}
      <Section labelledBy="who-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Who we work with"
          id="who-heading"
          title="Two sectors, one profile, and an honest note on who this is not for."
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

          <div className="card" style={{ background: '#FBF8F4', borderColor: '#E7DCC6' }}>
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
      <ClosingCta
        eyebrow="Start here"
        title="Four weeks. Fixed price. A number your CFO can sign off."
        aside={
          <div className="card">
            <Eyebrow>What it includes</Eyebrow>
            <h3 className="h3" style={{ marginTop: 16 }}>
              AI Value Baseline
            </h3>
            <p style={{ marginTop: 14 }}>
              <b
                className="mono"
                style={{ fontSize: 34, color: 'var(--brand)', fontWeight: 500, letterSpacing: '-0.02em' }}
              >
                £6,000
              </b>
              <span className="small" style={{ marginLeft: 8 }}>
                to £12,000, fixed
              </span>
            </p>
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
        you a costed roadmap with the business case written for finance. If the numbers do not support
        going further, we tell you that.
      </ClosingCta>
    </>
  );
}
