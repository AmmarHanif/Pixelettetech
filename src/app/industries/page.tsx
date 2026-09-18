import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, JsonLd, Section } from '@/components/ui';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Industries',
  description:
    'Where we have published sector-specific work: professional and business services, and insurance and specialist financial services.',
  path: '/industries',
});

/*
 * THE INDUSTRIES INDEX, added 2026-09-14 to close three defects at once rather
 * than because a hub was wanted for its own sake.
 *
 *  1. /industries returned 404. A visitor who trims the last segment off
 *     /industries/professional-services met a dead end on a section that
 *     plainly exists.
 *
 *  2. TWO BREADCRUMB TRAILS WERE ASSERTING A STRUCTURE THAT DID NOT EXIST, and
 *     this is the one that mattered. /industries/professional-services emitted
 *     positions 2 and 3 pointing at the SAME URL, and
 *     /industries/insurance-financial-services named
 *     /industries/professional-services as its parent — telling Google its
 *     parent is its sibling. Both had to point somewhere, and inventing a rung
 *     was not an option, so the rung now exists.
 *
 *  3. Both sector pages sit at sitemap priority 0.8 and were reachable only
 *     from /ai-engineering and from each other. Two commercial pages one hop off
 *     a single hub is a thin internal-link position for their weighting.
 *
 * WHAT THIS PAGE DELIBERATELY IS NOT. It does not invent sector coverage. The
 * previous site listed ten sectors as unlinked spans on its homepage, and that
 * block was deleted the same day precisely because ten names with two
 * destinations is a promise the site cannot keep. This page lists exactly the
 * two sectors that have a published page behind them, and says so.
 */

const sectors = [
  {
    title: 'Professional and business services',
    href: '/industries/professional-services',
    body:
      '78% of UK corporate clients call AI-enabled quality improvement essential. 7% say providers deliver it. We close that gap and give you the evidence.',
  },
  {
    title: 'Insurance and specialist financial services',
    href: '/industries/insurance-financial-services',
    body:
      'Nearly half of regulated firms only partly understand the AI they already run. We make it explainable, monitored and defensible for a supervisor.',
  },
];

export default function IndustriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
        ])}
      />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Industries</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '24ch' }}>
            Where we have published sector work
          </h1>
          <p className="lead" style={{ marginTop: 24, maxWidth: '68ch' }}>
            Two sectors have a page here because two sectors have work behind them. We engineer for
            others, and the engagements on our work index cover digital assets, health, legal
            and fintech. But a sector page should mean a published position rather than a label, so
            this list stays short until the next one earns a page.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/case-studies" variant="secondary">
              See the work
            </Cta>
          </div>
        </div>
      </div>

      <Section labelledBy="sectors-heading">
        <h2 className="visually-hidden-heading" id="sectors-heading">
          Sectors with a published page
        </h2>
        <div className="grid grid-2">
          {sectors.map(sector => (
            <Link key={sector.href} href={sector.href} className="card service-card">
              <h3 className="h3">{sector.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {sector.body}
              </p>
              <div style={{ flexGrow: 1 }} />
              <p className="flink" style={{ marginTop: 16, color: 'var(--brand)' }}>
                Read the sector position →
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <ClosingCta title="Your sector is not the interesting part. Your process is">
        Bring us the process that is costing you, and we will tell you what it would take to
        instrument it, whether your sector has a page here or not.
      </ClosingCta>
    </>
  );
}
