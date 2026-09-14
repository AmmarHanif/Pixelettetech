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

/**
 * ============================================================================
 *  IS THE CONTACT FORM'S DELIVERY PATH ACTUALLY CONNECTED?  ONE FLAG.
 * ============================================================================
 *
 * Set this to `true` only when all four of `SUPABASE_URL`,
 * `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` and `CONTACT_NOTIFICATION_FROM`
 * are set in the production environment AND a real submission has been seen to
 * land. Variable names only; no value belongs in this repository.
 *
 * WHAT IT CHANGES. Two published legal pages, in three places:
 *   - /privacy, the "what happens to your enquiry" section
 *   - /privacy, the recipients section (Article 13(1)(e))
 *   - /security-and-data, the subprocessor state line
 *
 * While it is `false`, all three say the path is not connected and that a
 * submission today returns an error. The day the accounts exist, all three
 * become false statements about where personal data goes, on the one page whose
 * entire job is to state that accurately.
 *
 * MOVED HERE 2026-09-14, and the move IS the fix. This started as two separate
 * constants, one in each page, each carrying a comment telling the reader to
 * remember the other. Both files recorded the same debt in the same words —
 * "one shared constant in src/content/ is the right home and is recorded as
 * owed" — because those two files were the whole of the authorised scope for
 * the change that introduced them. The failure mode that duplication invites is
 * specific and bad: flip one, miss the other, and the two legal pages then
 * CONTRADICT EACH OTHER about whether personal data is being stored. There is
 * no way to notice from either page alone. One constant cannot half-flip.
 *
 * DELIBERATELY NOT READ FROM `process.env`, and this is a measured decision
 * rather than a preference. Both pages are statically prerendered (`○ (Static)`
 * in the build output), so an environment read resolves when the build runs.
 * Setting the variables in the hosting dashboard WITHOUT a redeploy would leave
 * both notices stale, confident and wrong — with no diff and no date, so a data
 * subject asking what was disclosed and when would have no answer and neither
 * would we. An editorial constant produces a dated, reviewable change instead.
 * It also avoids turning a published page into an oracle for whether a
 * credential is set, and avoids the four half-set states the variables can hold.
 *
 * THE DIRECTION OF ERROR IS DELIBERATE. Switching the path on is four values
 * pasted into a dashboard: no code review, no diff, no publication step. Written
 * this way, forgetting this flag means the pages UNDERSTATE what the firm does.
 * The opposite design — copy that only becomes true when somebody remembers to
 * rewrite it — means personal data starts being stored overseas with nothing
 * published about it at all.
 *
 * Typed `boolean` rather than left to infer the literal `false`, matching
 * `ANALYTICS_ENABLED` in src/lib/analytics.ts, so the other branch is not
 * treated as dead code and both keep type-checking.
 *
 * Both branches are proven to render, on both pages, by
 * `verification/2026-09-14/delivery_connected_render.js`, which builds the site
 * once per branch and reads the prerendered HTML rather than trusting the
 * source. Run it after changing this line.
 */
export const DELIVERY_CONNECTED: boolean = false;
