import Link from 'next/link';

import {
  AgentScopeDiagram,
  EvaluationGateDiagram,
  EvaluationGateStack,
  ThemeMark,
} from '@/components/InsightVisuals';
import { ClosingCta } from '@/components/sections';
import { Eyebrow, FLink, JsonLd, Section, SectionHead } from '@/components/ui';
import { archive, publishedInsights } from '@/content/insights';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Insights.
 *
 * REBUILT 2026-09-24 FOR LAUNCH, around two published pieces.
 *
 * THE DESIGN PROBLEM WAS NOT "TWO ARTICLES IS TOO FEW". It was that the previous
 * version rendered the whole editorial pipeline as cards marked "In preparation",
 * so the page advertised its own emptiness: eight promises and nothing to read.
 * Two substantial pieces given real scale read as a selection. Eight cards, two
 * of which work, read as a site that has not been finished.
 *
 * SO QUANTITY IS REMOVED AND SIGNIFICANCE IS ADDED. No card grid, no filter
 * chips, no empty states, no "coming soon". The two pieces get editorial splits
 * with bespoke diagrams; everything after them is orientation rather than
 * inventory.
 *
 * THE FILTER IS GONE, NOT HIDDEN. With two articles a category control does
 * nothing except demonstrate that there is nothing to filter. The pipeline data
 * still exists in content/insights.ts because it is a real editorial plan; it
 * simply is not rendered. When six or eight pieces exist this page can grow a
 * library again, and nothing here prevents that: adding a third published
 * article needs no change to this file.
 *
 * `noIndex` IS REMOVED. It was set with a comment saying to remove it once the
 * first piece shipped, and two have. The site-wide SITE_IN_DEVELOPMENT flag in
 * content/launch.ts still holds every page back until launch, which is the one
 * control that should do that job.
 */

export const metadata = pageMetadata({
  title: 'Insights',
  description:
    'Practical thinking on software engineering, AI, automation, security and emerging technology, written for people who build, buy and use technology in the real world.',
  path: '/insights',
});

/** The four areas we write about. Deliberately NOT links: see the section note. */
const THEMES = [
  {
    kind: 'engineering' as const,
    title: 'Engineering',
    body: 'How software survives contact with the real world.',
  },
  {
    kind: 'ai' as const,
    title: 'AI & Automation',
    body: 'Where AI earns its place, and where it doesn’t.',
  },
  {
    kind: 'security' as const,
    title: 'Security & Regulation',
    body: 'What technology teams need to prepare for next.',
  },
  {
    kind: 'emerging' as const,
    title: 'Emerging Technology',
    body: 'What’s becoming possible, and what’s still hype.',
  },
];

/*
 * Explore by topic. Three point at a practice we actually sell.
 *
 * EMERGING TECHNOLOGY DOES NOT, and is not a link. The brief is explicit that it
 * must not imply quantum is an established Pixelette service, and it is not one:
 * the claim is held and /quantum-development-services returns 404 by decision.
 * A link to a hub that does not exist, or to a service we do not currently sell,
 * would assert exactly what the instruction rules out. It stays as a labelled
 * area of interest until there is somewhere honest to send a reader.
 */
const TOPICS = [
  { label: 'Engineering', href: '/engineering' },
  { label: 'AI & Automation', href: '/ai-automation' },
  { label: 'Blockchain', href: '/blockchain' },
  { label: 'Emerging Technology', href: null },
];

