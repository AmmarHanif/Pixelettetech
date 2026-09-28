/**
 * The Pix T server endpoint.
 *
 * THE BROWSER TALKS TO THIS, NEVER TO A MODEL PROVIDER. Section 35 requires it
 * and the reason is simple: a key that reaches the browser is a published key.
 * Nothing in this route reads a credential either - the provider boundary does
 * that at the point of use, server-side, if and when one is ever configured.
 *
 * THE LIMITS ARE HERE BECAUSE THIS IS WHERE THEY CANNOT BE BYPASSED. Section 22
 * says a malicious visitor must not get round a limit by calling the endpoint
 * directly, so the gateway - which owns rate, quota and budget - is the only
 * path to an answer. The UI may show a countdown; this decides one.
 *
 * TELEMETRY NEVER LEAVES THE SERVER. The gateway returns operational metadata
 * with every reply: tier, tokens, cost, latency, escalation reason. That is for
 * section 61's observability and it is stripped here, deliberately and in one
 * place, so a future field cannot leak to the browser by being forgotten.
 */

import { NextResponse } from 'next/server';

import { handle } from '@/lib/pix/gateway';
import { PIX_T } from '@/lib/pix/config';
import { readSessionId, sessionCookie } from '@/lib/pix/session';

export const runtime = 'nodejs';
/** Limits are per-process state; a cached response would serve someone else's. */
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  const { message, pagePath } = (body ?? {}) as { message?: unknown; pagePath?: unknown };
  if (typeof message !== 'string') {
    return NextResponse.json({ error: 'bad-request' }, { status: 400 });
  }

  // Oversize is rejected before anything parses it further (section 68).
  if (message.length > PIX_T.messageMaxChars * 2) {
    return NextResponse.json({ error: 'too-large' }, { status: 413 });
  }

  const { sessionId, isNew } = readSessionId(request);

  const reply = await handle({
    sessionId,
    message,
    pagePath: typeof pagePath === 'string' ? pagePath : undefined,
  });

  /*
   * One place where the internal half is removed. Everything the browser is
   * allowed to see is named explicitly rather than spread from the reply, so a
   * field added to Telemetry later cannot reach a visitor by omission.
   */
  const { telemetry, ...pub } = reply;
  void telemetry; // recorded by the observability sink; never returned.

  const res = NextResponse.json({
    text: pub.text,
    path: pub.path,
    sourceLabel: pub.sourceLabel,
    via: pub.via,
    aiTurnsRemaining: pub.aiTurnsRemaining,
    assistant: PIX_T.name,
  });

  if (isNew) res.headers.append('Set-Cookie', sessionCookie(sessionId));
  return res;
}

/** A GET is not part of the contract; saying so is cheaper than a stack trace. */
export async function GET() {
  return NextResponse.json({ error: 'method-not-allowed' }, { status: 405 });
}
