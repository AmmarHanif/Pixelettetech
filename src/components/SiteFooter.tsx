import Link from 'next/link';
import { Fragment } from 'react';

import { BrandLogo } from '@/components/BrandLogo';
import { PrivacyChoices } from '@/components/PrivacyChoices';
import {
  ArrowUpRight,
  FacebookMark,
  InstagramMark,
  LinkedInMark,
  XMark,
} from '@/components/Icons';
import { isPublishable } from '@/content/claims';
import { certifications, company, trustBadges } from '@/content/company';
import { footerColumns, groupBlurb, groupEntities } from '@/content/nav';

/**
 * The social profiles rendered in the footer brand column.
 *
 * ORDER IS DELIBERATE: LinkedIn first, because it is the only one this site
 * already asserted in its Organization graph and the only one the Privacy
 * Statement names.
 *
 * Every entry carries a LABEL as well as a glyph. The anchor renders the glyph
 * aria-hidden and the label as visually hidden text, so the link has a real
 * accessible name. An icon-only anchor announcing just "link" is the commonest
 * footer accessibility defect there is.
 */
/*
 * THE SIZES ARE NOT ALL 18, AND THAT IS THE POINT.
 *
 * These four are the authentic brand glyphs and the brands do not draw them to
 * a common weight, so an equal box is not an equal mark.
 *
 * REVISED 2026-09-22 when Facebook became the bare f. Its size had been 15,
 * which was an optical correction for the SOLID DISC it used to be: at a common
 * 240px box that disc laid down 42.5% ink against Instagram's 19.7%, so it
 * carried 2.16x the mass of the lightest and pulled the eye off the row.
 *
 * Dropping the disc removed the thing being corrected for, and the correction
 * then worked against itself. The bare f measures 12.4% - the LIGHTEST of the
 * four, because an f is a narrow letter - and at 15px it read as an
 * afterthought. A CORRECTION THAT OUTLIVES ITS CAUSE IS A NEW DEFECT.
 *
 * Re-measured: LinkedIn 24.6%, X 22.3%, Instagram 19.7%, Facebook 12.4%. Ink
 * area alone would put the f at 22.7, but ink area is the wrong target for a
 * letterform among marks - a narrow letter is supposed to be narrow. Matching
 * ink HEIGHT is what makes it belong: its box is 161/240 against LinkedIn's
 * 180, so 20 renders it at the same height as LinkedIn and X. Rendered at 15,
 * 20 and 22 side by side; 22 made it dominant again, 20 sits in the row.
 *
 * SCALED AGAIN 2026-09-22 against the founder's own reference image, after he
 * said the icons were still not right. Measured from that image, tile for tile:
 * his f is 1.16x the Instagram mark's HEIGHT. The row was running the f at
 * 0.89x - the shortest ink of the four - which is why it read as weak.
 *
 * His reference shows only Instagram and Facebook, so its ratio cannot simply
 * be adopted: the footer also carries LinkedIn and X, and at 26px the f towers
 * over both. Rendered at 20, 22, 24 and 26 against all four. The row now runs
 * 20 / 26 / 18 / 20 - every mark larger and the f leading at 1.09x - which
 * carries his reference's weight without leaving the other two stranded.
 */
