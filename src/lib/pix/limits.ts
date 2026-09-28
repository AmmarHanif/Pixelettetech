/**
 * Server-side rate limiting, AI-turn quota and the spend circuit breaker.
 *
 * ALL OF IT SERVER-SIDE, AND THAT IS THE WHOLE POINT. Section 22 is explicit:
 * a visitor must not be able to bypass a limit by calling the endpoint
 * directly. Anything enforced in the browser is a suggestion. The front end may
 * mirror these numbers to keep the UI honest, but this module is what decides.
 *
 * ONLY PAID TURNS ARE COUNTED. Sections 8, 19 and 20 all say the same thing
 * from different directions: a deterministic answer costs nothing and must not
 * consume the visitor's allowance. So `consumeAiTurn` is called by the gateway
 * AFTER it has decided a model is actually needed, never on the way in. A
 * visitor can ask Pix T forty factual questions about Pixelette and still have
 * eight AI turns left, which is the intended behaviour and not a loophole.
 *
 * IN-MEMORY, AND THAT IS A STATED LIMITATION RATHER THAN A DESIGN CLAIM.
 * The store below lives in one server process. On a single instance it is
 * correct. Across several instances each keeps its own counters, so the
 * effective limit multiplies by the instance count - which understates
 * protection rather than overstating it, but is still wrong. Phase 1 is
 * architecture, so the seam is what matters: every read and write goes through
 * LimitStore, and swapping it for a shared store is one implementation, not a
 * rewrite. DO NOT SHIP PAID INFERENCE ON MULTIPLE INSTANCES WITHOUT REPLACING
 * IT - that is recorded here because it is the kind of thing that is obvious
 * now and invisible in six months.
 */

import { PIX_T } from './config';

export type Decision =
  | { allowed: true }
  | { allowed: false; reason: LimitReason; retryAfterMs?: number; remaining?: number };

export type LimitReason =
  | 'cooldown'
  | 'per-minute'
  | 'per-hour'
  | 'ai-turns-exhausted'
  | 'budget-exhausted'
  | 'circuit-open';

type Bucket = {
  lastRequestAt: number;
  minute: { windowStart: number; count: number };
  hour: { windowStart: number; count: number };
  aiTurns: { windowStart: number; count: number };
  verified: boolean;
  spend: number;
  touchedAt: number;
};

/**
 * The seam. One process, one map; replace this to go multi-instance.
 */
class LimitStore {
  private buckets = new Map<string, Bucket>();

  get(id: string, now: number): Bucket {
    let b = this.buckets.get(id);
    if (!b) {
      b = {
        lastRequestAt: 0,
        minute: { windowStart: now, count: 0 },
        hour: { windowStart: now, count: 0 },
        aiTurns: { windowStart: now, count: 0 },
        verified: false,
        spend: 0,
        touchedAt: now,
      };
      this.buckets.set(id, b);
    }
    b.touchedAt = now;
    return b;
  }

  /** Section 47: anonymous state is short-lived. Swept on access, not on a timer. */
  sweep(now: number): void {
    const ttl = PIX_T.sessionTtlMs;
    for (const [k, v] of this.buckets) {
      if (now - v.touchedAt > ttl) this.buckets.delete(k);
    }
  }

  /** Test seam only. */
  reset(): void {
    this.buckets.clear();
  }
}

const store = new LimitStore();

/** Global spend and provider health, separate from any one visitor. */
const global = {
  daySpend: 0,
  dayStart: 0,
  hourSpend: 0,
  hourStart: 0,
  tier3DaySpend: 0,
  consecutiveProviderErrors: 0,
  breakerOpenUntil: 0,
};

function rollWindow(w: { windowStart: number; count: number }, now: number, ms: number) {
  if (now - w.windowStart >= ms) {
    w.windowStart = now;
    w.count = 0;
  }
}

/**
 * May this visitor make a request at all? Applies to every turn, paid or not,
 * because the cheap path still costs a server round trip and is still a way to
 * hammer the endpoint.
 */
export function checkRate(sessionId: string, now = Date.now()): Decision {
  store.sweep(now);
  const b = store.get(sessionId, now);

  const since = now - b.lastRequestAt;
  if (b.lastRequestAt !== 0 && since < PIX_T.requestCooldownMs) {
    return { allowed: false, reason: 'cooldown', retryAfterMs: PIX_T.requestCooldownMs - since };
  }

  rollWindow(b.minute, now, 60_000);
  rollWindow(b.hour, now, 3_600_000);

  if (b.minute.count >= PIX_T.perMinuteLimit) {
    return { allowed: false, reason: 'per-minute', retryAfterMs: 60_000 - (now - b.minute.windowStart) };
  }
  if (b.hour.count >= PIX_T.perHourLimit) {
    return { allowed: false, reason: 'per-hour', retryAfterMs: 3_600_000 - (now - b.hour.windowStart) };
  }

  b.lastRequestAt = now;
  b.minute.count += 1;
  b.hour.count += 1;
  return { allowed: true };
}

