import { createHash } from 'node:crypto';

/**
 * Rate limits for Pix T's two server actions (security review S3, 29 September
 * 2026).
 *
 * THE PROBLEM. `startAssistantChat` records a name and an email before any
 * enquiry exists, needs no login, and sends nobody an email. A script calling it
 * in a loop - the review ran 500 calls and got 500 rows - fills the table with
 * third parties' details, and nothing tells anyone it happened.
 *
 * WHAT THIS DOES. Counts calls per client connection in fixed windows and
 * refuses the excess. A person never comes near the limits: one chat start and
 * one enquiry is the normal visit, and the ceilings allow several dozen.
 *
 * THE CONNECTION ADDRESS IS HELD ONLY HERE, HASHED, IN MEMORY, FOR A DAY AT
 * MOST. It is never stored, logged or sent anywhere. That keeps the Privacy
 * Statement's promise that no IP address is recorded with an enquiry, and it
 * falls under the purpose the Statement already names: preventing abuse of the
 * form.
 *
 * IN-MEMORY, AS src/lib/pix/limits.ts IS, WITH THE SAME STATED LIMITATION: each
 * server instance counts on its own, so across several the ceiling multiplies.
 * It raises the cost of a flood; it does not end it. The host's firewall is the
 * stronger control, and that is a setting outside this repository.
 *
 * SERVER ONLY. Its one caller is src/app/contact/actions.ts.
 */

if (typeof window !== 'undefined') {
  throw new Error('src/lib/action-limits.ts was evaluated in a browser. It is server-only.');
}

export type LimitedAction = 'chat-start' | 'assistant-enquiry';

type Window = { ms: number; max: number };

/* Per connection. Generous for people, tight for scripts. */
const LIMITS: Record<LimitedAction, Window[]> = {
  'chat-start': [
    { ms: 10 * 60 * 1000, max: 10 },
    { ms: 24 * 60 * 60 * 1000, max: 30 },
  ],
  'assistant-enquiry': [
    { ms: 60 * 60 * 1000, max: 10 },
    { ms: 24 * 60 * 60 * 1000, max: 30 },
  ],
};

type Count = { windowStart: number; count: number };
const counts = new Map<string, Count>();
const DAY = 24 * 60 * 60 * 1000;

/**
 * The key for a request, from the address the host puts in front of it: a
 * short hash, so the address itself is not what sits in memory. `null` when the
 * request carries no address, which a real request through the host always
 * does.
 */
export function clientKey(headers: Headers): string | null {
  const address = (headers.get('x-real-ip') ?? headers.get('x-forwarded-for')?.split(',')[0] ?? '').trim();
  if (!address) return null;
  return createHash('sha256').update(address).digest('hex').slice(0, 16);
}

/** Whether this call may go ahead; counts it if so. */
export function allowAction(action: LimitedAction, key: string, now = Date.now()): boolean {
  if (counts.size > 10000) {
    for (const [k, c] of counts) if (now - c.windowStart > DAY) counts.delete(k);
  }
  const windows = LIMITS[action].map((w, i) => {
    const id = `${action}:${i}:${key}`;
    const c = counts.get(id);
    return { id, w, c: c && now - c.windowStart < w.ms ? c : { windowStart: now, count: 0 } };
  });
  if (windows.some(({ w, c }) => c.count >= w.max)) return false;
  for (const { id, c } of windows) counts.set(id, { windowStart: c.windowStart, count: c.count + 1 });
  return true;
}

export function __resetActionLimitsForTest(): void {
  counts.clear();
}