const socialLinks = [
  { label: 'LinkedIn', href: company.linkedin, icon: <LinkedInMark size={20} /> },
  { label: 'Facebook', href: company.social.facebook, icon: <FacebookMark size={26} /> },
  { label: 'Instagram', href: company.social.instagram, icon: <InstagramMark size={18} /> },
  { label: 'X', href: company.social.x, icon: <XMark size={20} /> },
];

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
 * THE CERTIFICATION LEDGER. Founder instruction 2026-09-17: on the public site,
 * certification is limited to the verified ISO standards in the homepage and
 * footer ledger, with no supporting certificate narrative anywhere. Recorded as
 * ADR-0034, which amends ADR-0012 and tightens ADR-0029.
 *
 * THIS REVERSES A RECORDED DECISION, so the decision is answered rather than
 * deleted. `src/content/company.ts` deliberately kept these pills empty, on the
 * reasoning that "a pill carries none of them" — none of the certificate
 * number, the issuing body or the dates — and that a bare badge is therefore
 * not checkable. That reasoning was sound, and it is the reason each row here
 * carries its EXPIRY DATE beside the standard.
 *
 * A date is not narrative. It is one short qualifier, and it answers the exact
 * objection the old note raised: the single fact that stops a badge outliving
 * its certificate. The certificate number, issuing body, scope and Statement of
 * Applicability are gone from the public site entirely and are supplied during
 * procurement, which is the rest of the same instruction.
 *
 * GATED PER ROW, not on the old compound id. `TRUST_BADGE_CLAIM_ID` above
 * governs a claim class naming ISO 9001, ISO 27001 AND Cyber Essentials Plus,
 * and no certificate has ever been produced for the third — so gating the
 * ledger on it would have meant publishing all three or none. Each row now
 * names its own register row and fails closed if that row is not VERIFIED, so
 * Cyber Essentials Plus cannot ride in on the other two.
 *
 * A row with no `validTo` does not render. That is the same fail-closed rule
 * the old note was protecting, expressed as code rather than as a warning.
 *
 * AND AS OF 2026-09-22 THE DATE MUST ALSO BE IN THE FUTURE. The founder removed
 * the visible "Valid to ..." line, which had been carrying the whole objection
 * the note above answers: it was "the single fact that stops a badge outliving
 * its certificate". A hidden expiry protects nobody, because the displayed date
 * was the thing that made a lapse visible in the first place. So the expiry now
 * gates the row instead of captioning it — a lapsed certificate stops rendering
 * on its own, which is a stronger guarantee than a date a reader had to notice.
 *
 * Evaluated when the page is generated, so it is only as current as the last
 * build. Both present certificates run to 2027 and any rebuild re-checks them,
 * but a site left unbuilt past an expiry would still show the row: this reduces
 * the exposure, it does not abolish it, and the honest place to say so is here.
 *
 * Parsed as an ISO date rather than by Date.parse on the display string, so a
 * format change in the content file fails closed instead of silently producing
 * NaN, which compares false and would drop every row without explanation.
 */
