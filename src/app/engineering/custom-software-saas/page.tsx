import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Custom Software & SaaS',
  description:
    'Multi-tenant SaaS, internal platforms and customer-facing products, designed and engineered from specification through to production rather than to a prototype.',
  path: '/engineering/custom-software-saas',
});

const capabilities = [
  {
    title: 'Multi-tenant SaaS products',
    body: 'Tenancy model, entitlements, plan logic, onboarding and the administration surface behind them. The parts that are cheap to decide early and expensive to change once you have customers.',
  },
  {
    title: 'Internal platforms',
    body: 'The operational system a business runs on and cannot buy: scheduling, case handling, pricing, inventory, approvals, and whatever else currently lives in a spreadsheet nobody is allowed to touch.',
  },
  {
    title: 'Customer-facing products',
    body: 'Portals, applications and self-service journeys where the interface is the product and a support call is a defect.',
  },
  {
    title: 'APIs and service layers',
    body: 'Versioned, documented interfaces that other teams and other companies can build against, with the authentication, rate limiting and error contracts written down rather than discovered.',
  },
  {
    title: 'Integration into systems of record',
    body: 'CRM, ERP, finance, document stores and the third-party services your product depends on. Most of the risk in a new product lives at these seams.',
  },
  {
    title: 'Cloud architecture and environments',
    body: 'Environments, deployment, configuration and the operational shape of the thing, decided as part of the build rather than improvised the week before launch.',
  },
];

const ships = [
  {
    title: 'Architecture you can question',
    body: 'The decisions written down with their reasons, so a future team can tell what was deliberate.',
  },
  {
    title: 'A test suite',
    body: 'Automated coverage of the paths that matter, running before a change ships rather than after it breaks.',
  },
  {
    title: 'A deployment path',
    body: 'Repeatable releases with a way back. Deploying should be dull.',
  },
  {
    title: 'A runbook and handover',
    body: 'So your own team can operate it, whether or not you keep us on to do it.',
  },
];

const routes = [
  {
    label: 'Engineering diagnostic',
    body: 'For when you know the problem but not the solution. Discovery, architecture, data and workflow review, feasibility, and a prioritised build plan.',
  },
  {
    label: 'Build & launch programme',
    body: 'A scoped product programme with milestones, working releases, acceptance criteria and a launch.',
  },
  {
    label: 'Managed engineering partner',
    body: 'A continuing engineering capability once the product is live, rather than a one-off project and a goodbye.',
  },
];

const faqs = [
  {
    q: 'What does Pixelette Technologies mean by custom software?',
    a: 'A system that does not come off the shelf, plus the integration work that connects it to the systems that do. That covers multi-tenant SaaS products, internal operational platforms, customer-facing applications and the APIs and cloud architecture behind them.',
  },
  {
    q: 'Can you start from an existing codebase rather than a blank sheet?',
    a: 'Yes. Engagements start either from a blank sheet or from an inherited codebase. Where a system already exists, the usual first step is an independent technical assessment and architecture review before committing to further development.',
  },
  {
    q: 'What do you hand over at the end of a build?',
    a: 'A running system, the architecture decisions written down with their reasons, an automated test suite, a repeatable deployment path with a rollback, and a runbook so your own team can operate the product whether or not the support contract continues.',
  },
];

export default function CustomSoftwareSaasPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Custom Software & SaaS',
          description:
            'Design and engineering of multi-tenant SaaS products, internal platforms, customer-facing applications, APIs and the cloud architecture behind them.',
          path: '/engineering/custom-software-saas',
          serviceType: 'Custom software development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          { name: 'Custom Software & SaaS', path: '/engineering/custom-software-saas' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Build · Custom Software &amp; SaaS</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            The system that does not come off the shelf.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            From a blank sheet or an inherited codebase, we design and engineer products that move
            from specification to production. Not a prototype handed over with a wave, and not a
            demonstration that quietly needs rebuilding before anyone can use it.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a build</Cta>
            <Cta href="/engineering" variant="secondary">
              All engineering
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="css-build-heading">
        <SectionHead
          title="What we build"
          id="css-build-heading"
          lead="Product engineering, and the unglamorous structural work underneath it that decides whether the product survives its second year."
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

      {/* --------------------------------------------- prototype vs product */}
      <Section labelledBy="css-prod-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The distinction that costs money"
              id="css-prod-heading"
              title="A prototype proves an idea. A product survives a Monday."
            />
            <p className="body" style={{ marginTop: 20 }}>
              A great deal of software is bought as a product and delivered as a prototype: the happy
              path works, the demonstration is convincing, and the first real week of use exposes
              everything that was never built. Error handling, permissions, concurrency, migrations,
              observability and the boring administrative screens are where a build either holds or
              does not.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              We scope those in from the start and price them openly, which occasionally makes a
              proposal look more expensive than one that omits them. It is the same work either way.
              The only question is whether you pay for it before launch or after.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/method/live">See how we deliver</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>What ships with the build</Eyebrow>
            <div className="grid" style={{ gap: 12, marginTop: 22 }}>
              {ships.map(item => (
                <div className="tile" key={item.title} style={{ padding: '20px 24px' }}>
                  <h3 className="h4">{item.title}</h3>
                  <span>{item.body}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- routes */}
      <Section labelledBy="css-routes-heading">
        <SectionHead
          eyebrow="Ways to work with us"
          id="css-routes-heading"
          title="Three commercial shapes, chosen around the problem."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {routes.map(route => (
            <div className="tile" key={route.label} style={{ padding: '24px 26px' }}>
              <span className="step__n">{route.label}</span>
              <p className="small" style={{ marginTop: 4 }}>
                {route.body}
              </p>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 26, maxWidth: '72ch' }}>
          Dedicated engineering capacity can be structured where that is genuinely the right
          commercial model. It is not our default, and we will not pretend a timesheet is an
          outcome.
        </p>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering." />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have something that needs building?" ctaLabel="Scope a build">
        Tell us what it has to do and what already exists. We will tell you whether it is a
        fixed-scope build or a standing product team, and where the difficult parts are, before
        anyone books a workshop.
      </ClosingCta>
    </>
  );
}
