'use client';

/**
 * Scroll reveal, without a library.
 *
 * WHY NOT AOS. The obvious answer to "animate on scroll" is the AOS package, and
 * it was deliberately not installed. Three reasons, the third decisive:
 *
 *  1. A new dependency is a governed decision here and every package carries a
 *     recorded licence. This buys ~14 kB of obligation for behaviour the
 *     platform already provides.
 *  2. `IntersectionObserver` plus two CSS rules IS the whole feature.
 *  3. AOS HIDES CONTENT BY DEFAULT IN CSS and relies on its own JavaScript to
 *     put it back. If that script fails to load, is blocked, or throws, the page
 *     renders with its copy invisible - to visitors and to crawlers. On a
 *     marketing site whose entire job is to be read, that is not an acceptable
 *     failure mode.
 *
 * SO THIS INVERTS IT. Nothing is hidden by the stylesheet alone. `reveal-ready`
 * is added to <html> only once this code has confirmed, at runtime, that it can
 * also take it away again. Every path where the animation cannot run - no
 * JavaScript, a thrown error, a browser without IntersectionObserver,
 * `prefers-reduced-motion` - leaves the page plain and fully visible. The
 * animation sits on top of a page that already works.
 *
 * IT MARKS THE CARDS ITSELF rather than asking eight page files to carry an
 * attribute. One selector list here beats the same edit repeated across the
 * site and then forgotten on the ninth page someone adds later.
 *
 * NOTHING FLASHES. Elements already on screen are marked revealed BEFORE
 * `reveal-ready` goes on, so they are never transparent for even one frame.
 * Getting that order wrong is what makes this pattern blink on load.
 *
 * IT REVEALS ONCE. Re-animating on every scroll past is what makes the effect
 * tiresome, and it means something already read can vanish on the way back up.
 * Each element is unobserved the moment it is shown.
 */

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/* The repeating cards worth staggering. Kept here, not in the pages, so the
   treatment stays consistent as pages come and go. */
const CARDS = '.service-card, .work-card, .ins-card, .mini-card, .arc-item';

export function ScrollReveal() {
  /* RE-ARMED ON EVERY NAVIGATION, AND THIS IS A BUG FIX, NOT A REFINEMENT.
     This component lives in the root layout, which does NOT unmount during an
     App Router client-side navigation. With an empty dependency array the effect
     ran ONCE per full page load, so after navigating to a second page
     `reveal-ready` was still on <html>, that page's [data-reveal] elements were
     hidden by CSS, and NOTHING WAS OBSERVING THEM - the page rendered blank
     until a refresh remounted the component. Measured before the fix: navigating
     from / to /engineering left 8 marked elements at opacity 0.
     Keying the effect to the pathname tears down and re-arms on each route, so
     every page gets its own observer. */
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;

    // Bail out to the plain, visible page on every unsupported path.
    if (typeof IntersectionObserver === 'undefined') return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    /* Cards get the attribute and a stagger index within their own row. Capped
       at five: past that the last card waits long enough to read as broken
       rather than choreographed. */
    const seen = new Map<Element, number>();
    for (const card of Array.from(document.querySelectorAll<HTMLElement>(CARDS))) {
      const parent = card.parentElement;
      if (!parent) continue;
      const i = seen.get(parent) ?? 0;
      seen.set(parent, i + 1);
      card.setAttribute('data-reveal', '');
      if (i > 0) card.setAttribute('data-reveal-delay', String(Math.min(i, 5)));
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (targets.length === 0) return;

    /* ORDER MATTERS. Decide what is already on screen and mark it revealed
       BEFORE `reveal-ready` is added, or those elements go transparent for a
       frame and the page blinks. */
    /* ONCE SHOWN, AN ELEMENT STOPS BEING A REVEAL TARGET, and that is a fix
       rather than tidiness. `.reveal-ready [data-reveal]` is a more specific
       selector than `.service-card`, so while the attribute is present it wins
       the `transition` property outright - and the cards' hover transition was
       measured as "opacity, transform", meaning their shadow would have SNAPPED
       instead of easing. Dropping the attribute when the animation finishes
       hands the element back to its own styles. Nothing moves at that moment:
       it is already at opacity 1 with no transform. */
    const release = (el: HTMLElement) => {
      el.removeAttribute('data-reveal');
      el.removeAttribute('data-reveal-delay');
      el.classList.remove('is-revealed', 'is-instant');
    };

    const vh = window.innerHeight || 0;
    const below: HTMLElement[] = [];
    for (const el of targets) {
      if (el.getBoundingClientRect().top < vh) {
        // Already on screen: never hidden, never animated, never marked.
        release(el);
      } else {
        below.push(el);
      }
    }

    // Nothing below the fold to animate? Leave the page entirely alone.
    if (below.length === 0) return;

    root.classList.add('reveal-ready');

    const timers = new Set<ReturnType<typeof setTimeout>>();

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.add('is-revealed');
          observer.unobserve(el);

          /* Release after the animation, not during it. `transitionend` is the
             accurate signal; the timer is the fallback for the cases where it
             never fires - a tab hidden mid-transition, or an element whose
             transition was overridden to none. Both call the same idempotent
             function, so a double fire is harmless. */
          const done = () => release(el);
          el.addEventListener('transitionend', done, { once: true });
          const t = setTimeout(done, 1200);
          timers.add(t);
        }
      },
      /* A negative bottom margin rather than a threshold, so an element starts
         arriving slightly before it is properly in view and has finished by the
         time it is being read. Waiting until it is fully visible makes the
         visitor watch the animation instead of the page. */
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );

    for (const el of below) observer.observe(el);

    /* If reduced motion is turned on mid-visit, stop hiding anything. Removing
       the class restores the plain page in one step. */
    const onMotionChange = () => {
      if (!motion.matches) return;
      observer.disconnect();
      root.classList.remove('reveal-ready');
    };
    motion.addEventListener('change', onMotionChange);

    return () => {
      observer.disconnect();
      motion.removeEventListener('change', onMotionChange);
      for (const t of timers) clearTimeout(t);
      root.classList.remove('reveal-ready');
    };
  }, [pathname]);

  return null;
}

export default ScrollReveal;
