import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Web Platforms',
  description:
    'Customer portals, marketplaces, booking and workflow systems, internal tools, and the APIs and infrastructure behind them, built to carry a business.',
  path: '/engineering/web-platforms',
});

const capabilities = [
  {
    title: 'Customer portals',
    body: 'Accounts, documents, requests, statements and self-service. The measure of a good one is the support calls it removes, not the screens it contains.',
  },
  {
    title: 'Marketplaces and multi-sided platforms',
    body: 'Supply, demand, matching, transactions and the trust mechanics between them, including the moderation and dispute paths nobody demonstrates.',
  },
  {
    title: 'Booking and scheduling systems',
    body: 'Availability, capacity, conflicts, cancellations and time zones. Deceptively hard, and unforgiving when it is wrong.',
  },
  {
    title: 'Workflow and case management',
    body: 'Queues, states, ownership, SLAs and audit history for the processes a business actually runs on.',
  },
  {
    title: 'Internal tools',
    body: 'The admin, operations and reporting surfaces that decide whether your own team can run the platform without calling an engineer.',
  },
  {
    title: 'The APIs and infrastructure behind them',
    body: 'Service interfaces, background processing, storage, search, caching and environments. The front end is the visible tenth of a platform.',
  },
];

const nonNegotiables = [
  {
    title: 'Accessibility as a build requirement',
    body: 'Keyboard operation, focus order, contrast and semantics designed in and tested, rather than remediated after a complaint.',
  },
  {
    title: 'Performance budgets',
    body: 'Agreed page and interaction targets that a release is measured against, so speed is a specification rather than an opinion.',
  },
  {
    title: 'Authentication and permissions',
    body: 'Roles, entitlements and session handling modelled before the features that depend on them, not retrofitted around them.',
  },
  {
    title: 'Observability from day one',
    body: 'Logs, traces and alerts on the paths that carry revenue, so a failure is something you detect rather than something a customer reports.',
  },
];

const faqs = [
  {
    q: 'What counts as a web platform rather than a website?',
    a: 'A website presents information. A platform carries a process: accounts, permissions, transactions, workflow states, integrations and an administrative surface your own team operates. Portals, marketplaces, booking systems, case-management systems and internal tools are all platforms in that sense.',
  },
  {
    q: 'Is accessibility included or charged separately?',
    a: 'It is a build requirement, not an extra line. Keyboard operation, focus order, contrast and semantics are designed in and tested during the build, because retrofitting them into a finished interface costs considerably more than doing them once.',
  },
  {
    q: 'Do you rebuild an existing platform or extend it?',
    a: 'Either, and the decision should follow an assessment rather than a preference. Where an existing platform is sound, incremental replacement of the parts that are failing is usually cheaper and less risky than a full rebuild. Where it is not, we will say so and explain why.',
  },
];

export default function WebPlatformsPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Web Platforms',
          description:
            'Customer portals, marketplaces, booking and workflow systems, internal tools, and the APIs and infrastructure behind them.',
          path: '/engineering/web-platforms',
          serviceType: 'Web platform development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          { name: 'Web Platforms', path: '/engineering/web-platforms' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Build · Web Platforms</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Platforms that carry a business, not a brochure
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Customer portals, marketplaces, booking and workflow systems, internal tools, and the
            APIs and infrastructure behind them. Built for the operating day, when the traffic is
            real and the person on the other end is trying to get something done.
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
      <Section labelledBy="wp-build-heading">
        <SectionHead title="What we build" id="wp-build-heading" />
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

      {/* ------------------------------------------------- non-negotiables */}
      <Section labelledBy="wp-standards-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="In every platform we ship"
          id="wp-standards-heading"
          title="Four things that are not features"
          lead="They never appear on a requirements list and they decide whether the platform is usable, defensible and operable a year after launch."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {nonNegotiables.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ rebuild vs */}
      <Section labelledBy="wp-rebuild-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Rebuild or extend"
              id="wp-rebuild-heading"
              title="The cheapest answer is often not the new one"
            />
            <p className="body" style={{ marginTop: 20 }}>
              A platform that is slow, awkward or expensive to change does not automatically need
              replacing. Frequently the failure is concentrated in two or three areas, and replacing
              those incrementally is faster, cheaper and very much less risky than a rebuild that
              spends a year reaching the functionality you already had.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Where a rebuild genuinely is the right call, we will say so and explain what makes it
              so. That assessment is its own piece of work and can be bought on its own.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/engineering/modernisation-integration">
                Modernisation &amp; integration
              </FLink>
            </p>
          </div>

          <div>
            <Eyebrow>Where AI fits, if it fits</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Plenty of platforms now want a model inside them: a search that understands a question,
              a summary of a case file, a suggested next action. That is a genuine capability and we
              build it, but it belongs to a specific job in the workflow and it needs to be
              measurable before anyone funds it.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              The same team that ships the platform can add it, evaluate it and keep it inside the
              boundaries you set.
            </p>
            <div style={{ marginTop: 28 }}>
              <Cta href="/ai-automation" variant="secondary">
                See AI &amp; automation
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a platform to build or to fix?" ctaLabel="Scope a build">
        Bring us the process it has to carry and whatever exists today. We will tell you what should
        be built, what should be replaced, and what should be left alone.
      </ClosingCta>
    </>
  );
}
