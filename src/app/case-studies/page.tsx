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
import { breadcrumbSchema, itemListSchema } from '@/lib/schema';
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
      {/*
        The 29 studies as an ordered list, added 2026-09-15. This page emitted a
        BreadcrumbList and nothing else — it told an answer engine where it sits
        in the hierarchy and nothing whatever about what is on it.

        NAMES COME THROUGH `displayName`, not from `cs.client`. Three studies are
        still name-gated, and a graph that listed the real client while the page
        showed an anonymised label would leak the exact thing the gate exists to
        withhold — in the channel that is hardest to take back. The gate holds
        here for the same reason it holds on the image.

        The full list, not the filtered `visible` set: the canonical URL for this
        page does not vary with `?filter=`, so the graph should not either.
      */}
      <JsonLd
        data={itemListSchema(
          caseStudies.map(cs => ({
            name: displayName(cs),
            path: `/case-studies/${cs.slug}`,
          })),
        )}
      />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Work</Eyebrow>
          {/*
            REWRITTEN 2026-09-17 on founder instruction: "give me a less
            aggressive statement. Isn't this page about the case studies?"

            Both halves of that were right. "Named clients. Named processes. No
            invented numbers." argued with an accusation nobody had made - it
            read as defensive, and a reader arriving at an index page has not
            yet doubted anything. It also described our EVIDENCE POLICY rather
            than the page, which is the index of the work itself.

            The policy has not gone anywhere; it is the lead paragraph below,
            where a reader who wants it will find it, stated rather than
            asserted at them. The headline now says what the page is.
          */}
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Selected work, and the engineering behind it
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
              Book a conversation
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
                    alt={`${displayName(cs)}: ${cs.title}`}
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
                          {/* data-placeholder added 2026-09-14. These wear the amber
                              placeholder styling but carried no attribute, so the
                              audit counter - which counts data-placeholder - could
                              not see them. Eighteen [MEASURED RESULT] tiles were
                              outstanding content on no list. They ARE gaps awaiting
                              evidence, so they are counted; the `intentional` escape
                              hatch on Placeholder exists for the copy that is not. */}
                          <b
                            className={m.pending ? 'ph' : undefined}
                            style={m.pending ? { fontSize: 15 } : undefined}
                            {...(m.pending ? { 'data-placeholder': 'true' } : {})}
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
        measurement behind any result on this page, including the figures we are not yet
        publishing, and what it would take to publish them.
      </ClosingCta>
    </>
  );
}
