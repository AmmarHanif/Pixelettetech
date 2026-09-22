import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Mobile Applications',
  description:
    'Native iOS and Android and cross-platform builds, taken through store submission and kept maintained afterwards, as a product or part of a wider platform.',
  path: '/engineering/mobile-applications',
});

const capabilities = [
  {
    title: 'Native iOS and Android',
    body: 'Where the product depends on platform behaviour, background work, hardware access or interface conventions that a shared codebase will fight rather than use.',
  },
  {
    title: 'Cross-platform builds',
    body: 'One codebase across both stores where the product is mostly screens, data and forms, and the saving is real rather than theoretical.',
  },
  {
    title: 'Offline behaviour and sync',
    body: 'What the app does on a train, in a basement or on a bad connection, and what happens to the data when the signal comes back.',
  },
  {
    title: 'Device capability',
    body: 'Camera, location, biometrics, notifications, background processing and secure local storage, with the permission prompts designed rather than defaulted.',
  },
  {
    title: 'Store submission and release management',
    body: 'Review requirements, privacy declarations, staged rollout, versioning and the discipline of shipping to an audience that cannot be forced to update.',
  },
  {
    title: 'The back end behind the app',
    body: 'APIs, authentication, push infrastructure and integrations. A mobile app is a client; most of the engineering is usually behind it.',
  },
];

const decisions = [
  {
    label: 'Choose native when',
    body: 'The product leans on platform behaviour, hardware, background execution or performance, or the interface has to feel genuinely at home on each platform.',
  },
  {
    label: 'Choose cross-platform when',
    body: 'The app is largely screens, data and forms, both platforms need parity, and one team maintaining one codebase is worth more than the last few per cent of native feel.',
  },
  {
    label: 'Choose neither when',
    body: 'A responsive web experience would do the job. An app that gets installed once and opened twice is an expensive way to have a website.',
  },
];

const faqs = [
  {
    q: 'Do you build native or cross-platform mobile applications?',
    a: 'Both, and the choice is made per product rather than by house preference. Native suits products that depend on platform behaviour, hardware, background execution or performance. Cross-platform suits products that are largely screens, data and forms where parity across both stores matters more than the last few per cent of native feel.',
  },
  {
    q: 'Can mobile be part of a wider platform programme?',
    a: 'Yes. Mobile can be a standalone product or one client of a wider SaaS or platform programme across iOS, Android and web, with the architecture chosen around the product and its operating requirements rather than around a single device.',
  },
  {
    q: 'Do you handle App Store and Google Play submission?',
    a: 'Yes. Store review requirements, privacy declarations, versioning and staged rollout are part of the build rather than a separate concern handed back to the client, and releases continue under a support arrangement afterwards.',
  },
];

export default function MobileApplicationsPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Mobile Applications',
          description:
            'Native iOS and Android and cross-platform mobile application development, store submission, and the APIs and infrastructure behind the app.',
          path: '/engineering/mobile-applications',
          serviceType: 'Mobile application development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          { name: 'Mobile Applications', path: '/engineering/mobile-applications' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Build · Mobile Applications</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Mobile as a product, not a port of the website
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Native iOS and Android and cross-platform builds, taken through store submission and kept
            maintained afterwards. Mobile can be the whole product or one client of a wider platform;
            the architecture follows the product, not the other way round.
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
      <Section labelledBy="mob-build-heading">
        <SectionHead title="What we build" id="mob-build-heading" />
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

      {/* -------------------------------------------------- the choice */}
      <Section labelledBy="mob-choice-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Native, cross-platform or neither"
              id="mob-choice-heading"
              title="The decision belongs to the product, not to the supplier"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Every mobile agency has a preferred answer and it is usually the one they already
              staff. We would rather make the choice in front of you, with the reasons written down,
              because it drives the cost of every change you make for the next several years.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Occasionally the honest answer is that you do not need an app at all, and we will say
              so before the budget is committed rather than after it is spent.
            </p>
          </div>

          <div className="grid" style={{ gap: 16 }}>
            {decisions.map(d => (
              <div
                className="card"
                key={d.label}
                style={
                  d.label === 'Choose neither when'
                    ? { background: '#FBF8F4', borderColor: '#edd8de' }
                    : undefined
                }
              >
                <span
                  className="step__n"
                  style={
                    d.label === 'Choose neither when' ? { color: 'var(--amber-ink)' } : undefined
                  }
                >
                  {d.label}
                </span>
                <p className="body" style={{ marginTop: 4, fontSize: 15 }}>
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- after */}
      <Section labelledBy="mob-after-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="After the first release"
              id="mob-after-heading"
              title="An app is never finished, it is only current"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Operating systems change annually, store requirements change without asking, and
              dependencies age whether or not you touch the code. A mobile product needs a standing
              maintenance route from the day it ships, or it degrades quietly until a review
              rejection makes it urgent.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/engineering/support-continuous-improvement">
                See support and continuous improvement
              </FLink>
            </p>
          </div>

          <div>
            <Eyebrow>Usually part of something larger</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Most mobile work we take on is one surface of a wider programme: a web platform, an API
              layer, an administrative back office and a set of integrations. Building the app in
              isolation from those is how a product ends up with three definitions of a customer.
            </p>
            <div style={{ marginTop: 28 }}>
              <Cta href="/engineering/web-platforms" variant="secondary">
                Web platforms
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a mobile product in mind?" ctaLabel="Scope a build">
        Tell us what it has to do and who has to use it. We will tell you whether it should be
        native, cross-platform or a web experience, and why.
      </ClosingCta>
    </>
  );
}
