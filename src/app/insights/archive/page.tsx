import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import { Eyebrow, Section, SectionHead } from '@/components/ui';
import { ARCHIVE_GROUPS, archiveArticles } from '@/content/archive';
import { breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/ui';
import { pageMetadata } from '@/lib/seo';

/*
 * The archive index (§9 of the Insights brief).
 *
 * A SEPARATE PAGE, NOT A SECTION OF THE HUB. 36 historical articles listed on
 * the Insights page would outweigh the editorial pipeline by an order of
 * magnitude and make a hub about current thinking look like a blog archive with
 * a banner on top. §9 asks for a "Browse the archive" route out of the hub, and
 * this is where it goes.
 *
 * GROUPED BY THE PREVIOUS SITE'S OWN CATEGORIES, taken from its four category
 * archives rather than invented here. One article was filed under no category
 * there and is placed by subject, which content/archive/index.ts records at the
 * entry itself so the placement is not later mistaken for their decision.
 *
 * NO FILTER BAR, DELIBERATELY. The hub has one because it is meant to grow. This
 * list is closed - 36 articles, none of which will ever be added to - so headed
 * groups and a date on every row are easier to scan than a control that changes
 * a list short enough to read.
 */

export const metadata = pageMetadata({
  title: 'Archive',
  description:
    'Articles published on the previous Pixelette Technologies site between March and July 2025, retained for reference. This material is historical and is not current guidance.',
  path: '/insights/archive',
  /* NO PAGE-LEVEL noIndex, deliberately. SITE_IN_DEVELOPMENT in content/launch.ts
     already forces noindex on every page that goes through pageMetadata, so one
     here would be invisible today and harmful later: the day that single flag is
     flipped for launch, this page would stay hidden because of a second hold
     nobody remembers. One control, one launch action. */
});

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function ArchiveIndexPage() {
  const total = archiveArticles.length;

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
          { name: 'Archive', path: '/insights/archive' },
        ])}
      />

      <div className="hero-glow" style={{ padding: '80px 0 48px' }}>
        <div className="wrap">
          <Eyebrow>From the archive</Eyebrow>
          <h1 className="h1" style={{ marginTop: 20, maxWidth: '22ch' }}>
            Earlier writing, retained for reference
          </h1>
          <p className="lead" style={{ marginTop: 22, maxWidth: '64ch' }}>
            {total} articles published on the previous Pixelette Technologies site between
            March and July 2025. They are kept so that links to them still work and the
            work is not lost. Original publication dates and bylines are preserved.
          </p>
          <p className="small arc-notice">
            <strong>This material is historical.</strong> It reflects the position at the
            time of writing. Prices, product names and technical recommendations in these
            articles are not current guidance — for that, see{' '}
            <Link href="/insights">Insights</Link>.
          </p>
        </div>
      </div>

      <Section labelledBy="archive-list-heading">
        <h2 className="visually-hidden-heading" id="archive-list-heading">
          All archived articles
        </h2>

        {ARCHIVE_GROUPS.map(group => {
          const items = archiveArticles.filter(a => a.group === group.id);
          if (!items.length) return null;
          return (
            <div className="arc-group" key={group.id}>
              <SectionHead
                level={3}
                title={group.label}
                lead={`${items.length} article${items.length === 1 ? '' : 's'}`}
              />
              <div style={{ marginTop: 18 }}>
                {items.map(a => (
                  <article className="arc-item" key={a.slug}>
                    <h4 className="h4 arc-item__title">
                      <Link href={`/blog/${a.slug}`}>{a.title}</Link>
                    </h4>
                    <p className="body" style={{ maxWidth: '68ch' }}>
                      {a.summary}
                    </p>
                    <p className="small arc-item__meta" style={{ marginTop: 10 }}>
                      <span>{a.author}</span>
                      <span aria-hidden>·</span>
                      <time dateTime={a.publishedOn}>{longDate(a.publishedOn)}</time>
                      <span aria-hidden>·</span>
                      <span>{a.readingMinutes} min read</span>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </Section>

      <ClosingCta title="Judge how we think before deciding how we build." ctaLabel="Talk to us">
        Explore our current thinking, methodology and technical approach before starting a
        conversation.
      </ClosingCta>
    </>
  );
}
