import { ClosingCta, Testimonials } from '@/components/sections';
import { Cta, Eyebrow, Faqs, JsonLd, Section, SectionHead, StatTile } from '@/components/ui';
import { certified, clutch, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Claims sweep, 2026-09-08 (WP6).
 *
 * Four held claims were removed from this page: the geography count
 * ("thirteen countries"), the ISO 9001 and ISO 27001 badges, and the Clutch
 * rating tile. Each is HELD in src/content/claims.ts and none had evidence in
 * the repository. Two of them were also sitting in machine-readable surfaces —
 * the Next.js metadata description below and the FAQ answer that feeds
 * FAQPage JSON-LD — where a claim outlives the page copy and gets quoted back
 * without its context.
 *
 * The Clutch tile is gated rather than deleted: `clutch.published` is the
 * existing switch and it flips the day someone re-reads the live profile.
 */
export const metadata = pageMetadata({
  title: 'About the firm',
  description:
    'Building production software since 2018, with the operating discipline to evidence that a system works. That discipline is why we stand behind an AI system.',
  path: '/about',
});

const faqs = [
  {
    q: 'When was Pixelette Technologies founded?',
    a: 'Pixelette Technologies Ltd was incorporated in 2018 under company registration number 11716825, and is headquartered at 77 Fulham Palace Road, London W6 8JA. It has been building production software for clients ever since.',
  },
  {
    q: 'What is Pixelette Technologies’ connection to UK AI policy?',
    a: 'Our founder holds a shareholding in Big Innovation Centre, which acts as Secretariat to the All-Party Parliamentary Group on Artificial Intelligence. That gives visibility of UK AI policy as it forms. It is not an accreditation, an endorsement or a partnership, and it is not presented as one.',
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>About</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Since {company.incorporated}, shipping systems that had to keep working.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            {company.name} has built production software since {company.incorporated}: web
            platforms, mobile applications, custom software and the integration work underneath
            them. That operating discipline is why we can build AI into a client system and still
            stand behind it a year later.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            <Cta href="/case-studies" variant="secondary">
              See the work
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- why we measure */}
      <Section labelledBy="measure-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead title="Why an engineering firm measures everything" id="measure-heading" />
            <p className="body" style={{ marginTop: 20 }}>
              Running a quality management process and an information security management process
              for years teaches you something most AI specialists have never had to learn: how to
              evidence that a thing works, repeatedly, to somebody who is not inclined to believe
              you.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              That is the discipline AI needs. The subject changed; the method did not. Where a
              programme needs formal governance, or a route to independent assessment rather than a
              working system, that is {certified.name}’s work to scope and coordinate rather than
              ours. It is also why we start every engagement by measuring, and why we would rather
              publish a method you can check than a claim you cannot.
            </p>
          </div>

          {/* Two facts a stranger can check for themselves at Companies House,
              plus the Clutch rating behind its own switch. The ISO 9001, ISO
              27001 and "countries delivered in" tiles that stood here are HELD
              in claims.ts, and `company.countriesDelivered` is now an empty
              string, so that tile was already rendering a number-shaped blank. */}
          <div className="grid grid-2" style={{ gap: 12 }}>
            <StatTile value={String(company.incorporated)} label={`Incorporated. CRN ${company.crn}`} />
            <StatTile value="UK" label="Headquartered, London W6" />
            {clutch.published ? (
              <StatTile
                value={String(clutch.ratingValue)}
                label={`Clutch, ${clutch.reviewCount} verified reviews, read ${clutch.lastVerified}`}
              />
            ) : null}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- policy exposure */}
      <Section labelledBy="policy-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <SectionHead
            eyebrow="Policy exposure"
            id="policy-heading"
            title="Stated precisely, because the precision is the point"
          />
          <div>
            <p className="body">
              Our founder holds a shareholding in Big Innovation Centre, which acts as Secretariat to
              the All-Party Parliamentary Group on Artificial Intelligence. That gives us visibility of
              UK AI policy as it forms.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              It is <b>not an accreditation, an endorsement or a partnership</b>, and we do not present
              it as one. It sits in its own section, deliberately away from anything that could be
              read as a credential, for exactly that reason.
            </p>
          </div>
        </div>
      </Section>

      <Testimonials heading="What clients say" />

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta
        title="Want to test whether we know what we are talking about?"
        ctaHref="/insights"
        ctaLabel="Read the methodology"
      >
        Read the methodology first. It is free, it is detailed, and it will tell you more than a
        capability deck.
      </ClosingCta>
    </>
  );
}
