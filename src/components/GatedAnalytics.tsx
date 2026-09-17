'use client';

import { Analytics } from '@vercel/analytics/next';

import { analyticsAllowed } from '@/lib/privacy';

/**
 * The analytics provider, with the visitor's objection applied at the TRANSPORT
 * rather than at the call sites.
 *
 * THIS EXISTS BECAUSE GATING THE CALL SITES WAS NOT ENOUGH, and the gap was
 * found by measuring rather than reasoning. Every `track()` in this repository
 * is behind `analyticsAllowed()`, and with the control switched off the custom
 * events duly stopped. A `pageview` went out anyway:
 *
 *     ["pageview", { route: "/contact", path: "/contact" }]
 *
 * `<Analytics />` sends pageviews ITSELF, on navigation, without going through
 * any `track()` call in this codebase. Gating the calls I wrote left the
 * provider's own automatic traffic untouched — so a visitor who had objected
 * was still being counted on every page they opened, which is the precise thing
 * the founder's instruction says must not happen.
 *
 * `beforeSend` is the provider's own hook and it sees EVERYTHING the provider
 * sends, including the traffic this codebase never initiates. Returning `null`
 * drops the event before it leaves the browser. That makes the gate complete by
 * construction: a future provider feature that starts sending something new
 * passes through here too, whereas a list of gated call sites would silently
 * not cover it.
 *
 * WHY THE CALL-SITE GATES STAY as well. They stop an event being CONSTRUCTED,
 * not merely dropped on the way out, and they are the thing a reader of
 * `AnalyticsEvents.tsx` will see. Defence in depth, and the call-site gate is
 * also what protects any future provider that has no `beforeSend`.
 *
 * Recorded as ADR-0037, which generalises it: when a third-party library both
 * accepts your calls AND acts on its own, gating your calls governs only your
 * half. Find the seam the library cannot bypass.
 *
 * CHECKED PER EVENT, never captured. A visitor who switches the control off
 * mid-visit is respected on the very next event rather than on their next page
 * load — `analyticsAllowed()` reads storage each time it is called.
 */
export function GatedAnalytics() {
  return <Analytics beforeSend={event => (analyticsAllowed() ? event : null)} />;
}
