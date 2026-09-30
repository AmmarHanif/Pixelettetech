'use client';

/**
 * Prev/next controls for the testimonials row.
 *
 * WHY THIS EXISTS. The slider variant was a bare scroll container with
 * `scrollbar-width: none` and `::-webkit-scrollbar { display: none }`, so on a
 * desktop with a mouse there was NO affordance and no ordinary way to move it:
 * the scrollbar was hidden by design, and the only routes left were a horizontal
 * trackpad swipe or focusing the row and pressing an arrow key. The founder
 * reported it on 2026-09-30 as "slider button is missing", which is exactly
 * right - the cards ran off the edge with nothing to press.
 *
 * The keyboard and screen-reader behaviour that was already here is kept intact:
 * the row itself stays focusable with a role and a label, so arrow keys still
 * work whether or not anyone uses the buttons.
 *
 * The buttons are HIDDEN when there is nothing to scroll, rather than shown
 * disabled. A control that can never do anything is noise, and with two cards on
 * a wide screen there is genuinely nothing to page through. Each button is
 * disabled at its own end of the travel, which is a different thing: there the
 * control is meaningful and its state is the information.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

const EDGE = 2; // px of slack, because scroll offsets are fractional at non-integer DPR

export default function ReviewSlider({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    /* THE ROW DOES NOT REST AT scrollLeft 0. It bleeds to the gutter with
       `margin-inline: calc(var(--gutter) * -1)` and pads back with
       `padding-inline: var(--gutter)`, and scroll-snap settles on the first
       card - which sits AFTER that padding. Measured at rest: scrollLeft 24
       against a 24px start padding. Comparing against 0 therefore never saw
       "at start", and Previous stayed enabled with nothing to go back to. */
    const startPad = parseFloat(getComputedStyle(el).paddingInlineStart) || 0;
    setCanScroll(max > startPad + EDGE);
    setAtStart(el.scrollLeft <= startPad + EDGE);
    setAtEnd(el.scrollLeft >= max - EDGE);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    /* Re-measure on resize rather than only on mount: the row is scrollable at
       one width and not at another, and the buttons must follow that. */
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of Array.from(el.children)) ro.observe(child);
    return () => ro.disconnect();
  }, [measure]);

  const page = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    /* Step by one card, not by a fixed number: the card width is set in CSS
       (`min(380px, 86vw)`) and changes with the viewport, so reading it back is
       the only way the button and the snap points agree. */
    const card = el.querySelector<HTMLElement>('.tm-slide');
    const gap = parseFloat(getComputedStyle(el).columnGap || '20') || 20;
    const step = card ? card.getBoundingClientRect().width + gap : el.clientWidth * 0.8;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * step, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <div className="tm-sliderwrap" style={{ marginTop: 32 }}>
      <div
        aria-label={label}
        className="tm-slider"
        onScroll={measure}
        ref={ref}
        role="group"
        tabIndex={0}
      >
        {children}
      </div>

      {canScroll ? (
        <div className="tm-nav">
          <button
            aria-label="Previous reviews"
            className="tm-nav__btn"
            disabled={atStart}
            onClick={() => page(-1)}
            type="button"
          >
            <svg aria-hidden fill="none" focusable="false" height="18" viewBox="0 0 24 24" width="18">
              <path
                d="M15 5l-7 7 7 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
          <button
            aria-label="Next reviews"
            className="tm-nav__btn"
            disabled={atEnd}
            onClick={() => page(1)}
            type="button"
          >
            <svg aria-hidden fill="none" focusable="false" height="18" viewBox="0 0 24 24" width="18">
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}
