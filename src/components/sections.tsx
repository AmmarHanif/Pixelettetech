import Link from 'next/link';
import type { ReactNode } from 'react';

import { ArrowUpRight, Shield, Star } from '@/components/Icons';
import { Cta, Eyebrow, FLink, PillRow, Section, SourceNote } from '@/components/ui';
import { certifications, certified, clutch, company } from '@/content/company';
import { clients } from '@/content/clients';
import { featuredTestimonials, type Testimonial } from '@/content/testimonials';

/**
 * "Trusted by" client row.
 *
 * Rendered as text wordmarks, which is exactly what the approved design
 * specifies — a row of names at 17px/500 in the muted grey, not logo images.
 *
 * It is also the only correct option with the assets that exist: the client
 * logo files in the current asset library are white-on-transparent, drawn for
 * the old dark-themed site, and several are invisible on this light one. Text
 * is faithful, accessible, and cannot silently render as a blank space. If a
 * logo row is wanted later it needs light-background artwork per client.
 */
export function ClientLogos({
  heading = 'Trusted by',
  tight,
}: {
  heading?: string;
  tight?: boolean;
}) {
  return (
    <Section tight={tight} labelledBy="clients-heading">
      <div className="clientrow">
        <span className="clientrow__label mono" id="clients-heading">
          {heading}
        </span>
        <ul className="clientrow__list">
          {clients.map(client => (
            <li key={client.name}>{client.name}</li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/** Verified client voices. Each one links to the review it came from. */
export function Testimonials({
  items = featuredTestimonials,
  heading = 'Client voices',
}: {
  items?: Testimonial[];
  heading?: string;
}) {
  return (
    <Section labelledBy="voices-heading">
      <Eyebrow id="voices-heading">{heading}</Eyebrow>
      <div className="grid grid-2" style={{ marginTop: 32 }}>
        {items.map(t => (
          <figure className="card" key={t.url} style={{ margin: 0 }}>
            <div
              style={{ display: 'flex', gap: 3, color: 'var(--brand)', marginBottom: 18 }}
              aria-label={`${t.rating} out of 5`}
            >
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <blockquote className="quote" style={{ margin: 0 }}>
              “{t.quote}”
            </blockquote>
            <figcaption
              style={{
                marginTop: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                flexWrap: 'wrap',
              }}
            >
              <span className="avatar" aria-hidden>
                {t.initials}
              </span>
              <span>
                <b style={{ display: 'block', fontSize: 15 }}>{t.name}</b>
                <span className="small" style={{ fontSize: 13 }}>
                  {t.role}
                </span>
              </span>
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="small"
                style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5 }}
              >
                Verify on Clutch
                <ArrowUpRight size={12} />
              </a>
            </figcaption>
          </figure>
        ))}
      </div>
      <SourceNote>
        Rating {clutch.ratingValue} from {clutch.reviewCount} verified reviews. Last checked{' '}
        {clutch.lastVerified}.{' '}
        <a href={clutch.profileUrl} target="_blank" rel="noopener noreferrer">
          Full profile on Clutch
        </a>
        .
      </SourceNote>
    </Section>
  );
}

/**
 * The group hand-off.
 *
 * This block exists to send certification work away from us. It is the
 * commercial point of the whole architecture: we build it, they certify it,
 * and a builder grading its own homework is not assurance.
 */
export function CertifiedHandoff({
  variant = 'full',
  /**
   * Show the full service list including vCISO and vDPO. The design lists
   * those only on the Assurance page; the front page shows the five
   * certification standards.
   */
  allServices = false,
  /**
   * The design gives this block different copy on two boards, because it does
   * two different jobs. On the front page it interrupts someone who landed on
   * the wrong site — "Came for the certificate rather than the build?". On the
   * Assurance page it closes a reader who has already worked through the
   * who-does-what comparison, so it simply states what Certified sells.
   *
   * The facts are identical in both; only the framing sentence differs, which
   * is why this is a prop rather than a second component.
   */
  eyebrow,
  title,
  blurb,
}: {
  variant?: 'full' | 'compact';
  allServices?: boolean;
  eyebrow?: string;
  title?: string;
  blurb?: ReactNode;
}) {
  if (variant === 'compact') {
    return (
      <div className="dark-panel" style={{ padding: '30px 32px' }}>
        <span style={{ color: 'var(--mint)', display: 'inline-flex', marginBottom: 16 }} aria-hidden>
          <Shield size={26} />
        </span>
        <h2 className="h3" style={{ color: 'var(--dark-head)' }}>
          The one we do not do: certify it
        </h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>
          ISO/IEC 42001, AI governance, security review and audit are delivered by{' '}
          {certified.name}, a separate practice in the same group, with its own lead auditors. We
          will not sell you an audit of our own build.
        </p>
        <p style={{ marginTop: 20 }}>
          <a
            href={certified.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--mint)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            pixelettecertified.com
            <ArrowUpRight size={13} />
          </a>
        </p>
      </div>
    );
  }

  return (
    <Section labelledBy="certified-heading">
      <div className="dark-panel" style={{ padding: '48px 44px' }}>
        <Eyebrow>{eyebrow ?? 'Part of Pixelette Group · a separate practice'}</Eyebrow>
        <h2 className="h2" style={{ color: 'var(--dark-head)', marginTop: 18 }} id="certified-heading">
          {title ?? 'Came for the certificate rather than the build?'}
        </h2>
        <p style={{ marginTop: 20, fontSize: 16, lineHeight: 1.65, maxWidth: '66ch' }}>
          {blurb ?? (
            <>
              {certified.name} is the group’s compliance and certification practice: ISO 27001,
              ISO/IEC 42001 for AI management systems, Cyber Essentials, GDPR and SOC 2, delivered by
              certified lead auditors. If the question is whether your AI will survive a security
              review or a board, that is their work rather than ours, and we will hand you straight
              over.
            </>
          )}
        </p>
        <div className="pill-row" style={{ marginTop: 26 }}>
          {(allServices ? certified.services : certified.standards).map(s => (
            <span
              className="pill"
              key={s}
              style={{ borderColor: '#1C4744', color: '#9BAEAB' }}
            >
              {s}
            </span>
          ))}
        </div>
        <p style={{ marginTop: 28, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
          <a
            href={certified.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--mint)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontWeight: 600,
            }}
          >
            pixelettecertified.com
            <ArrowUpRight size={14} />
          </a>
          <Link
            href="/assurance"
            style={{ color: '#9BAEAB', display: 'inline-flex', alignItems: 'center', gap: 7 }}
          >
            Who does what →
          </Link>
        </p>
      </div>
    </Section>
  );
}

/**
 * The verification table.
 *
 * Published because security review delays roughly half of enterprise deals,
 * and because publishing what a reviewer will ask for is cheaper than
 * answering it forty times. The ISO 42001 row states plainly that the
 * certificate is a group capability we do not hold.
 */
export function VerificationTable({ withHeading = true }: { withHeading?: boolean }) {
  return (
    <>
      {withHeading ? (
        <>
          <Eyebrow>Verification</Eyebrow>
          <h2 className="h2" style={{ marginTop: 18 }}>
            Every claim on this page resolves to a link.
          </h2>
          <p className="body" style={{ marginTop: 20 }}>
            Security review delays half of all enterprise deals. We publish what a reviewer asks for
            before they ask, and we do not claim a certificate we do not hold.
          </p>
          <SourceNote>G2 Buyer Behavior Report, July 2026</SourceNote>
        </>
      ) : null}

      <div className="table-scroll" style={{ marginTop: withHeading ? 34 : 0 }}>
        <table>
          <caption className="small" style={{ textAlign: 'left', paddingBottom: 12 }}>
            Certifications held by {company.legalName}, and the one held elsewhere in the group.
          </caption>
          <thead>
            <tr>
              <th scope="col">Standard</th>
              <th scope="col">Status</th>
              <th scope="col">Verify</th>
            </tr>
          </thead>
          <tbody>
            {certifications.map(cert => (
              <tr key={cert.standard}>
                <th
                  scope="row"
                  style={{
                    fontFamily: 'var(--sans)',
                    fontSize: 14.5,
                    textTransform: 'none',
                    letterSpacing: 0,
                    color: 'var(--ink)',
                    fontWeight: 600,
                    borderBottom: '1px solid var(--line)',
                    padding: '14px 16px',
                  }}
                >
                  {cert.standard}
                  {cert.note ? (
                    <span
                      className="small"
                      style={{ display: 'block', fontWeight: 400, marginTop: 4 }}
                    >
                      {cert.note}
                    </span>
                  ) : null}
                </th>
                {/* "In progress" is a true, current status, not unfilled
                    content — so it renders as ordinary copy. Placeholder
                    styling (ADR-0003) is reserved for a genuine gap, and
                    dressing a real answer as a gap understates what we know. */}
                <td>{cert.status}</td>
                <td>
                  {cert.verifyUrl ? (
                    cert.verifyUrl.startsWith('/') ? (
                      <Link href={cert.verifyUrl}>{cert.verifyLabel}</Link>
                    ) : (
                      <a href={cert.verifyUrl} target="_blank" rel="noopener noreferrer">
                        {cert.verifyLabel}
                        <ArrowUpRight size={11} />
                      </a>
                    )
                  ) : (
                    <span className="muted">{cert.verifyLabel}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ marginTop: 26 }}>
        <FLink href="/security-and-data">Read our security and data position</FLink>
      </p>
    </>
  );
}

/** Closing call to action, used at the foot of nearly every page. */
export function ClosingCta({
  eyebrow,
  title,
  children,
  ctaHref = '/contact',
  ctaLabel = 'Book a value baseline',
  aside,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  aside?: ReactNode;
}) {
  return (
    <Section labelledBy="closing-heading">
      <div className={`split ${aside ? 'split--cta' : 'split--single'}`}>
        <div>
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          <h2 className="h2" id="closing-heading" style={{ marginTop: eyebrow ? 18 : 0 }}>
            {title}
          </h2>
          {children ? (
            <p className="body" style={{ marginTop: 20 }}>
              {children}
            </p>
          ) : null}
          <div className="btn-row" style={{ marginTop: 32 }}>
            <Cta href={ctaHref}>{ctaLabel}</Cta>
          </div>
        </div>
        {aside}
      </div>
    </Section>
  );
}

/** Compact trust strip: certifications, rating and reach. */
export function TrustStrip() {
  return (
    <PillRow
      items={[
        'ISO 9001',
        'ISO 27001',
        'Cyber Essentials Plus',
        `Clutch ${clutch.ratingValue} · ${clutch.reviewCount} reviews`,
        `${company.countriesDelivered} countries`,
      ]}
      style={{ justifyContent: 'center' }}
    />
  );
}
