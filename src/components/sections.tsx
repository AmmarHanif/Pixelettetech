import Link from 'next/link';
import type { ReactNode } from 'react';

import { AiMark, ArrowUpRight, BuildMark, ChainMark, Gauge, Shield, Star } from '@/components/Icons';
import { ProofStrip } from '@/components/ProofStrip';
import { Cta, Eyebrow, FLink, Section, SourceNote } from '@/components/ui';
import { publishedClaims } from '@/content/claims';
import { certifications, certified, clutch, company } from '@/content/company';
import { approvedClients } from '@/content/clients';
import { featuredTestimonials, type Testimonial } from '@/content/testimonials';
import { ANALYTICS_EVENTS, ANALYTICS_SURFACES, analyticsAttrs } from '@/lib/analytics';

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
   * the trust strip, all of which were live bugs earlier that same day. This
   * one is latent only because the list happens to be non-empty right now.
   *
   * `src/content/clients.ts` gained a required `permission` field on
   * 2026-09-08, along with an `approvedClients()` accessor that filters on it.
   * Read on 2026-09-11, all seven rows of `clients` are APPROVED, so that
   * accessor returns all seven and the two lists hold the same names. The
   * filter is still the point rather than a formality: a row set back to
   * UNCONFIRMED drops out of it with nobody editing that function, and the
   * eighth row — `additionalClients`, still UNCONFIRMED, imported by nothing —
   * is the shape of a name that must not reach this render by accident.
   *
   * So the guard stands on its own merits. Unguarded, an empty list left a
   * "Trusted by" label sitting over an empty `<ul>`, inside a bordered 128px
   * section, on the homepage and on /ai-automation — an orphan heading, an
   * empty container and a stray separator in one. Exactly what the handoff's
   * DEVELOPER RULE forbids: "the absence of a badge must not leave a broken
   * layout".
   *
   * The whole component returns null rather than guarding the inner list,
   * because the `<Section>` — with its border-top and its 64px of padding —
   * lives inside this component and both call sites render it bare. Nothing
   * wraps it, so nothing is left behind.
   *
   * The guard and the map read one local, so they cannot drift apart, and
   * that local is now `approvedClients()`. The second correction at the foot
   * of this block records when that switch was made, what it changed, and
   * quotes what this passage used to say about it.
   *
   * CORRECTED 2026-09-11, comment only. What follows is a correction, not a
   * deletion.
   *
   * This comment used to read: "`src/content/clients.ts` gained a required
   * `permission` field today, along with an `approvedClients()` accessor that
   * returns EMPTY, and it records the founder's open decision to switch this
   * render onto that accessor. On the day that switch is made, the unguarded
   * component left a 'Trusted by' label sitting over an empty `<ul>` …", and
   * it ended: "This does NOT make that switch: the permission question is the
   * founder's to answer, not this component's."
   *
   * Both halves stopped being true on 2026-09-11.
   *
   *  1. `approvedClients()` does not return EMPTY. The founder was asked on
   *     2026-09-11 whether the seven names that render with no recorded
   *     permission should be hidden or kept, and answered "Keep them — I'm
   *     confident we have the basis". Every row in `clients` reads APPROVED on
   *     the strength of that decision and of nothing else, so the accessor
   *     returns all seven. Read the gate note at the top of
   *     `src/content/clients.ts` before relying on this: it is a founder
   *     decision of that date, NOT a per-client release document, and no such
   *     document exists anywhere in this repository.
   *  2. The permission question is no longer the founder's to answer, because
   *     he has answered it. What is left is not a decision but an edit, and it
   *     is a safe one for the first time: with the two lists identical, moving
   *     this render onto `approvedClients()` changes no rendered name.
   *
   * The decision does not reach the eighth name. `additionalClients` holds
   * 'Akashic Knowing' and stays UNCONFIRMED deliberately: the question was put
   * about the seven names that were live on the homepage, and an answer about
   * those cannot approve a name he was not asked about. Nothing imports that
   * array, so this component has never published it.
   *
   * "Earlier today" above is re-dated to "earlier that same day" in the same
   * pass, because this block was written on 2026-09-08 and is now read after
   * it; the events it names are unchanged.
   *
   * The RENDERED output of this component is untouched by this correction, and
   * the guard it describes was correct on 2026-09-08 and is correct today.
   * NOTHING IS OWED FROM THIS PARAGRAPH AND NOTHING HERE IS BLOCKING.
   *
   * ----------------------------------------------------------------------
   * CORRECTED AGAIN 2026-09-11, later the same day — and this time the code
   * moved, not only the comment. A correction, not a deletion.
   *
   * Two passages described the switch to `approvedClients()` as outstanding.
   * They were true when written and are quoted here because they are not true
   * now:
   *
   *   - This block used to say, a few paragraphs above: "This does NOT make
   *     that switch — it is a separate change to a separate line, and
   *     `src/content/clients.ts` records it as left to whoever makes it."
   *   - Point 2 above still says: "What is left is not a decision but an edit,
   *     and it is a safe one for the first time: with the two lists identical,
   *     moving this render onto `approvedClients()` changes no rendered name."
   *     That sentence is left standing deliberately — it is the reasoning that
   *     authorised this edit. Read it as history, not as work outstanding.
   *
   * THE SWITCH IS MADE. On 2026-09-11 this component moved from the raw
   * `clients` array to `approvedClients()`. Three files recorded the change
   * as owed and each left it to the next person: this comment; the gate note
   * in `src/content/clients.ts`, under "DELIBERATELY NOT CHANGED BY THIS
   * DECISION", which ends "left to whoever makes it"; and the open founder
   * decision item in `GO-LIVE-CHECKLIST.md`. It is done. The other two were
   * outside the scope of this change and still describe it as outstanding —
   * they are stale from today, and they are not a task list.
   *
   * Two further files state the OLD mechanism as a fact and go stale with
   * them: the comment above the call site in `src/app/page.tsx`, which says
   * this component "still reads `clients` directly", and the `client-logos`
   * evidenceNote in `src/content/claims.ts`, which says "That component reads
   * `clients` directly". Their conclusions survive intact — that register row
   * still gates nothing here, because `approvedClients()` filters the
   * `permission` field in `src/content/clients.ts` and not the claims
   * register — but the sentences describing how are now wrong. Checked file by
   * file on 2026-09-11 rather than assumed; `DESIGN-CONFORMANCE-AUDIT.md`
   * does not mention this component at all.
   *
   * What it changes TODAY: nothing, and that was measured rather than assumed.
   * All seven rows read APPROVED, so the accessor returns the same seven names
   * in the same order, and the rendered markup is byte-identical to the markup
   * this component produced before the switch.
   *
   * What it changes FOREVER: this gate is now fail-closed like every other one
   * on this site. If a permission is ever withdrawn, that row drops out of
   * `approvedClients()` and out of this render in the same edit, instead of
   * rendering on until somebody remembers there is a second file to change.
   * Reading the raw array was fail-open by omission; it was the last gate here
   * that was.
   *
   * The zero guard below is what makes the empty case safe, and it is now load
   * bearing rather than latent: `approvedClients()` genuinely can return an
   * empty array, and when it does the whole component returns null — no orphan
   * "Trusted by" heading, no empty `<ul>`, no bordered section with nothing
   * in it. `src/content/clients.ts` names this guard as the reason that
   * accessor is allowed to return nothing at all.
   *
   * The eighth name is no nearer this render than it was. `additionalClients`
   * holds 'Akashic Knowing', still UNCONFIRMED, and is imported by nothing;
   * `approvedClients()` filters `clients` alone and never looks at it.
   * ----------------------------------------------------------------------
   */
  const names = approvedClients();
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

