/**
 * Copy helpers for rendering a canonical sentence in a context that needs a
 * different shape from the one it is stored in.
 */

/**
 * Render a stored SENTENCE as a HEADING, without its closing full stop.
 *
 * Founder instruction 2026-09-17: headlines do not end in a full stop. Most
 * headings on this site are literals, so they were simply rewritten. This
 * helper exists for the one case that could not be:
 *
 * `certified.positioningLine` in `src/content/company.ts` is an
 * accreditation-safe sentence taken verbatim from the handoff, and it renders
 * in SEVEN places. Five of them are prose — /ai-engineering, /certifications,
 * /blockchain/smart-contracts-dapps, the `CertifiedHandoff` panel and the LIVE
 * diagram's governance route — where it sits mid-paragraph after another
 * sentence and the full stop is doing its ordinary job. Two of them are
 * headings, on /assurance and /security-and-data.
 *
 * SO THE CANONICAL STRING MUST NOT CHANGE. Editing the full stop out of
 * company.ts would fix two headings and silently produce five run-on sentences
 * in body copy elsewhere — and that string is deliberately imported rather than
 * retyped precisely so that it cannot drift. The difference is presentational
 * and belongs at the point of use, which is what this is.
 *
 * Trailing whitespace is trimmed first so a stored sentence that ends "…. " is
 * still handled, and only a single full stop is removed — an ellipsis or an
 * abbreviation ending in ".." is left alone rather than silently mangled.
 */
export function asHeading(sentence: string): string {
  const text = sentence.trim();
  return text.endsWith('.') && !text.endsWith('..') ? text.slice(0, -1) : text;
}
