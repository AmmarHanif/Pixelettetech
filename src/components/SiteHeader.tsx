import Link from 'next/link';

import { BrandLogo } from '@/components/BrandLogo';
import { NavDropdown } from '@/components/NavDropdown';
import { ArrowRight, ArrowUpRight } from '@/components/Icons';
import { company } from '@/content/company';
import { navSections, primaryCta, primaryNav } from '@/content/nav';
import type { NavItem, NavSection } from '@/content/nav';
import { ANALYTICS_EVENTS, ANALYTICS_SURFACES, analyticsAttrs } from '@/lib/analytics';

/**
 * Site header.
 *
 * Deliberately a Server Component with no client JavaScript: the mobile menu
 * is a native <details>/<summary> disclosure, which is keyboard accessible,
 * announced correctly by screen readers, and works before hydration.
 *
 * The three capability dropdowns the 8 September 2026 handoff asks for —
 * Engineering, AI & Automation, Blockchain — are built the same way, for the
 * same reason, on the desktop bar and inside the mobile panel alike. One
 * <details> per section. That is a choice against the usual CSS :hover menu,
 * and it is not only about keeping the component server-rendered:
 *
 *  - a :hover menu cannot be opened from the keyboard at all, and the
 *    :focus-within variant of it stays invisible to a screen-reader user
 *    reading in browse mode, because browse-mode reading never moves DOM
 *    focus onto the trigger, so the sub-pages are simply absent for them;
 *  - content revealed on hover has to be dismissible without moving the
 *    pointer or focus (WCAG 2.1 SC 1.4.13, Level AA), which cannot be done in
 *    CSS alone;
 *  - <summary> is already exposed to assistive technology as a button with an
 *    expanded/collapsed state, is operable with Enter and Space, and works
 *    before hydration.
 *
 * Stated rather than hidden, the cost of the no-JavaScript decision: an open
 * dropdown is closed by the user — by toggling it, or by opening another one,
 * since the `name` attribute makes them mutually exclusive — and not by
 * clicking elsewhere on the page or by a soft navigation. Closing on outside
 * click needs a document listener, which needs a Client Component. This is a
 * disclosure behaving like a disclosure, not a broken menu.
 *
 * Both menus render from `primaryNav`, in `primaryNav` order, with
 * `navSections` supplying each section's sub-pages, so the header cannot
 * describe the site differently from the footer or the sitemap. A section is
 * matched to its nav item by its landing route: adding a fourth section to
 * `navSections` gives it a dropdown as soon as the same route is in
 * `primaryNav`, and nothing here needs editing.
 */

/** Capability sections keyed by landing route; nav order stays primaryNav's. */
const sectionByHref = new Map<string, NavSection>(
  navSections.map(section => [section.href, section]),
);

/** A nav item with no dropdown: Work, Insights, About. */
function TopLink({ item, className }: { item: NavItem; className?: string }) {
  if (item.external) {
    return (
      <a href={item.href} className={className} target="_blank" rel="noopener noreferrer">
        {item.label}
        <ArrowUpRight size={12} />
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

/**
 * A desktop dropdown.
 *
 * The trigger is a <summary>, so it is not itself a link — which is why the
 * section's own landing page is the first item in the panel rather than
 * something a visitor has to guess at. Nobody who wants /engineering ends up
 * trapped in a menu about it.
 */
/*
 * THE DESKTOP DROPDOWN MOVED TO src/components/NavDropdown.tsx on 2026-09-17,
 * on founder instruction that the submenus should open on HOVER rather than on
 * a click. It had to become a client island to do that compliantly: hover-
 * revealed content must be dismissible without moving the pointer (WCAG 2.1
 * SC 1.4.13), which means an Escape handler, which means JavaScript.
 *
 * What moved is ONLY the desktop bar. The mobile panel's disclosure below is
 * untouched and still has no client JavaScript at all, so a phone keeps the tap
 * behaviour by construction rather than by a media query.
 *
 * The new component is still a native <details>/<summary>: click, keyboard and
 * the pre-hydration fallback all survive. See the file for how each of the three
 * SC 1.4.13 conditions is met.
 */

/**
 * The same section inside the mobile panel: a nested disclosure, so the
 * seventeen service pages are reachable on a phone and not only on a desktop
 * that can open a dropdown. Landing page first here too.
 *
 * Seventeen, corrected 2026-09-08: it read "sixteen", which counted the
 * directories created that session and missed
 * `/ai-automation/evaluation-and-observability`, which already existed. The
 * number is `navSections` in `src/content/nav.ts` — Engineering 6, AI &
 * Automation 6, Blockchain 5 — every one of which has a `page.tsx` on disk.
 * The three section landing pages are additional and are rendered above the
 * list, not counted in it.
 */
function SectionGroupMobile({ section }: { section: NavSection }) {
  return (
    <details className="nav-mobile__group" name="pt-nav-section-mobile">
      <summary className="nav-mobile__group-summary">{section.label}</summary>
      <ul className="nav-mobile__group-list">
        <li>
          <Link href={section.href}>{section.label} overview</Link>
        </li>
        {section.items.map(item => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function SiteHeader() {
  const desktopNav = primaryNav.map(item => {
    const section = sectionByHref.get(item.href);
    return section ? (
      <NavDropdown key={item.href} section={section} />
    ) : (
      <TopLink key={item.href} item={item} />
    );
  });

  const mobileNav = primaryNav.map(item => {
    const section = sectionByHref.get(item.href);
    return section ? (
      <SectionGroupMobile key={item.href} section={section} />
    ) : (
      <TopLink key={item.href} item={item} />
    );
  });

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="brandmark" aria-label={`${company.name} home`}>
          <BrandLogo height={36} />
        </Link>

        <nav className="nav" aria-label="Primary">
          {desktopNav}
          {/* Tracked as two surfaces, not one. The same label appears on the
              desktop bar and inside the mobile panel, and "does the header CTA
              convert on a phone" is a different question from whether it
              converts on a desktop. Collapsing them answers neither. */}
          <Link
            href={primaryCta.href}
            className="nav__cta"
            {...analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
              surface: ANALYTICS_SURFACES.SITE_HEADER,
            })}
          >
            {primaryCta.label}
          </Link>
        </nav>

        <details className="nav-mobile">
          <summary className="nav-toggle" aria-label="Open menu">
            Menu
          </summary>
          <nav className="nav-mobile__panel" aria-label="Primary, mobile">
            {mobileNav}
            <Link
              href={primaryCta.href}
              className="nav__cta"
              {...analyticsAttrs(ANALYTICS_EVENTS.BOOK_CONVERSATION_CTA, {
                surface: ANALYTICS_SURFACES.SITE_HEADER_MOBILE,
              })}
            >
              {primaryCta.label}
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
