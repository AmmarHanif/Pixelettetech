import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  MediaSlot,
  Placeholder,
  Section,
} from '@/components/ui';
import { caseStudies, getCaseStudy } from '@/content/work';
import { breadcrumbSchema, caseStudySchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return caseStudies.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return pageMetadata({ title: 'Case study', description: '', path: `/case-studies/${slug}`, noIndex: true });

  return pageMetadata({
    title: cs.metaTitle,
    description: cs.summary,
    path: `/case-studies/${cs.slug}`,
    ogImage: cs.image,
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  const others = caseStudies.filter(c => c.slug !== cs.slug).slice(0, 2);

  return (
    <>
      <JsonLd data={caseStudySchema(cs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/case-studies' },
          { name: cs.client, path: `/case-studies/${cs.slug}` },
        ])}
      />

      <div className="hero-glow" style={{ padding: '64px 0 56px' }}>
        <div className="wrap">
          <p className="small" style={{ marginBottom: 20 }}>
            <Link href="/case-studies">Work</Link> <span aria-hidden>/</span> {cs.sector}
          </p>
          <Eyebrow>
            {cs.client} · {cs.service}
          </Eyebrow>
          <h1 className="h1p" style={{ marginTop: 20, maxWidth: '24ch' }}>
            {cs.title}
          </h1>

          {cs.internal ? (
            <p className="small" style={{ marginTop: 20, fontStyle: 'italic' }}>
              Internal work. We label it as internal rather than presenting it as client delivery.
            </p>
          ) : null}
          {cs.anonymised ? (
            <p className="small" style={{ marginTop: 20, fontStyle: 'italic' }}>
              Client under NDA. We publish the sector and the number rather than nothing.
            </p>
          ) : null}

          <div className="grid grid-4" style={{ marginTop: 44 }}>
            {cs.metrics.map(m => (
              <div className="tile" key={m.label}>
                <b className={m.pending ? 'ph' : undefined} style={m.pending ? { fontSize: 18 } : undefined}>
                  {m.value}
                </b>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section flush style={{ paddingTop: 48 }} labelledBy="cs-body-heading">
        <h2 className="visually-hidden-heading" id="cs-body-heading">
          Case study detail
        </h2>

        <MediaSlot
          label={cs.imageLabel}
          src={cs.image}
          alt={`${cs.client} — ${cs.title}`}
          ratio="16 / 9"
        />

        <div className="split split--wide-left" style={{ marginTop: 56 }}>
          <div>
            {cs.detail ? (
              <>
                <h2 className="h2">The problem</h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {cs.detail.problem}
                </p>

                <h2 className="h2" style={{ marginTop: 48 }}>
                  What we built
                </h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {cs.detail.built}
                </p>

                <div style={{ marginTop: 32 }}>
                  <MediaSlot label={cs.detail.architectureLabel} ratio="16 / 7" />
                </div>

                <h2 className="h2" style={{ marginTop: 48 }}>
                  How it is measured
                </h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {cs.detail.measured}
                </p>

                {/* Shown when there is something to say, or where the design
                    boards the section and it is still waiting on the client. */}
                {cs.detail.next || cs.pendingQuote ? (
                  <>
                    <h2 className="h2" style={{ marginTop: 48 }}>
                      What happened next
                    </h2>
                    <p className="body" style={{ marginTop: 18 }}>
                      {cs.detail.next ?? (
                        <Placeholder>
                          RUN CONTRACT STATUS, OR WHAT THE CLIENT DID AFTERWARDS
                        </Placeholder>
                      )}
                    </p>
                  </>
                ) : null}

                {cs.pendingQuote ? (
                  <blockquote className="card" style={{ marginTop: 40 }}>
                    <p className="quote">
                      <Placeholder>CLIENT QUOTE, WITH SIGN-OFF</Placeholder>
                    </p>
                    <footer className="small" style={{ marginTop: 18 }}>
                      <Placeholder>NAME</Placeholder>, <Placeholder>ROLE</Placeholder>, {cs.client}
                    </footer>
                  </blockquote>
                ) : null}
              </>
            ) : (
              <>
                <h2 className="h2">Summary</h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {cs.summary}
                </p>
                <p className="body" style={{ marginTop: 24 }}>
                  <Placeholder>
                    FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured
                  </Placeholder>
                </p>
              </>
            )}
          </div>

          <aside className="card is-sticky" style={{ position: 'sticky', top: 100 }}>
            <Eyebrow>At a glance</Eyebrow>
            <dl className="glance">
              <dt>Client</dt>
              <dd>{cs.client}</dd>
              <dt>Sector</dt>
              <dd>{cs.sector}</dd>
              <dt>Service</dt>
              <dd>{cs.service}</dd>
              {/* Founder decision 2026-09-01: where the duration is not on
                  record, the row is omitted rather than shown as a placeholder.
                  Duration is not a selling point — the metrics above it are —
                  and an absent row reads as deliberate where an amber [MONTHS]
                  reads as unfinished. Only five engagements state a duration in
                  the source record; the rest are simply not published. */}
              {cs.detail?.duration ? (
                <>
                  <dt>Duration</dt>
                  <dd>{cs.detail.duration}</dd>
                </>
              ) : null}
              <dt>Stack</dt>
              <dd>{cs.detail?.stack ?? <Placeholder>STACK</Placeholder>}</dd>
            </dl>
            <hr className="rule" style={{ margin: '22px 0 18px' }} />
            <p>
              <FLink href="/contact">Request the technical note</FLink>
            </p>
            <div style={{ marginTop: 14 }}>
              <Cta href="/contact">Book a value baseline</Cta>
            </div>
          </aside>
        </div>
      </Section>

      <Section labelledBy="more-work-heading" style={{ background: '#F7FAFA' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <h2 className="h2" id="more-work-heading">
            More work
          </h2>
          <FLink href="/case-studies">All work</FLink>
        </div>
        <div className="grid grid-2" style={{ marginTop: 32 }}>
          {others.map(o => (
            <Link key={o.slug} href={`/case-studies/${o.slug}`} className="work-card">
              <MediaSlot label={o.imageLabel} src={o.image} alt={`${o.client} — ${o.title}`} />
              <span className="mono work-card__kicker">{o.kicker}</span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                {o.title}
              </h3>
            </Link>
          ))}
        </div>
      </Section>

      <ClosingCta title="Want the detail behind a number?">
        Every case study links to the architecture, the evaluation approach and, where the client
        agreed, a reference call.
      </ClosingCta>
    </>
  );
}
