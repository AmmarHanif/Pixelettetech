import { ClosingCta, Testimonials } from '@/components/sections';
import { Cta, Eyebrow, JsonLd, Section, SectionHead, StatTile } from '@/components/ui';
import { certified, clutch, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About the firm',
  description:
    'Building production software since 2018 across thirteen countries, under ISO 9001 and ISO 27001. That discipline is why we stand behind an AI system.',
  path: '/about',
});

const faqs = [
  {
    q: 'When was Pixelette Technologies founded?',
    a: 'Pixelette Technologies Ltd was incorporated in 2018 under company registration number 11716825, and is headquartered at 77 Fulham Palace Road, London W6 8JA. It has delivered production software across thirteen countries.',
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
            {company.name} has built production software since {company.incorporated}, across
            thirteen countries, under certified quality and information security management systems.
            That operating discipline is why we can build AI into a client system and still stand
            behind it a year later.
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
            <SectionHead title="Why an engineering firm measures everything." id="measure-heading" />
            <p className="body" style={{ marginTop: 20 }}>
              Running an ISO 9001 quality system and an ISO 27001 information security system for
              years teaches you something most AI specialists have never had to learn: how to evidence
              that a thing works, repeatedly, to somebody who is not inclined to believe you.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              That is the discipline AI needs. The subject changed; the method did not. Where it has
              to end in a certificate rather than a working system, the work goes to {certified.name}{' '}
              rather than staying here. It is also why we start every engagement by measuring, and why
              we would rather publish a method you can check than a claim you cannot.
            </p>
          </div>

          <div className="grid grid-2" style={{ gap: 12 }}>
            <StatTile value={String(company.incorporated)} label={`Incorporated. CRN ${company.crn}`} />
            <StatTile value={String(company.countriesDelivered)} label="Countries delivered in" />
            <StatTile value="ISO 9001" label="Verifiable on the IAF registry" />
            <StatTile value="ISO 27001" label="Certificate published" />
            <StatTile
              value={String(clutch.ratingValue)}
              label={`Clutch, ${clutch.reviewCount} verified reviews`}
            />
            <StatTile value="UK" label="Headquartered, London W6" />
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- policy exposure */}
      <Section labelledBy="policy-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <SectionHead
            eyebrow="Policy exposure"
            id="policy-heading"
            title="Stated precisely, because the precision is the point."
          />
          <div>
            <p className="body">
              Our founder holds a shareholding in Big Innovation Centre, which acts as Secretariat to
              the All-Party Parliamentary Group on Artificial Intelligence. That gives us visibility of
              UK AI policy as it forms.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              It is <b>not an accreditation, an endorsement or a partnership</b>, and we do not present
              it as one. It appears here rather than beside our certifications for exactly that
              reason.
            </p>
          </div>
        </div>
      </Section>

      <Testimonials heading="What clients say" />

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