/** How many paid turns this visitor has left in the rolling window. */
export function aiTurnsRemaining(sessionId: string, now = Date.now()): number {
  const b = store.get(sessionId, now);
  rollWindow(b.aiTurns, now, PIX_T.allowanceWindowHours * 3_600_000);
  const allowance = b.verified ? PIX_T.verifiedAiTurns : PIX_T.anonymousAiTurns;
  return Math.max(0, allowance - b.aiTurns.count);
}

/**
 * Called only once the gateway has decided a model is genuinely needed.
 * Deterministic answers never reach this function.
 */
export function consumeAiTurn(sessionId: string, now = Date.now()): Decision {
  const b = store.get(sessionId, now);
  rollWindow(b.aiTurns, now, PIX_T.allowanceWindowHours * 3_600_000);
  const allowance = b.verified ? PIX_T.verifiedAiTurns : PIX_T.anonymousAiTurns;
  if (b.aiTurns.count >= allowance) {
    return { allowed: false, reason: 'ai-turns-exhausted', remaining: 0 };
  }
  b.aiTurns.count += 1;
  return { allowed: true };
}

/** Section 45: verification extends the allowance; it is not marketing consent. */
export function markVerified(sessionId: string, now = Date.now()): void {
  store.get(sessionId, now).verified = true;
}

/**
 * The circuit breaker, section 38.
 *
 * FAILS TOWARDS TIER 1, NEVER TOWARDS SPENDING. Every condition here - budget
 * reached, repeated provider errors, accounting unavailable - resolves to "do
 * not call the paid model", and the caller falls back to the deterministic
 * assistant, which always works. The website never depends on a paid model to
 * answer a basic question.
 */
export function checkBudget(sessionId: string, tier: 2 | 3, now = Date.now()): Decision {
  if (now < global.breakerOpenUntil) {
    return { allowed: false, reason: 'circuit-open', retryAfterMs: global.breakerOpenUntil - now };
  }
  if (now - global.dayStart >= 86_400_000) {
    global.dayStart = now;
    global.daySpend = 0;
    global.tier3DaySpend = 0;
  }
  if (now - global.hourStart >= 3_600_000) {
    global.hourStart = now;
    global.hourSpend = 0;
  }

  // Zero budget means unconfigured, which means no paid inference at all.
  if (PIX_T.dailyBudget <= 0) return { allowed: false, reason: 'budget-exhausted' };
  if (global.daySpend >= PIX_T.dailyBudget) return { allowed: false, reason: 'budget-exhausted' };
  if (PIX_T.hourlyBudget > 0 && global.hourSpend >= PIX_T.hourlyBudget) {
    return { allowed: false, reason: 'budget-exhausted' };
  }
  if (tier === 3 && PIX_T.tier3DailyBudget > 0 && global.tier3DaySpend >= PIX_T.tier3DailyBudget) {
    return { allowed: false, reason: 'budget-exhausted' };
  }
  const b = store.get(sessionId, now);
  if (PIX_T.sessionBudget > 0 && b.spend >= PIX_T.sessionBudget) {
    return { allowed: false, reason: 'budget-exhausted' };
  }
  return { allowed: true };
}

export function recordSpend(sessionId: string, tier: 2 | 3, cost: number, now = Date.now()): void {
  global.daySpend += cost;
  global.hourSpend += cost;
  if (tier === 3) global.tier3DaySpend += cost;
  store.get(sessionId, now).spend += cost;
}

export function recordProviderOutcome(ok: boolean, now = Date.now()): void {
  if (ok) {
    global.consecutiveProviderErrors = 0;
    return;
  }
  global.consecutiveProviderErrors += 1;
  if (global.consecutiveProviderErrors >= PIX_T.providerErrorThreshold) {
    global.breakerOpenUntil = now + PIX_T.circuitBreakerCooloffMs;
    global.consecutiveProviderErrors = 0;
  }
}

/** Test seam. Not exported through the gateway. */
export function __resetLimitsForTest(): void {
  store.reset();
  global.daySpend = 0;
  global.dayStart = 0;
  global.hourSpend = 0;
  global.hourStart = 0;
  global.tier3DaySpend = 0;
  global.consecutiveProviderErrors = 0;
  global.breakerOpenUntil = 0;
}
