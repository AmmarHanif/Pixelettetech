import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  JsonLd,
  MediaSlot,
  Section,
} from '@/components/ui';
import {
  caseStudies,
  displayKicker,
  displayName,
  publishedImage,
  publishedMetrics,
  workFilters,
  type WorkFilter,
} from '@/content/work';
import { ANALYTICS_EVENTS, ANALYTICS_SURFACES, analyticsAttrs } from '@/lib/analytics';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Work and case studies',
  description:
    'Every case study names the client where we are permitted to and states the engineering. Figures go up once the measurement basis and permission are confirmed.',
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
            Named clients. Named processes. No invented numbers.
          </h1>
          {/* Rewritten twice on 2026-09-08, and the second time is the one that
              matters. The first rewrite still led with "shows the number before
              and after", treating a held figure as the exception. Reconciling
              work.ts against the claims register the same day moved every
              numerical result behind the evidence gate, so that emphasis had
              become the opposite of what the page renders — and an overall
              presentation that misleads is a misleading action under DMCCA 2024
              s.226 even where each sentence is true. The gate is stated as the
              rule, because today it is the rule. */}
          <p className="lead" style={{ marginTop: 24 }}>
            Every case study on this site names the client where we are permitted to and states the
            engineering. Figures are a separate gate: a numerical result goes up only once its
            measurement basis and the client’s permission are both confirmed, and none has cleared
            that gate yet. So what follows is the challenge, the work and the result without a number
            on it. The figures are recorded, not discarded, and each one goes up when its evidence
            does.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta
              href="/contact"
              analytics={analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
                surface: ANALYTICS_SURFACES.WORK_INDEX_HERO,
              })}
            >
              Book a value baseline
            </Cta>
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
            {/* Name, kicker, artwork and figures all come through the accessors
                in work.ts rather than off the record directly. A case study
                whose client name is not cleared for publication renders the
                same card in the same grid, with the anonymised name, the
                anonymised kicker and the labelled media box the slot falls back
                to — the layout does not change, which is what the handoff
                asks for. */}
            {visible.map(cs => {
              const metrics = publishedMetrics(cs).slice(0, 3);
              return (
                <Link
                  key={cs.slug}
                  href={`/case-studies/${cs.slug}`}
                  className="work-card"
                  {...analyticsAttrs(ANALYTICS_EVENTS.CASE_STUDY_OPENED, {
                    surface: ANALYTICS_SURFACES.WORK_INDEX,
                    detail: cs.slug,
                  })}
                >
                  <MediaSlot
                    label={cs.imageLabel}
                    src={publishedImage(cs)}
                    alt={`${displayName(cs)} — ${cs.title}`}
                  />
                  <span className="mono work-card__kicker">{displayKicker(cs)}</span>
                  <h3 className="h3" style={{ marginTop: 12 }}>
                    {cs.title}
                  </h3>
                  <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                    {cs.summary}
                  </p>
                  {/* Rendered only when there is something in it. An empty
                      metrics row on a case study that publishes no figure adds
                      a gap under the summary and says nothing. */}
                  {metrics.length > 0 ? (
                    <div className="work-card__metrics">
                      {metrics.map(m => (
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
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      <ClosingCta title="Want the evidence behind a result?">
        Ask and we will walk you through the architecture, the evaluation approach and the
        measurement behind any result on this page — including the figures we are not yet
        publishing, and what it would take to publish them.
      </ClosingCta>
    </>
  );
}
