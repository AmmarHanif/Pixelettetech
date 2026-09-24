import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArchiveBody } from '@/components/ArchiveBody';
import { ClosingCta } from '@/components/sections';
import { Eyebrow, FLink, JsonLd, Section } from '@/components/ui';
import {
  ARCHIVE_GROUPS,
  type ArchiveArticle,
  archiveArticles,
  archiveBySlug,
} from '@/content/archive';
import { ARCHIVE_BODIES } from '@/content/archive/bodies';
import { INSIGHT_BODIES, INSIGHT_SOURCES } from '@/content/insight-bodies';
import {
  type Attribution,
  type PublishedInsight,
  publishedInsights,
} from '@/content/insights';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * The article template, serving two kinds of article at the same path.
 *
 * WHY ONE ROUTE AND NOT TWO. The 36 migrated articles were published at
 * /blog/<slug> on the previous site and are restored to exactly those URLs, so
 * the links, bookmarks and citations that already point at them resolve rather
 * than redirect. New Insights pieces use the same path by the founder's
 * instruction. Two routes cannot both own /blog/<slug>, so this one resolves
 * against both sources and renders through a single normalised shape.
 *
 * THE DOUBLE CONDITION IS DELIBERATE, and survives the migration. A NEW piece
 * must be `status: 'published'` AND have a body registered. Either alone is a
 * way to ship an empty article: a status flipped before the writing is done, or
 * a body written while the entry still says pipeline. Requiring both means the
 * two have to agree. The archive is held to the same bar from the other
 * direction - an entry with no harvested body does not resolve.
 *
 * AN ARCHIVE ARTICLE IS ALWAYS MARKED HISTORICAL. It is not a judgement about
 * any individual piece; it is that all 36 were written in 2025 for a business
 * that has since changed what it sells, and a reader deserves to know that
 * before the first paragraph rather than after the last.
 */

type Params = { slug: string };

/** What the page renders, whichever source the article came from. */
type Resolved = {
  slug: string;
  eyebrow: string;
  title: string;
  /** Shorter label for <title> where the headline is too long. Falls back to it. */
  seoTitle?: string;
  /** Shorter meta description where the standfirst is too long. Falls back to it. */
  seoDescription?: string;
  summary: string;
  publishedOn: string;
  updatedOn?: string;
  readingMinutes: number;
  /** The name the site stands behind for this piece. */
  authorName: string;
  reviewer?: string;
  historical: boolean;
  body: React.ReactNode;
  /** `href` is optional: a citation we can name but not link is still a citation. */
  sources: { label: string; href?: string }[];
  serviceBridge?: PublishedInsight['serviceBridge'];
  relatedService?: { href: string; label: string };
  related: { slug: string; title: string; summary: string; eyebrow: string }[];
};

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

const groupLabel = (id: ArchiveArticle['group']) =>
  ARCHIVE_GROUPS.find(g => g.id === id)?.label ?? 'Archive';

function findInsight(slug: string): PublishedInsight | null {
  const item = publishedInsights.find(i => i.slug === slug);
  if (!item) return null;
  if (!INSIGHT_BODIES[slug]) return null;
  return item;
}

function resolve(slug: string): Resolved | null {
  const insight = findInsight(slug);
  if (insight) {
    const Body = INSIGHT_BODIES[insight.slug]!;
    /* Related: same category first, then anything else published. Only
       published ones - a "related insight" that cannot be opened is the same
       defect as a clickable pipeline card. */
    const related = publishedInsights
      .filter(i => i.slug !== insight.slug && INSIGHT_BODIES[i.slug])
      .sort(
        (a, b) =>
          Number(b.category === insight.category) -
          Number(a.category === insight.category),
      )
      .slice(0, 3)
      .map(i => ({
        slug: i.slug,
        title: i.title,
        summary: i.summary,
        eyebrow: i.category,
      }));

    return {
      slug: insight.slug,
      eyebrow: insight.category,
      title: insight.title,
      seoTitle: insight.seoTitle,
      seoDescription: insight.seoDescription,
      summary: insight.summary,
      publishedOn: insight.publishedOn,
      updatedOn: insight.updatedOn,
      readingMinutes: insight.readingMinutes,
      authorName: attributionName(insight.attribution),
      reviewer: reviewerName(insight.attribution),
      historical: Boolean(insight.archived),
      body: <Body />,
      sources: INSIGHT_SOURCES[insight.slug] ?? [],
      relatedService: insight.relatedService,
      serviceBridge: insight.serviceBridge,
      related,
    };
  }

  const arc = archiveBySlug(slug);
  if (!arc) return null;
  const blocks = ARCHIVE_BODIES[slug];
  if (!blocks || !blocks.length) return null;

  /* Related within the archive only. An archive article must not hand a reader
     off to current commercial pages as though it were current advice. */
  const related = archiveArticles
    .filter(a => a.slug !== arc.slug && a.group === arc.group)
    .slice(0, 3)
    .map(a => ({
      slug: a.slug,
      title: a.title,
      summary: a.summary,
      eyebrow: groupLabel(a.group),
    }));

  return {
    slug: arc.slug,
    eyebrow: groupLabel(arc.group),
    title: arc.title,
    summary: arc.summary,
    publishedOn: arc.publishedOn,
    readingMinutes: arc.readingMinutes,
    authorName: arc.author,
    historical: true,
    body: <ArchiveBody blocks={blocks} />,
    sources: [],
    related,
  };
}

