import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

import { ArrowRight, ArrowUpRight } from '@/components/Icons';
import type { AnalyticsAttributes } from '@/lib/analytics';
import { jsonLd } from '@/lib/schema';

/**
 * Injects a JSON-LD graph. Used on every page for GEO/AEO reach.
 *
 * Renders nothing at all when there is no graph. `jsonLd` returns '' for a
 * builder that declined to assert anything — `caseStudySchema` returns null for
 * a case study with no published detail — and an empty
 * `<script type="application/ld+json"></script>` is not a neutral no-op: a
 * structured-data validator reports it as "no items detected", which is a
 * failing result on a page that has a perfectly good graph elsewhere on it.
 *
 * The guard belongs here rather than at each call site. Callers were writing
 * `schema ? <JsonLd data={schema} /> : null` to work around it, which only
 * protected the caller that remembered.
 */
export function JsonLd({ data }: { data: unknown }) {
  const html = jsonLd(data);
  if (!html) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Section({
  children,
  id,
  flush,
  tight,
  className = '',
  style,
  labelledBy,
}: {
  children: ReactNode;
  id?: string;
  flush?: boolean;
  tight?: boolean;
  className?: string;
  style?: CSSProperties;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`sec${flush ? ' sec--flush' : ''}${tight ? ' sec--tight' : ''} ${className}`.trim()}
      style={style}
    >
      {/* `data-reveal` marks this for the scroll animation. It is INERT until
          ScrollReveal confirms at runtime that it can reveal it again, so a page
          without JavaScript, or with reduced motion set, renders exactly as it
          did before - visible. See ScrollReveal.tsx. */}
      <div className="wrap" data-reveal>
        {children}
      </div>
    </section>
  );
}

export function Eyebrow({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <span className="eyebrow" id={id}>
      {children}
    </span>
  );
}

/**
 * Unfilled content, rendered visibly.
 *
 * The design's standing rule: a placeholder stays on the page until a real
 * engagement fills it, because inventing a client name or a percentage to make
 * a section look complete is the one failure mode this site is built to avoid.
 * Rendering it in amber monospace makes it obvious to a reviewer and trivial
 * to grep for before go-live.
 */
export function Placeholder({
  children,
  /**
   * True for copy that deliberately *wears* the placeholder styling but is not
   * an unfilled gap — currently only the "your engagement here" invitation on
   * the work index, which borrows the site's own not-yet-filled idiom on
   * purpose and will never be filled in.
   *
   * It keeps the amber treatment but drops `data-placeholder`, so the audit
   * stops counting it as outstanding content. Without this it inflates the
   * blocking count permanently — the checklist read 13 client sign-off items
   * when one of them could never be signed off by anyone.
   */
  intentional = false,
}: {
  children: ReactNode;
  intentional?: boolean;
}) {
  /*
   * UNFILLED PLACEHOLDERS RENDER NOTHING FROM 2026-09-16, for launch.
   *
   * They were publishing INTERNAL EDITORIAL INSTRUCTIONS as public body copy:
   * "[ RUN CONTRACT STATUS, OR WHAT THE CLIENT DID AFTERWARDS ]",
   * "[ CLIENT QUOTE, WITH SIGN-OFF ]", "[ NAME ]", "[ ROLE ]", "[ CLIENT ]",
   * "[ MEASURED FIGURE ]". The founder's instruction is explicit: no internal
   * instruction, development note or unpublished-content marker may remain
   * publicly visible.
   *
   * THE DISCIPLINE THIS SERVED IS NOT ABANDONED, ONLY MOVED. The rule was that
   * a gap stays visible until a real engagement fills it, so nobody invents a
   * client, a figure or a date to make a section look finished. That rule now
   * lives where it belongs - in the source, the claims register and the launch
   * marker sweep - rather than on the page in front of a buyer. Showing a
   * prospect the scaffolding proves honesty to nobody who was not already
   * reading the HTML.
   *
   * `intentional` is UNCHANGED and still renders: it is the "your engagement
   * here" invitation on the work index, which borrows the idiom on purpose and
   * is real published copy rather than an unfilled gap.
   *
   * WATCH FOR EMPTY CONTAINERS. Returning null can leave an orphaned heading or
   * an empty quote frame where a placeholder was the only child. Those are
   * fixed at their call sites, not here.
   */
  if (!intentional) return null;

  return <span className="ph">[{children}]</span>;
}

