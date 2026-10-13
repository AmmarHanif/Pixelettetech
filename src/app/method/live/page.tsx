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
    /*
     * CLARIFIED 2026-10-13 on the founder's discovery-positioning brief. LAND
     * used to read as the instrumented Value Discovery programme itself
     * ("Instrument two or three processes..."), implying every client buys a
     * discovery project before engineering can begin. LAND is the
     * understand-and-measure stage: it may draw on existing requirements, a
     * baseline agreed within the project, focused technical scoping, or a
     * separately commissioned instrumented Value Discovery where justified.
     */
    stage: 'Land',
    doing:
      'Establish the requirement, the evidence available and what success should look like — proportionate to the project',
    getting:
      'An agreed baseline and definition of success; where justified, a measured current state, opportunity map, costed roadmap and business case',
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
    /*
     * "Optional" added 2026-09-23 on founder instruction. This column asserted a
     * retainer as the commercial model of the final stage, which reads as the
     * default ending of every engagement rather than a choice.
     */
    commercial: 'Optional, retainer plus usage',
  },
];

const faqs = [
  {
    q: 'What does LIVE stand for?',
    a: 'Land, integrate, verify, evolve. Land measures the current state and produces the business case. Integrate makes the data reachable, permissioned and observable. Verify builds the system and proves it against agreed thresholds. Evolve runs it, watches it, costs it and improves it, optionally, if you want us to stay involved after delivery.',
  },
  {
    /*
     * REWORDED 2026-10-13 on the founder's discovery-positioning brief. The
     * question used to read "Why does every engagement have to start with a
     * measured baseline?", which presumes a compulsory discovery purchase.
     * The retained principle — measurable performance before outcome
     * commitments — is stated for outcome-linked work, and the answer names
     * the proportionate forms LAND can take.
     */
    q: 'Why does LIVE establish a baseline before building?',
    a: 'Because for outcome-linked work you cannot price an outcome nobody has counted: measurable performance must be established before outcome commitments are made. Of 979 generative and agentic use cases analysed in 2026, generic productivity cases ran 54% in proof of concept against 19% in production, while narrow process-performance cases ran 8% in proof of concept against 27% in production, the healthiest ratio in the dataset (HFS Research, May 2026). The level of investigation is proportionate: LAND can draw on your existing requirements, a baseline agreed within the project, focused technical scoping, or a separately commissioned instrumented Value Discovery where justified. Engagements that start vaguely do not finish.',
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

      {/*
        REPLACED 2026-10-13 on the founder's discovery-positioning brief. The
        old close ("Start at LAND / Every LIVE engagement begins with a
        measured baseline...") implied a discovery purchase before any
        engineering. LIVE is an engineering method, not a sales process: every
        engagement establishes what success looks like before building, and a
        measured baseline is compulsory only where work is outcome-linked.
      */}
      <ClosingCta title="Start with a conversation">
        Every LIVE engagement establishes what success should look like before anything is built.
        Where work is outcome-linked, a measured baseline comes first, because you cannot price an
        outcome you have never counted.
      </ClosingCta>
    </>
  );
}