export function generateStaticParams(): Params[] {
  return [
    ...publishedInsights
      .filter(i => INSIGHT_BODIES[i.slug])
      .map(i => ({ slug: i.slug })),
    ...archiveArticles
      .filter(a => ARCHIVE_BODIES[a.slug]?.length)
      .map(a => ({ slug: a.slug })),
  ];
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
  if (!item) {
    return pageMetadata({
      title: 'Insight',
      description: '',
      path: '/insights',
      noIndex: true,
    });
  }

  return pageMetadata({
    /* The tab and search-result label, which may be shorter than the headline
       the page displays. The H1 below is always the full title. */
    title: item.seoTitle ?? item.title,
    /* The standfirst is what the page shows; this is what a search result gets. */
    description: item.seoDescription ?? item.summary,
    path: `/blog/${item.slug}`,
    article: {
      publishedTime: item.publishedOn,
      modifiedTime: item.updatedOn,
      authors: [item.authorName],
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

  return (
    <>
      <JsonLd
        data={articleSchema({
          headline: item.title,
          description: item.summary,
          path: `/blog/${item.slug}`,
          datePublished: item.publishedOn,
          dateModified: item.updatedOn,
          authorName: item.authorName,
          reviewedByName: item.reviewer,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: item.title, path: `/blog/${item.slug}` },
        ])}
      />

      {/* ------------------------------------------------------------ head */}
      <div className="hero-glow" style={{ padding: '80px 0 48px' }}>
        <div className="wrap">
          <Eyebrow>{item.eyebrow}</Eyebrow>
          {/* The one H1 on the page (§15). */}
          <h1 className="h1" style={{ marginTop: 20, maxWidth: '26ch' }}>
            {item.title}
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: '64ch' }}>
            {item.summary}
          </p>

          <div className="small ins-article__meta">
            <span>{item.authorName}</span>
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
            {item.reviewer ? (
              <>
                <span aria-hidden>·</span>
                <span>Technically reviewed by {item.reviewer}</span>
              </>
            ) : null}
          </div>

          {/* §9: material that is no longer current guidance says so at the top,
              where a reader sees it before the content, not in a footnote. */}
          {item.historical ? (
            <p className="small arc-notice">
              <strong>Historical article.</strong> Published on the previous Pixelette
              Technologies site and retained for reference and technical context. It
              reflects the position at the time of writing, and prices, product names and
              technical recommendations in it are not current guidance.{' '}
              <Link href="/insights">See current thinking</Link>.
            </p>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------------ body */}
      <Section labelledBy="article-body-heading">
        <h2 className="visually-hidden-heading" id="article-body-heading">
          Article
        </h2>
        <div className="ins-article__body">{item.body}</div>

        {item.sources.length ? (
          <div className="ins-article__body" style={{ marginTop: 44 }}>
            <h2 className="h4">Sources</h2>
            <ul className="ins-article__sources" style={{ marginTop: 14 }}>
              {/* A citation without a verified URL renders as text rather than as a
                  link to a guess. content/insight-bodies.tsx explains why. */}
              {item.sources.map(s => (
                <li key={s.label}>
                  {s.href ? (
                    <a href={s.href} rel="noopener noreferrer" target="_blank">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
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

        {/*
          The service bridge: two links and a sentence, set apart from the
          article rather than tacked onto its last paragraph, so a reader can
          see where the writing stops and the offer starts.
        */}
        {item.serviceBridge ? (
          <aside className="art-bridge">
            <h2 className="h4">{item.serviceBridge.heading}</h2>
            <p className="body" style={{ marginTop: 12 }}>
              {item.serviceBridge.body}
            </p>
            <p className="art-bridge__links">
              {item.serviceBridge.links.map(l => (
                <FLink href={l.href} key={l.href}>
                  {l.label}
                </FLink>
              ))}
            </p>
          </aside>
        ) : null}
      </Section>

      {/* -------------------------------------------------------- related */}
      {item.related.length ? (
        <Section labelledBy="related-heading" style={{ background: '#F7FAFA' }}>
          <h2 className="h4" id="related-heading">
            {item.historical ? 'More from the archive' : 'Related insights'}
          </h2>
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {item.related.map(r => (
              <article className="card ins-card" key={r.slug}>
                <Eyebrow>{r.eyebrow}</Eyebrow>
                <h3 className="h4 ins-card__title">
                  <Link href={`/blog/${r.slug}`}>{r.title}</Link>
                </h3>
                <p className="body ins-card__summary">{r.summary}</p>
              </article>
            ))}
          </div>
        </Section>
      ) : null}

      <ClosingCta title="Judge how we think before deciding how we build" ctaLabel="Talk to us">
        Explore our thinking, methodology and technical approach before starting a conversation.
      </ClosingCta>
    </>
  );
}