/** Attribution line. Every statistic on the site is followed by one. */
export function SourceNote({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p className="src" style={{ marginTop: 14, ...style }}>
      {children}
    </p>
  );
}

export function StatTile({
  value,
  label,
  pending,
}: {
  value: string;
  label: string;
  pending?: boolean;
}) {
  return (
    <div className="tile">
      <b
        className={pending ? 'ph' : undefined}
        style={pending ? { fontSize: 20 } : undefined}
        {...(pending ? { 'data-placeholder': 'true' } : {})}
      >
        {value}
      </b>
      {/* Real space, not layout: value and label are display:block so they
          never run together on screen, but JSX drops newline whitespace
          between elements, so textContent read '80%of individual AI
          users'. Copy-paste and extraction tools use textContent. */}
      {' '}
      <span>{label}</span>
    </div>
  );
}

export function PillRow({ items, style }: { items: readonly string[]; style?: CSSProperties }) {
  return (
    <div className="pill-row" style={style}>
      {items.map(item => (
        <span className="pill" key={item}>
          {item}
        </span>
      ))}
    </div>
  );
}

/** Primary call to action. */
export function Cta({
  href,
  children,
  variant = 'primary',
  external,
  analytics,
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
  /**
   * Analytics attributes from `analyticsAttrs()` in `src/lib/analytics.ts`,
   * spread onto the rendered anchor.
   *
   * They are plain `data-*` attributes and not a handler, which is the whole
   * point: a tracked CTA stays server-rendered, and the single delegated
   * listener in `src/components/AnalyticsEvents.tsx` reads them at click
   * time. Optional, so an untracked CTA renders exactly the markup it
   * rendered before this prop existed.
   */
  analytics?: AnalyticsAttributes;
}) {
  const cls = variant === 'primary' ? 'btn' : 'btn2';
  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer" {...analytics}>
        {children}
        <ArrowUpRight size={15} />
      </a>
    );
  }
  return (
    <Link className={cls} href={href} {...analytics}>
      {children}
      {variant === 'primary' ? <ArrowRight size={16} /> : null}
    </Link>
  );
}

/** Inline text link with the 44px target the design specifies. */
export function FLink({
  href,
  children,
  external,
  analytics,
  wrap,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  /** See `Cta`. Plain attributes, no handler, no client boundary. */
  analytics?: AnalyticsAttributes;
  /**
   * For a label too long to sit on one line in its container.
   *
   * The default `.flink` is inline-flex with `align-items: center`, so a label
   * that wraps leaves the arrow floating beside the middle of a two-line block.
   * `.flink--wrap` makes the link inline-block, which returns the arrow to the
   * text flow so it follows the last word. Opt in, because every short label on
   * the site is better served by the flex version's exact 7px gap.
   */
  wrap?: boolean;
}) {
  const className = wrap ? 'flink flink--wrap' : 'flink';
  if (external) {
    return (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer" {...analytics}>
        {children}
        <ArrowUpRight size={13} />
      </a>
    );
  }
  return (
    <Link className={className} href={href} {...analytics}>
      {children}
      <ArrowRight size={15} />
    </Link>
  );
}

/**
 * The `sizes` values for the three places a MediaSlot image appears, so no call
 * site has to restate the breakpoints. Measured 2026-09-30 at a 1440px viewport;
 * both grids collapse to one column at 860px and content caps at 1112px.
 */
export const SIZES = {
  /** Homepage, `.grid-3` - 357px at full width. */
  grid3: '(max-width: 860px) 92vw, (max-width: 1159px) 30vw, 358px',
  /** /case-studies index, `.grid-2` - 545px at full width. */
  grid2: '(max-width: 860px) 92vw, (max-width: 1159px) 46vw, 547px',
  /** Case-study detail hero - the full content column, 1110px. */
  hero: '(max-width: 1159px) 92vw, 1112px',
} as const;

