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
import {
  caseStudies,
  displayKicker,
  displayName,
  getCaseStudy,
  isNameGated,
  publishedDetail,
  publishedImage,
  publishedMetrics,
} from '@/content/work';
import { ANALYTICS_EVENTS, ANALYTICS_SURFACES, analyticsAttrs } from '@/lib/analytics';
import { breadcrumbSchema, caseStudySchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return caseStudies.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) {
    // An ABSENT description, not an empty one. `description: ''` emitted
    // `<meta name="description" content="">`, which is a tag asserting that the
    // page has no description rather than simply not making the claim. Inert
    // here because the branch is noIndex, and wrong in the same small way the
    // rest of this repository refuses elsewhere.
    return pageMetadata({
      title: 'Case study',
      description: 'This case study does not exist.',
      path: `/case-studies/${slug}`,
      noIndex: true,
    });
  }

  // `metaTitle` and `summary` are authored name-free for any case study whose
  // client permission is still pending, so both are safe here either way. The
  // og:image is not: a product screenshot generally carries the client's logo,
  // so it comes through the same gate the page body uses.
  return pageMetadata({
    title: cs.metaTitle,
    description: cs.summary,
    path: `/case-studies/${cs.slug}`,
    ogImage: publishedImage(cs),
  });
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  // Everything below reads the case study through the publication gate in
  // work.ts: `displayName` for the name, `publishedDetail` for the narrative,
  // `publishedMetrics` for the figures, `publishedImage` for the artwork. The
  // page has the same sections and the same layout whether or not the client
  // can be named — only the words in the name slots change.
  const name = displayName(cs);
  const detail = publishedDetail(cs);
  const metrics = publishedMetrics(cs);
  const image = publishedImage(cs);

  const others = caseStudies.filter(c => c.slug !== cs.slug).slice(0, 2);

  /*
   * Structured data goes through the same gate as the page, and the gate now
   * lives behind the two functions rather than here.
   *
   * `caseStudySchema` resolves the artwork through `publishedImage()` itself,
   * so it can no longer emit a gated client's screenshot URL for any caller —
   * this page used to hand it `{ ...cs, image }` to force that, which
   * protected this call site and nobody else. `JsonLd` renders nothing when
   * the builder returns null, so the `articleSchema ? … : null` guard is gone
   * too. Both fixes are in the shared code, where the next caller inherits
   * them instead of having to remember them.
   */
  return (
    <>
      <JsonLd data={caseStudySchema(cs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Work', path: '/case-studies' },
          { name, path: `/case-studies/${cs.slug}` },
        ])}
      />

      <div className="hero-glow" style={{ padding: '64px 0 56px' }}>
        <div className="wrap">
          <p className="small" style={{ marginBottom: 20 }}>
            <Link href="/case-studies">Work</Link> <span aria-hidden>/</span> {cs.sector}
          </p>
          <Eyebrow>
            {name} · {cs.service}
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
          {/* The name gate, said out loud. It occupies the same slot as the two
              notes above, so a gated case study is the same shape as any other
              — it just tells the reader why the client is not named yet. */}
          {isNameGated(cs) ? (
            <p className="small" style={{ marginTop: 20, fontStyle: 'italic' }}>
              Client named on request. We publish the challenge, the engineering and the result while
              the name, logo and any figures are cleared for publication.
            </p>
          ) : null}

          {metrics.length > 0 ? (
            <div className="grid grid-4" style={{ marginTop: 44 }}>
              {metrics.map(m => (
                <div className="tile" key={m.label}>
                  <b
                    className={m.pending ? 'ph' : undefined}
                    style={m.pending ? { fontSize: 18 } : undefined}
                    {...(m.pending ? { 'data-placeholder': 'true' } : {})}
                  >
                    {m.value}
                  </b>
                  <span>{m.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <Section flush style={{ paddingTop: 48 }} labelledBy="cs-body-heading">
        <h2 className="visually-hidden-heading" id="cs-body-heading">
          Case study detail
        </h2>

        {/* No ratio override. The slot's own 16/10 matches the source mockups
            (675x419, 1.61:1) almost exactly, so nothing is cropped. Forcing
            16/9 here clipped the bottom of every laptop mockup on the site —
            the only MediaSlot in the build that did. */}
        {/* `priority`: this is the hero, directly under the h1, and is the
            likely LCP element on all 29 case-study pages. Every other MediaSlot
            on the page is below the fold and stays lazy. */}
        <MediaSlot label={cs.imageLabel} src={image} alt={`${name} — ${cs.title}`} priority />

        <div className="split split--wide-left" style={{ marginTop: 56 }}>
          <div>
            {detail ? (
              /* The section order the 8 September 2026 handoff mandates:
                 Challenge → What Pixelette built → Delivery → Result → Tech and
                 evidence → CTA. Delivery and the evidence block are optional,
                 because the case studies carried across from the previous site
                 record neither, and inventing a delivery sequence for them
                 would be writing fiction into a case study. */
              <>
                <h2 className="h2">The challenge</h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {detail.problem}
                </p>

                <h2 className="h2" style={{ marginTop: 48 }}>
                  What Pixelette built
                </h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {detail.built}
                </p>

                <div style={{ marginTop: 32 }}>
                  <MediaSlot label={detail.architectureLabel} ratio="16 / 7" />
                </div>

                {detail.delivery ? (
                  <>
                    <h2 className="h2" style={{ marginTop: 48 }}>
                      How we delivered it
                    </h2>
                    <p className="body" style={{ marginTop: 18 }}>
                      {detail.delivery}
                    </p>
                  </>
                ) : null}

                <h2 className="h2" style={{ marginTop: 48 }}>
                  The result
                </h2>
                <p className="body" style={{ marginTop: 18 }}>
                  {detail.measured}
                </p>

                {/* Tech and evidence. Present where the write-up states what it
                    rests on, which is every case study the handoff supplied.
                    The stack is repeated from the aside on purpose: the aside
                    is a scan-and-leave summary, and the handoff asks for tech
                    and evidence to be a section a reader arrives at. */}
                {detail.evidenceBasis ? (
                  <>
                    <h2 className="h2" style={{ marginTop: 48 }}>
                      Tech and evidence
                    </h2>
                    <p className="body" style={{ marginTop: 18 }}>
                      {detail.stack ? (
                        <>
                          Built with {detail.stack}.{' '}
                        </>
                      ) : null}
                      {detail.evidenceBasis}
                    </p>
                  </>
                ) : null}

                {/* Shown when there is something to say, or where the design
                    boards the section and it is still waiting on the client. */}
                {detail.next || cs.pendingQuote ? (
                  <>
                    <h2 className="h2" style={{ marginTop: 48 }}>
                      What happened next
                    </h2>
                    <p className="body" style={{ marginTop: 18 }}>
                      {detail.next ?? (
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
                      <Placeholder>NAME</Placeholder>, <Placeholder>ROLE</Placeholder>, {name}
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
                  {/*
                    CORRECTED 2026-09-14. This branched on `cs.internal`, which
                    NO study sets, so every unfilled write-up rendered "PENDING
                    CLIENT SIGN-OFF" — and on all nine of them that is false.

                    Measured: every one of the nine carries
                    `namePermission: 'CONFIRMED'`. The client has already cleared
                    the name. work.ts says so in its own note at the block that
                    holds them — "filling them needs the engagement detail, not
                    more design files" — so the blocker is ours, and the page was
                    quietly attributing our backlog to nine clients who had
                    already said yes.

                    That matters beyond tidiness. A visitor reading "pending
                    client sign-off" on nine of twenty-nine studies concludes
                    those clients are unhappy or slow. The gate this site is
                    proud of is the FIGURES gate; the write-ups are simply not
                    written.

                    Now branches on the fact that decides it. A name still
                    gated is genuinely waiting on a client; a confirmed one is
                    waiting on us, and says so.
                  */}
                  <Placeholder>
                    {cs.namePermission === 'PENDING'
                      ? 'FULL WRITE-UP PENDING CLIENT SIGN-OFF — problem, what we built, how it is measured'
                      : 'FULL WRITE-UP PENDING — problem, what we built, how it is measured'}
                  </Placeholder>
                </p>
              </>
            )}
          </div>

          <aside className="card is-sticky" style={{ position: 'sticky', top: 100 }}>
            <Eyebrow>At a glance</Eyebrow>
            <dl className="glance">
              <dt>Client</dt>
              <dd>{name}</dd>
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
              {detail?.duration ? (
                <>
                  <dt>Duration</dt>
                  <dd>{detail.duration}</dd>
                </>
              ) : null}
              <dt>Stack</dt>
              <dd>{detail?.stack ?? <Placeholder>STACK</Placeholder>}</dd>
            </dl>
            <hr className="rule" style={{ margin: '22px 0 18px' }} />
            <p>
              <FLink href="/contact">Request the technical note</FLink>
            </p>
            <div style={{ marginTop: 14 }}>
              <Cta
                href="/contact"
                analytics={analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
                  surface: ANALYTICS_SURFACES.CASE_STUDY_ASIDE,
                })}
              >
                Book a conversation
              </Cta>
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
          {/*
            NOT "Read the full case studies", which is the label the other four
            call sites use. Those sit above kicker LABELS with no title and no
            body, so there the phrase correctly means "these are labels, the real
            thing is one click away". Here the grid below holds ACTUAL case-study
            cards that link to individual studies, so the same phrase would imply
            those cards are abridged versions of themselves. This link goes to
            the index, and says so.
          */}
          <FLink href="/case-studies">All case studies</FLink>
        </div>
        <div className="grid grid-2" style={{ marginTop: 32 }}>
          {others.map(o => (
            <Link
              key={o.slug}
              href={`/case-studies/${o.slug}`}
              className="work-card"
              {...analyticsAttrs(ANALYTICS_EVENTS.CASE_STUDY_OPENED, {
                surface: ANALYTICS_SURFACES.CASE_STUDY_RELATED,
                detail: o.slug,
              })}
            >
              <MediaSlot
                label={o.imageLabel}
                src={publishedImage(o)}
                alt={`${displayName(o)} — ${o.title}`}
              />
              <span className="mono work-card__kicker">{displayKicker(o)}</span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                {o.title}
              </h3>
            </Link>
          ))}
        </div>
      </Section>

      <ClosingCta title="Want the evidence behind a result?">
        Ask and we will walk you through the architecture, the evaluation approach and the
        measurement behind any result on this page — including the figures we are not yet
        publishing, and what it would take to publish them.
      </ClosingCta>
    </>
  );
}
