import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

import { ArrowRight, ArrowUpRight } from '@/components/Icons';
import { jsonLd } from '@/lib/schema';

/** Injects a JSON-LD graph. Used on every page for GEO/AEO reach. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(data) }}
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
      <div className="wrap">{children}</div>
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
export function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span className="ph" data-placeholder="true">
      [{children}]
    </span>
  );
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
      <b className={pending ? 'ph' : undefined} style={pending ? { fontSize: 20 } : undefined}>
        {value}
      </b>
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
}: {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}) {
  const cls = variant === 'primary' ? 'btn' : 'btn2';
  if (external) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <ArrowUpRight size={15} />
      </a>
    );
  }
  return (
    <Link className={cls} href={href}>
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
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a className="flink" href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <ArrowUpRight size={13} />
      </a>
    );
  }
  return (
    <Link className="flink" href={href}>
      {children}
      <ArrowRight size={15} />
    </Link>
  );
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
}: {
  label: string;
  src?: string;
  alt?: string;
  ratio?: string;
}) {
  if (src) {
    return (
      <div className="slot slot--media" style={{ aspectRatio: ratio }}>
        {/* Plain <img>: these are pre-sized static exports, and skipping the
            optimiser keeps the site deployable to any static host. */}
        <img src={src} alt={alt ?? label} loading="lazy" decoding="async" />
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
