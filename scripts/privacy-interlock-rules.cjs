/**
 * The privacy interlock's rules, in one place.
 *
 * Used by two checks that must never disagree:
 *   - next.config.ts reads the SOURCE on every production build, however the
 *     build is started (a bare `next build` included);
 *   - scripts/check-privacy-interlock.mjs reads the BUILD OUTPUT after
 *     `npm run build`, which is what a visitor would actually load.
 *
 * Founder decision, 29 September 2026: Pix T's lead capture - a name and email
 * recorded before chatting, and a score on the enquiry - does not go live until
 * the Privacy Statement describes it. The published Statement says the site runs
 * "no profiling of individual visitors".
 *
 * WHY A POSITIVE MARKER AS WELL AS A DENY-LIST (security review, 29 September).
 * Looking only for the one old sentence let wordings that are just as false
 * pass: "no profiling or scoring of visitors", "we do not score visitors", the
 * old phrase with a soft hyphen in it. So the Statement must now (1) carry the
 * approved scoring paragraph, marked with id="pix-t-lead-score" on its heading,
 * and (2) say none of the things below anywhere a reader can see, after soft
 * hyphens, zero-width and direction characters are taken out.
 *
 * CommonJS so that next.config.ts and an ES-module script can both load it.
 */

const LEAD_SCORE_MARKER = 'pix-t-lead-score';

/* Statements the lead score makes false, matched on readable text only. Not
   "not scored": the approved wording truly says the contact form's enquiries
   are not scored. */
const DENY = [
  /\bno (profiling|scoring)\b/,
  /\bdo(es)? not (profile|score)\b/,
  /\bdon'?t (profile|score)\b/,
  /\bnever (profiles?|scores?)\b/,
];

/* Soft hyphen, zero-width characters, direction controls, word joiners, BOM. */
const INVISIBLE = new RegExp(
  '[' +
    [0xad, 0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e,
      0x2060, 0x2061, 0x2062, 0x2063, 0x2064, 0x2066, 0x2067, 0x2068, 0x2069, 0xfeff]
      .map(code => String.fromCharCode(code))
      .join('') +
    ']',
  'g',
);

/* The words as a reader meets them: invisible characters gone, spacing and case folded. */
function readable(text) {
  return text.replace(INVISIBLE, '').replace(/\s+/g, ' ').toLowerCase();
}

/**
 * What is wrong with this Statement text for a site that captures leads, as a
 * list of plain sentences; empty when nothing is. `hasMarker` says whether the
 * approved scoring paragraph's marker is present.
 */
function statementProblems(text, hasMarker) {
  const plain = readable(text);
  const problems = [];
  for (const rule of DENY) {
    const found = plain.match(rule);
    if (found) problems.push(`it still says "${found[0]}"`);
  }
  if (!hasMarker) {
    problems.push(`it has no element with id="${LEAD_SCORE_MARKER}", the approved paragraph describing the score`);
  }
  return problems;
}

/* The notice where the name and email are asked must say they are recorded at
   once (security review S5). Checked in the source and in the built code. */
const GATE_NOTICE_MARKER = 'as soon as you give them';

/* A reason phrase only the scoring code contains: its presence in server output
   means scoring ships. */
const SCORING_MARKER = 'Email not at a listed personal provider';

module.exports = { LEAD_SCORE_MARKER, GATE_NOTICE_MARKER, SCORING_MARKER, DENY, readable, statementProblems };
