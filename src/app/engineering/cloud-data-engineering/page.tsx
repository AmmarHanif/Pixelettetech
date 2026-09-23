import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cloud & Data Engineering',
  description:
    'Cloud architecture, environments and infrastructure as code, plus pipelines, warehousing, APIs and the integrations into existing systems of record.',
  path: '/engineering/cloud-data-engineering',
});

const cloud = [
  {
    title: 'Cloud architecture',
    body: 'Networking, compute, storage, identity and the boundaries between environments, designed around the product rather than around whichever managed service was in the last conference talk.',
  },
  {
    title: 'Environments and infrastructure as code',
    body: 'Development, staging and production defined in code and reproducible. If an environment can only be recreated by the person who built it, you have a single point of failure with a payroll number.',
  },
  {
    title: 'Deployment and release',
    body: 'Automated pipelines, staged rollout and a rollback that has actually been exercised. The point of a release process is that it is boring.',
  },
  {
    title: 'Observability and alerting',
    body: 'Logs, metrics, traces and alerts on the paths that carry revenue, instrumented on open standards so you are never locked into whoever is monitoring you.',
  },
  {
    title: 'Resilience and recovery',
    body: 'Backups that have been restored from, failure modes that have been rehearsed, and a written recovery expectation rather than an assumed one.',
  },
  {
    title: 'Cost engineering',
    body: 'What the estate costs, which components drive it, and where an architectural change is worth more than another round of instance resizing.',
  },
];

const data = [
  {
    title: 'Pipelines and ingestion',
    body: 'Moving data from the systems that create it into the places that use it, with schedules, retries, schema handling and a way to tell when a load silently did nothing.',
  },
  {
    title: 'Warehousing and modelling',
    body: 'A structure the business can query without three caveats per number, and definitions that survive somebody renaming a column.',
  },
  {
    title: 'APIs and service interfaces',
    body: 'Documented, versioned access to data for the applications, partners and teams that need it, with authentication and entitlements designed first.',
  },
  {
    title: 'Integration into systems of record',
    body: 'CRM, ERP, finance, case management and document stores. Most data problems are integration problems wearing a reporting costume.',
  },
  {
    title: 'Quality, lineage and provenance',
    body: 'Where a figure came from, which source, which version, at what time. Your auditor will ask, and so will the first person who disagrees with the number.',
  },
  {
    title: 'Model-serving layers',
    body: 'Where AI is part of the product, the serving, caching and evaluation hooks it needs, built as infrastructure rather than bolted to the application.',
  },
];

const faqs = [
  {
    q: 'Which cloud platforms do you work in?',
    a: 'AWS, Azure and Google Cloud, with Kubernetes where the workload justifies it. The platform is usually a constraint set by the client rather than a preference we impose, and the architecture is designed around the product and its operating requirements either way.',
  },
  {
    q: 'What is the difference between cloud engineering and data engineering here?',
    a: 'Cloud engineering is where the system runs: environments, deployment, observability, resilience and cost. Data engineering is what moves through it: pipelines, warehousing, APIs, integration into systems of record, and the lineage that lets you defend a number. Most engagements need both, which is why they sit on one page.',
  },
  {
    q: 'Do you do this work without also building the application?',
    a: 'Yes. Cloud architecture, environment rebuilds, pipeline work and integration layers are all deliverable against an existing estate, and are a common first engagement where the application itself is sound but the infrastructure or data layer underneath it is not.',
  },
];

export default function CloudDataEngineeringPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Cloud & Data Engineering',
          description:
            'Cloud architecture, environments, deployment, observability and cost engineering, together with data pipelines, warehousing, APIs and integration.',
          path: '/engineering/cloud-data-engineering',
          serviceType: 'Cloud and data engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          { name: 'Cloud & Data Engineering', path: '/engineering/cloud-data-engineering' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Build · Cloud &amp; Data Engineering</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Where the system runs, and what moves through it
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Cloud architecture, environments and deployment on one side; pipelines, warehousing, APIs
            and integration into systems of record on the other. Two disciplines that fail together,
            which is why we do not sell them separately.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a build</Cta>
            <Cta href="/engineering" variant="secondary">
              All engineering
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- cloud */}
      <Section labelledBy="cde-cloud-heading">
        <SectionHead
          eyebrow="Cloud"
          id="cde-cloud-heading"
          title="Infrastructure that holds under production load"
          lead="AWS, Azure and Google Cloud, with Kubernetes where the workload justifies it and without it where it does not."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {cloud.map(item => (
            <div className="card" key={item.title}>
              <h3 className="h4">{item.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------------- data */}
      <Section labelledBy="cde-data-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Data"
          id="cde-data-heading"
          title="Pipelines, models and the integrations underneath them"
          /* "unglamorous" also appears on /engineering and
             /engineering/custom-software-saas. The overview keeps it; this
             page says it plainly. */
          lead="The layer underneath that decides whether reporting, automation and any AI you later buy are possible at all."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {data.map(item => (
            <div className="card" key={item.title}>
              <h3 className="h4">{item.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- the link */}
      <Section labelledBy="cde-link-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Why this comes before AI"
              id="cde-link-heading"
              title="A model cannot use data it cannot reach"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Automation and AI projects stall on access far more often than on capability: the
              information sits in four systems, the permissions were never modelled, and nobody can
              say which copy of a record is authoritative. That is a data and integration problem,
              and it is solvable by ordinary engineering.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Doing it first also has the useful property of being valuable on its own. Better
              reporting and fewer manual reconciliations pay for themselves whether or not a model is
              ever pointed at the result.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-automation/data-and-integration">
                Data &amp; integration for AI
              </FLink>
            </p>
          </div>

          <div>
            <Eyebrow>A typical sequence</Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 14 }}>
              {[
                ['01', 'Assess the estate', 'What runs where, what it costs, and what is fragile'],
                ['02', 'Environments and pipeline', 'Reproducible infrastructure and a dull release'],
                ['03', 'Data layer', 'Ingestion, modelling, entitlements and lineage'],
                ['04', 'Observability and cost', 'Alerting on what matters, then the spend curve'],
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

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Estate not behaving?" ctaLabel="Scope a build">
        Tell us what runs where and what it is costing you, in money or in Fridays. We will tell you
        which layer is actually the problem.
      </ClosingCta>
    </>
  );
}
