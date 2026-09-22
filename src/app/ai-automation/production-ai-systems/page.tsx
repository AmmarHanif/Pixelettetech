import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, Faqs, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Production AI Systems',
  description:
    'AI built into a named business process, with the process redesigned around it. Agentic only where the task earns it. Human review by default.',
  path: '/ai-automation/production-ai-systems',
});

const processes = [
  {
    title: 'Claims and case handling',
    body: 'Intake, triage, evidence gathering and a drafted decision with the reasoning attached. Human sign-off retained.',
  },
  {
    title: 'Client reporting',
    body: 'Recurring reports assembled from systems of record, in house voice, with every figure traceable to its source.',
  },
  {
    title: 'Document production',
    body: 'Regulated correspondence and structured documents where the template is known and the content is not.',
  },
  {
    title: 'Back-office exceptions',
    body: 'The queue nobody wants: mismatches, missing data, things that fell out of the happy path.',
  },
  {
    title: 'Underwriting support',
    body: 'Assembling the pack, flagging the anomalies, and never making the decision.',
  },
  {
    title: 'Knowledge and internal copilots',
    body: 'Useful, and honestly the hardest to attach a number to. We will say so before you fund it.',
  },
];

const evidence = [
  {
    title: 'Evaluation suite',
    body: '100+ example golden set, binary pass or fail, judge calibrated against human labels.',
  },
  {
    title: 'Acceptance thresholds',
    body: 'Agreed before build, not negotiated after. Below threshold means it does not ship.',
  },
  {
    title: 'Escalation design',
    body: 'What the system refuses to do alone, and who picks it up when it does.',
  },
  {
    title: 'Runbook',
    body: 'So your team can operate it, whether or not you keep us on to do it.',
  },
];

const faqs = [
  {
    q: 'When should a workflow use an AI agent, and when should it not?',
    a: 'Use an agent when the path genuinely varies per case, the system must choose among tools, and a wrong step is recoverable and reviewable. Do not use one when the process is stable, the steps are known, the output is regulated, or nobody can articulate what "correct" looks like well enough to grade it.',
  },
  {
    q: 'Are most "agentic" products actually agentic?',
    a: 'No. 17% of organisations have deployed AI agents, over 40% of agentic projects are forecast to be cancelled by the end of 2027 on cost, unclear value or inadequate controls, and of the thousands of vendors claiming agentic capability Gartner assesses roughly 130 as genuinely agentic. Much of what is sold as agentic should be a deterministic workflow with one model call in it, which is cheaper, faster and auditable.',
  },
  {
    q: 'What ships alongside a production AI system?',
    a: 'An evaluation suite with a 100+ example golden set graded pass or fail and a judge calibrated against human labels; acceptance thresholds agreed before the build; an escalation design defining what the system refuses to do alone; and a runbook so your own team can operate it.',
  },
];

export default function ProductionAiPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Production AI Systems',
          description:
            'AI embedded in a named business process with the workflow redesigned around it, shipped with an evaluation suite, acceptance thresholds, escalation design and a runbook.',
          path: '/ai-automation/production-ai-systems',
          serviceType: 'AI system development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-automation' },
          { name: 'Production AI Systems', path: '/ai-automation/production-ai-systems' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Production AI Systems</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Systems that change a number, not pilots that prove a concept
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            We build AI into a named business process and redesign the process around it. Agentic
            patterns where the task genuinely requires planning and tool use. Deterministic automation
            where it does not. Human review by default.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            <Cta href="/case-studies" variant="secondary">
              See the work
            </Cta>
          </div>
        </div>
      </div>

      {/* --------------------------------------------- position on agents */}
      <Section labelledBy="agents-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Our position on agents"
              id="agents-heading"
              title="We will talk you out of an agent if you do not need one"
            />
            <p className="body" style={{ marginTop: 20 }}>
              17% of organisations have deployed AI agents. Over 40% of agentic projects are forecast
              to be cancelled by the end of 2027 on cost, unclear value or inadequate controls. Of the
              thousands of vendors claiming agentic capability, Gartner assesses roughly 130 as
              genuinely agentic.
            </p>
            <SourceNote>Gartner, 2025–2026</SourceNote>
            <p className="body" style={{ marginTop: 24 }}>
              We build agentic systems, and we are good at it. We also think most of what is sold as
              agentic should be a deterministic workflow with one model call in it, which is cheaper,
              faster and auditable. The baseline usually settles the argument with data.
            </p>
          </div>

          <div className="grid" style={{ gap: 16 }}>
            <div className="card">
              <span className="step__n">Use an agent when</span>
              <p className="body" style={{ marginTop: 4, fontSize: 15 }}>
                The path genuinely varies per case, the system must choose among tools, and a wrong
                step is recoverable and reviewable.
              </p>
            </div>
            <div className="card" style={{ background: '#FBF8F4', borderColor: '#edd8de' }}>
              <span className="step__n" style={{ color: 'var(--amber-ink)' }}>
                Do not when
              </span>
              <p className="body" style={{ marginTop: 4, fontSize: 15 }}>
                The process is stable, the steps are known, the output is regulated, or nobody can
                articulate what “correct” looks like well enough to grade it.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ processes */}
      <Section labelledBy="processes-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          title="Processes we have built into, or would take on"
          id="processes-heading"
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {processes.map(p => (
            <div className="card" key={p.title}>
              <h3 className="h4">{p.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------- evidence */}
      <Section labelledBy="evidence-heading">
        <SectionHead title="Every build ships with its own evidence" id="evidence-heading" />
        {/* Card titles are headings, matching the board and the processes grid
            above. As bold text these four sat outside the outline entirely, so
            heading navigation skipped what ships with every build. */}
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {evidence.map(e => (
            <div className="tile" key={e.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{e.title}</h3>
              <span>{e.body}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a process in mind?">
        Bring us the one with the queue. We will baseline it before we quote to build anything.
      </ClosingCta>
    </>
  );
}
