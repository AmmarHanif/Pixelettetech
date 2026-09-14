import Link from 'next/link';

import { ArrowUpRight } from '@/components/Icons';
import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, JsonLd, Section, SectionHead } from '@/components/ui';
import { certified } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI engineering services',
  description:
    'Five services from the engineers who build the rest of your system: Value Baseline, Data & Integration, Production AI, Evaluation, and Support & Run.',
  path: '/ai-engineering/services',
});

const primary = [
  {
    n: '04',
    title: 'Support & Run',
    href: '/ai-engineering/support-and-run',
    body: 'Continuous evaluation against acceptance thresholds, drift and regression detection, incident response with defined severities, model and prompt version control, inference cost management, and a quarterly improvement cycle.',
    meta: ['Monthly retainer', 'From £1,500 / month', 'Extends an existing build'],
    linkLabel: 'The run contract',
  },
];

const secondary = [
  {
    n: '01',
    title: 'AI Value Baseline',
    href: '/ai-engineering/ai-value-baseline',
    body: 'The entry point. Four weeks, fixed price, published. Instrument the process, measure it, write the case.',
    meta: '£6,000 to £12,000',
  },
  {
    n: '02',
    title: 'Data & Integration',
    href: '/ai-engineering/data-and-integration',
    body: 'The enabling layer named as the top barrier by KPMG, Deloitte and the UK government alike. Access, entitlements, context, observability.',
    meta: 'Fixed-scope phases',
  },
  {
    n: '03',
    title: 'Production AI Systems',
    href: '/ai-engineering/production-ai-systems',
    body: 'The build, with the workflow redesigned around it. Agentic patterns only where the task genuinely needs planning and tool use.',
    meta: 'Outcome-linked where evidenced',
  },
  {
    n: '05',
    title: 'Evaluation & Observability',
    href: '/ai-engineering/evaluation-and-observability',
    body: 'Test sets, regression checks and monitoring, so output quality moving is something you detect rather than something your users report.',
    meta: 'Built into every engagement',
  },
];

const stack = [
  { label: 'Python', body: 'PyTorch, LangGraph, FastAPI' },
  { label: 'TypeScript', body: 'Next.js, Node, React' },
  { label: 'Cloud', body: 'AWS, Azure, GCP, Kubernetes' },
  { label: 'Distributed', body: 'Cryptographic and high-assurance systems since 2018' },
];