/**
 * The WebP srcset for a /work PNG, or null for anything else.
 *
 * The widths mirror `scripts/build-work-images.mjs`, which never upscales - so a
 * 675px source has only the 360 and 675 entries and the browser simply picks the
 * best it has. Listing a width whose file does not exist would 404, so the set is
 * derived from the same table rather than assumed.
 */
const WORK_WIDTHS: Record<string, number[]> = {
  '2connect': [360, 675],
  aia: [360, 720, 1120, 2220],
  ayni: [360, 675],
  beyorch: [360, 675],
  blockguard: [360, 675],
  'diamond-nxt': [360, 720, 1120, 2220],
  'digital-asset-vault': [360, 720, 1120, 2220],
  fusio: [360, 675],
  'ragnar-token': [360, 675],
  'stay-sane': [360, 675],
};

function webpSet(src: string): string | null {
  const m = /^\/work\/([a-z0-9-]+)\.png$/.exec(src);
  if (!m) return null;
  const widths = WORK_WIDTHS[m[1]];
  if (!widths) return null;
  return widths.map(w => `/work/${m[1]}-${w}.webp ${w}w`).join(', ');
}

/**
 * A labelled slot where real imagery goes.
 *
 * With `src` it renders the image. Without one it renders a labelled box
 * naming what belongs there — honest about being unfilled rather than padded
 * with stock photography.
 */
export function MediaSlot({
  label,
  src,
  alt,
  ratio = '16 / 10',
  /**
   * Load this image eagerly and at high fetch priority. Set it on an image that
   * is ABOVE THE FOLD, never below it.
   *
   * Added 2026-09-14. Every MediaSlot hardcoded `loading="lazy"`, which is right
   * for the several below-fold slots on a case study and wrong for the one at
   * the top: the hero renders immediately after the h1 on all 29 case-study
   * pages and is the likely largest-contentful-paint element. Lazy-loading the
   * LCP candidate delays the metric by design — the browser is told not to
   * start the fetch until layout proves the image is near the viewport, which
   * for an above-fold image is work done in the wrong order.
   *
   * Defaults to false so every existing call site keeps the behaviour it had.
   */
  priority = false,
  /**
   * What width this image actually renders at, as a `sizes` attribute.
   *
   * THE SAME FILE RENDERS AT THREE DIFFERENT SIZES, measured 2026-09-30:
   * 357px on the homepage (`.grid-3`), 545px on the /case-studies index
   * (`.grid-2`) and 1110px as the case-study detail hero. Without `sizes` the
   * browser assumes 100vw and fetches the largest candidate for all three, so
   * the homepage would pull a 2240px file to paint 357 of it.
   *
   * Both grids collapse to one column at `max-width: 860px`, and content is
   * capped at `--wrap: 1160px` less two 24px gutters. The default below is the
   * `.grid-2` case, which is the most common; the homepage and the detail hero
   * pass their own.
   */
  sizes = SIZES.grid2,
}: {
  label: string;
  src?: string;
  alt?: string;
  ratio?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src) {
    const webp = webpSet(src);
    return (
      <div className="slot slot--media" style={{ aspectRatio: ratio }}>
        {/* <picture> with a WebP srcset over the original PNG.
            Still no image optimiser in front of the site: these are static
            files built by `scripts/build-work-images.mjs`, so the site stays
            deployable to any static host - which is why this was a plain <img>
            before and why the PNG is kept as the fallback source.
            The WebP set is 638 KB across every width against 3,255 KB of PNG. */}
        <picture>
          {webp ? <source type="image/webp" srcSet={webp} sizes={sizes} /> : null}
          <img
            src={src}
            alt={alt ?? label}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
          />
        </picture>
      </div>
    );
  }
  return (
    <div className="slot" style={{ aspectRatio: ratio }} role="img" aria-label={`Placeholder: ${label}`}>
      [ {label} ]
    </div>
  );
}

