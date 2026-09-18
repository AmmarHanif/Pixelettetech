import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Agentic AI & Multi-Agent Systems',
  description:
    'Single- and multi-agent systems that plan, call tools, coordinate steps and operate within defined controls, with autonomy introduced as an engineered decision.',
  path: '/ai-engineering/agentic-ai-multi-agent',
});

const capabilities = [
  {
    title: 'Planning and task decomposition',
    body: 'Turning an instruction into an ordered set of steps the system can actually carry out, with the plan visible and inspectable rather than implied by whatever the model felt like doing.',
  },
  {
    title: 'Tool use and system access',
    body: 'The functions, queries and APIs an agent may call, what arguments it may pass, and the explicit list of things it may not touch. The boundary is the design.',
  },
  {
    title: 'Multi-agent coordination',
    body: 'Where a task genuinely splits into research, drafting, checking and execution, agents with distinct responsibilities and a defined protocol between them, rather than one prompt pretending to be a team.',
  },
  {
    title: 'State, memory and recovery',
    body: 'What the system remembers within a task and across tasks, and what it does when a step fails halfway through. Recovery design is most of the engineering.',
  },
  {
    title: 'Human approval points',
    body: 'The moments where the run stops and a person decides. Placed where the consequence is material, not where they are least inconvenient.',
  },
  {
    title: 'Traceability',
    body: 'Every step, tool call, input and decision recorded, so an outcome can be explained afterwards to a customer, an auditor or a court.',
  },
];

const ladder = [
  {
    n: '01',
    title: 'Suggest',
    body: 'The system proposes; a person does the work. Nothing changes without a human action. The right place to start with almost anything.',
  },
  {
    n: '02',
    title: 'Draft for approval',
    body: 'The system produces the output and a person approves or edits it before it leaves the building. Most production value sits here.',
  },
  {
    n: '03',
    title: 'Act within bounds',
    body: 'The system executes inside a narrow, reversible envelope, escalating anything outside it. Requires evaluation evidence before it is granted.',
  },
  {
    n: '04',
    title: 'Act and report',
    body: 'The system runs and a person reviews after the fact. Justified only by measured performance over time on a task where a mistake is recoverable.',
  },
];

const faqs = [
  {
    q: 'What is a multi-agent system, in practical terms?',
    a: 'A design in which distinct components each hold a defined responsibility, for example gathering information, drafting, checking and executing, and communicate through a defined protocol. It is worth the extra complexity only where the task genuinely splits along those lines. Where it does not, a single agent, or a deterministic workflow with one model call in it, is cheaper, faster and easier to audit.',
  },
  {
    q: 'How do you decide how much autonomy an agent should have?',
    a: 'Autonomy is treated as an engineered control decision rather than a selling point. Human oversight is the default wherever a decision is material. More autonomous operation is introduced only where the workflow, the risk level and measured evaluation evidence justify it, in defined steps: suggest, draft for approval, act within bounds, then act and report.',
  },
  {
    q: 'How do you stop an agent doing something it should not?',
    a: 'By constraining what it can reach rather than by asking it nicely. The tools, queries and APIs available to an agent are an explicit allow-list, arguments are validated, irreversible actions are gated behind human approval, and every step and tool call is recorded so the run can be reconstructed afterwards.',
  },
];

export default function AgenticAiPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Agentic AI & Multi-Agent Systems',
          description:
            'Single- and multi-agent systems that plan, call tools, coordinate steps and operate within defined controls, with traceability and human approval points.',
          path: '/ai-engineering/agentic-ai-multi-agent',
          serviceType: 'Agentic AI system development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI & Automation', path: '/ai-engineering' },
          {
            name: 'Agentic AI & Multi-Agent Systems',
            path: '/ai-engineering/agentic-ai-multi-agent',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Automate · Agentic AI</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Autonomy is a control decision, not a slogan
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Single- and multi-agent systems that plan, call tools, coordinate steps and operate
            within defined controls. Human oversight is the default where decisions are material;
            more autonomous operation is introduced where the workflow, the risk and the evidence
            justify it.
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
      <Section labelledBy="ag-build-heading">
        <SectionHead
          title="What an agentic build actually consists of"
          id="ag-build-heading"
          lead="Very little of it is prompt writing. The engineering lives in what the system may reach, what it does when a step fails, and how the run is reconstructed afterwards."
        />
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

      {/* --------------------------------------------------- autonomy steps */}
      <Section labelledBy="ag-ladder-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="How autonomy is granted"
          id="ag-ladder-heading"
          title="Four steps, and you have to earn each one"
          lead="A system moves up only on evidence from its own evaluation results. Nothing here is granted because a demonstration went well."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {ladder.map(step => (
            <div className="tile" key={step.n} style={{ padding: '24px 26px' }}>
              <span className="step__n">{step.n}</span>
              <h3 className="h4" style={{ marginTop: 4 }}>
                {step.title}
              </h3>
              <span>{step.body}</span>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 30, maxWidth: '76ch' }}>
          The same ladder runs in reverse. If measured quality falls below the agreed threshold, the
          system drops a step and a person is back in the loop until it recovers. That is a designed
          behaviour, not an incident response.
        </p>
      </Section>

      {/* ------------------------------------------------------ when not to */}
      <Section labelledBy="ag-when-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Where this fits"
              id="ag-when-heading"
              title="An agent is a solution to variability, not to work"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Agentic architecture earns its cost when the path genuinely varies from case to case
              and the system has to choose among tools to get through it. When the steps are known
              and stable, the same outcome is available from a deterministic workflow with a model
              call inside it. That is cheaper to run, faster, and very much easier to explain to whoever
              asks why it did what it did.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              We build both, and we would rather argue for the simpler one before you have paid for
              the complicated one.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/production-ai-systems">
                How we build production AI
              </FLink>
            </p>
          </div>

          <div>
            <Eyebrow>What has to exist first</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              An agent needs somewhere to act and something to act on. In practice that means the
              tools it calls have to exist as reliable interfaces, the data it reads has to be
              reachable with the right permissions, and there has to be an agreed definition of a
              correct outcome precise enough to grade against.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Where those are missing, the honest sequence is integration first, evaluation second,
              agent third. Reversing it produces a demonstration rather than a system.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/data-and-integration" variant="secondary">
                Data &amp; integration
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Thinking about agents?">
        Bring us the process and we will tell you, with the reasons, whether it needs an agent, a
        deterministic workflow, or a fortnight of integration work first.
      </ClosingCta>
    </>
  );
}
