import Link from 'next/link';

import { Cloud, Cpu, Mobile, Pen, Shield, Window } from '@/components/Icons';
import { ClosingCta, Testimonials } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  MediaSlot,
  Section,
  SectionHead,
  SourceNote,
  StatTile,
} from '@/components/ui';
import { company } from '@/content/company';
import { caseStudies } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Web, mobile and custom software',
  description:
    'Web platforms, mobile apps and custom software, built in the UK since 2018 under ISO 9001 and ISO 27001. Fixed-scope, product team or support and run.',
  path: '/engineering',
});

const capabilities = [
  {
    id: 'web-platforms',
    icon: <Window size={24} />,
    title: 'Web platforms',
    body: 'Customer portals, marketplaces, booking and workflow systems, internal tools, and the APIs and infrastructure behind them.',
  },
  {
    id: 'mobile-applications',
    icon: <Mobile size={24} />,
    title: 'Mobile applications',
    body: 'Native iOS and Android and cross-platform builds, taken through store submission and kept maintained afterwards.',
  },
  {
    id: 'custom-software',
    icon: <Cpu size={24} />,
    title: 'Custom software',
    body: 'The system that does not come off the shelf, and the integration work that connects it to the systems that do.',
  },
  {
    id: 'product-design',
    icon: <Pen size={24} />,
    title: 'Product design',
    body: 'Interface and experience design as part of a build rather than sold as a separate line. Research, prototypes, design system, handover.',
  },
  {
    id: 'distributed-systems',
    icon: <Shield size={24} />,
    title: 'Distributed & cryptographic systems',
    body: 'High-assurance distributed systems and cryptographic engineering. Tokenisation, smart contracts and chain work have their own practice.',
    link: { href: '/blockchain', label: 'Go to Blockchain' },
  },
  {
    id: 'cloud-modernisation',
    icon: <Cloud size={24} />,
    title: 'Cloud & modernisation',
    body: 'Migration, re-platforming and the unglamorous legacy work that most of the market quietly avoids.',
  },
];

const engagementModels = [
  {
    label: 'Fixed-scope build',
    body: 'A defined outcome, a fixed price and a date. Best when you know what you want built.',
  },
  {
    label: 'Product team',
    body: 'A standing team against a roadmap and a quarterly outcome, not a headcount you manage. Best when the destination will move.',
  },
  {
    label: 'Support & run',
    body: 'We keep what we built working, on a monthly contract. One contract covers the conventional software and any AI we built into it.',
  },
];

const faqs = [
  {
    q: 'Does AI really make a software build cheaper?',
    a: 'It depends entirely on the codebase. Published evidence puts gains at roughly 35 to 40% on straightforward greenfield work and 10% or less on complex legacy code, and one randomised study found experienced developers were measurably slower with AI tools while believing they were faster. Pixelette quotes on which of those a project actually is: a new product gets the greenfield price, a twelve-year-old estate does not.',
  },
  {
    q: 'How does Pixelette Technologies price a build?',
    a: 'Three commercial models: a fixed-scope build for a defined outcome with a fixed price and date; a standing product team against a roadmap and a quarterly outcome; and a monthly support-and-run contract covering the software and any AI built into it. The firm does not sell developers by the day.',
  },
  {
    q: 'What happens after the build ships?',
    a: 'A typical path runs fixed-scope build, then a monthly support-and-run contract, then AI added to a process inside it — baselined first so the change is measurable — then evaluation and monitoring reported monthly on drift, cost and incidents.',
  },
];

