import Link from 'next/link';
import type { ReactNode } from 'react';

import { AiMark, ArrowUpRight, BuildMark, ChainMark, Gauge, Shield, Star } from '@/components/Icons';
import { ProofStrip } from '@/components/ProofStrip';
import { Cta, Eyebrow, FLink, Section, SourceNote } from '@/components/ui';
import { publishedClaims } from '@/content/claims';
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
  /*
   * The zero guard (added 2026-09-08).
   *
   * The same defect class as the footer badge row, the certification table and
   * the trust strip, all of which were live bugs earlier today. This one is
   * latent only because the list happens to be non-empty right now.
   *
   * `src/content/clients.ts` gained a required `permission` field today, along
   * with an `approvedClients()` accessor that returns EMPTY, and it records the
   * founder's open decision to switch this render onto that accessor. On the
   * day that switch is made, the unguarded component left a "Trusted by" label
   * sitting over an empty `<ul>`, inside a bordered 128px section, on the
   * homepage and on /ai-engineering — an orphan heading, an empty container
   * and a stray separator in one. Exactly what the handoff's DEVELOPER RULE
   * forbids: "the absence of a badge must not leave a broken layout".
   *
   * The whole component returns null rather than guarding the inner list,
   * because the `<Section>` — with its border-top and its 64px of padding —
   * lives inside this component and both call sites render it bare. Nothing
   * wraps it, so nothing is left behind.
   *
   * The guard and the map read one local, so they cannot drift apart, and
   * switching to `approvedClients()` stays the one-line change that file
   * describes. This does NOT make that switch: the permission question is the
   * founder's to answer, not this component's.
   */
  const names = clients;
  if (names.length === 0) return null;

  return (
    <Section tight={tight} labelledBy="clients-heading">
      <div className="clientrow">
        <span className="clientrow__label mono" id="clients-heading">
          {heading}
        </span>
        <ul className="clientrow__list">
          {names.map(client => (
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
  /*
   * The zero guard (added 2026-09-08).
   *
   * `src/content/testimonials.ts` gained a required `publication` field today,
   * and `featuredTestimonials` — this component's default — is now derived
   * from a fail-closed accessor, so it empties the moment any row is set to
   * WITHHELD. That file names this component as the consumer that had not yet
   * guarded its zero case.
   *
   * Unguarded, an empty list rendered the eyebrow, an empty `.grid.grid-2` and
   * the source note inside a bordered 96px section: an orphan heading, an
   * empty container and a stray separator. Worse than the layout, the note
   * read "Each review above links to the review it came from" with no reviews
   * above it. The `clutch.published` branch is no better — an aggregate over
   * zero rendered reviews is precisely the rollup that flag exists to withhold.
   *
   * So the guard covers the whole block, heading and note included, and not
   * merely the grid. Same treatment as the footer badge row, the certification
   * table and the trust strip earlier today, and the same rule behind all
   * four: "the absence of a badge must not leave a broken layout".
   */
  if (items.length === 0) return null;

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
      {/*
        The aggregate is gated on `clutch.published` (added 2026-09-08).

        Not in the brief for this work package, found while fixing the same
        defect in `TrustStrip` and fixed here because it is the same held claim
        in the same file: `clutch-rating` is HELD in the claims register, and
        `clutch.published` is `false` specifically so that nothing prints the
        score and the review count until the live profile is re-read. This note
        printed both regardless.

        The individual reviews are a different claim from the aggregate and are
        untouched — each card still carries its own quote, its own rating and
        its own "Verify on Clutch" link to the review it came from. Only the
        firm-level rollup is withheld, and a source note is still rendered
        either way, so the section closes the same way in both states.
      */}
      {clutch.published ? (
        <SourceNote>
          Rating {clutch.ratingValue} from {clutch.reviewCount} verified reviews. Last checked{' '}
          {clutch.lastVerified}.{' '}
          <a href={clutch.profileUrl} target="_blank" rel="noopener noreferrer">
            Full profile on Clutch
          </a>
          .
        </SourceNote>
      ) : (
        <SourceNote>
          Each review above links to the review it came from.{' '}
          <a href={clutch.profileUrl} target="_blank" rel="noopener noreferrer">
            Full profile on Clutch
          </a>
          .
        </SourceNote>
      )}
    </Section>
  );
}

/**
 * The group hand-off.
 *
 * This block exists to send certification and assurance work away from us.
 *
 * CORRECTED 2026-09-11. What follows is a correction, not a deletion.
 *
 * This comment used to read: "It is the commercial point of the whole
 * architecture: we build it, they certify it, and a builder grading its own
 * homework is not assurance."
 *
 * "We build it, they certify it" is the formulation the founder's
 * implementation handoff displaced. At its section 12 CTA the handoff says:
 * 'Use this wording instead of the current "we build it, Certified proves it"
 * claim'; and its ACCREDITATION-SAFE RULE forbids saying that Pixelette
 * Technologies or Pixelette Certified "holds" an accreditation, issues a
 * certificate, performs an independent audit or has a named certified-practice
 * status unless the exact legal entity and status have been verified. "They
 * certify it" asserts that a Group company issues certificates, which is
 * precisely what that rule forbids.
 *
 * The approved replacement has one home — `certified.positioningLine` in
 * `src/content/company.ts`: "We engineer it. Certified helps you govern,
 * evidence and prepare it for assurance." That file's own note records it as
 * replacing "we build it, Certified proves it" and every variant of it,
 * wherever those still appear. This comment was one of the places they still
 * appeared.
 *
 * The RENDERED output of this component was fixed on 2026-09-08 and has been
 * safe since: both variants below compose `certified.positioningLine`,
 * `certified.blurb`, `certified.name` and `certified.standards` from that file
 * and assert no status, and the pill row carries an explicit label saying the
 * standards are areas of support rather than accreditations held. Only the doc
 * comment sitting above the fix kept the displaced wording. NOTHING IS OWED
 * FROM THIS PARAGRAPH AND NOTHING HERE IS BLOCKING.
 *
 * Corrected in place rather than quietly deleted, for the reason the same
 * correction in `src/app/ai-engineering/page.tsx` gives: a comment that states
 * a displaced policy as current reads as authority to the next person editing
 * the file, and this is the most widely imported component file in the
 * repository. The history is what stops the sentence being reintroduced.
 *
 * What the old sentence was reaching for is still true, and is still why this
 * block exists: a builder grading its own homework is not assurance, so the
 * assessment stays independent. What changed is the claim about who performs
 * it. Certified prepares a client for independent assessment. It does not
 * carry it out, and neither do we.
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
   * The design gives this block different copy on different boards, because it
   * does different jobs: on a service page it interrupts someone who landed on
   * the wrong site, and on the Assurance page it closes a reader who has
   * already worked through the who-does-what comparison. Only the framing
   * differs, which is why this is a prop rather than a second component.
   *
   * CORRECTED 2026-09-11, comment only. This used to say that the front page
   * renders "Came for the certificate rather than the build?". It does not.
   * All three full-variant call sites now pass their own `eyebrow`, `title`
   * and `blurb`: the homepage and /certifications both pass the title "Need
   * governance and assurance around what you are building?", and /assurance
   * passes "Governance, evidence and readiness for assurance." So the three
   * defaults below are rendered by NO call site today.
   *
   * They are kept deliberately. A fourth caller added with no props must still
   * land on accreditation-safe copy, and the defaults are that floor — not
   * dead code. Nothing is owed from this paragraph.
   */
  eyebrow,
  title,
  blurb,
  /**
   * Label for the outbound link in the full variant. Defaults to the bare
   * domain. Optional and additive, so no caller is forced to change.
   *
   * CORRECTED 2026-09-11, comment only. This used to say the bare domain is
   * "what every existing call site renders", which stopped being true once the
   * homepage began passing a label. Counted today: of the three full-variant
   * call sites, /assurance and /certifications take the default and render
   * "pixelettecertified.com", and the homepage passes the handoff's section 12
   * CTA, "Explore Pixelette Certified". The compact variant does not read this
   * prop at all. Nothing is owed from this paragraph.
   */
  ctaLabel,
}: {
  variant?: 'full' | 'compact';
  allServices?: boolean;
  eyebrow?: string;
  title?: string;
  blurb?: ReactNode;
  ctaLabel?: string;
}) {
  if (variant === 'compact') {
    return (
      <div className="dark-panel" style={{ padding: '30px 32px' }}>
        <span style={{ color: 'var(--mint)', display: 'inline-flex', marginBottom: 16 }} aria-hidden>
          <Shield size={26} />
        </span>
        {/* Reworded 2026-09-08 under the handoff's ACCREDITATION-SAFE RULE.
            The heading said "The one we do not do: certify it" and the body
            said Certified delivers ISO/IEC 42001 and audit "with its own lead
            auditors" — a named certified-practice status and an independent
            audit competence, neither of which is verified for the exact legal
            entity (claims.ts `certified-cross-sell`). This is the handoff's
            own section 12 wording instead, which sells the same route without
            asserting a status. Three pages render this variant with no props,
            so the default is the only thing that fixes them. */}
        <h2 className="h3" style={{ color: 'var(--dark-head)' }}>
          Need governance and assurance around what you are building?
        </h2>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>
          {certified.positioningLine}
        </p>
        <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.6 }}>{certified.blurb}</p>
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
          {/* Reworded 2026-09-08, same rule as the compact variant above. The
              default said Certified delivers five standards "by certified lead
              auditors", which is a named certified-practice status the
              ACCREDITATION-SAFE RULE forbids until the exact legal entity and
              status are verified. It is now the handoff's section 12 sentence,
              assembled from `certified.blurb` so the wording has one home in
              `src/content/company.ts` and cannot drift from it here. */}
          {blurb ?? (
            <>
              {certified.name} is{' '}
              {certified.blurb.charAt(0).toLowerCase() + certified.blurb.slice(1)}
            </>
          )}
        </p>
        {/*
          The pill row is labelled (added 2026-09-08).

          It was rendering "ISO 27001 · ISO 42001 · Cyber Essentials · GDPR ·
          SOC 2" as five bare pills directly under the Certified panel, with
          nothing saying what the list was. `src/content/company.ts` states the
          requirement on the list itself — "These are areas of support, not
          accreditations held by any Pixelette company … the copy around this
          list must not turn readiness into a certificate" — and an unlabelled
          badge row is precisely the presentation that turns it into one. Under
          DMCCA 2024 s.226 the test is the overall impression, so a true list
          under a misleading label is still a misleading action.

          The label states what the list is before the reader reaches it.
        */}
        <p className="small" style={{ marginTop: 26, color: 'var(--dark-text)' }}>
          What {certified.name} helps with. These are areas of support, not accreditations held by
          any Pixelette company; independent assessment stays independent.
        </p>
        <div className="pill-row" style={{ marginTop: 14 }}>
          {(allServices ? certified.services : certified.standards).map(s => (
            <span
              className="pill"
              key={s}
              style={{ borderColor: '#1C4744', color: '#ffffff' }}
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
            {ctaLabel ?? 'pixelettecertified.com'}
            <ArrowUpRight size={14} />
          </a>
          <Link
            href="/assurance"
            style={{ color: '#ffffff', display: 'inline-flex', alignItems: 'center', gap: 7 }}
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
 * answering it forty times.
 *
 * CORRECTED 2026-09-11. What follows is a correction, not a deletion.
 *
 * This comment used to end: "The ISO 42001 row states plainly that the
 * certificate is a group capability we do not hold." That described the table
 * this component renders, and it stopped describing it on 2026-09-08, when
 * every row of `certificationRegister` was set `published: false`.
 * `certifications` is the published filter over that register, so it is EMPTY,
 * and NO row renders — the ISO 42001 one included. The guard immediately below
 * is the live behaviour: the table is suppressed and a paragraph that makes no
 * certification claim renders in its place.
 *
 * The sentence remains true of the REGISTER, which is where it belongs: the
 * ISO/IEC 42001 row in `src/content/company.ts` carries the status "Group
 * capability" and the note "Pixelette Technologies does not hold this standard;
 * Pixelette Certified supports readiness and the route to independent
 * assessment." It will render when that row publishes, and nothing in this
 * component has to change for it to. NOTHING IS OWED FROM THIS PARAGRAPH.
 */
export function VerificationTable({ withHeading = true }: { withHeading?: boolean }) {
  /*
   * The guard (added 2026-09-08).
   *
   * `certifications` is `certificationRegister.filter(c => c.published === true)`
   * and every row is currently unpublished, so this list is EMPTY. Without a
   * guard the component rendered a caption claiming "Certifications held by
   * Pixelette Technologies Ltd" and a three-column header row over
   * `<tbody></tbody>` on /ai-engineering and /security-and-data — a table
   * asserting certifications it then failed to list, which is both the broken
   * layout the handoff's DEVELOPER RULE forbids and a claim made by a caption.
   *
   * Returning `null` for the whole component would be worse, not better: both
   * call sites wrap this in a `<Section labelledBy="verify-heading">`, so an
   * empty return leaves a bordered 96px section with nothing in it and an
   * `aria-labelledby` pointing at an element that does not exist. So the guard
   * is around the TABLE, and the section keeps a heading and a sentence that
   * makes no certification claim at all.
   *
   * The table below maps `rows` rather than `certifications` (2026-09-08, with
   * the empty-state sweep that added the two guards above). The guard tested
   * `rows` while the body read the import, so narrowing `rows` to a filtered
   * view later would have rendered the unfiltered register under a guard that
   * had already agreed the list was safe. One local, read in both places.
   */
  const rows = certifications;

  return (
    <>
      {withHeading ? (
        <>
          <Eyebrow>Verification</Eyebrow>
          {/* `id` added 2026-09-08: /ai-engineering labels its section
              "verify-heading" and nothing on the page carried that id, so the
              reference dangled. /security-and-data passes withHeading={false}
              and supplies its own, so the two never collide. */}
          <h2 className="h2" id="verify-heading" style={{ marginTop: 18 }}>
            Every claim on this page resolves to a link.
          </h2>
          <p className="body" style={{ marginTop: 20 }}>
            Security review delays half of all enterprise deals. We publish what a reviewer asks for
            before they ask, and we do not claim a certificate we do not hold.
          </p>
          <SourceNote>G2 Buyer Behavior Report, July 2026</SourceNote>
        </>
      ) : null}

      {rows.length === 0 ? (
        /* Says what is NOT being published and why, and asserts nothing about
           what is or is not held. The reader is told the standard the site
           applies to itself, which is the only claim-free thing that can go
           here while the register rows are unpublished. */
        <p className="body" style={{ marginTop: withHeading ? 34 : 0, maxWidth: '68ch' }}>
          No certification is listed here. This site publishes one only when a reader can check it
          without taking our word for it — the certificate number, the issuing certification body
          and the expiry date, against {company.legalName} as the named entity. Until that is
          published, no badge is shown.
        </p>
      ) : (
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
            {rows.map(cert => (
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
      )}
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

/* ------------------------------------------------------------------------ *
 * BUILD • AUTOMATE • DECENTRALISE • RUN
 * ------------------------------------------------------------------------ */

/**
 * The four-card service model.
 *
 * The handoff's implementation checklist asks for this specifically:
 * "Implement the Build • Automate • Decentralise • Run mental model as four
 * reusable cards used across homepage and service pages." So it lives here,
 * exported, rather than as markup inside `src/app/page.tsx` — a copy of these
 * four cards on each service page is four places for the wording to drift, and
 * the point of the mnemonic is that it reads identically everywhere. The
 * handoff's own developer summary is the reason to keep it exact: "If a
 * visitor remembers only four words, they should be: BUILD • AUTOMATE •
 * DECENTRALISE • RUN."
 *
 * Every string below is the handoff's, verbatim. `summary` is the short
 * definition from the four capitalised blocks in section 04; `detail` is the
 * longer paragraph the same section gives underneath them. `linkLabel` is the
 * navigation label from `src/content/nav.ts`, so a card and the menu name the
 * same destination the same way.
 */
export type ValueModelEntry = {
  key: 'BUILD' | 'AUTOMATE' | 'DECENTRALISE' | 'RUN';
  icon: ReactNode;
  summary: string;
  detail: string;
  href: string;
  linkLabel: string;
};

export const valueModel: ValueModelEntry[] = [
  {
    key: 'BUILD',
    icon: <BuildMark size={30} />,
    summary:
      'Custom software, SaaS, web and mobile products, APIs, integrations, cloud architecture and modernisation.',
    detail:
      'From a blank sheet or an inherited codebase, we design and engineer products that can move from specification to production without handing the client a prototype and walking away.',
    href: '/engineering',
    linkLabel: 'Engineering',
  },
  {
    key: 'AUTOMATE',
    icon: <AiMark size={30} />,
    summary:
      'AI agents, workflow orchestration, model/LLM integration, RAG, predictive systems and intelligent automation.',
    detail:
      'We apply AI where it can reduce work, improve decisions, personalise a product or coordinate complex workflows — with human oversight and measurable success criteria where the use case requires it.',
    href: '/ai-engineering',
    linkLabel: 'AI & Automation',
  },
  {
    key: 'DECENTRALISE',
    icon: <ChainMark size={30} />,
    summary:
      'Tokenisation, smart contracts, dApps, wallets and blockchain infrastructure where decentralisation solves a real problem.',
    detail:
      'Blockchain is a specialist tool, not a default answer. We use it where ownership, programmability, verification, tokenisation or distributed trust creates a genuine advantage.',
    href: '/blockchain',
    linkLabel: 'Blockchain',
  },
  {
    key: 'RUN',
    icon: <Gauge size={30} />,
    summary:
      'Operate, monitor, support and continually improve products and workflows after launch.',
    detail:
      'Production is a starting point, not a handover ceremony. Ongoing support can include monitoring, incident response, optimisation, releases, backlog delivery and product evolution.',
    href: '/engineering/managed-engineering',
    linkLabel: 'Managed Engineering / Support',
  },
];

export function ValueModelCards({
  /**
   * Show the longer paragraph under each short definition. True on the
   * homepage, where section 04 carries both layers; a service page
   * reintroducing the model alongside its own copy wants the compact form.
   */
  detailed = true,
  /**
   * The one of the four this page actually is, marked as the reader's own
   * position in the set.
   *
   * Added 2026-09-11, when the three practice hubs started reintroducing the
   * model. Without it a visitor who lands on /blockchain from search meets four
   * identical cards and has to work out which one they are standing in, which
   * is the opposite of what an orientation block is for.
   *
   * Optional, and `undefined` by default, so every call site that does not pass
   * it renders exactly the markup it rendered before — today that is section 04
   * of `src/app/page.tsx`, verified byte-identical against a pre-change render.
   *
   * Marked three ways, each of them a primitive this site already has:
   * `aria-current="page"` on the card, which is the standard way to name the
   * current item in a set; the brand border colour, written as `var(--brand)`
   * so it resolves to the amber of `.theme-amber` on /blockchain with no
   * special case; and the small mono marker the homepage hero already uses for
   * its SPECIALIST chip. No new colour, font or component.
   *
   * CORRECTED 2026-09-11, comment only. This used to describe `aria-current`
   * as "the only part of this that reaches a screen reader". That was wrong on
   * the day it was written. The "THIS PAGE" marker below carries no
   * `aria-hidden`, so it sits in the accessibility tree, and because it is
   * inside the `<h3>` the heading announces as "BUILD THIS PAGE". Read out of
   * the rendered HTML rather than assumed. Of the three markers the border
   * colour is the only purely visual one.
   *
   * That is a description corrected, not a defect fixed. Whether the marker
   * SHOULD be exposed is a design question with two defensible answers — it is
   * either redundant beside `aria-current` or a useful plain-text cue — and
   * adding `aria-hidden` would change rendered output, which the 2026-09-11
   * comment-accuracy pass does not do. Left for the next reader to decide, not
   * decided here. Nothing else in this paragraph is owed.
   */
  current,
}: {
  detailed?: boolean;
  current?: ValueModelEntry['key'];
} = {}) {
  return (
    <div className="grid grid-4">
      {valueModel.map(entry => {
        const isCurrent = entry.key === current;
        return (
          <div
            className="card"
            key={entry.key}
            aria-current={isCurrent ? 'page' : undefined}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: 26,
              ...(isCurrent ? { borderColor: 'var(--brand)' } : null),
            }}
          >
            <span
              style={{ color: 'var(--brand)', display: 'inline-flex', marginBottom: 18 }}
              aria-hidden
            >
              {entry.icon}
            </span>
            <h3 className="mono" style={{ fontSize: 13, letterSpacing: '0.1em', color: 'var(--ink)' }}>
              {entry.key}
              {isCurrent ? (
                <span className="mono" style={{ fontSize: 10, marginLeft: 8, opacity: 0.75 }}>
                  THIS PAGE
                </span>
              ) : null}
            </h3>
            <p className="body" style={{ marginTop: 12, fontSize: 14.5 }}>
              {entry.summary}
            </p>
            {detailed ? (
              <p className="small" style={{ marginTop: 14 }}>
                {entry.detail}
              </p>
            ) : null}
            <div style={{ flexGrow: 1 }} />
            <div style={{ marginTop: 18 }}>
              <FLink href={entry.href}>{entry.linkLabel}</FLink>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compact trust strip.
 *
 * Rewritten 2026-09-08. It used to be a hardcoded pill row — 'ISO 9001',
 * 'ISO 27001', 'Cyber Essentials Plus', the Clutch score and a country count —
 * which made it the single largest publication exposure on the site, for three
 * separate reasons:
 *
 *  1. It bypassed the claims register entirely. Every one of those five items
 *     is HELD in `src/content/claims.ts`, and a component that prints a badge
 *     from a string literal cannot be stopped by a register it never consults.
 *  2. It printed the Clutch aggregate without checking `clutch.published`,
 *     which is `false` precisely so that nothing renders it.
 *  3. `company.countriesDelivered` was emptied to '' when the geography count
 *     was held, so the last pill had been rendering as a bare " countries" on
 *     every page that used the strip. A live defect, not a hypothetical.
 *
 * It now reads the register and nothing else, through `ProofStrip`, which
 * returns `null` at zero verified claims rather than an empty frame. Today
 * `publishedClaims()` is empty, so this renders nothing at all — which is the
 * correct output under the handoff's DEVELOPER RULE ("the absence of a badge
 * must not leave a broken layout"), not a degraded one. It repopulates by
 * itself the moment a register row moves to VERIFIED; no edit here is needed.
 *
 * The signature is unchanged — both new props are optional — so every existing
 * call site keeps working.
 */
export function TrustStrip({ heading, note }: { heading?: string; note?: string }) {
  return <ProofStrip claims={publishedClaims()} heading={heading} note={note} />;
}