export default function AiServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
          { name: 'Services', path: '/ai-engineering/services' },
        ])}
      />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>AI engineering</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Measure it, make it reachable, build it, then keep it working
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            {/* "Five", not the board's "Four". The board numbers only 01-04 and
                omits Evaluation & Observability, but its own later copy says
                "the five services above" and "which of the five you need", and
                boards 04 and 20 both say "Five things we do". Five is correct
                and is what the build ships. */}
            Five services delivered by the same engineers who build the rest of your system, and one
            thing we deliberately do not do. Governance and assurance readiness are a separate
            discipline and sit with {certified.name}. If you are here for a conventional build
            instead, that lives under Engineering.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            <Cta href="/engineering" variant="secondary">
              Engineering
            </Cta>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- the five */}
      <Section labelledBy="services-heading">
        <h2 className="visually-hidden-heading" id="services-heading">
          AI engineering services
        </h2>

        <div className="grid grid-2">
          {primary.map(s => (
            <Link key={s.href} href={s.href} className="card service-card">
              <span className="step__n">{s.n}</span>
              <h3 className="h3">{s.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {s.body}
              </p>
              <div style={{ flexGrow: 1 }} />
              <div className="pill-row" style={{ marginTop: 22 }}>
                {s.meta.map(m => (
                  <span className="pill" key={m}>
                    {m}
                  </span>
                ))}
              </div>
              <p className="flink" style={{ marginTop: 16, color: 'var(--brand)' }}>
                {s.linkLabel} →
              </p>
            </Link>
          ))}

          {/* The service we route away. Kept the same visual weight as the
              others because it is a genuine part of the offer, not a footnote. */}
          <div className="dark-panel" style={{ padding: '30px 32px', display: 'flex', flexDirection: 'column' }}>
            <span className="step__n" style={{ color: 'var(--mint)' }}>
              Not us · {certified.name}
            </span>
            <h3 className="h3" style={{ color: 'var(--dark-head)' }}>
              AI Assurance & Governance
            </h3>
            {/*
              Was: "... Delivered by Pixelette Certified, a separate practice in
              the same group, with its own lead auditors."

              "Its own lead auditors" is a named certified-practice status, and
              the handoff's ACCREDITATION-SAFE RULE forbids it until the exact
              legal entity and status are verified (claims.ts
              `certified-cross-sell`). What remains is what the section 12 copy
              actually permits: scoping the requirement, coordinating
              appropriately credentialed specialists, and supporting the route
              to independent assessment. The card keeps its job — routing this
              work away from us — without borrowing a credential to do it.

              The ISO/IEC 42001 and ISO 27001 references here describe the
              READER's management system and the standard the work is built to,
              not a certificate any Pixelette company holds.
            */}
            <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>
              An AI management system built to ISO/IEC 42001 as an extension of the ISO 27001 you
              already hold: policy, risk methodology, system inventory, impact assessments, human
              oversight, incident response and a Statement of Applicability. Scoped by{' '}
              {certified.name}, a separate practice in the same group, which coordinates
              appropriately credentialed specialists and supports the route to independent
              assessment.
            </p>
            <div style={{ flexGrow: 1 }} />
            {/*
              THE BARE "ISO 42001" PILL WAS REMOVED 2026-09-14, and the paragraph
              above is why it could not stay.

              That paragraph is careful and correct: it says in terms that the
              ISO/IEC 42001 reference describes the READER's management system,
              not a certificate any Pixelette company holds. A pill carries none
              of that. It is a standard number on a coloured chip, and
              `company.ts:313-340` keeps the certification register deliberately
              empty because a pill is the one presentation that register singles
              out as the highest risk — it reads as a credential at a glance and
              has nowhere to put a qualifier.

              It also hardcoded past the register entirely, which is the thing the
              register exists to prevent. And /certifications states plainly that
              Pixelette Technologies Ltd does NOT hold ISO/IEC 42001 — an answer
              that, until the same commit removed this pill, lived only in
              structured data and was never shown to a human. A reader met the
              chip and never met the denial.

              The two remaining pills still do the card's job, which is routing
              this work to a separate practice. The standard is named precisely,
              once, in prose that can hold the qualifier it needs.
            */}
            <div className="pill-row" style={{ marginTop: 22 }}>
              {['AI governance', 'Separate engagement'].map(m => (
                <span className="pill" key={m} style={{ borderColor: '#1C4744', color: '#ffffff' }}>
                  {m}
                </span>
              ))}
            </div>
            <p style={{ marginTop: 16 }}>
              <a
                href={certified.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--mint)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                pixelettecertified.com
                <ArrowUpRight size={13} />
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginTop: 18 }}>
          {secondary.map(s => (
            <Link key={s.href} href={s.href} className="card service-card">
              <span className="step__n">{s.n}</span>
              <h3 className="h4">{s.title}</h3>
              <p className="body" style={{ marginTop: 10, fontSize: 14.5 }}>
                {s.body}
              </p>
              <div style={{ flexGrow: 1 }} />
              <p className="small" style={{ marginTop: 16, color: 'var(--brand)', fontWeight: 500 }}>
                {s.meta}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ other half */}
      <Section labelledBy="other-half-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The other half of the business"
              id="other-half-heading"
              title="Software engineering is a door of its own, not a footnote"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Web platforms, mobile applications, custom software and integration are still the larger
              part of what we deliver, and they have their own page, their own commercial models and
              their own proof.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              The AI practice grew out of that work. It is also what makes the five services above
              deliverable rather than theoretical.
            </p>
            <div style={{ marginTop: 28 }}>
              <Cta href="/engineering" variant="secondary">
                Go to Engineering
              </Cta>
            </div>
          </div>

          <div className="grid" style={{ gap: 12 }}>
            {stack.map(item => (
              <div className="tile" key={item.label}>
                <b style={{ fontSize: 15, fontFamily: 'var(--sans)' }}>{item.label}</b>
                <span>{item.body}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <ClosingCta title="Not sure which of the five you need?">
        Most clients start with the baseline, because it tells you which of the other four is worth
        paying for.
      </ClosingCta>
    </>
  );
}
