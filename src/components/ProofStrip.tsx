import Link from 'next/link';

import type { Claim } from '@/content/claims';

/**
 * The proof strip.
 *
 * Implements the handoff's DEVELOPER RULE for section 02 (Verified proof):
 * "Build the proof component so cards/badges can be switched on individually.
 * The absence of a badge must not leave a broken layout. The first public
 * release can be strong with client work + case studies alone."
 *
 * Two properties follow from that rule and both are enforced here rather than
 * left to the caller:
 *
 *  1. Only VERIFIED claims render. HELD and NOT_PUBLISHED are dropped, and they
 *     are dropped silently — no greyed-out badge, no "coming soon", nothing a
 *     reader could mistake for a claim we are almost entitled to make.
 *  2. At zero verified claims the component returns `null`. Not an empty
 *     bordered box, not an orphan heading, not a grid with no cells. The
 *     heading and the surrounding markup live INSIDE the guard precisely so a
 *     first release with no verified badge at all still reads as a finished
 *     page rather than a broken one.
 *
 * No claim data is held here. `Claim` and the register itself live in
 * `src/content/claims.ts`, and its `publishedClaims()` helper already does the
 * same filtering at source. This component filters a second time on purpose: a
 * proof surface that trusts its input is one refactor away from rendering a
 * held claim, and the cost of the duplicate check is a single predicate.
 */

/**
 * A register row, plus the optional presentation fields a badge can use. Every
 * addition is optional, so `Claim[]` — and therefore `publishedClaims()` —
 * passes straight in with no adapter.
 */
export type ProofClaim = Claim & {
  /** One line of substantiation, shown under the label where present. */
  detail?: string;
  /** Where a reader can check it for themselves. */
  verifyUrl?: string;
  /** What that link is, e.g. "IASME register". */
  verifyLabel?: string;
};

/**
 * The publishable subset. Exported because the zero case is the interesting
 * one and it should be assertable without rendering.
 */
export function verifiedClaims(claims: readonly ProofClaim[]): ProofClaim[] {
  return claims.filter(claim => claim.status === 'VERIFIED');
}

export function ProofStrip({
  claims,
  /** Optional label above the row. Suppressed entirely when nothing renders. */
  heading,
  /** Optional line beneath the row, e.g. what the evidence gate covers. */
  note,
}: {
  claims: readonly ProofClaim[];
  heading?: string;
  note?: string;
}) {
  const published = verifiedClaims(claims);

  // The whole point of the component. Nothing verified, nothing rendered — no
  // wrapper, no heading, no note, no residual margin.
  if (published.length === 0) return null;

  return (
    <div className="clientrow">
      {heading ? (
        <span className="clientrow__label mono" id="proof-heading">
          {heading}
        </span>
      ) : null}

      <ul className="clientrow__list" aria-label={heading ?? 'Verified proof'}>
        {published.map(claim => (
          <li key={claim.id}>
            {claim.label}
            {claim.detail ? (
              <span className="small" style={{ display: 'block', fontSize: 12.5 }}>
                {claim.detail}
              </span>
            ) : null}
            {claim.verifyUrl ? (
              <span className="small" style={{ display: 'block', fontSize: 12.5 }}>
                {claim.verifyUrl.startsWith('/') ? (
                  <Link href={claim.verifyUrl}>{claim.verifyLabel ?? 'Verify'}</Link>
                ) : (
                  <a href={claim.verifyUrl} target="_blank" rel="noopener noreferrer">
                    {claim.verifyLabel ?? 'Verify'}
                  </a>
                )}
              </span>
            ) : null}
          </li>
        ))}
      </ul>

      {note ? (
        <p className="src" style={{ flexBasis: '100%', marginTop: 10 }}>
          {note}
        </p>
      ) : null}
    </div>
  );
}
