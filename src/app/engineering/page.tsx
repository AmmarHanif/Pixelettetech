import Link from 'next/link';

import { Cloud, Cpu, Mobile, Pen, Shield, Window } from '@/components/Icons';
import { ClosingCta, Testimonials, ValueModelCards } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  Faqs,
  JsonLd,
  MediaSlot,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { company } from '@/content/company';
import { caseStudies, displayKicker, displayName, publishedImage, publishedMetrics } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Claims sweep, 2026-09-08 (WP6).
 *
 * Removed from this page: the ISO 9001 and ISO 27001 badge tiles, the same two
 * badges asserted inside the Next.js metadata description below and inside the
 * Service JSON-LD, the "certified quality and information security management
 * systems" clause in the hero, and the "countries delivered in" tile (which
 * rendered blank once `company.countriesDelivered` was emptied). All are HELD
 * in src/content/claims.ts.
 *
 * A metadata description and a JSON-LD blob are the worst places to leave a
 * held badge: they are extracted, cached and quoted without the page around
 * them, so the qualifying context never travels with the claim.
 */
export const metadata = pageMetadata({
  title: 'Web, mobile and custom software',
  description:
    'Web platforms, mobile apps and custom software, built in the UK since 2018. Fixed-scope build, standing product team, or support and run.',
  path: '/engineering',
});

/**
 * The six specialist pages beneath this hub.
 *
 * They stand where the badge tiles used to, because the hero needed something
 * deliberate in that slot and this hub had no links to its own children at all.
 * Navigation earns the space that an unevidenced number was occupying.
 */
const servicePages = [
  { href: '/engineering/web-platforms', label: 'Web platforms' },
  { href: '/engineering/mobile-applications', label: 'Mobile applications' },
  { href: '/engineering/custom-software-saas', label: 'Custom software & SaaS' },
  { href: '/engineering/modernisation-integration', label: 'Modernisation & integration' },
  { href: '/engineering/cloud-data-engineering', label: 'Cloud & data engineering' },
  { href: '/engineering/managed-engineering', label: 'Managed engineering' },
];

