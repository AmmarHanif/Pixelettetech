import Link from 'next/link';

import { ArrowUpRight, Logomark } from '@/components/Icons';
import { company } from '@/content/company';
import { primaryCta, primaryNav } from '@/content/nav';

/**
 * Site header.
 *
 * Deliberately a Server Component with no client JavaScript: the mobile menu
 * is a native <details>/<summary> disclosure, which is keyboard accessible,
 * announced correctly by screen readers, and works before hydration.
 */
export function SiteHeader() {
  const links = primaryNav.map(item =>
    item.external ? (
      <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer">
        {item.label}
        <ArrowUpRight size={12} />
      </a>
    ) : (
      <Link key={item.href} href={item.href}>
        {item.label}
      </Link>
    ),
  );

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="brandmark" aria-label={`${company.name} — home`}>
          <Logomark size={24} />
          <span>{company.name}</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {links}
          <Link href={primaryCta.href} className="nav__cta">
            {primaryCta.label}
          </Link>
        </nav>

        <details className="nav-mobile">
          <summary className="nav-toggle" aria-label="Open menu">
            Menu
          </summary>
          <nav className="nav-mobile__panel" aria-label="Primary, mobile">
            {links}
            <Link href={primaryCta.href} className="nav__cta">
              {primaryCta.label}
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
