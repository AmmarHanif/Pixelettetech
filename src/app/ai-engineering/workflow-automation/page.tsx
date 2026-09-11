import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI Agents & Workflow Automation',
  description:
    'Automate repetitive or high-friction business processes across systems, data and human approvals, with the current cost measured before anything is changed.',
  path: '/ai-engineering/workflow-automation',
});

const capabilities = [
  {
    title: 'Process mapping and baseline',
    body: 'What the process actually is, as opposed to what the procedure document says, and what it currently costs in time, money, cycle time and rework.',
  },
  {
    title: 'Cross-system orchestration',
    body: 'Steps that span several systems, each of which was designed as though it were the only one. Most of the friction in a business process lives in these gaps.',
  },
  {
    title: 'Document and data handling',
    body: 'Receiving, reading, extracting, validating and filing the material a process runs on, including the awkward formats nobody wants to admit are still in use.',
  },
  {
    title: 'Human approval steps',
    body: 'Approvals designed as part of the flow, with the right context put in front of the right person, rather than an email asking someone to go and look at something.',
  },
  {
    title: 'Exception handling',
    body: 'The cases that fall out of the happy path. An automation that handles eighty per cent and silently drops the rest has moved the work, not removed it.',
  },
  {
    title: 'Reporting on what changed',
    body: 'Volume processed, time saved, exceptions raised, and the same measurements taken before the automation existed, so the comparison is real.',
  },
];

const sequence = [
  ['01', 'Measure it first', 'Manual cost, cycle time, error rate and volume, instrumented before anything changes'],
  ['02', 'Fix the process', 'Remove the steps that only exist because the systems do not talk to each other'],
  ['03', 'Automate deterministically', 'Rules, integrations and orchestration for everything that is genuinely stable'],
  ['04', 'Add a model where it earns it', 'Only for the judgement, extraction or language work that rules cannot do'],
];

const faqs = [
  {
    q: 'What kinds of process are worth automating?',
    a: 'Repetitive or high-friction processes that cross several systems, involve documents or structured data, and have a measurable current cost in time, cycle time or error rate. Processes that run rarely, change constantly, or carry a decision nobody can define well enough to grade are usually poor candidates, and we will say so.',
  },
  {
    q: 'Does workflow automation need AI?',
    a: 'Frequently not. A large share of the value in a business process comes from deterministic integration and orchestration, which is cheaper to run and simpler to audit. A model is introduced where the work genuinely requires judgement, extraction or language handling that rules cannot do.',
  },
  {
    q: 'How do you prove an automation was worth it?',
    a: 'By measuring the process before it is changed. The manual cost, cycle time, error rate or conversion baseline is instrumented first, so afterwards the comparison is against a recorded starting point rather than against a recollection of how bad things used to be.',
  },
];

export default function WorkflowAutomationPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'AI Agents & Workflow Automation',
          description:
            'Automation of repetitive and high-friction business processes across systems, data and human approvals, baselined before and measured after.',
          path: '/ai-engineering/workflow-automation',
          serviceType: 'Business process automation',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI & Automation', path: '/ai-engineering' },
          { name: 'Workflow Automation', path: '/ai-engineering/workflow-automation' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Automate · Workflow Automation</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Take the work out of the process, not the person out of the decision.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Automate repetitive or high-friction business processes across systems, data and human
            approvals. We measure what the process costs today before we change it, because
            otherwise nobody can tell afterwards whether it worked.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Map the workflow</Cta>
            <Cta href="/ai-engineering" variant="secondary">
              All AI &amp; automation
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="wa-build-heading">
        <SectionHead title="What we automate" id="wa-build-heading" />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {capabilities.map(cap => (
            <div className="card" key={cap.title}>
              <h3 className="h4">{cap.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- sequence */}
      <Section labelledBy="wa-order-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The order matters"
              id="wa-order-heading"
              title="Automating a broken process gives you a faster broken process."
            />
            <p className="body" style={{ marginTop: 20 }}>
              A surprising amount of manual work exists only because two systems never spoke to each
              other and somebody filled the gap with a spreadsheet. Automating the copying preserves
              the gap. Removing the gap removes the work, and it is usually the cheaper piece of
              engineering.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              So the sequence runs measure, simplify, automate deterministically, and only then
              introduce a model — for the judgement, extraction or language handling that rules
              genuinely cannot do.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/ai-value-baseline">Start with the baseline</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>How an engagement runs</Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 14 }}>
              {sequence.map(([n, t, d]) => (
                <li key={n} className="tile" style={{ padding: '18px 22px' }}>
                  <span className="step__n">{n}</span>
                  <b style={{ fontSize: 15.5 }}>{t}</b>
                  <p className="small" style={{ marginTop: 6 }}>
                    {d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------- oversight */}
      <Section labelledBy="wa-oversight-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Where people stay"
              id="wa-oversight-heading"
              title="Approval is part of the design, not a concession to nervousness."
            />
            <p className="body" style={{ marginTop: 20 }}>
              Human oversight is the default wherever a decision is material: money leaving the
              business, a commitment to a customer, anything regulated, anything irreversible. The
              automation is built to bring the right context to that person quickly, which is usually
              where the time saving actually comes from.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Where more autonomous operation is warranted, it is introduced against measured
              performance rather than granted at launch because everyone was feeling optimistic.
            </p>
          </div>

          <div>
            <Eyebrow>The exception queue</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Ask any supplier what their automation does with the cases it cannot handle. The answer
              tells you whether they have run one in production. Exceptions need a queue, an owner,
              a reason code and a route back into the flow, and the volume in that queue is one of
              the numbers we report.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              An automation that quietly discards what it does not understand has not removed the
              work. It has moved it somewhere nobody is looking.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/evaluation-and-observability" variant="secondary">
                How we measure it
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <ClosingCta title="Have a process that eats the week?">
        Bring us the one with the queue and the spreadsheet. We will baseline it before quoting to
        build anything, and tell you if the answer is an integration rather than an automation.
      </ClosingCta>
    </>
  );
}
