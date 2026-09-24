import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, JsonLd, Section, SectionHead } from '@/components/ui';
import {
  FILTER_CATEGORIES,
  archive,
  featuredInsight,
  isPublished,
  listedInsights,
  publishedInsights,
  type Insight,
} from '@/content/insights';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * The Insights hub, rebuilt 2026-09-24 to the founder's brief.
 *
 * NO NEW DESIGN LANGUAGE. Every section here is built from the components and
 * tokens the rest of the site already uses — Section, SectionHead, Eyebrow, Cta,
 * FLink, .card, .tile, .grid-3, .h1/.h2/.h4, .lead, .body, .small. The brief's
 * first instruction is "DO NOT redesign the website", so the editorial feel
 * comes from scale, spacing and restraint rather than from new furniture. The
 * only additions to globals.css are the filter chips and the card rhythm, both
 * of which reuse existing colour and border tokens.
 *
 * NOTHING IS PUBLISHED YET, AND THE PAGE IS BUILT AROUND THAT RATHER THAN
 * AGAINST IT. Every card renders its real state: a pipeline piece shows its
 * category, headline and standfirst and says "In preparation" where a published
 * one shows a date, a reading time and a link. No pipeline card is clickable,
 * because §4 and §20 both forbid an article link that leads nowhere, and the
 * cheapest way to honour that is to make the link conditional on the type rather
 * than on someone remembering.
 *
 * THE PAGE STAYS `noIndex` UNTIL SOMETHING IS PUBLISHED. That line was set on
 * 2026-09-16 and is deliberately kept: an index of ten commissioned headlines is
 * exactly the thin content §15 and §17 are written to prevent, and it is now
 * linked from every page's navigation, so it would be found. Remove it in the
 * same commit that publishes the first real article — the condition is stated at
 * the line itself.
 */

export const metadata = pageMetadata({
  title: 'Insights',
  description:
    'Practical thinking on software engineering, AI, automation, blockchain and the technologies shaping what comes next.',
  path: '/insights',
  /*
   * KEPT, and the reason has changed. It was set 2026-09-16 because the page was
   * withdrawn from the navigation. It is now IN the navigation (founder
   * instruction 2026-09-24), so the reason is no longer "nobody can reach it" —
   * it is that nothing here is written yet. Ten commissioned headlines with no
   * bodies is the thin content §15 forbids, and the page is now reachable from
   * every page on the site, so a crawler would find it.
   *
   * REMOVE THIS LINE IN THE SAME COMMIT THAT PUBLISHES THE FIRST ARTICLE, not
   * before and not separately. `publishedInsights.length > 0` is the condition.
   */
  noIndex: true,
});

/* ------------------------------------------------------------------ cards -- */

/**
 * One article card. Published pieces link and carry their metadata; pipeline
 * pieces render the same shape and say what they are.
 *
 * The category lives on `data-cat` because the filter below is CSS-only and
 * selects on it. Keeping it as a data attribute rather than a class means the
 * category string stays the single source of truth for the chip, the card label
 * and the filter rule at once.
 */
