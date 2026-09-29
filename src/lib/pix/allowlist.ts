/**
 * The explicit allowlist of current sources Pix T may be grounded in.
 *
 * WHY AN ALLOWLIST RATHER THAN A DENYLIST. Section 5 asks for the move from
 * "everything we can scrape" to "approved current sources only", and the
 * difference is what happens to something NEW. Under a denylist, a route added
 * next month is indexed unless somebody remembers to exclude it; under an
 * allowlist it is excluded unless somebody decides to include it. The failure
 * mode of the first is silent inclusion of material nobody approved, which is
 * exactly the risk the old-website exclusion exists to prevent.
 *
 * THIS IS A LIST OF FAMILIES, NOT OF PAGES. Listing every page would mean this
 * file fell out of date on the next content change and the guard would start
 * failing for uninteresting reasons, which is how a guard gets switched off.
 * Families are stable: a new page under /engineering is the same category of
 * approved current material as the ones already there, whereas a whole new
 * top-level section is a decision worth making deliberately.
 *
 * THE LEGAL AND POLICY PAGES ARE INCLUDED ON PURPOSE. Privacy, cookies, terms,
 * accessibility and modern slavery are current, approved and published, and a
 * visitor asking "what do you do with my data" deserves the real answer rather
 * than a routing message. They are also exactly the pages where an invented
 * answer would be most damaging, which is an argument for grounding rather than
 * against it.
 */

/** Route families Pix T may ground answers in. */
export const ALLOWED_SOURCE_PREFIXES: readonly string[] = [
  '/', // the homepage itself, matched exactly below
  '/about-us',
  '/accessibility',
  '/ai-automation',
  '/ar-vr-development-services',
  '/assurance',
  '/blockchain',
  '/case-studies',
  '/contact',
  '/cookies',
  '/engineering',
  '/industries',
  '/insights',
  '/method',
  '/modern-slavery',
  '/privacy',
  '/support-continuous-improvement',
  '/terms-conditions',
];

/**
 * Families that may never ground an answer, whatever else is true.
 *
 * Belt and braces against the allowlist being widened carelessly: if a prefix
 * here is ever also matched by the allowlist, exclusion wins. Section 5 names
 * these directly.
 */
export const FORBIDDEN_SOURCE_PREFIXES: readonly string[] = [
  '/archive',
  '/legacy',
  '/old',
  '/deprecated',
  '/held',
  '/insights/archive/', // the index is allowed; the articles beneath it are not
];

export function isAllowedSource(routePath: string): boolean {
  const p = (routePath || '').trim();
  if (!p.startsWith('/')) return false;
  if (FORBIDDEN_SOURCE_PREFIXES.some(f => p === f || p.startsWith(f.endsWith('/') ? f : `${f}/`))) {
    return false;
  }
  if (p === '/') return true;
  return ALLOWED_SOURCE_PREFIXES.some(a => a !== '/' && (p === a || p.startsWith(`${a}/`)));
}
