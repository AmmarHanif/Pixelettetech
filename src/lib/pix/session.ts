/**
 * A first-party anonymous session identifier for Pix T.
 *
 * WHAT IT IS: a random opaque value in a first-party, HttpOnly, SameSite=Lax
 * cookie, used to attach rate limits and an AI-turn allowance to one browser
 * for a short period. Nothing else.
 *
 * WHAT IT DELIBERATELY IS NOT. Section 23 rules out invasive fingerprinting and
 * unnecessary personal data, so this derives nothing from the visitor: no
 * canvas, no fonts, no user-agent hashing, no IP hashing. It carries no
 * meaning, identifies no person, and survives only as long as the allowance
 * window it exists to enforce.
 *
 * WHY NOT IP. Section 23 again, and it is worth stating plainly because IP is
 * the obvious shortcut: a corporate office shares one address between hundreds
 * of people, so the eighth question from one building would exhaust an
 * allowance for everyone in it, while a mobile visitor can change address
 * between questions and reset their own. IP is both too strict and too loose.
 *
 * AND WHY THAT IS NOT A BYPASS. A cookie can be cleared, so a determined
 * visitor can get a fresh allowance. That is accepted: the allowance exists to
 * keep costs sane against ordinary use, and it is the rate limit and the spend
 * circuit breaker - neither of which depends on this value - that stop abuse.
 * Trying to make the identifier unforgeable would mean fingerprinting, which
 * the brief forbids and which would trade a privacy harm for a small cost
 * saving.
 */

import { randomBytes } from 'node:crypto';

import { PIX_T } from './config';

export const SESSION_COOKIE = 'pix_t_sid';

/** Opaque, unguessable, and carrying nothing about the visitor. */
export function newSessionId(): string {
  return randomBytes(16).toString('base64url');
}

/**
 * The identifier is accepted only if it looks like one we issued. A tampered or
 * attacker-chosen value would otherwise let someone select a bucket - section
 * 68 lists identifier tampering explicitly - so anything unexpected is replaced
 * rather than trusted.
 */
const VALID = /^[A-Za-z0-9_-]{22}$/;

export function readSessionId(request: Request): { sessionId: string; isNew: boolean } {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === SESSION_COOKIE) {
      const v = rest.join('=');
      if (VALID.test(v)) return { sessionId: v, isNew: false };
      break;
    }
  }
  return { sessionId: newSessionId(), isNew: true };
}

/**
 * HttpOnly so client JavaScript cannot read or forge it; SameSite=Lax so it is
 * not sent from third-party contexts; Secure in production. Max-Age matches the
 * allowance window rather than outliving it, which is section 47's requirement
 * that anonymous state be short-lived.
 */
export function sessionCookie(id: string): string {
  const maxAge = Math.round(PIX_T.allowanceWindowHours * 3600);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${id}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
}
