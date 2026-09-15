import { LiveDiagram } from '@/components/LiveDiagram';
import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, Faqs, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'LIVE, our AI delivery method',
  description:
    'How we take AI from a pilot deck to an operation you can leave running. Four stages, each with a defined deliverable and a defined commercial model.',
  path: '/method/live',
});

const stages = [
  {
    stage: 'Land',
    doing: 'Instrument two or three processes and measure the real current-state numbers',
    getting: 'Baseline, opportunity map, costed roadmap, CFO-grade business case',
    commercial: 'Quoted before we start',
  },
  {
    stage: 'Integrate',
    doing: 'Make the data reachable, permissioned and observable',
    getting: 'Integration architecture, entitlement model, context layer, evaluation harness',
    commercial: 'Fixed-scope phases',
  },
  {
    stage: 'Verify',
    doing: 'Build the system, redesign the workflow around it, prove it against thresholds',
    getting: 'The production system, evaluation suite, escalation design, runbook',
    commercial: 'Outcome-linked where the baseline supports it',
  },
  {
    stage: 'Evolve',
    doing: 'Run it, watch it, cost it, improve it',
    getting:
      'Monthly operating report with the delta, quarterly improvement release, annual model review',
    commercial: 'Retainer plus usage',
  },
];

const faqs = [
  {
    q: 'What does LIVE stand for?',
    a: 'Land, integrate, verify, evolve. Land measures the current state and produces the business case. Integrate makes the data reachable, permissioned and observable. Verify builds the system and proves it against agreed thresholds. Evolve runs it, watches it, costs it and improves it under a monthly contract.',
  },
  {
    q: 'Why does every engagement have to start with a measured baseline?',
    a: 'Because you cannot price an outcome nobody has counted. Of 979 generative and agentic use cases analysed in 2026, generic productivity cases ran 54% in proof of concept against 19% in production, while narrow process-performance cases ran 8% in proof of concept against 27% in production — the healthiest ratio in the dataset (HFS Research, May 2026). Engagements that start vaguely do not finish.',
  },
];

export default function LivePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'The method', path: '/method/live' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>The method</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, fontSize: 'clamp(48px, 7vw, 84px)' }}>
            LIVE
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Land, integrate, verify, evolve. The system we use to take AI from a pilot deck into an
            operation you can leave running, and the reason our clients stop buying projects and start
            buying outcomes.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            <Cta href="/case-studies" variant="secondary">
              See it applied
            </Cta>
          </div>
          <div style={{ marginTop: 52 }}>
            <LiveDiagram />
          </div>
        </div>
      </div>

      {/* ------------------------------------------------- stage-by-stage */}
      <Section labelledBy="stages-heading">
        <SectionHead title="What you get at each stage" id="stages-heading" />
        <div className="table-scroll" style={{ marginTop: 34 }}>
          <table>
            <thead>
              <tr>
                <th scope="col">Stage</th>
                <th scope="col">What we do</th>
                <th scope="col">What you get</th>
                <th scope="col">Commercial</th>
              </tr>
            </thead>
            <tbody>
              {stages.map(s => (
                <tr key={s.stage}>
                  <th
                    scope="row"
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 12,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--brand)',
                      borderBottom: '1px solid var(--line)',
                      padding: '14px 16px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.stage}
                  </th>
                  <td>{s.doing}</td>
                  <td>{s.getting}</td>
                  <td className="small">{s.commercial}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------------------------------------------------- why */}
      <Section labelledBy="why-live-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <SectionHead
            eyebrow="Why it is built this way"
            id="why-live-heading"
            title="Generic productivity pilots almost never reach production"
          />
          <div>
            <p className="body">
              Of 979 generative and agentic use cases analysed in 2026, generic productivity cases ran{' '}
              <b>54% in proof of concept against 19% in production</b>. Narrow process-performance
              cases ran <b>8% in proof of concept against 27% in production</b>, the healthiest ratio
              in the dataset.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              LIVE is built around that finding. We will not start an engagement without a named
              process and a number attached to it, because the evidence says the ones that start
              vaguely do not finish.
            </p>
            <SourceNote>HFS Research, May 2026, n=979 use cases</SourceNote>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Start at LAND">
        Every LIVE engagement begins with a measured baseline, because you cannot price an outcome you
        have never counted.
      </ClosingCta>
    </>
  );
}
