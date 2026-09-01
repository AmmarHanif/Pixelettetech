import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  JsonLd,
  MediaSlot,
  Placeholder,
  Section,
} from '@/components/ui';
import { caseStudies, workFilters, type WorkFilter } from '@/content/work';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Work and case studies',
  description:
    'Every case study names the client where we are permitted to, states the process, and shows the number before and after. No stock case studies.',
  path: '/case-studies',
});

/** Filter slugs are part of the URL, so each filtered view is linkable. */
function toSlug(filter: WorkFilter): string {
  return filter.toLowerCase().replace(/&/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const active = workFilters.find(f => toSlug(f) === filter);

  // Filtering happens on the server so every view is a real, indexable URL
  // rather than a client-side state change search engines never see.
  const visible = active ? caseStudies.filter(c => c.filters.includes(active)) : caseStudies;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/case-studies' },
        ])}
      />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Work</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Named clients. Named processes. Measured results.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Every case study on this site names the client where we are permitted to, states the
            process, and shows the number before and after. Where a client cannot be named, we say so
            and publish the sector metric instead.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            {/* The board pairs the primary CTA with a visible "Filter by sector"
                affordance. Without it the chips below are only announced to
                screen readers — a sighted visitor has nothing telling them the
                list is filterable. */}
            <a className="btn2" href="#filters">
              Filter by sector
            </a>
          </div>
        </div>
      </div>

      <Section labelledBy="work-list-heading" flush style={{ paddingTop: 48 }}>
        <h2 className="visually-hidden-heading" id="work-list-heading">
          Case studies
        </h2>

        <nav id="filters" aria-label="Filter case studies by sector and service" style={{ scrollMarginTop: 100 }}>
          <ul className="filters">
            <li>
              <Link
                href="/case-studies"
                className="filter"
                aria-current={!active ? 'page' : undefined}
              >
                All
              </Link>
            </li>
            {workFilters.map(f => (
              <li key={f}>
                <Link
                  href={`/case-studies?filter=${toSlug(f)}`}
                  className="filter"
                  aria-current={active === f ? 'page' : undefined}
                >
                  {f}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {visible.length === 0 ? (
          <p className="body" style={{ marginTop: 40 }}>
            No published case studies carry that label yet.{' '}
            <Link href="/case-studies">Show all work</Link>.
          </p>
        ) : (
          <div className="grid grid-2" style={{ marginTop: 40 }}>
            {visible.map(cs => (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
                <MediaSlot label={cs.imageLabel} src={cs.image} alt={`${cs.client} — ${cs.title}`} />
                <span className="mono work-card__kicker">{cs.kicker}</span>
                <h3 className="h3" style={{ marginTop: 12 }}>
                  {cs.title}
                </h3>
                <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                  {cs.summary}
                </p>
                <div className="work-card__metrics">
                  {cs.metrics.slice(0, 3).map(m => (
                    <span key={m.label}>
                      <b
                        className={m.pending ? 'ph' : undefined}
                        style={m.pending ? { fontSize: 15 } : undefined}
                      >
                        {m.value}
                      </b>
                      <span>{m.shortLabel ?? m.label}</span>
                    </span>
                  ))}
                </div>
              </Link>
            ))}

            {/* The next engagement's slot, stated rather than hidden. */}
            <div className="work-card work-card--empty">
              <MediaSlot label="Next case study" />
              <span className="mono work-card__kicker">
                <Placeholder intentional>YOUR ENGAGEMENT HERE</Placeholder>
              </span>
              <h3 className="h3" style={{ marginTop: 12 }}>
                Your engagement here
              </h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                Every baseline produces a measured before and after. Publishing it is optional, and
                yours to approve.
              </p>
            </div>
          </div>
        )}
      </Section>

      <ClosingCta title="Want the detail behind a number?">
        Every case study links to the architecture, the evaluation approach and, where the client
        agreed, a reference call.
      </ClosingCta>
    </>
  );
}