function publishedCertifications() {
  const today = new Date().toISOString().slice(0, 10);
  return certifications.filter(
    cert =>
      cert.claimId !== undefined &&
      cert.validTo !== undefined &&
      cert.validToISO !== undefined &&
      cert.validToISO >= today &&
      isPublishable(cert.claimId),
  );
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
/**
 * The footer's group band is hidden, founder instruction 2026-09-22.
 *
 * A FLAG RATHER THAN A DELETION, and rather than emptying `groupEntities`.
 * That array is also the source for `subOrganization` and part of `sameAs` in
 * src/lib/schema.ts, so clearing it would take the four group companies out of
 * the Organization structured data as well - changing what search and answer
 * engines are told about the company, invisibly, off the back of a request to
 * hide something in a footer.
 *
 * Gating the render leaves the schema, the content file and the separator guard
 * below untouched, and putting the band back is one boolean.
 */
const SHOW_GROUP_BAND = false;

export function SiteFooter() {
  const badges = publishedTrustBadges();
  const certs = publishedCertifications();
  const columns = footerColumns.filter(col => col.items.length > 0);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <BrandLogo variant="white" height={38} className="site-footer__logo" />
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

            {/* The certification ledger. Standard and validity, nothing else —
                the guard wraps the container so an empty register leaves no
                stray flex box, which is the same rule the pill row above
                follows. */}
            {certs.length > 0 ? (
              <ul className="cert-ledger">
                {certs.map(cert => (
                  <li key={cert.standard}>
                    {/* Standard only, per founder instruction 2026-09-22: the
                        badge image and the "Valid to" line are both gone. The
                        expiry still governs whether this row exists at all —
                        see publishedCertifications — so what was a date a
                        reader had to check is now a condition the build
                        enforces. */}
                    <span className="cert-ledger__text">
                      <span className="cert-ledger__std">{cert.standard}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {/*
              Social links, added 2026-09-22 on founder instruction. They sit
              after the certification ledger so the brand column reads
              identity, then evidence, then elsewhere-we-are.

              Every one is an accessible NAME, not a decoration: the glyph is
              aria-hidden and the label is visually hidden text, so a screen
              reader announces "LinkedIn, link" rather than "link". An icon-only
              anchor with no accessible name is the single most common footer
              accessibility defect and it is trivially avoidable.

              44px minimum target, per WCAG 2.5.8, which the rest of this site
              already honours.
            */}
            <ul className="site-footer__social">
              {socialLinks.map(s => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}>
                    {s.icon}
                    <span className="visually-hidden-heading">{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* A column with no links would render its mono heading over nothing,
              so an emptied column drops out entirely rather than leaving a
              label in the grid. */}
          {columns.map(col => (
            <div key={col.heading}>
              <h2>{col.heading}</h2>
              <ul className="site-footer__list">
                {col.items.map(item => (
                  <Fragment key={item.href + item.label}>
                    <li>
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                          {item.label}
                          <ArrowUpRight size={11} />
                        </a>
                      ) : (
                        <Link href={item.href}>{item.label}</Link>
                      )}
                    </li>
                    {/*
                      "Privacy choices" is a BUTTON, not a route — it opens a
                      panel, so there is nothing to link to and nothing to put in
                      the sitemap. It is rendered here rather than added to
                      `legalNav`, because that array is typed as navigation items
                      with an href and inventing a fake one would put a dead URL
                      into the sitemap and the link checker.

                      POSITIONED AFTER /cookies, NOT APPENDED TO THE COLUMN. The
                      founder's brief lists the three as one group — Privacy
                      Statement | Cookies & analytics | Privacy choices — and
                      appending it to the end separated it from the other two by
                      Terms, Modern slavery and Accessibility. Anchoring it to
                      the item it belongs beside keeps the group together however
                      the rest of the column is reordered.
                    */}
                    {item.href === '/cookies' ? (
                      <li>
                        <PrivacyChoices />
                      </li>
                    ) : null}
                  </Fragment>
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
        {SHOW_GROUP_BAND && groupEntities.length > 0 ? (
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
          {/* RESTYLED 2026-09-17: "understated and visually integrated".
              It was one bold, high-contrast run-on sentence that read as a
              statement rather than as the fine print it is. Now it is a quiet
              labelled row at the footer's ordinary text weight.

              Every statutory element is still here and each is now NAMED,
              which is what the disclosure rules actually ask for: S.I. 2015/17
              reg. 25(2) wants the part of the UK, the registered number and the
              registered office; E-Commerce Regs 2002 reg. 6(1)(d) and PoSR 2009
              reg. 8(1)(d) want the register named as well, and reg. 6(1)(g) /
              8(1)(g) the VAT number. Quieter typography, not less disclosure.

              `company.registeredIn` rather than a typed "England and Wales":
              the same string was hand-written in three files, which is three
              chances for someone to shorten it to England. There is no such
              registration - see the note on that constant.

              The VAT segment stays conditional for the reason it always was:
              those regulations require it WHERE the trader is VAT registered,
              so an empty value must produce no segment rather than a dangling
              "VAT ". Nothing else here is optional. */}
          {/* SPLIT INTO TWO GROUPS, 2026-09-17, founder instruction: the second
              line sits to the right.

              It reads as one disclosure and is still one continuous statement —
              the split is where the line was already breaking, so nothing is
              reordered and nothing is hidden. Identity and registration on the
              left; where to find us and the VAT number on the right.

              WHY THIS ONLY BECAME POSSIBLE NOW: this row used to hold the legal
              nav on its right-hand side. That moved into the Company column
              earlier today, which left the right side empty and the disclosure
              stranded on the left of a full-width row. */}
          <p className="site-footer__id">
            <span>{company.legalName}</span>
            <span>Registered in {company.registeredIn}</span>
            <span>Company number {company.crn}</span>
          </p>
          <p className="site-footer__id site-footer__id--end">
            <span>Registered office {company.addressLine}</span>
            {company.vat ? <span>VAT {company.vat}</span> : null}
          </p>
          {/* The legal-document links used to sit here, beside the statutory
              disclosure. They moved into the Company column on 2026-09-17
              (founder instruction) and are composed there from the same
              `legalNav` constant — so they are NOT rendered twice, and this
              block is gone rather than hidden.

              What is left in this row is the statutory disclosure alone, which
              now has the full width instead of sharing it. */}
        </div>
      </div>
    </footer>
  );
}
