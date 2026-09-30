'use client';

/**
 * Marks the nav link for the page you are on.
 *
 * WHY THIS EXISTS. The founder asked on 2026-09-30 for the active page to be
 * named in #661A8F on the menu. The stylesheet already had a rule for it -
 * `.nav a[aria-current='page']` - but NOTHING ON THE SITE EVER SET THAT
 * ATTRIBUTE: `SiteHeader` is a Server Component with no access to the current
 * route, so the rule had never matched anything. Colouring it alone would have
 * changed nothing at all. The attribute has to be produced first, and that
 * needs the pathname, and that needs a client boundary.
 *
 * This is kept as small as it can be on purpose. `SiteHeader` stays a Server
 * Component and the whole header still renders and works before hydration; only
 * the current-page marking arrives with the client bundle, which is the right
 * trade because it is an enhancement rather than the navigation itself.
 *
 * WHAT COUNTS AS CURRENT. Exact match, plus a section landing page counts as
 * current for its own sub-pages ("/engineering" stays marked while you are on
 * "/engineering/custom-software-saas"), because that is what a reader means by
 * "where am I". "/" is matched exactly and never as a prefix, or it would be
 * current everywhere.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function isCurrent(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(href + '/');
}

/**
 * `page` for the page you are actually on, `true` for the section containing it.
 *
 * WHY TWO VALUES. Marking both the section overview and the sub-page as
 * `aria-current="page"` put two identical highlights in one dropdown and claimed
 * you were on a page you were not. `aria-current="page"` means THIS page;
 * `aria-current="true"` is the valid ARIA for "the current item in a set", which
 * is exactly what the parent section is. The styling follows the same split, so
 * one entry reads as where you are and the other as what contains it.
 */
export function currentState(pathname: string | null, href: string): 'page' | 'true' | undefined {
  if (!pathname) return undefined;
  if (pathname === href) return 'page';
  return isCurrent(pathname, href) ? 'true' : undefined;
}

export default function NavCurrentLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const current = currentState(pathname, href);
  return (
    <Link aria-current={current} className={className} href={href}>
      {children}
    </Link>
  );
}