/**
 * Verified client voices. Each one links to the review it came from.
 *
 * TWO CALL SITES: /about and /engineering. A change here reaches both.
 *
 * The standing source note under the grid was removed 2026-09-18 on founder
 * instruction for the About rework: "Remove explanatory text such as 'Each
 * review above links to the review it came from.'" It narrated what the cards
 * already show, which is the kind of copy that makes a page read as though it
 * is explaining itself rather than presenting evidence. Each card now carries
 * "Verified review on Clutch" and nothing else.
 *
 * The `clutch.published` branch SURVIVES. That one is not explanatory: it is
 * the aggregate rating and review count, a separate held claim that returns the
 * day someone re-reads the live profile. Deleting the whole conditional would
 * have removed the route that claim comes back through, which is not what was
 * asked for and would not have been noticed until it was wanted.
 */
export function Testimonials({
  items = featuredTestimonials,
  heading = 'Client voices',
  variant = 'card',
}: {
  items?: Testimonial[];
  heading?: string;
  /**
   * `card` is the original treatment and the default, so every call site that
   * does not pass this renders exactly what it rendered before.
   *
   * `plain` drops the box and separates the two quotes with a hairline instead.
   * Added 2026-09-18 for /about, where this block lands directly beneath the
   * four capability cards: two bordered grids in succession read as one
   * texture, and on this site a bordered box means "this is a link", which a
   * quote is not. The serif quote at 21px does not need a container to carry
   * weight, and the founder asked for these to be prominent but simple.
   */
  variant?: 'card' | 'plain';
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
      <div
        className={variant === 'plain' ? 'grid grid-2 tm-plain-grid' : 'grid grid-2'}
        style={{ marginTop: 32 }}
      >
        {items.map(t => (
          <figure
            className={variant === 'plain' ? 'tm-plain' : 'card'}
            key={t.url}
            style={{ margin: 0 }}
          >
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
              {/*
                minHeight is the WCAG 2.5.8 target floor. Every other control on
                this site carries it and this one did not. At 390px the
                figcaption wraps and this link lands on its own line, where a
                20px-tall target is the entire hit area.
              */}
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="small"
                style={{
                  marginLeft: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  minHeight: 44,
                }}
              >
                Verified review on Clutch
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
      ) : null}
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
 * correction in `src/app/ai-automation/page.tsx` gives: a comment that states
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
    /*
     * Padding lives in `.dark-panel--compact` rather than inline, changed
     * 2026-09-17. An INLINE style beats any class, so while it sat on the div
     * the full-bleed Certified band could not zero it and the band's text
     * stayed indented 32px from the container it was supposed to align with.
     */
    return (
      <div className="dark-panel dark-panel--compact">
        {/* WHITE, not --mint, from 2026-09-17 on founder instruction. --mint is
            #d9b8f0, a light PURPLE, which read as a stray brand accent against
            the white body text of this panel rather than as part of it. Same
            change on the outbound link below and on the full variant's link. */}
        <span style={{ color: 'var(--dark-head)', display: 'inline-flex', marginBottom: 16 }} aria-hidden>
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
            style={{ color: 'var(--dark-head)', display: 'inline-flex', alignItems: 'center', gap: 6 }}
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

          CORRECTED 2026-09-14, and this is the ADR-0012 defect repeating in a
          place no grep for it would have found. The label read "These are areas
          of support, not accreditations held by any Pixelette company". That
          was true when it was written and it was FALSE the moment two
          certificates published on 14 September 2026: ISO 27001 is one of the
          five pills below, and Pixelette Technologies Ltd now holds and
          publishes an ISO/IEC 27001:2022 certificate. A disclaimer that is
          itself inaccurate is worse than none — it is the sentence a reviewer
          quotes back — and this panel renders on /, /certifications and
          /assurance, two of which now also carry the published badge.

          The replacement asserts NOTHING about what is or is not held. Saying
          "not held by Pixelette Technologies" would be the same error with the
          sign flipped, since one of these standards IS held. What is true, and
          all that needs to be true, is that this list is not a claim about
          holdings: it is what Certified helps a client with. The reader is then
          pointed at the one page that answers the holdings question properly,
          with numbers and dates.

          Found by rendering the page and reading it, not by grepping source —
          which is the lesson ADR-0012 recorded and the reason this comment is
          this long.
        */}
        <p className="small" style={{ marginTop: 26, color: 'var(--dark-text)' }}>
          What {certified.name} helps with. This is a list of support areas, not a claim that{' '}
          {certified.name} or {company.name} holds any of them. What {company.name} does hold is
          published with its certificate numbers and dates on our certifications page; independent
          assessment stays independent.
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
              color: 'var(--dark-head)',
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

/*
 * VerificationTable was REMOVED on 2026-09-17, with /security-and-data, its
 * only call site. Founder instruction: detailed security controls and ISO
 * evidence leave the marketing site and are supplied during enterprise
 * procurement. The certificate number, issuing body, scope and Statement of
 * Applicability are no longer published anywhere on the public site.
 *
 * What survives is the ledger in SiteFooter: standard plus expiry date, gated
 * per certificate on its own claims-register row. Do not reinstate a table
 * here without that instruction being reversed.
 */

/** Closing call to action, used at the foot of nearly every page. */
export function ClosingCta({
  eyebrow,
  title,
  children,
  ctaHref = '/contact',
  ctaLabel = 'Book a conversation',
  aside,
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  ctaHref?: string;
  ctaLabel?: string;
  aside?: ReactNode;
}) {
  /*
   * Instrumented HERE rather than at each of the call sites, because this
   * component is the closing CTA on the work index, every case study and the
   * service pages, and an event added per call site is an event some future
   * call site forgets.
   *
   * Conditional on the destination, and that is not defensive padding:
   * `ctaHref` is overridable, so this block can be pointed somewhere that is
   * not a conversation. A closing CTA to a service page is not a booked
   * conversation and counting it as one would inflate the single number the
   * founder is most likely to act on.
   */
  const ctaAnalytics = ctaHref.startsWith('/contact')
    ? analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
        surface: ANALYTICS_SURFACES.CLOSING_CTA,
      })
    : undefined;

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
            <Cta href={ctaHref} analytics={ctaAnalytics}>
              {ctaLabel}
            </Cta>
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
  /*
   * REMOVED 2026-09-15, same day it was added, on founder instruction.
   *
   * A `service` field briefly rendered the nav's own service name on a second
   * line under the mnemonic, so a card read BUILD / ENGINEERING. He looked at it
   * built and called it duplication, because the same word was already the
   * card's link at the foot: "I only want the purple text ... there's an arrow
   * ... I want that retained because there's duplication."
   *
   * HE IS RIGHT AND THIS WAS A KNOWN TRADE. The design review that added it
   * weighed exactly this and accepted the repetition for the sake of anchor text
   * and a distinct accessible name. That was a defensible call and it was the
   * wrong one: a reader meets the word twice on one card and the nav a third
   * time in the bar directly above. Anchor text survives either way, because the
   * link keeps its own label.
   *
   * The FIELD is deleted rather than left unused, on the same reasoning that
   * removed the `detailed` prop: a field nothing renders is a field the next
   * reader has to work out. `linkLabel` at the card foot is now the only place
   * the service name appears, which is what he asked for.
   */
  icon: ReactNode;
  /**
   * The plain-English line a buyer reads to place their own problem, 2026-09-15.
   *
   * The block was defining rather than routing. Measured before this change: 223
   * rendered words across the four cards, 49 to 63 each, in four text layers —
   * a capability list, quoted buyer triggers and an explanatory paragraph on top
   * of the key. A first-time reader had to read all of it before they could
   * choose. IBM's UK homepage cards, measured the same day, run a median of 23
   * words in two layers: a headline and one line.
   *
   * IBM's brevity is earned by a proof line — a percentage or a named customer.
   * That slot cannot be filled here: every figure on this site sits behind the
   * evidence gate and there are 48 of them. So the shape is borrowed and the
   * proof slot is not faked. What goes in its place is recognition rather than
   * evidence: a headline in the buyer's language, then one sentence of scope.
   */
  headline: string;
  summary: string;
  href: string;
  linkLabel: string;
  /**
   * Opt this card's link into the wrapping treatment, for a `linkLabel` too
   * long to sit on one line in a four-card grid. See the RUN entry: the arrow
   * follows the last word instead of centring beside a two-line block.
   */
  linkWraps?: boolean;
};

export const valueModel: ValueModelEntry[] = [
  {
    key: 'BUILD',
    icon: <BuildMark size={30} />,
    headline: 'Software built or rebuilt',
    summary:
      'New platforms, products and apps, plus the modernisation of systems you already run.',
    href: '/engineering',
    linkLabel: 'Engineering',
  },
  {
    key: 'AUTOMATE',
    /*
     * The stutter in 'AUTOMATE · AI & Automation' is deliberate and was weighed.
     * The nav says 'AI & Automation'; a card that says something tidier forfeits
     * exactly the recognition this pairing exists to buy.
     */
    icon: <AiMark size={30} />,
    headline: 'AI put to work',
    summary:
      'Agents and workflow automation for manual processes, and AI inside products that already exist.',
    href: '/ai-automation',
    linkLabel: 'AI & Automation',
  },
  {
    key: 'DECENTRALISE',
    icon: <ChainMark size={30} />,
    /*
     * SHORTENED 2026-09-15 on founder instruction, to run the same length as the
     * other three headlines.
     *
     * It read 'Blockchain is a specialist tool, not a default answer' - nine
     * words against the others' four to seven, and visibly longer on the card.
     *
     * THE SENTENCE MOVED RATHER THAN BEING CUT, and that mattered: it was the
     * ONLY place that positioning appeared in rendered copy anywhere on the
     * site. The approved deck still carries it, but the deck does not render.
     * Shortening the headline without relocating it would have deleted the
     * blockchain-is-not-a-default position from the website entirely, which is
     * the opposite of what a length edit should cost.
     *
     * 'Earns its place' is not new wording. It is already published on
     * /blockchain and /blockchain/tokenisation, where the firm says it assesses
     * whether a chain genuinely earns its place "including when the honest
     * answer is that a conventional database would do the job", and in the
     * homepage hero. Same position, the site's own phrase, six words.
     */
    headline: 'Blockchain where it earns its place',
    summary:
      'A specialist tool, not a default answer. Tokenisation, smart contracts, dApps and wallets.',
    href: '/blockchain',
    linkLabel: 'Blockchain',
  },
  {
    key: 'RUN',
    icon: <Gauge size={30} />,
    /*
     * REFRAMED 2026-09-23 on founder instruction. The prior headline, 'Support
     * that does not stop at launch', framed the offer as a negation and read as
     * something the client was locked into. This service is OPTIONAL, so the
     * headline now leads on the outcome the client chooses, and the summary
     * opens on "Optional" to make the voluntary framing explicit. The wording is
     * the founder's approved grid-card copy from the 2026-09-23 rebuild brief;
     * it is used everywhere this RUN card renders. No full stop, to match the
     * other three cards and the headline style check.
     */
    headline: 'Keep your product performing',
    summary:
      'Optional ongoing support, maintenance and improvement to keep your product reliable, secure and performing as intended.',
    href: '/engineering/support-continuous-improvement',
    /*
     * THE 2026-09-15 SHORTENING IS DELIBERATELY REVERSED HERE, 2026-09-22.
     *
     * That note said 'Managed Engineering / Support' was cut to 19 characters
     * because at 29 it wrapped at 1440px and stranded the link arrow beside the
     * second line. The observation was right and the arrow problem is real.
     *
     * This label is 40 characters and will certainly wrap. It stays anyway,
     * because the founder brief renaming this service is explicit: if the
     * approved name wraps badly, adjust the layout rather than shorten or alter
     * the name. So the fix moved to where the defect actually was — `wrap` on
     * FLink gives an inline-block link whose arrow follows the last word in the
     * text flow instead of centring beside a two-line block. The stranded arrow
     * is fixed for any long label, not avoided by keeping labels short.
     *
     * It also no longer diverges from the nav: both read
     * 'Support & Continuous Improvement', which the brief requires - the same
     * terminology everywhere, abbreviated differently nowhere.
     *
     * 'EXPLORE' WAS DROPPED 2026-09-22, founder decision. The brief specified
     * 'Explore Support & Continuous Improvement' as the CTA, and it was shipped
     * that way with one objection flagged rather than silently resolved: the
     * three cards beside this one use bare service names, so the verb broke the
     * set. He agreed. At 32 characters it still wraps at desktop, so the `wrap`
     * treatment below is still doing the work - this shortened the CTA, not the
     * service name, which is the line the brief drew.
     */
    linkLabel: 'Support & Continuous Improvement',
    linkWraps: true,
  },
];

export function ValueModelCards({
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
   * so it follows the firm's brand colour with no special case - it used to
   * resolve to crimson inside `.theme-amber` on /blockchain, and that theme was
   * deleted on 2026-09-16, which this component needed no change to survive;
   * and the small mono marker the homepage hero already uses for
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
            {/*
              The "THIS PAGE" text marker was removed on founder instruction,
              2026-09-22. The card still marks itself current twice over, so the
              signal is intact: `aria-current="page"` above, which is the
              mechanism a screen reader uses to place the reader, and the brand
              border colour, which is the visual cue.

              This closes the question the note above left open. That marker sat
              in the accessibility tree - no aria-hidden, and inside the <h3> -
              so the heading announced as "BUILD THIS PAGE". It now announces
              "BUILD", with position carried by aria-current alone.
            */}
            <h3 className="mono" style={{ fontSize: 13, letterSpacing: '0.1em', color: 'var(--ink)' }}>
              {entry.key}
            </h3>
            {/*
              Headline then one sentence. Two text layers, matching the shape of
              the comparator measured on 2026-09-15 and replacing four.

              A <p> with the `.h4` class rather than a heading element: `key` is
              already the <h3> and carries the "THIS PAGE" marker that announces
              the reader's position on the three hub pages. Promoting this to a
              heading would put two headings in every card and change the
              accessibility tree on four pages to fix nothing.
            */}
            <p className="h4" style={{ marginTop: 10 }}>
              {entry.headline}
            </p>
            <p className="body" style={{ marginTop: 10, fontSize: 14.5 }}>
              {entry.summary}
            </p>
            <div style={{ flexGrow: 1 }} />
            <div style={{ marginTop: 18 }}>
              <FLink href={entry.href} wrap={entry.linkWraps}>
                {entry.linkLabel}
              </FLink>
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