/** Heading + lead pair used at the top of most sections. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  id,
  center,
  level = 2,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  center?: boolean;
  level?: 2 | 3;
}) {
  const Tag = level === 2 ? 'h2' : 'h3';
  return (
    <div style={center ? { textAlign: 'center' } : undefined}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag className={level === 2 ? 'h2' : 'h3'} id={id} style={{ marginTop: eyebrow ? 18 : 0 }}>
        {title}
      </Tag>
      {lead ? (
        <p className="lead" style={{ marginTop: 20, ...(center ? { marginInline: 'auto' } : {}) }}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Feature card used across the service grids. */
export function FeatureCard({
  icon,
  title,
  children,
  href,
  linkLabel,
  meta,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  href?: string;
  linkLabel?: string;
  meta?: string;
}) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      {icon ? (
        <span style={{ color: 'var(--brand)', display: 'inline-flex', marginBottom: 18 }} aria-hidden>
          {icon}
        </span>
      ) : null}
      <h3 className="h3">{title}</h3>
      <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
        {children}
      </p>
      {meta ? (
        <p className="small" style={{ marginTop: 16, fontSize: 12.5 }}>
          {meta}
        </p>
      ) : null}
      <div style={{ flexGrow: 1 }} />
      {href && linkLabel ? (
        <div style={{ marginTop: 18 }}>
          <FLink href={href}>{linkLabel}</FLink>
        </div>
      ) : null}
    </div>
  );
}

/** Checklist row, as used in the door cards and the baseline inclusions. */
export function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        listStyle: 'none',
      }}
    >
      <span
        style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 4, display: 'inline-flex' }}
        aria-hidden
      >
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none" focusable="false">
          <path
            d="M3 8l3 3 6-7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="small" style={{ fontSize: 14, color: 'var(--body)' }}>
        {children}
      </span>
    </li>
  );
}

export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <ul style={{ padding: 0, margin: 0, display: 'grid', gap: 9 }}>
      {items.map((item, i) => (
        <CheckItem key={i}>{item}</CheckItem>
      ))}
    </ul>
  );
}

export type Faq = { q: string; a: string };

/**
 * The FAQ list, rendered for humans.
 *
 * WHY THIS EXISTS AS A COMPONENT, 2026-09-14. It did not, and the consequence was
 * measured rather than suspected: 33 pages emitted `faqSchema(faqs)` into the
 * structured data and exactly ONE — the homepage — rendered the array. 89 of 103
 * answers were published to machines and shown to nobody.
 *
 * That is not a missed opportunity, it is a Google structured-data policy breach:
 * FAQPage markup must correspond to content visible on the page, and the exposure
 * is a manual action rather than a lost rich result. It was inert only because
 * `SITE_IN_DEVELOPMENT` keeps the site out of the index, and it would have gone
 * live on the day that flag flipped.
 *
 * The sharpest instance was on /certifications, where the answer to "Does
 * Pixelette Technologies hold ISO/IEC 42001?" — "No." — was machine-only. That is
 * the one disambiguation this site most needs a human and an answer engine to
 * agree on, and only the machine was getting it.
 *
 * So the component takes the SAME array the schema takes. A page that emits the
 * schema and renders this cannot state more in the graph than in the prose, which
 * is the rule `src/lib/schema.ts` sets out and which 32 pages were breaking. Two
 * call sites reading one array is the only version of this that stays true.
 *
 * Guarded three ways, because a convention is not a control: the type is shared
 * with `faqSchema`; `scripts/audit.py` now asserts every `acceptedAnswer.text`
 * appears in the page body with the JSON stripped; and that assertion is a
 * problem, not a note, so the audit fails rather than warns.
 */
export function Faqs({
  items,
  style,
}: {
  items: readonly Faq[];
  style?: CSSProperties;
}) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: 34, maxWidth: '80ch', ...style }}>
      {items.map(faq => (
        <details key={faq.q} className="faq">
          <summary>{faq.q}</summary>
          <p className="body" style={{ marginTop: 12 }}>
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
