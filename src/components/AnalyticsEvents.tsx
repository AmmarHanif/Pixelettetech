'use client';

import { track } from '@vercel/analytics/react';
import { useEffect } from 'react';

import { analyticsAllowed } from '@/lib/privacy';
import {
  ANALYTICS_EVENTS,
  DETAIL_ATTRIBUTE,
  EVENT_ATTRIBUTE,
  MAX_DETAIL_LENGTH,
  ROUTE_ATTRIBUTE,
  SURFACE_ATTRIBUTE,
  VALUE_MODEL_BY_ROUTE,
  isAnalyticsEventName,
  isAnalyticsSurface,
  isBuyerRoute,
} from '@/lib/analytics';

/**
 * The whole client surface of the analytics feature. One component, one
 * listener, mounted once in the root layout.
 *
 * WHY THIS SHAPE AND NOT onClick HANDLERS
 *
 * This site is server-rendered with almost no client JavaScript, on purpose.
 * The navigation dropdowns are native `<details>` elements specifically to
 * avoid hydrating a component (see the note at the top of
 * `src/components/SiteHeader.tsx`). Attaching an `onClick` to a CTA would make
 * its page a Client Component, and its parents with it, so instrumenting the
 * handoff's five families would have converted the homepage, the work index,
 * the case-study template and the header into client components — trading the
 * site's architecture for a measurement feature.
 *
 * Instead every tracked element carries plain `data-pt-*` attributes, which
 * cost nothing and keep their page a Server Component, and ONE delegated
 * listener at the document reads them back from the click target's nearest
 * matching ancestor. Adding a tracked CTA is then an attribute, not a handler,
 * and never a new client boundary.
 *
 * Rendering `null` is deliberate: this component exists for its effect.
 */
export function AnalyticsEvents() {
  useEffect(() => {
    /**
     * `closest()` walks up from whatever was actually clicked — usually the
     * arrow SVG or the label span inside the link, not the link itself — and
     * stops at the first instrumented ancestor, so nested markup produces
     * exactly one event per click.
     */
    const onActivate = (event: MouseEvent) => {
      /*
       * THE VISITOR'S OBJECTION, CHECKED FIRST AND AT EVENT TIME.
       *
       * Founder instruction 2026-09-17: switching analytics off must stop
       * transmission immediately.
       *
       * AT THE TOP, NOT BESIDE EACH `track()`. This handler has TWO senders -
       * the normal one at the foot, and the UNKNOWN_EVENT report on the
       * early-return path for an undeclared event name. Gating the senders
       * individually is what I did first, and it left that second one firing
       * for a visitor who had opted out. One gate at the entry covers every
       * exit from this function, including any added later.
       *
       * AT EVENT TIME, not around the `useEffect`: a gate on the effect is
       * evaluated once at mount, so a visitor who objects mid-visit would keep
       * being measured until they navigated. That is not "immediately", and it
       * is invisible in testing to anyone who reloads before checking.
       */
      if (!analyticsAllowed()) return;

      // Right-click opens a context menu rather than following the link.
      if (event.button === 2) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const element = target.closest(`[${EVENT_ATTRIBUTE}]`);
      if (!element) return;

      const name = element.getAttribute(EVENT_ATTRIBUTE);
      if (!name) return;

      if (!isAnalyticsEventName(name)) {
        /*
         * A name that is not in the registry. This is the failure this whole
         * design exists to make impossible to ship quietly: an element that
         * LOOKS instrumented, tracks nothing, and reports nothing. It cannot
         * normally happen — `analyticsAttrs()` will not compile against an
         * undeclared name — but it can be reached by hand-writing the
         * attribute, so it is reported rather than dropped.
         */
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error(
            `[analytics] "${name}" is not a declared event. Add it to ANALYTICS_EVENTS in src/lib/analytics.ts, or use analyticsAttrs().`,
            element,
          );
        }
        track(ANALYTICS_EVENTS.UNKNOWN_EVENT, { detail: name.slice(0, MAX_DETAIL_LENGTH) });
        return;
      }

      const properties: Record<string, string> = {};

      const route = element.getAttribute(ROUTE_ATTRIBUTE);
      if (route && isBuyerRoute(route)) {
        properties.route = route;
        /*
         * Derived here rather than read from the markup. Item 22 asks for
         * conversion "by route (Build / Automate / Blockchain / Run)", which is
         * section 04's four words over section 03's six routes. Deriving it
         * from one table means the two dimensions cannot contradict each other
         * however many pages carry a route attribute.
         */
        properties.model = VALUE_MODEL_BY_ROUTE[route];
      }

      const surface = element.getAttribute(SURFACE_ATTRIBUTE);
      if (surface && isAnalyticsSurface(surface)) properties.surface = surface;

      const detail = element.getAttribute(DETAIL_ATTRIBUTE);
      if (detail) properties.detail = detail.slice(0, MAX_DETAIL_LENGTH);

      track(name, properties);
    };

    /*
     * Capture phase, so the event is seen before any handler further down could
     * stop it propagating, and before `next/link` begins its client-side
     * navigation. `auxclick` is listened to as well because a middle-click —
     * "open this CTA in a new tab", which is a real and interested visitor —
     * does not fire `click` at all.
     *
     * Keyboard activation needs no separate handling: pressing Enter on a link
     * or Space on a button dispatches a real `click`.
     */
    document.addEventListener('click', onActivate, true);
    document.addEventListener('auxclick', onActivate, true);

    return () => {
      document.removeEventListener('click', onActivate, true);
      document.removeEventListener('auxclick', onActivate, true);
    };
  }, []);

  return null;
}
