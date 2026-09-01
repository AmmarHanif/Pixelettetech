/**
 * ============================================================================
 *  THE SITE-WIDE SEARCH ENGINE SWITCH.  ONE FLAG.  READ THIS BEFORE LAUNCH.
 * ============================================================================
 *
 * While this is `true`:
 *   - every page serves <meta name="robots" content="noindex, nofollow">
 *   - robots.txt disallows every crawler from every path
 *   - the site is INVISIBLE to Google, Bing and every AI answer engine
 *
 * SET IT TO `false` BEFORE GOING LIVE. If it ships as `true`, the site will
 * launch and quietly rank for nothing at all — no error, no warning, no broken
 * page. That failure is silent by nature, which is why it is guarded three ways:
 *
 *   1. `scripts/audit.py` FAILS with a banner while this is true, so the
 *      pre-launch check cannot come back green with the site hidden.
 *   2. `DEPLOY-RUNBOOK.md` step 5 requires flipping it as a named go-live step.
 *   3. This comment.
 *
 * Requested by the founder on 2026-09-01 to keep the site out of the index
 * during development. The engineering advice remains that platform-level
 * Deployment Protection (runbook step 2) is the safer primary control, because
 * a forgotten password wall fails loudly and a forgotten noindex does not. Use
 * both: this flag protects the content, that setting protects the URL.
 */
export const SITE_IN_DEVELOPMENT = true;
