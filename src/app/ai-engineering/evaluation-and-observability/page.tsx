import { CertifiedHandoff, ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Evaluation & Observability',
  description:
    'Golden datasets graded pass or fail, judges calibrated against human labels, regression checks, and drift detection including judge drift.',
  path: '/ai-engineering/evaluation-and-observability',
});

const practices = [
  {
    title: 'Golden datasets',
    body: 'A maintained set of at least 100 labelled examples per system, built from real cases rather than invented ones, and versioned alongside the code that is graded against it.',
  },
  {
    title: 'Pass or fail, not one to five',
    body: 'Binary grading against an agreed definition of correct. A five-point scale hides disagreement inside the middle three points and makes a regression impossible to detect.',
  },
  {
    title: 'Judge calibration',
    body: 'Where a model does the grading, it is calibrated against human labels before it is trusted, and re-calibrated on a schedule. An uncalibrated judge is an opinion with a number attached.',
  },
  {
    title: 'Regression checks on every release',
    body: 'The suite runs before a change ships. Below the acceptance threshold means it does not ship, and that threshold is agreed before the build rather than negotiated after it.',
  },
  {
    title: 'Drift detection, including judge drift',
    body: 'Input distribution drift, silent model version changes by a supplier, and movement in the evaluator’s own behaviour. The third is the one most teams never watch.',
  },
  {
    title: 'Open standards throughout',
    body: 'Instrumented on open standards from day one, so you are never locked into whoever happens to be monitoring you, and can take the measurement with you.',
  },
];

const faqs = [
  {
    q: 'Why grade AI output pass or fail rather than on a one-to-five scale?',
    a: 'Because a five-point scale hides disagreement inside the middle three points, which makes regressions impossible to detect reliably. Binary grading against an agreed definition of correct forces the definition to be written down, and makes a change in quality visible the moment it happens.',
  },
  {
    q: 'What is judge drift and why does it matter?',
    a: 'Judge drift is movement in the behaviour of the model doing the grading, as opposed to drift in the input data or a silent version change by a supplier. It matters because it silently invalidates your quality measurements: the system looks stable while the instrument measuring it has moved.',
  },
  {
    q: 'When should evaluation be built into an AI system?',
    a: 'At the start. Evaluation designed in from day one is what makes an acceptance threshold enforceable and a support-and-run contract possible. Evaluation bolted on after an incident can only tell you what is happening now, not what changed.',
  },
];

export default function EvaluationPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'AI Evaluation & Observability',
          description:
            'Golden datasets, binary pass-or-fail grading, judge calibration against human labels, regression checks and drift detection for AI systems in production.',
          path: '/ai-engineering/evaluation-and-observability',
          serviceType: 'AI evaluation and monitoring',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
          {
            name: 'Evaluation & Observability',
            path: '/ai-engineering/evaluation-and-observability',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Evaluation & Observability</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Find out that quality moved before your users do.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Test sets, regression checks and monitoring, so a change in output quality is something
            you detect rather than something your customers and your regulator report to you. Built in
            at the start, not bolted on after an incident.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            <Cta href="/insights" variant="secondary">
              Read the methodology
            </Cta>
          </div>
        </div>
      </div>

      <Section labelledBy="eval-heading">
        <SectionHead
          title="How we measure an AI system"
          id="eval-heading"
          lead="The same approach on every engagement, published so you can check it before you buy anything."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {practices.map(p => (
            <div className="card" key={p.title}>
              <h3 className="h4">{p.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="eval-why-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Why it is the enabling service"
              id="eval-why-heading"
              title="Everything else depends on this one."
            />
            <p className="body" style={{ marginTop: 20 }}>
              An acceptance threshold you cannot measure is a wish. An outcome-linked commercial model
              you cannot measure is uninsurable. A monthly run contract with nothing to report against
              is a retainer. Evaluation is what makes the other services real, which is why it is
              instrumented into every engagement rather than sold as an afterthought.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/support-and-run">See what we report monthly</FLink>
            </p>
          </div>
          <CertifiedHandoff variant="compact" />
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering." />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Want to know whether your system still works?">
        The baseline measures a system that already exists just as readily as one that does not. We
        tell you what it is doing now, and what it would cost to keep it honest.
      </ClosingCta>
    </>
  );
}
