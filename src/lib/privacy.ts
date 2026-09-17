/**
 * The visitor's analytics choice, and the one gate everything must pass.
 *
 * Founder instruction 2026-09-17: no cookie banner, no consent wall, no
 * automatic pop-up. Limited privacy-preserving statistical analytics, with a
 * permanent visible objection mechanism the visitor opens when they want it.
 *
 * WHAT IS STORED, AND WHY IT IS NOT ITSELF TRACKING. One key, one of two
 * literal values, in first-party `localStorage`:
 *
 *     pt-analytics = "on" | "off"
 *
 * No identifier, no timestamp, no counter, nothing derived from the visitor.
 * Two visitors who both opt out store byte-identical values, so the preference
 * cannot distinguish them — which is the property that stops a privacy control
 * becoming the tracking it exists to prevent. It is never sent anywhere.
 *
 * ABSENCE IS NOT A CHOICE. A visitor who has never opened the panel has no key,
 * and that state is deliberately distinguishable from "on" — `readChoice`
 * returns `null` rather than defaulting, so the interface can show the real
 * default rather than claiming the visitor picked it.
 */

import { ANALYTICS_ENABLED } from '@/lib/analytics';

export const PRIVACY_STORAGE_KEY = 'pt-analytics';

/** Broadcast so an open panel and any listening gate agree without a reload. */
export const PRIVACY_CHANGE_EVENT = 'pt-privacy-change';

export type AnalyticsChoice = 'on' | 'off';

/**
 * The visitor's explicit choice, or `null` if they have never made one.
 *
 * Every read is wrapped: `localStorage` THROWS rather than returning null in a
 * private window with site data blocked, and an exception here would take the
 * footer down on every page of the site. Unreadable storage is treated as "no
 * choice recorded", which is true.
 */
export function readChoice(): AnalyticsChoice | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(PRIVACY_STORAGE_KEY);
    return v === 'on' || v === 'off' ? v : null;
  } catch {
    return null;
  }
}

/**
 * Record a choice and tell the rest of the page immediately.
 *
 * The event matters: switching to "off" has to stop analytics for the REST OF
 * THIS VISIT, not from the next page load. A listener that only ran on mount
 * would keep sending events until the visitor navigated, which is not what
 * "stop immediately" means.
 */
export function writeChoice(choice: AnalyticsChoice): void {
  try {
    window.localStorage.setItem(PRIVACY_STORAGE_KEY, choice);
  } catch {
    /* Private window with storage blocked: the choice cannot be persisted, so
       it governs this page only. Failing silently is correct — the alternative
       is an error dialog about a privacy control, which is worse than a
       preference that does not survive a reload. */
  }
  window.dispatchEvent(new CustomEvent(PRIVACY_CHANGE_EVENT, { detail: choice }));
}

/**
 * THE SINGLE GATE. Nothing may send an analytics event without passing this.
 *
 * FAIL-CLOSED ON TWO INDEPENDENT CONDITIONS, and both must hold:
 *
 *  1. `ANALYTICS_ENABLED` — the build-level switch in `lib/analytics.ts`. It is
 *     `false` today and no analytics provider is loaded at all, so this returns
 *     false for every visitor regardless of their choice. That is the honest
 *     state of the site and the Cookies and analytics page says so.
 *  2. The visitor has not objected. `off` means off; anything else, including
 *     "never asked", leaves the build-level switch in charge.
 *
 * Checked at CALL TIME rather than captured once, so a visitor who switches the
 * control off mid-visit stops being measured on their next interaction rather
 * than on their next page.
 */
export function analyticsAllowed(): boolean {
  if (!ANALYTICS_ENABLED) return false;
  return readChoice() !== 'off';
}
