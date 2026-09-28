/**
 * Pix T operational configuration, in one place.
 *
 * WHY ONE FILE. The brief's section 70 asks for this directly, and the reason is
 * that a limit written into the component that enforces it cannot be reviewed
 * without reading the component. Every number Pix T is governed by is here, with
 * the environment variable that overrides it, so the whole operating envelope
 * can be read in one screen and changed without a deploy of new logic.
 *
 * NO SECRET IS READ HERE AND NONE EVER SHOULD BE. This module is imported by
 * code that runs on the server only, but it is the sort of file that gets
 * imported from a client component by accident, so it holds limits and model
 * NAMES and nothing else. API keys are read at the point of use, server-side,
 * and never pass through configuration that something else might log.
 *
 * MONEY IS NOT HARD-CODED. Section 37 is explicit that budget figures must not
 * live in application logic; they arrive as environment values, and the
 * defaults below are deliberately ZERO so that an unconfigured deployment
 * cannot spend anything at all. A missing budget must mean "no paid inference",
 * never "unlimited".
 */

import { PIX_T_DESCRIPTOR, PIX_T_NAME } from './branding';

/** Read a positive number from the environment, falling back to a default. */
function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function str(name: string, fallback: string): string {
  const raw = process.env[name];
  return raw === undefined || raw === '' ? fallback : raw;
}

export const PIX_T = {
  /* The customer-facing name comes from branding.ts, which is client-safe.
     This module reads process.env and must never reach the browser bundle. */
  name: PIX_T_NAME,
  descriptor: PIX_T_DESCRIPTOR,

  /* ---------------------------------------------------------- allowances --
     Section 19 and 20. Deterministic answers do not count against either of
     these: only a turn that actually invokes a model does. */
  anonymousAiTurns: num('PIX_T_ANONYMOUS_AI_TURNS', 8),
  verifiedAiTurns: num('PIX_T_VERIFIED_AI_TURNS', 20),
  /** Show the remaining-turns hint only once the visitor is close to the end. */
  turnsRemainingHintAt: num('PIX_T_TURNS_HINT_AT', 2),
  allowanceWindowHours: num('PIX_T_ALLOWANCE_WINDOW_HOURS', 24),

  /* --------------------------------------------------------------- input --
     Section 24. Pix T is a pre-sales agent, not a document-analysis service. */
  messageMaxChars: num('PIX_T_MESSAGE_MAX_CHARS', 2000),

  /* -------------------------------------------------------------- output --
     Section 25. Targets are for the prompt; the cap is enforced in code,
     because a model asked politely for 180 words will sometimes write 900. */
  normalOutputTokenLimit: num('PIX_T_NORMAL_OUTPUT_TOKENS', 320),
  complexOutputTokenLimit: num('PIX_T_COMPLEX_OUTPUT_TOKENS', 700),

  /* ---------------------------------------------------------------- rate --
     Section 22. Server-side; the front end may mirror it for a tidy UI but is
     never the thing that enforces it. */
  requestCooldownMs: num('PIX_T_REQUEST_COOLDOWN_MS', 6000),
  perMinuteLimit: num('PIX_T_PER_MINUTE_LIMIT', 8),
  perHourLimit: num('PIX_T_PER_HOUR_LIMIT', 40),

  /* -------------------------------------------------------------- context --
     Section 39. Each part of the prompt is bounded separately so one of them
     growing cannot quietly consume the budget of the others. */
  sessionRecentTurns: num('PIX_T_RECENT_TURNS', 6),
  sessionSummaryMaxChars: num('PIX_T_SESSION_SUMMARY_CHARS', 800),
  retrievedPassages: num('PIX_T_RETRIEVED_PASSAGES', 4),
  retrievedPassageMaxChars: num('PIX_T_PASSAGE_CHARS', 700),

  /* --------------------------------------------------------------- models --
     Section 11 and 34. NAMES only, and no provider is implied by them. An
     empty value means the tier is not configured, which means it does not run. */
  tier2Model: str('PIX_T_TIER2_MODEL', ''),
  tier3Model: str('PIX_T_TIER3_MODEL', ''),
  providerTimeoutMs: num('PIX_T_PROVIDER_TIMEOUT_MS', 12000),

  /* -------------------------------------------------------------- budgets --
     Section 37. ZERO BY DEFAULT, ON PURPOSE. An unconfigured deployment must
     not be able to spend: a missing budget means no paid inference, never
     unlimited. Units are whatever currency the operator configures; nothing
     here assumes one. */
  dailyBudget: num('PIX_T_DAILY_BUDGET', 0),
  hourlyBudget: num('PIX_T_HOURLY_BUDGET', 0),
  sessionBudget: num('PIX_T_SESSION_BUDGET', 0),
  tier3DailyBudget: num('PIX_T_TIER3_DAILY_BUDGET', 0),

  /* ------------------------------------------------------ circuit breaker --
     Section 38. */
  providerErrorThreshold: num('PIX_T_PROVIDER_ERROR_THRESHOLD', 5),
  circuitBreakerCooloffMs: num('PIX_T_BREAKER_COOLOFF_MS', 10 * 60 * 1000),

  /* ------------------------------------------------------------ retention --
     Section 47. Anonymous conversation state is short-lived by design. */
  sessionTtlMs: num('PIX_T_SESSION_TTL_MS', 60 * 60 * 1000),
} as const;

/**
 * Is paid inference permitted to run at all right now?
 *
 * THREE THINGS MUST ALL BE TRUE, and the default state of a fresh deployment
 * fails all three: a model must be named, a budget must be set above zero, and
 * the provider must be explicitly enabled. Section 33 authorises paid inference
 * IN PRINCIPLE while forbidding provisioning, credentials and live cost, and
 * this is where that distinction is enforced rather than remembered.
 */
export function paidInferenceConfigured(): boolean {
  return (
    process.env.PIX_T_PROVIDER_ENABLED === 'true' &&
    PIX_T.tier2Model !== '' &&
    PIX_T.dailyBudget > 0
  );
}
