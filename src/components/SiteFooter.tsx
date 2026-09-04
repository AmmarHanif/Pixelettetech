import Link from 'next/link';

import { BrandLogo } from '@/components/BrandLogo';
import { ArrowUpRight } from '@/components/Icons';
import { company, trustBadges } from '@/content/company';
import { footerColumns, groupBlurb, groupEntities, legalNav } from '@/content/nav';

/**
 * Site footer.
 *
 * Rendered from `footerColumns` so it cannot drift from the sitemap. Every
 * href here resolves to a real page or a real anchor on one.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__grid">
          <div className="site-footer__brand">
            <BrandLogo variant="white" height={34} className="site-footer__logo" />
            <p>{company.description}</p>
            <div className="pill-row" style={{ marginTop: 20 }}>
              {trustBadges.map(badge => (
                <span className="pill" key={badge}>
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {footerColumns.map(col => (
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
            landed on the wrong one can find the right one. */}
        <section className="groupband" aria-labelledby="group-heading">
          <div className="groupband__intro">
            <h2 id="group-heading">Part of Pixelette Group</h2>
            <p>{groupBlurb}</p>
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

        <div className="site-footer__legal">
          <p>
            {company.legalName} · {company.addressLine} · CRN {company.crn}
          </p>
          <p style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {legalNav.map(item => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
