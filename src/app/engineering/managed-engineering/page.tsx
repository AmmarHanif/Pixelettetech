import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Managed Engineering & Support',
  description:
    'Monitoring, incident response, releases, optimisation and roadmap delivery after launch, as a continuing engineering capability rather than a one-off project.',
  path: '/engineering/managed-engineering',
});

const included = [
  {
    title: 'Monitoring and incident response',
    body: 'Alerting on the paths that matter, a named responder, a defined severity scale and a written note after the event that goes into your own records.',
  },
  {
    title: 'Releases and backlog delivery',
    body: 'A predictable release cadence against an agreed backlog, so change is a routine event rather than an annual project with a business case attached.',
  },
  {
    title: 'Security patching and dependency currency',
    body: 'Libraries, runtimes and platform versions kept current. Software ages whether or not anyone touches it, and the bill for ignoring that arrives all at once.',
  },
  {
    title: 'Performance and cost optimisation',
    body: 'Where the system is slow, where it is expensive, and which of the two is actually worth engineering time this quarter.',
  },
  {
    title: 'Roadmap delivery',
    body: 'Product evolution against outcomes you set, with the work planned in the open and the trade-offs put in front of you rather than absorbed quietly.',
  },
  {
    title: 'Ownership of the boring parts',
    body: 'Certificates, backups, restores that have been tested, access reviews, documentation that matches the system. Nobody asks for these until the week they matter.',
  },
];

const shapes = [
  {
    label: 'Support and run',
    body: 'We keep what we built working on a monthly contract, with defined response expectations and a report you can read without a translator.',
  },
  {
    label: 'Managed engineering partner',
    body: 'A continuing engineering capability against a roadmap and a quarterly outcome, for organisations that need capacity rather than another project.',
  },
  {
    label: 'Take-on of an existing system',
    body: 'We can support software we did not build, once an assessment has established what it is and what supporting it honestly requires.',
  },
];

const faqs = [
  {
    q: 'What does managed engineering include?',
    a: 'Monitoring and incident response with a defined severity scale and a named responder, a predictable release cadence against an agreed backlog, security patching and dependency currency, performance and cost optimisation, roadmap delivery, and ownership of the operational tasks — backups, restores, access reviews and documentation — that only become visible when they have been neglected.',
  },
  {
    q: 'Will you support a system you did not build?',
    a: 'Yes, after an assessment. Taking on unfamiliar software without first establishing its architecture, test coverage, dependency posture and failure modes would mean quoting a support commitment against an unknown, which helps nobody.',
  },
  {
    q: 'Is this the same as hiring developers by the day?',
    a: 'No. Dedicated engineering capacity can be structured where that is genuinely the right commercial model, but the default is an accountable engineering outcome: an agreed scope of responsibility, defined response expectations and reporting against the things you care about, rather than hours on a timesheet.',
  },
];

export default function ManagedEngineeringPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Managed Engineering & Support',
          description:
            'Monitoring, incident response, releases, patching, optimisation and roadmap delivery for software in production, as a continuing engineering capability.',
          path: '/engineering/managed-engineering',
          serviceType: 'Managed software engineering and support',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          { name: 'Managed Engineering', path: '/engineering/managed-engineering' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Run · Managed Engineering</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Production is a starting point, not a handover ceremony.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Operate, monitor, support and continually improve a product after launch. For
            organisations that need a continuing technical capability rather than another one-off
            project with a warranty period bolted to the end of it.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Discuss ongoing engineering</Cta>
            <Cta href="/engineering" variant="secondary">
              All engineering
            </Cta>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- included */}
      <Section labelledBy="me-included-heading">
        <SectionHead
          title="What the arrangement covers"
          id="me-included-heading"
          lead="Scoped per client, because a single internal tool and a customer-facing platform in a regulated environment are not the same commitment."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {included.map(item => (
            <div className="card" key={item.title}>
              <h3 className="h4">{item.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- shapes */}
      <Section labelledBy="me-shapes-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Three shapes"
          id="me-shapes-heading"
          title="Chosen around what you actually need owned."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {shapes.map(shape => (
            <div className="tile" key={shape.label} style={{ padding: '24px 26px' }}>
              <span className="step__n">{shape.label}</span>
              <p className="small" style={{ marginTop: 4 }}>
                {shape.body}
              </p>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 30, maxWidth: '76ch' }}>
          None of these is developers by the day. Dedicated capacity can be structured where that is
          genuinely the right commercial model, but the default proposition is an accountable
          engineering outcome with someone answerable for it. If what you want is bodies on a
          timesheet, we are the wrong supplier and we will say so on the first call.
        </p>
      </Section>

      {/* ---------------------------------------------------------- and AI */}
      <Section labelledBy="me-ai-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="When there is AI in the product"
              id="me-ai-heading"
              title="Running a model is a different job from running a service."
            />
            <p className="body" style={{ marginTop: 20 }}>
              Conventional software fails loudly. An AI component degrades quietly: the output is
              still fluent, still fast, still returning two hundred, and gradually less correct.
              Keeping it working means measuring output quality continuously, watching for drift,
              and owning the inference cost as an operating line.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              That is a specific run discipline with its own commitments and its own monthly report,
              and it is documented separately rather than folded silently into a support contract.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/support-and-run">See the AI run contract</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>A typical path</Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 14 }}>
              {[
                ['01', 'Build or take-on', 'A new product, or an assessment of an existing one'],
                ['02', 'Stabilise', 'Monitoring, alerting, release path and the known defects'],
                ['03', 'Operate', 'Incidents, patching, releases and the routine ownership'],
                ['04', 'Improve', 'Roadmap delivery measured against the outcome, not the output'],
              ].map(([n, t, d]) => (
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

      <ClosingCta
        title="Something live that nobody owns?"
        ctaLabel="Discuss ongoing engineering"
      >
        Tell us what is running, who currently looks after it, and what happens when it breaks at
        four on a Friday. That conversation usually settles the scope on its own.
      </ClosingCta>
    </>
  );
}