function InsightCard({ item }: { item: Insight }) {
  const published = isPublished(item);

  const meta = published ? (
    <>
      <time dateTime={item.publishedOn}>
        {new Date(item.publishedOn).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </time>
      {' · '}
      {item.readingMinutes} min read
    </>
  ) : (
    /* Not a placeholder awaiting a value — a true statement of where the piece
       is. §17: show what exists, and say so. */
    <span className="ins-card__state">In preparation</span>
  );

  return (
    <article className="card ins-card" data-cat={item.category}>
      <Eyebrow>{item.category}</Eyebrow>
      <h3 className="h4 ins-card__title">
        {published ? (
          <Link href={`/blog/${item.slug}`}>{item.title}</Link>
        ) : (
          item.title
        )}
      </h3>
      <p className="body ins-card__summary">{item.summary}</p>
      <p className="small ins-card__meta">{meta}</p>
      {published ? (
        <p className="ins-card__cta">
          <FLink href={`/blog/${item.slug}`}>Read article</FLink>
        </p>
      ) : null}
    </article>
  );
}

/* ------------------------------------------------------------------- page -- */

const collections = [
  {
    eyebrow: 'Engineering',
    title: 'Building software that survives production.',
    body: 'Architecture, cloud, integration, performance and what happens after launch.',
    href: '/engineering',
    cta: 'Explore Engineering',
  },
  {
    eyebrow: 'AI & Automation',
    title: 'Moving AI from demonstration to operation.',
    body: 'Agents, workflows, retrieval, evaluation and production AI.',
    href: '/ai-automation',
    cta: 'Explore AI & Automation',
  },
  {
    eyebrow: 'Blockchain',
    title: 'Where decentralisation earns its place.',
    body: 'Practical applications, infrastructure, security and when not to use blockchain.',
    href: '/blockchain',
    cta: 'Explore Blockchain',
  },
  {
    eyebrow: 'Emerging Technology',
    title: "What we're watching next.",
    body: 'Quantum computing, post-quantum security and technologies approaching commercial relevance.',
    /*
     * The only one of the four with no service section behind it, deliberately.
     * §7: this section "must NOT imply Pixelette has extensive delivery history
     * in every emerging technology discussed". The other three point at a
     * service we sell; this one points back at the reading, which is what it
     * actually is. The note under it says so rather than leaving a reader to
     * infer parity with the others.
     */
    href: '#latest-thinking',
    cta: 'Explore Emerging Technology',
    note: 'Analysis and exploration rather than a delivery record.',
  },
];

export default function InsightsPage() {
  const hasPublished = publishedInsights.length > 0;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />

      {/* ------------------------------------------------------------- hero */}
      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Ideas for building what comes next.
          </h1>
          <p className="lead" style={{ marginTop: 24, maxWidth: '62ch' }}>
            Practical thinking on software engineering, AI, automation, blockchain and the
            technologies shaping what comes next.
          </p>
          {/*
            NO CTA HERE, on instruction (§2): "Do NOT put a large Book a
            conversation CTA immediately underneath the hero. This is an
            editorial page." The conversation is offered at the foot of the page
            once the reader has had something to read.
          */}
        </div>
      </div>

      {/*
        ------------------------------------------------------- filter + grid
        One scope element wraps the radios, the chips and the grid, because the
        filter is CSS-only: the rules select the grid as a SIBLING of the checked
        radio. No JavaScript, so it cannot fail to hydrate and costs nothing to
        load — and on a page whose own subject is engineering restraint, a filter
        that needs a bundle would be a poor advertisement.

        The radios are visually hidden but focusable, so the chips are reachable
        by keyboard and arrow-navigable as a normal radio group.
      */}
      <Section labelledBy="latest-heading" style={{ paddingTop: 8 }}>
        <div className="ins-scope">
          {FILTER_CATEGORIES.map((cat, i) => (
            <input
              key={cat}
              type="radio"
              name="ins-cat"
              id={`ins-cat-${i}`}
              className="ins-radio"
              defaultChecked={false}
            />
          ))}
          <input
            type="radio"
            name="ins-cat"
            id="ins-cat-all"
            className="ins-radio"
            defaultChecked
          />

          <fieldset className="ins-filter">
            <legend className="visually-hidden-heading">Filter insights by topic</legend>
            <label className="ins-chip" htmlFor="ins-cat-all">
              All
            </label>
            {FILTER_CATEGORIES.map((cat, i) => (
              <label className="ins-chip" key={cat} htmlFor={`ins-cat-${i}`}>
                {cat}
              </label>
            ))}
          </fieldset>

          {/* --------------------------------------------------- featured */}
          {featuredInsight ? (
            <div className="ins-featured" data-cat={featuredInsight.category}>
              <Eyebrow>Featured insight</Eyebrow>
              <article className="card ins-featured__card">
                <Eyebrow>{featuredInsight.category}</Eyebrow>
                <h2 className="h2 ins-featured__title">
                  {isPublished(featuredInsight) ? (
                    <Link href={`/blog/${featuredInsight.slug}`}>
                      {featuredInsight.title}
                    </Link>
                  ) : (
                    featuredInsight.title
                  )}
                </h2>
                <p className="body ins-featured__summary">{featuredInsight.summary}</p>
                {isPublished(featuredInsight) ? (
                  <div className="ins-featured__foot">
                    <Cta href={`/blog/${featuredInsight.slug}`}>Read the insight</Cta>
                    <span className="small">
                      <time dateTime={featuredInsight.publishedOn}>
                        {new Date(featuredInsight.publishedOn).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </time>
                      {' · '}
                      {featuredInsight.readingMinutes} min read
                    </span>
                  </div>
                ) : (
                  /* The brief names this piece as the featured example and, in
                     the same breath, forbids a clickable article that leads to
                     an empty page. So it is featured, and it is honest about
                     not being written. */
                  <p className="small ins-featured__state">
                    <span className="ins-card__state">In preparation</span> · this piece is
                    commissioned and not yet published, so there is nothing to open yet.
                  </p>
                )}
              </article>
            </div>
          ) : null}

          {/* ---------------------------------------------- latest thinking */}
          <h2 className="h2 ins-latest-heading" id="latest-heading">
            Latest thinking
          </h2>

          <div className="grid grid-3 ins-grid" id="latest-thinking">
            {listedInsights.map(item => (
              <InsightCard item={item} key={item.slug} />
            ))}
          </div>

          {/*
            One empty-state line per category that currently has NOTHING in it,
            revealed by CSS when that chip is selected. Which categories are
            empty is known at build time, so the page emits an element only
            where one is needed and the CSS needs no counting.

            This exists because a filter that silently empties the page reads as
            a broken filter. Today it fires for Blockchain, which has no
            commissioned piece yet; when one is written this renders nothing and
            the rule has nothing to show.
          */}
          {FILTER_CATEGORIES.map((cat, i) =>
            listedInsights.some(item => item.category === cat) ? null : (
              <p className="small ins-empty" data-for={`ins-cat-${i}`} key={cat}>
                Nothing on {cat.toLowerCase()} yet. Pieces appear here as they are written.
              </p>
            ),
          )}

          {!hasPublished ? (
            <p className="small ins-note">
              Every piece above is commissioned and not yet published. Each one appears with its
              date, reading time and attribution when it has actually been written and reviewed,
              and not before.
            </p>
          ) : null}
        </div>
      </Section>

      {/* -------------------------------------------------- explore by topic */}
      <Section labelledBy="collections-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Explore by topic" id="collections-heading" title="Go deeper." />
        <div className="grid grid-2 ins-collections">
          {collections.map(c => (
            <div className="card ins-collection" key={c.eyebrow}>
              <Eyebrow>{c.eyebrow}</Eyebrow>
              <h3 className="h4 ins-collection__title">{c.title}</h3>
              <p className="body ins-collection__body">{c.body}</p>
              {c.note ? <p className="small ins-collection__note">{c.note}</p> : null}
              <p className="ins-collection__cta">
                <FLink href={c.href}>{c.cta}</FLink>
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ----------------------------------------------------- methodology */}
      {/*
        §8: the evaluation methodology is NOT deleted, it moves down the page so
        it reads as evidence of rigour rather than as the whole of Insights. The
        destination is the service page that actually carries the methodology
        today; the long-form write-up is itself still in the pipeline above.
      */}
      <Section labelledBy="methodology-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Our methodology"
              id="methodology-heading"
              title="See how we test what we build."
            />
            <p className="body" style={{ marginTop: 20 }}>
              Our approach to evaluating AI systems, evidence, reliability and production
              readiness.
            </p>
          </div>
          <div>
            <p className="body" style={{ fontSize: 15 }}>
              How we evaluate AI systems, and why we grade pass or fail rather than one to five.
            </p>
            <p style={{ marginTop: 22 }}>
              <FLink href="/ai-automation/evaluation-and-observability">
                Read the methodology
              </FLink>
            </p>
          </div>
        </div>
      </Section>

      {/* --------------------------------------------------------- archive */}
      <Section labelledBy="archive-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="From the archive"
              id="archive-heading"
              title={archive.title}
            />
            <p className="body" style={{ marginTop: 20 }}>
              {archive.note}
            </p>
          </div>
          <div>
            {archive.href ? (
              <p>
                <FLink href={archive.href}>Browse the archive</FLink>
              </p>
            ) : (
              /* §9 asks for a "Browse the archive →" CTA. The archive has no
                 home in this build yet, and §20 forbids a link to an empty
                 page, so the section states what it holds and where it is
                 rather than offering a control that does nothing. Set
                 `archive.href` in content/insights.ts the day it has a home. */
              <p className="small">
                The archive is held from the previous site and is not yet republished here.
                Original publication dates are preserved, and anything no longer current will be
                marked <strong>Historical article</strong> rather than quietly updated.
              </p>
            )}
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------- final CTA */}
      <ClosingCta
        title="Judge how we think before deciding how we build."
        ctaLabel="Talk to us"
      >
        Explore our thinking, methodology and technical approach before starting a conversation.
      </ClosingCta>
    </>
  );
}