export default function EngineeringPage() {
  const featured = caseStudies.filter(c =>
    // The board features a platform build and a marketplace build. BlockGuard
    // is the platform, exactly as designed. Stay Sane fills the marketplace
    // slot the board labelled Butter Smiles — those figures are Stay Sane's
    // (ADR-0006). LawLedger fills the board's third, empty card with real work.
    ['blockguard', 'chysler', 'law-ledger'].includes(
      c.slug,
    ),
  );

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Software engineering',
          description:
            'Web platforms, mobile applications, custom software and integration, delivered under ISO 9001 and ISO 27001 certified management systems.',
          path: '/engineering',
          serviceType: 'Custom software development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Engineering</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '18ch' }}>
            We build software that has to keep working.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Web platforms, mobile applications, custom software and integration, delivered since{' '}
            {company.incorporated} under certified quality and information security management
            systems. This is still the larger part of our business and we are not quiet about it.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a build</Cta>
            <Cta href="/case-studies" variant="secondary">
              See engineering work
            </Cta>
          </div>

          <div className="grid grid-4" style={{ marginTop: 48 }}>
            <StatTile value={String(company.incorporated)} label="Building production software since" />
            <StatTile value={String(company.countriesDelivered)} label="Countries delivered in" />
            <StatTile value="ISO 9001" label="Quality management, verifiable" />
            <StatTile value="ISO 27001" label="Information security, certified" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- what we build */}
      <Section labelledBy="build-heading">
        <SectionHead title="What we build" id="build-heading" />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {capabilities.map(cap => (
            <div key={cap.id} id={cap.id} className="card" style={{ scrollMarginTop: 100 }}>
              <span style={{ color: 'var(--brand)', display: 'inline-flex' }} aria-hidden>
                {cap.icon}
              </span>
              <h3 className="h3" style={{ marginTop: 18 }}>
                {cap.title}
              </h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {cap.body}
              </p>
              {cap.link ? (
                <p style={{ marginTop: 16 }}>
                  <FLink href={cap.link.href}>{cap.link.label}</FLink>
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- straight talk */}
      <Section labelledBy="straight-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Straight talk"
              id="straight-heading"
              title="What AI actually does to the cost of a build."
              lead="Every agency is now claiming AI makes them dramatically faster. The published evidence is more specific than that, and more useful to you."
            />
          </div>
          <div>
            <p className="body">
              Gains run at roughly <b>35 to 40% on straightforward greenfield work</b> and{' '}
              <b>10% or less on complex legacy code</b>. One randomised study found experienced
              developers were measurably slower with AI tools while believing they were faster.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              So we quote on which of those your project actually is. A new product gets the
              greenfield price. A twelve-year-old estate does not, and any supplier promising
              otherwise will find the difference in your change requests.
            </p>
            <SourceNote>DORA 2026 and METR, 2025–2026</SourceNote>
          </div>
        </div>

        <div className="grid grid-3" style={{ marginTop: 48 }}>
          {engagementModels.map(model => (
            <div className="tile" key={model.label} style={{ padding: '24px 26px' }}>
              <span className="step__n">{model.label}</span>
              <p className="small" style={{ marginTop: 4 }}>
                {model.body}
              </p>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 26, maxWidth: '72ch' }}>
          We do not sell developers by the day. If what you want is bodies on a timesheet, we are the
          wrong supplier and we will say so on the first call.
        </p>
      </Section>

      {/* -------------------------------------------------- selected builds */}
      <Section labelledBy="selected-heading">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <SectionHead
            eyebrow="Selected builds"
            id="selected-heading"
            title="Named clients, shipped systems."
          />
          <FLink href="/case-studies">All work</FLink>
        </div>

        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {featured.map(cs => (
            <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
              <MediaSlot label={cs.imageLabel} src={cs.image} alt={`${cs.client} — ${cs.title}`} />
              <span className="mono work-card__kicker">{cs.kicker}</span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                {cs.title}
              </h3>
              <p className="small" style={{ marginTop: 10 }}>
                {cs.metrics
                  .slice(0, 2)
                  .map(m => `${m.value} ${m.shortLabel ?? m.label}`)
                  .join(' · ')}
              </p>
            </Link>
          ))}

        </div>
      </Section>

      {/* ------------------------------------------------ where halves meet */}
      <Section labelledBy="meet-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Where the two halves meet"
              id="meet-heading"
              title="Most builds now have AI somewhere in them."
            />
            <p className="body" style={{ marginTop: 20 }}>
              When yours does, the same team that shipped it can evaluate it, monitor it and keep it
              inside the boundaries you set. That is not an upsell, it is the reason we built the AI
              capability in the first place: we were already being asked to keep this stuff working.
              Certification of it, when a customer or a regulator wants one, goes to Pixelette
              Certified.
            </p>
            <div style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering" variant="secondary">
                See AI engineering
              </Cta>
            </div>
          </div>

          <div>
            <Eyebrow>A typical path</Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 14 }}>
              {[
                ['01', 'Fixed-scope build', 'The platform, the app, the integration'],
                ['02', 'Support & run', 'We keep it working on a monthly contract'],
                ['03', 'AI added to a process inside it', 'Baselined first, so the change is measurable'],
                ['04', 'Evaluation and monitoring', 'Evaluation, drift, cost and incidents, reported monthly'],
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

      <Testimonials heading="What clients say" />

      <ClosingCta
        title="Have something you need built?"
        ctaLabel="Scope a build"
      >
        Tell us what it is and what it has to do. We will tell you whether it is a fixed-scope build
        or a product team, and roughly what it costs, before anyone books a workshop.
      </ClosingCta>
    </>
  );
}
