'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import type { NavSection } from '@/content/nav';

/**
 * A capability dropdown in the header, opening on HOVER.
 *
 * WHY THIS IS A CLIENT ISLAND AND NOT A CSS :hover MENU. Founder instruction
 * 2026-09-17: the submenus should open on hover and close when the pointer
 * leaves, rather than needing a click. The header's own source carried the
 * opposite decision and the reason for it, so the reason is answered here
 * rather than deleted:
 *
 *   "Deliberately not a :hover menu: hover-revealed content has to be
 *    dismissible without moving the pointer (WCAG 2.1 SC 1.4.13) and that needs
 *    JavaScript this header does not have."
 *
 * That is correct, and a plain CSS hover menu would have shipped a WCAG 2.1 AA
 * failure onto a site that publishes an accessibility statement and sells into
 * procurement. SC 1.4.13 asks for three things from hover-revealed content, and
 * all three are met here:
 *
 *   DISMISSIBLE  Escape closes it without moving the pointer. This is the one a
 *                CSS-only menu cannot do, and the whole reason this file exists.
 *   HOVERABLE    The panel is a DOM descendant of the <details>, so moving onto
 *                it keeps the pointer inside the element. The 18px gap between
 *                trigger and panel is bridged by CLOSE_DELAY below.
 *   PERSISTENT   It stays open until the pointer leaves or Escape is pressed;
 *                nothing times it out.
 *
 * WHAT IS PRESERVED. Still a native <details>/<summary>, so: it opens on click
 * and from the keyboard exactly as before, it carries an expanded state into the
 * accessibility tree, the `name` attribute keeps the three sections mutually
 * exclusive, and BEFORE HYDRATION it is a working click disclosure rather than
 * dead markup. Hover is added on top of that, never in place of it.
 *
 * TOUCH DEVICES GET NOTHING NEW, by design. The hover wiring is gated on a
 * `(hover: hover) and (pointer: fine)` media query, so a phone or tablet keeps
 * the tap behaviour. Without that gate, a touch device fires a synthetic
 * mouseenter on tap and the menu opens and closes on the same gesture.
 */

/**
 * Milliseconds to wait before closing after the pointer leaves.
 *
 * NOT cosmetic. `.nav__drop-panel` sits at `top: calc(100% + 18px)`, so there is
 * an 18px gap of empty space between the trigger and the panel. Travelling from
 * one to the other crosses that gap, which fires mouseleave; closing instantly
 * would make the menu unusable with a normal mouse movement and would also fail
 * the HOVERABLE half of SC 1.4.13. 140ms covers the crossing without feeling
 * sticky if the pointer has genuinely left.
 */
const CLOSE_DELAY = 140;

export function NavDropdown({ section }: { section: NavSection }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelClose = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const close = () => {
    cancelClose();
    if (ref.current) ref.current.open = false;
  };

  useEffect(() => {
    /*
     * Escape has to work when nothing inside the panel holds focus, which is
     * the normal case for a pointer user who has only hovered. A handler on the
     * element itself would never see the key, so this listens on the document
     * and closes only its own panel.
     */
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && ref.current?.open) close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      cancelClose();
    };
  }, []);

  const hoverCapable = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  return (
    <details
      className="nav__drop"
      name="pt-nav-section"
      ref={ref}
      onMouseEnter={() => {
        if (!hoverCapable()) return;
        cancelClose();
        if (ref.current) ref.current.open = true;
      }}
      onMouseLeave={() => {
        if (!hoverCapable()) return;
        cancelClose();
        timer.current = setTimeout(close, CLOSE_DELAY);
      }}
    >
      <summary
        className="nav__drop-summary"
        /*
         * With hover already having opened it, a click on the summary would
         * toggle it shut and then the still-present hover would not reopen it
         * until the pointer left and returned - the menu appears to ignore the
         * click. On a hover-capable pointer the summary therefore navigates to
         * the section hub, which is what a click on a nav item should do
         * anyway. Keyboard and touch keep the native toggle untouched.
         */
        onClick={e => {
          if (!hoverCapable()) return;
          if (e.detail === 0) return; // keyboard-activated, let <details> toggle
          e.preventDefault();
          window.location.href = section.href;
        }}
      >
        {section.label}
      </summary>
      <div
        className="nav__drop-panel"
        /*
         * CLOSE ON CHOOSING SOMETHING. Founder instruction 2026-09-17: the
         * panel stayed open after clicking one of its links.
         *
         * It is a client-side <Link>, so there is no document load to reset the
         * <details> element - the new page renders underneath a menu that is
         * still open, which is what he saw. This is the price of the same
         * client-side navigation that makes the site quick, and it needs paying
         * explicitly.
         *
         * Listening on the panel rather than on each Link: one handler covers
         * the hub link and every item, including any added later, and clicks on
         * the panel's own padding are ignored by the anchor test.
         */
        onClick={e => {
          if ((e.target as HTMLElement).closest('a')) close();
        }}
      >
        <Link href={section.href} className="nav__drop-hub">
          {/* No arrow icon. Founder instruction 2026-09-17: the arrows come
              out of the menu. "overview" already says where the link goes, and
              a chevron on one link inside a panel of plain links reads as
              decoration rather than as a signal. */}
          <span className="nav__drop-hub-label">{section.label} overview</span>
          <span className="nav__drop-hub-summary">{section.summary}</span>
        </Link>
        <ul className="nav__drop-list">
          {section.items.map(item => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