const METHODOLOGY_SLUG = 'how-we-evaluate-ai-systems';
const FEATURE_SLUG = 'where-ai-agents-should-work';

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export default function InsightsPage() {
  const feature = publishedInsights.find(i => i.slug === FEATURE_SLUG);
  const method = publishedInsights.find(i => i.slug === METHODOLOGY_SLUG);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Insights', path: '/insights' },
        ])}
      />

      {/* ---------------------------------------------------------- 1. hero */}
      <div className="hero-glow" style={{ padding: '92px 0 64px' }}>
        <div className="wrap">
          <div className="ins-hero">
            <div>
              <Eyebrow>Insights</Eyebrow>
              <h1 className="h1" style={{ marginTop: 24, maxWidth: '16ch' }}>
                Ideas for building what comes next.
              </h1>
              <p className="lead" style={{ marginTop: 26, maxWidth: '58ch' }}>
                Practical thinking on software engineering, AI, automation, security and
                emerging technology, written for people who build, buy and use technology in
                the real world.
              </p>
            </div>
            {/* A quiet typographic statement rather than a second call to action.
                The brief asks for no CTA in the hero, and a hero that asks for
                nothing is what lets the featured piece below carry the page. */}
            <p className="ins-hero__statement">
              Clear thinking.
              <br />
              Real experience.
              <br />
              <span>A more useful tomorrow.</span>
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------ 2. featured */}
      {feature ? (
        <Section labelledBy="featured-heading" style={{ paddingTop: 16 }}>
          <div className="ins-feature">
            <div className="ins-feature__copy">
              <Eyebrow>Featured insight</Eyebrow>
              <p className="ins-feature__cat">{feature.category}</p>
              <h2 className="h2 ins-feature__title" id="featured-heading">
                <Link href={`/blog/${feature.slug}`}>{feature.title}</Link>
              </h2>
              <p className="body ins-feature__excerpt">{feature.summary}</p>
              <p className="small ins-feature__meta">
                <time dateTime={feature.publishedOn}>{longDate(feature.publishedOn)}</time>
                <span aria-hidden>·</span>
                <span>{feature.readingMinutes} min read</span>
              </p>
              <p style={{ marginTop: 26 }}>
                <FLink href={`/blog/${feature.slug}`}>Read article</FLink>
              </p>
            </div>
            <div className="ins-feature__viz">
              <AgentScopeDiagram note="From experimentation to real-world impact." />
            </div>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------------ 3. second feature */}
      {method ? (
        <Section labelledBy="second-heading" style={{ background: '#F7FAFA' }}>
          {/* Reversed and on a tinted band, so the two features read as two
              pieces rather than as a repeating template. */}
          <div className="ins-feature ins-feature--reverse">
            <div className="ins-feature__viz">
              {/* The standing version: the horizontal one rendered as an 83px
                  strip beside a 480px column, and would have repeated the
                  methodology diagram lower down the page. */}
              <EvaluationGateStack />
            </div>
            <div className="ins-feature__copy">
              <p className="ins-feature__cat">{method.category}</p>
              <h2 className="h2 ins-feature__title" id="second-heading">
                <Link href={`/blog/${method.slug}`}>{method.title}</Link>
              </h2>
              <p className="body ins-feature__excerpt">{method.summary}</p>
              <p className="small ins-feature__meta">
                <time dateTime={method.publishedOn}>{longDate(method.publishedOn)}</time>
                <span aria-hidden>·</span>
                <span>{method.readingMinutes} min read</span>
              </p>
              <p style={{ marginTop: 26 }}>
                <FLink href={`/blog/${method.slug}`}>Read the methodology</FLink>
              </p>
            </div>
          </div>
        </Section>
      ) : null}

      {/* ------------------------------------------- 4. what we think about */}
      <Section labelledBy="themes-heading">
        <SectionHead
          eyebrow="What we’re thinking about"
          id="themes-heading"
          title="The areas we write about."
        />
        {/*
          NOT ARTICLE CARDS, and not clickable. They describe subjects rather
          than promising pieces, which is the whole point of replacing the "in
          preparation" grid: this section can say what Pixelette thinks about
          without implying an article exists for each one.
        */}
        <div className="grid grid-4 ins-themes" style={{ marginTop: 30 }}>
          {THEMES.map(t => (
            <div className="card ins-theme" key={t.title}>
              <ThemeMark kind={t.kind} />
              <h3 className="h4" style={{ marginTop: 18 }}>
                {t.title}
              </h3>
              <p className="body ins-theme__body">{t.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ 5. go deeper */}
      <Section labelledBy="deeper-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Explore by topic" id="deeper-heading" title="Go deeper." />
        <p className="body" style={{ marginTop: 18, maxWidth: '62ch' }}>
          Explore more thinking, case studies and technical perspectives across the areas we
          work in.
        </p>
        <ul className="ins-topics">
          {TOPICS.map(t => (
            <li key={t.label}>
              {t.href ? (
                <FLink href={t.href}>{t.label}</FLink>
              ) : (
                <span className="ins-topics__pending">
                  {t.label}
                  <span className="ins-topics__note">
                    Analysis and exploration rather than a service we currently sell.
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------- 6. methodology */}
      {method ? (
        <Section labelledBy="methodology-heading">
          <SectionHead
            eyebrow="Our methodology"
            id="methodology-heading"
            title="See how we test what we build."
          />
          <p className="body" style={{ marginTop: 18, maxWidth: '62ch' }}>
            Our approach to evaluating AI systems, evidence, reliability and production
            readiness.
          </p>
          <div style={{ marginTop: 34 }}>
            <EvaluationGateDiagram captions />
          </div>
          <p style={{ marginTop: 28 }}>
            <FLink href={`/blog/${method.slug}`}>Read the methodology</FLink>
          </p>
        </Section>
      ) : null}

      {/* -------------------------------------------------------- 7. archive */}
      <Section labelledBy="archive-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            {/*
              Visually secondary to the two features by position and by scale: a
              level-3 heading in a two-column band rather than an editorial
              split. The archive matters, and it is not current guidance.
            */}
            <SectionHead
              eyebrow="From the archive"
              id="archive-heading"
              level={3}
              title={archive.title}
            />
          </div>
          <div>
            <p className="body">{archive.note}</p>
            {archive.href ? (
              <p style={{ marginTop: 22 }}>
                <FLink href={archive.href}>Explore the archive</FLink>
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------- 8. closing CTA */}
      <ClosingCta
        ctaLabel="Talk to us"
        eyebrow="Let’s talk"
        title="Judge how we think before deciding how we build."
      >
        Explore our thinking, methodology and experience before starting a conversation.
      </ClosingCta>
    </>
  );
}