const capabilities = [
  {
    id: 'web-platforms',
    icon: <Window size={32} />,
    title: 'Web platforms',
    body: 'Customer portals, marketplaces, booking and workflow systems, internal tools, and the APIs and infrastructure behind them.',
  },
  {
    id: 'mobile-applications',
    icon: <Mobile size={32} />,
    title: 'Mobile applications',
    body: 'Native iOS and Android and cross-platform builds, taken through store submission and kept maintained afterwards.',
  },
  {
    id: 'custom-software',
    icon: <Cpu size={32} />,
    title: 'Custom software',
    body: 'The system that does not come off the shelf, and the integration work that connects it to the systems that do.',
  },
  {
    id: 'product-design',
    icon: <Pen size={32} />,
    title: 'Product design',
    body: 'Interface and experience design as part of a build rather than sold as a separate line. Research, prototypes, design system, handover.',
  },
  {
    id: 'distributed-systems',
    icon: <Shield size={32} />,
    title: 'Distributed & cryptographic systems',
    body: 'High-assurance distributed systems and cryptographic engineering. Tokenisation, smart contracts and chain work have their own practice.',
    link: { href: '/blockchain', label: 'Go to Blockchain' },
  },
  {
    id: 'cloud-modernisation',
    icon: <Cloud size={32} />,
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
    a: 'It depends entirely on the codebase. Published evidence puts gains at roughly 35 to 40% on straightforward greenfield work and 10% or less on complex legacy code, and one randomised study found experienced developers were measurably slower with AI tools while believing they were faster. Pixelette quotes on which of those a project actually is: a new product gets the greenfield price, an estate built twelve years ago does not.',
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
            'Web platforms, mobile applications, custom software and integration, from a fixed-scope build through to a standing product team and ongoing support.',
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
            We build software that stays in service
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Web platforms, mobile applications, custom software and integration, delivered since{' '}
            {company.incorporated}. This is still the larger part of our business and we are not
            quiet about it.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a build</Cta>
            <Cta href="/case-studies" variant="secondary">
              See engineering work
            </Cta>
          </div>

          <div style={{ marginTop: 44 }}>
            <Eyebrow>The practice</Eyebrow>
            <div className="pill-row" style={{ marginTop: 16 }}>
              {servicePages.map(page => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="pill"
                  style={{ color: 'var(--brand)' }}
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- what we build */}
      <Section labelledBy="build-heading">
        <SectionHead title="What we build" id="build-heading" />
        {/*
          `.tile` rather than `.card` on founder instruction, to make this 6-up
          run more compact: 4px radius against 12, 20/22px padding against 28,
          and the lighter --shadow-tile. Column count is unchanged at 3, which is
          the right fit for six items; 4-up would leave a ragged second row.

          THE ICON WRAPPER IS A div, NOT A span, AND THAT IS LOAD-BEARING.
          `.tile span` in globals.css is a one-class-one-element selector, so it
          is MORE SPECIFIC than `.icon-slot` and wins regardless of source order.
          As a span the icon would take display:block, colour var(--muted) and
          margin-top 9px - losing its brand purple and its flex centring. A div
          does not match that selector, so `.icon-slot` applies intact and no CSS
          change is needed.
        */}
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {capabilities.map(cap => (
            <div key={cap.id} id={cap.id} className="tile" style={{ scrollMarginTop: 100 }}>
              <div className="icon-slot" aria-hidden>
                {cap.icon}
              </div>
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
              title="What AI actually does to the cost of a build"
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
              greenfield price. An estate built twelve years ago does not, and any supplier
              promising otherwise will find the difference in your change requests.
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
            title="Named clients, shipped systems"
          />
          <FLink href="/case-studies">Read the full case studies</FLink>
        </div>

        {/* Every field goes through the work.ts publication gate. Reading
            `cs.client`, `cs.kicker`, `cs.image` or `cs.metrics` here would
            publish a gated client's name and their own product screenshot the
            moment a PENDING slug joined the list above. The metrics line is
            conditional so an empty published set leaves no orphan paragraph. */}
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {featured.map(cs => {
            const metrics = publishedMetrics(cs).slice(0, 2);
            return (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
                <MediaSlot
                  label={cs.imageLabel}
                  src={publishedImage(cs)}
                  alt={`${displayName(cs)} — ${cs.title}`}
                />
                <span className="mono work-card__kicker">{displayKicker(cs)}</span>
                <h3 className="h4" style={{ marginTop: 10 }}>
                  {cs.title}
                </h3>
                {metrics.length > 0 ? (
                  <p className="small" style={{ marginTop: 10 }}>
                    {metrics.map(m => `${m.value} ${m.shortLabel ?? m.label}`).join(' · ')}
                  </p>
                ) : null}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* -------------------------------------------------- where this sits */}
      {/*
        Build • Automate • Decentralise • Run, reintroduced (2026-09-11).

        The implementation checklist asks for "four reusable cards used across
        homepage and service pages", and the handoff's developer summary gives
        the reason: "If a visitor remembers only four words, they should be:
        BUILD • AUTOMATE • DECENTRALISE • RUN." The cards were built reusable
        and then rendered on exactly one page, so a visitor who arrived here
        from search never met the model at all.

        Placed here rather than higher because this is the seam where the page
        stops arguing its own practice and starts relating it to the rest of the
        company — the next section cross-links to AI engineering, and these
        cards are the map that hand-off was missing. `detailed={false}` is the
        component's own service-page mode: the long paragraphs belong to section
        04 of the homepage, where the model is introduced rather than recalled.
        The tint also repairs a white-on-white run between this section and the
        one after it.
      */}
      <Section labelledBy="model-heading" style={{ background: '#F7FAFA' }}>
        {/*
            NOT the homepage's h2, which this used to repeat verbatim. That line
            is a POSITIONING statement and it is right on the page that
            introduces the company; on a hub the reader has already chosen, so
            they need to know where they are in the set, not what the company is.
            The same string was on all four pages until 2026-09-15.

            The homepage instance is deliberately unchanged.

            One string, used identically on /engineering, /ai-engineering and
            /blockchain, so it carries no practice-specific word. It is also the
            accessible name of this whole region -- SectionHead renders `title` as
            the h2 whose id the wrapping Section points at -- so it has to mean
            something read cold in a heading list, which "Where this sits" alone
            would not.
        */}
        <SectionHead
          eyebrow="Where this sits"
          id="model-heading"
          title="This is one of four services"
          lead="Build is this page. Automate, Decentralise and Run are the other three."
        />
        <div style={{ marginTop: 36 }}>
          <ValueModelCards current="BUILD" />
        </div>
      </Section>

      {/* ------------------------------------------------ where halves meet */}
      <Section labelledBy="meet-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Where the two halves meet"
              id="meet-heading"
              title="Most builds now have AI somewhere in them"
            />
            <p className="body" style={{ marginTop: 20 }}>
              When yours does, the same team that shipped it can evaluate it, monitor it and keep it
              inside the boundaries you set. That is not an upsell, it is the reason we built the AI
              capability in the first place: we were already being asked to keep this stuff working.
              Where a customer or a regulator wants formal governance around it, Pixelette Certified
              can scope the requirement and support the route to independent assessment.
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

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

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
