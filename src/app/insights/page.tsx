import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  JsonLd,
  Placeholder,
  Section,
  SectionHead,
} from '@/components/ui';
import { featuredInsight, otherInsights } from '@/content/insights';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Insights and methodology',
  description:
    'Our evaluation methodology, our reading of the regulation, and how we run AI in production. Written to be checked. Every claim cites its source.',
  path: '/insights',
});

/** Renders a date, or a visible placeholder where one is not yet set. */
function Meta({
  publishedOn,
  author,
  readingMinutes,
}: {
  publishedOn: string | null;
  author: string | null;
  readingMinutes: number | null;
}) {
  return (
    <p className="small" style={{ marginTop: 14, fontSize: 12.5 }}>
      {publishedOn ?? <Placeholder>DATE</Placeholder>}
      {' · '}
      {author ?? <Placeholder>AUTHOR</Placeholder>}
      {readingMinutes ? ` · ${readingMinutes} min` : null}
    </p>
  );
}

export default function InsightsPage() {
  const lead = otherInsights.slice(0, 3);
  const rest = otherInsights.slice(3);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Insights</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '18ch' }}>
            How we work, published in full
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Our methodology, our evaluation approach and our reading of the regulation, written for
            the engineers and risk officers who have to check it. Every claim cites its source.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            {/* The board's second CTA. There is no mailing list wired up yet, so
                this routes to the contact form — unlike a "Download" button with
                no file, a subscription request is something a person can
                actually fulfil. Tracked in GO-LIVE-CHECKLIST.md. */}
            <Cta href="/contact" variant="secondary">
              Subscribe
            </Cta>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------- featured */}
      {/* The whole section is gated, not just the card inside it. `Section`
          carries `labelledBy="featured-heading"`, and that id lives on the h2
          inside the article — keeping the section without the article would
          leave an `aria-labelledby` pointing at nothing and an empty band above
          the list. `featuredInsight` became `Insight | undefined` in
          src/content/insights.ts on 2026-09-08, which turned the previously
          invisible crash here into three compile errors; this is the fix they
          asked for. With a featured piece present the output is unchanged;
          without one the list section follows the hero directly and the page
          still reads as finished. */}
      {featuredInsight ? (
        <Section flush style={{ paddingTop: 48 }} labelledBy="featured-heading">
          <article className="card" style={{ padding: 40 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <Eyebrow>{featuredInsight.category}</Eyebrow>
              <span className="small" style={{ fontSize: 12.5 }}>
                Updated <Placeholder>DATE</Placeholder>
              </span>
            </div>
            <h2 className="h2" id="featured-heading" style={{ marginTop: 18, maxWidth: '24ch' }}>
              {featuredInsight.title}
            </h2>
            <p className="body" style={{ marginTop: 20 }}>
              {featuredInsight.summary}
            </p>
            <div
              style={{ marginTop: 28, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}
            >
              <Cta href="/ai-engineering/evaluation-and-observability">Read the methodology</Cta>
              <span className="small">
                <Placeholder>PLANNED: our eval in inspect_evals</Placeholder>
              </span>
            </div>
          </article>
        </Section>
      ) : null}

      {/* ------------------------------------------------------------ list */}
      <Section labelledBy="articles-heading">
        <h2 className="visually-hidden-heading" id="articles-heading">
          Articles
        </h2>

        <div className="grid grid-3">
          {lead.map(item => (
            <article className="card" key={item.slug}>
              <Eyebrow>{item.category}</Eyebrow>
              <h3 className="h4" style={{ marginTop: 14 }}>
                {item.title}
              </h3>
              <p className="body" style={{ marginTop: 12, fontSize: 14.5 }}>
                {item.summary}
              </p>
              <Meta {...item} />
            </article>
          ))}
        </div>

        <div className="grid grid-3" style={{ marginTop: 18 }}>
          {rest.map(item => (
            <article className="tile" key={item.slug} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <p className="small" style={{ marginTop: 10, fontSize: 12.5 }}>
                {item.category} · {item.publishedOn ?? <Placeholder>DATE</Placeholder>}
                {item.readingMinutes ? ` · ${item.readingMinutes} min` : null}
              </p>
            </article>
          ))}

          <article className="tile" style={{ padding: '24px 26px', background: '#F7FAFA' }}>
            <h3 className="h4">Archive: blockchain and distributed systems, 2018–2025</h3>
            <p className="small" style={{ marginTop: 10, fontSize: 12.5 }}>
              Archive · retained, not current positioning
            </p>
            {/* The board offers "Browse →" here. The archive itself has no home
                in this build yet, so the destination is unfilled rather than
                pointing somewhere that is not an archive. */}
            <p className="small" style={{ marginTop: 12, fontSize: 12.5 }}>
              Browse → <Placeholder>ARCHIVE DESTINATION</Placeholder>
            </p>
          </article>
        </div>

        <p className="small" style={{ marginTop: 30, fontStyle: 'italic' }}>
          Articles are listed as they are commissioned. A piece appears here with its date and author
          filled in once it is written and signed off, not before.
        </p>
      </Section>

      <ClosingCta title="Reading before buying?">
        That is the point. The methodology is public so you can judge the work before you pay for any
        of it.
      </ClosingCta>
    </>
  );
}
