import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClosingCta } from '@/components/sections';
import { Eyebrow, FLink, JsonLd, Section } from '@/components/ui';
import { INSIGHT_BODIES, INSIGHT_SOURCES } from '@/content/insight-bodies';
import {
  type Attribution,
  type PublishedInsight,
  publishedInsights,
} from '@/content/insights';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * The reusable Insights article template (§11 of the Insights brief).
 *
 * IT BUILDS NOTHING TODAY, ON PURPOSE. `generateStaticParams` returns only
 * published pieces that also have a body, and there are none, so this route
 * emits zero pages and every /insights/<slug> is a 404. That is the brief's own
 * requirement — "never display a clickable article that leads to an empty page"
 * — enforced by the route rather than by remembering. The template exists so
 * that publishing the first piece is a content change, not a build.
 *
 * THE DOUBLE CONDITION IS DELIBERATE. A piece must be `status: 'published'` AND
 * have a body registered. Either alone is a way to ship an empty article: a
 * status flipped before the writing is done, or a body written while the entry
 * still says pipeline. Requiring both means the two have to agree.
 */

type Params = { slug: string };

function resolve(slug: string): PublishedInsight | null {
  const item = publishedInsights.find(i => i.slug === slug);
  if (!item) return null;
  if (!INSIGHT_BODIES[slug]) return null;
  return item;
}

export function generateStaticParams(): Params[] {
  return publishedInsights
    .filter(i => INSIGHT_BODIES[i.slug])
    .map(i => ({ slug: i.slug }));
}

/** The display name the site stands behind, per the three models in §12. */
function attributionName(a: Attribution): string {
  switch (a.kind) {
    case 'author':
      return a.author;
    case 'house-reviewed':
      return 'Pixelette Technologies';
    case 'editorial':
      return 'Pixelette Technologies Editorial';
  }
}

/** The reviewer, only where one genuinely reviewed the piece. */
function reviewerName(a: Attribution): string | undefined {
  if (a.kind === 'house-reviewed') return a.reviewedBy;
  if (a.kind === 'editorial' && a.technicallyReviewedBy) return a.technicallyReviewedBy;
  return undefined;
}

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = resolve(slug);
  if (!item) return pageMetadata({ title: 'Insight', description: '', path: '/insights', noIndex: true });

  return pageMetadata({
    title: item.title,
    description: item.summary,
    path: `/insights/${item.slug}`,
    article: {
      publishedTime: item.publishedOn,
      modifiedTime: item.updatedOn,
      authors: [attributionName(item.attribution)],
    },
  });
}

export default async function InsightArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const item = resolve(slug);
  if (!item) notFound();

  const Body = INSIGHT_BODIES[item.slug]!;
  const sources = INSIGHT_SOURCES[item.slug] ?? [];
  const reviewer = reviewerName(item.attribution);

  /* Related pieces: same category first, then anything else published. Only
     published ones — a "related insight" that cannot be opened is the same
     defect as a clickable pipeline card. */
  const related = publishedInsights
    .filter(i => i.slug !== item.slug && INSIGHT_BODIES[i.slug])
    .sort((a, b) => Number(b.category === item.category) - Number(a.category === item.category))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: item.title,
          description: item.summary,
          path: `/insights/${item.slug}`,
          datePublished: item.publishedOn,
          dateModified: item.updatedOn,
          authorName: attributionName(item.attribution),
          reviewedByName: reviewer,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: item.title, path: `/insights/${item.slug}` },
        ])}
      />

      {/* ------------------------------------------------------------ head */}
      <div className="hero-glow" style={{ padding: '80px 0 48px' }}>
        <div className="wrap">
          <Eyebrow>{item.category}</Eyebrow>
          {/* The one H1 on the page (§15). */}
          <h1 className="h1" style={{ marginTop: 20, maxWidth: '26ch' }}>
            {item.title}
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: '64ch' }}>
            {item.summary}
          </p>

          <div className="small ins-article__meta">
            <span>{attributionName(item.attribution)}</span>
            <span aria-hidden>·</span>
            <time dateTime={item.publishedOn}>{longDate(item.publishedOn)}</time>
            {/* Shown only where a revision actually happened. */}
            {item.updatedOn ? (
              <>
                <span aria-hidden>·</span>
                <span>
                  Updated <time dateTime={item.updatedOn}>{longDate(item.updatedOn)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{item.readingMinutes} min read</span>
            {reviewer ? (
              <>
                <span aria-hidden>·</span>
                <span>Technically reviewed by {reviewer}</span>
              </>
            ) : null}
          </div>

          {/* §9: material that is no longer current guidance says so at the top,
              where a reader sees it before the content, not in a footnote. */}
          {item.archived ? (
            <p className="small" style={{ marginTop: 22, color: 'var(--amber-ink)' }}>
              <strong>Historical article.</strong> Retained for reference and technical context.
              It reflects the position at the time of writing and is not current guidance.
            </p>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------------ body */}
      <Section labelledBy="article-body-heading">
        <h2 className="visually-hidden-heading" id="article-body-heading">
          Article
        </h2>
        <div className="ins-article__body">
          <Body />
        </div>

        {sources.length ? (
          <div className="ins-article__body" style={{ marginTop: 44 }}>
            <h2 className="h4">Sources</h2>
            <ul className="ins-article__sources" style={{ marginTop: 14 }}>
              {sources.map(s => (
                <li key={s.href}>
                  <a href={s.href} rel="noopener noreferrer" target="_blank">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {item.relatedService ? (
          <p style={{ marginTop: 40 }}>
            <FLink href={item.relatedService.href}>{item.relatedService.label}</FLink>
          </p>
        ) : null}
      </Section>

      {/* -------------------------------------------------------- related */}
      {related.length ? (
        <Section labelledBy="related-heading" style={{ background: '#F7FAFA' }}>
          <h2 className="h4" id="related-heading">
            Related insights
          </h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {related.map(r => (
              <article className="card ins-card" key={r.slug}>
                <Eyebrow>{r.category}</Eyebrow>
                <h3 className="h4 ins-card__title">
                  <Link href={`/insights/${r.slug}`}>{r.title}</Link>
                </h3>
                <p className="body ins-card__summary">{r.summary}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <ClosingCta title="Judge how we think before deciding how we build." ctaLabel="Talk to us">
        Explore our thinking, methodology and technical approach before starting a conversation.
      </ClosingCta>
    </>
  );
}
