import Link from 'next/link';

import { BrandLogo } from '@/components/BrandLogo';
import { ArrowUpRight } from '@/components/Icons';
import { isPublishable } from '@/content/claims';
import { company, trustBadges } from '@/content/company';
import { footerColumns, groupBlurb, groupEntities, legalNav } from '@/content/nav';

/**
 * The claims register row that governs the footer badge pills.
 *
 * `trustBadges` held "ISO 9001", "ISO 27001" and "Cyber Essentials Plus", which
 * is exactly the claim registered under this id: "HOLD — Publish only with
 * current certificate for exact legal entity, scope and validity."
 *
 * DELIBERATELY NOT RETARGETED, 2026-09-14. On that date the claims register
 * split that compound row: two certificates were evidenced and published under
 * `iso-27001-certificate` and `iso-9001-certificate`, and this id kept its
 * original three-standard meaning and stayed HELD. The obvious-looking edit is
 * to point this constant at one of the two new VERIFIED rows. Do not make it.
 *
 *  - The third string in `trustBadges` is "Cyber Essentials Plus", for which no
 *    certificate has ever been produced. Gating that array on a row that says
 *    ISO 27001 is evidenced would publish the Cyber Essentials pill on the
 *    strength of a 27001 certificate, on every route of the site.
 *  - A pill is the presentation this footer's own register calls out as
 *    highest-risk, because it asserts everything and evidences nothing. What
 *    was published on 14 September was the certificate number, the issuing body
 *    and the dates. None of those fits in a footer pill, and the footer is on
 *    every page.
 *
 * `trustBadges` is empty as well, so both gates below are shut and the pills
 * would not return even if this one were opened. That is defence in depth, not
 * a reason to relax either gate.
 */
const TRUST_BADGE_CLAIM_ID = 'iso-cyber-essentials-badges';

/**
 * The badges this footer may render, gated on the register rather than on the
 * content file alone.
 *
 * Two gates, deliberately, and both must pass:
 *
 *  1. The register. `isPublishable` fails closed — an unknown id, or a row that
 *     is HELD or NOT_PUBLISHED, returns false. So refilling `trustBadges` in
 *     `content/company.ts` without moving the register row to VERIFIED does not
 *     put the pills back. That is the drift this footer just demonstrated in
 *     the other direction: the array was emptied on 8 September 2026 and the
 *     component that consumed it was never told.
 *  2. The array itself. A VERIFIED row with nothing to show still renders no
 *     block, because the register records a decision and this file records the
 *     copy; neither one alone is a badge.
 *
 * Written as a function rather than a module constant so the gate is evaluated
 * at render time against the live register, not frozen at module load in
 * whatever order the bundler happened to choose.
 */
function publishedTrustBadges(): readonly string[] {
  return isPublishable(TRUST_BADGE_CLAIM_ID) ? trustBadges : [];
}

/**
 * Site footer.
 *
 * Rendered from `footerColumns` so it cannot drift from the sitemap. Every
 * href here resolves to a real page or a real anchor on one.
 *
 * Every collection this component renders is guarded on being non-empty, and
 * the guard wraps the container, the heading and the separator — not just the
 * items. That is the handoff's DEVELOPER RULE applied to the one component that
 * appears on every page of the site: "The absence of a badge must not leave a
 * broken layout." An empty `.pill-row` is not a neutral no-op; it is a flex
 * container with a 20px top margin and no content, and it shipped on every page
 * the moment `trustBadges` was emptied.
 */
export function SiteFooter() {
  const badges = publishedTrustBadges();
  const columns = footerColumns.filter(col => col.items.length > 0);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <BrandLogo variant="white" height={34} className="site-footer__logo" />
            {company.description ? <p>{company.description}</p> : null}
            {badges.length > 0 ? (
              <div className="pill-row" style={{ marginTop: 20 }}>
                {badges.map(badge => (
                  <span className="pill" key={badge}>
                    {badge}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {/* A column with no links would render its mono heading over nothing,
              so an emptied column drops out entirely rather than leaving a
              label in the grid. */}
          {columns.map(col => (
            <div key={col.heading}>
              <h2>{col.heading}</h2>
              <ul className="site-footer__list">
                {col.items.map(item => (
                  <li key={item.href + item.label}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        {item.label}
                        <ArrowUpRight size={11} />
                      </a>
                    ) : (
                      <Link href={item.href}>{item.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* The group band. All four companies together, so a visitor who
            landed on the wrong one can find the right one.

            Guarded on the entity list because this block owns the separator:
            `.groupband` carries `margin-top: 56px`, `padding-top: 40px` and a
            `border-top` against the dark line. With no entities it would draw a
            rule across the footer under an orphan heading. */}
        {groupEntities.length > 0 ? (
          <section className="groupband" aria-labelledby="group-heading">
            <div className="groupband__intro">
              <h2 id="group-heading">Part of Pixelette Group</h2>
              {groupBlurb ? <p>{groupBlurb}</p> : null}
            </div>
            <ul className="groupband__list">
              {groupEntities.map(entity => (
                <li key={entity.name}>
                  {entity.isThisEntity ? (
                    <span className="groupband__name groupband__name--current">
                      {entity.name}
                      <span className="groupband__here">You are here</span>
                    </span>
                  ) : (
                    <a
                      className="groupband__name"
                      href={entity.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entity.name}
                      <ArrowUpRight size={12} />
                    </a>
                  )}
                  <span className="groupband__what">{entity.what}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* Statutory trading disclosure.
            S.I. 2015/17 reg. 25(2) requires a company to disclose on its websites
            (a) the part of the UK in which it is registered, (b) its registered
            number and (c) the address of its registered office. The previous line
            gave (b) and an unlabelled address, and omitted (a) entirely.
            E-Commerce Regs 2002 reg. 6(1)(d) and PoSR 2009 reg. 8(1)(d) also want
            the NAME of the register, and reg. 6(1)(g) / 8(1)(g) require the VAT
            number where the trader is VAT registered. All four are now here.

            The VAT sentence is conditional for the same reason the badges are:
            those regulations require it *where the trader is VAT registered*, so
            an empty value must produce no sentence rather than the fragment
            "VAT registration number ." Nothing else in this block is optional —
            a company cannot withhold its registered number or office. */}
        <div className="site-footer__legal">
          <p>
            {company.legalName}, registered in England and Wales at Companies House,
            company number {company.crn}. Registered office: {company.addressLine}.
            {company.vat ? ` VAT registration number ${company.vat}.` : ''}
          </p>
          {legalNav.length > 0 ? (
            <p style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              {legalNav.map(item => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
