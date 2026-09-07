import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  JsonLd,
  MediaSlot,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { professionalServicesStats } from '@/content/sources';
import { caseStudies } from '@/content/work';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI for professional services',
  description:
    '78% of UK corporate clients call AI-enabled quality improvement essential. 7% say providers deliver it. We close that gap and give you the evidence.',
  path: '/industries/professional-services',
});

const opportunities = [
  {
    title: 'Client reporting and deliverable production',
    body: 'Where the hours go, and the easiest place to show a client a measured improvement.',
  },
  {
    title: 'Bid and proposal cycle',
    body: 'The process we ran on ourselves first, which is why we can show you the working.',
  },
  {
    title: 'Knowledge and precedent retrieval',
    body: 'With entitlements respected, which is the part that stops most firms rolling it out.',
  },
  {
    title: 'Client-facing AI evidence pack',
    body: 'The technical evidence a client asks for when they want to know how AI touched their matter. Formal certification of it runs through Pixelette Certified.',
  },
];

const faqs = [
  {
    q: 'Why are professional services clients asking what AI has done for them?',
    a: '78% of UK corporate clients say AI-enabled quality improvement is essential or very important, while only 7% say their providers are actually delivering it. One in five is prepared to move within twelve months, with around £20bn of UK client revenue under active reconsideration (Thomson Reuters Future of Professionals 2026, UK sample).',
  },
  {
    q: 'What separates firms that get value from AI from those that do not?',
    a: 'A named strategy. Firms with one reach their expected value 66% of the time; firms without one, 22% (Thomson Reuters Future of Professionals 2026). The gap in this sector is not adoption — most firms have bought the tools — it is being able to walk a client through what changed, with a number.',
  },
];

export default function ProfessionalServicesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries/professional-services' },
          { name: 'Professional & business services', path: '/industries/professional-services' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Industries · Professional & business services</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Your clients have started asking what AI has done for them.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            78% of UK corporate clients say AI-enabled quality improvement is essential or very
            important. 7% say their providers are actually delivering it. One in five is prepared to
            move within twelve months.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            <Cta href="/industries/insurance-financial-services" variant="secondary">
              Insurance & specialist FS
            </Cta>
          </div>

          {/* Tiles use the compressed label where the board has one: the first
              two claims are stated in full in the lead directly above, so
              repeating them verbatim reads as padding and crowds the tile. */}
          <div className="grid grid-4" style={{ marginTop: 48 }}>
            {professionalServicesStats.map(stat => (
              <div className="tile" key={stat.value + stat.label}>
                <b>{stat.value}</b>
                <span>{stat.shortLabel ?? stat.label}</span>
              </div>
            ))}
          </div>
          <SourceNote>All four figures: {professionalServicesStats[0]!.source}</SourceNote>
        </div>
      </div>

      {/* ------------------------------------------------------------- gap */}
      <Section labelledBy="ps-gap-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead title="The gap is not adoption. It is evidence." id="ps-gap-heading" />
            <p className="body" style={{ marginTop: 20 }}>
              Most firms in this sector have bought AI tools. Very few can walk a client through what
              changed, with a number. That is now a commercial risk rather than a technology one, and
              it is fixable in a quarter.
            </p>
          </div>
          <div className="card">
            <p className="quote">
              Firms with a named AI strategy reach their expected value 66% of the time. Firms without
              one, 22%.
            </p>
            <SourceNote>Thomson Reuters Future of Professionals 2026</SourceNote>
          </div>
        </div>

        <div className="grid grid-4" style={{ marginTop: 44 }}>
          {opportunities.map(o => (
            <div className="card" key={o.title}>
              <h3 className="h4">{o.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 14.5 }}>
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ sector work */}
      <Section labelledBy="ps-work-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Sector work" id="ps-work-heading" title="Published as it is measured." />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {[0, 1, 2].map(i => (
            <div className="work-card work-card--empty" key={i}>
              <MediaSlot label="Case study image" />
              <span className="mono work-card__kicker">
                <Placeholder>CLIENT</Placeholder>
              </span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                <Placeholder>NAMED PROCESS AND RESULT</Placeholder>
              </h3>
              <p className="small" style={{ marginTop: 10 }}>
                <Placeholder>MEASURED FIGURE</Placeholder>
              </p>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 24, fontStyle: 'italic' }}>
          Placeholders stay visible until a real engagement fills them. We do not use stock case
          studies.
        </p>
      </Section>

      <ClosingCta title="Being asked by clients what AI has done for them?">
        The baseline gives you the answer in four weeks, with the measurement to back it.
      </ClosingCta>
    </>
  );
}
