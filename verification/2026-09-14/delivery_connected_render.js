/**
 * =============================================================================
 *  DELIVERY_CONNECTED — both branches, proven from the emitted HTML
 * =============================================================================
 *
 * WHY THIS FILE EXISTS. The claim "both branches were rendered and read during
 * verification" was made in three source comments and in commit 0f2324e, and it
 * was true — but it was produced by a scratch script that was never committed.
 * A claim whose evidence cannot be re-run by a later reader is not much better
 * than a claim with no evidence, so the harness is now part of the repository.
 *
 * WHAT IT PROVES, and the distinction matters. It does not read the source and
 * conclude that the right string would be produced. It BUILDS THE SITE and reads
 * the prerendered HTML that Next actually emitted, once per branch. The failure
 * this guards against — a legal page asserting the wrong thing about where
 * personal data goes — happens in the emitted document, so that is where the
 * assertion has to live.
 *
 * For each of the two branches it asserts, on BOTH pages:
 *   - every sentence that branch is supposed to publish is PRESENT, and
 *   - every sentence the OTHER branch would publish is ABSENT.
 *
 * The absence half is what catches a page rendering both, or neither.
 *
 * CONTROL. A passing suite proves nothing unless a broken one fails. After the
 * real run, the harness re-checks the final build against DELIBERATELY INVERTED
 * expectations and requires that to fail. If the control passes, the assertions
 * are not reading what they claim to read, and the whole run is reported invalid
 * regardless of how green it looked.
 *
 * COST. Two full builds, plus a third to restore the tree to the committed
 * state. That is slow and it is the point: anything cheaper would be reading the
 * source rather than the output.
 *
 * SAFETY. The only file mutated is src/content/launch.ts. It is restored from an
 * in-memory copy of its original bytes in a `finally`, and the restoration is
 * verified by SHA-256 against the hash taken before the first mutation. If the
 * hashes do not match, the run FAILS LOUDLY rather than leaving a modified
 * working tree behind a green result.
 */

'use strict';

const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..', '..');
const LAUNCH = path.join(ROOT, 'src', 'content', 'launch.ts');
const PRIVACY_HTML = path.join(ROOT, '.next', 'server', 'app', 'privacy.html');
const SECURITY_HTML = path.join(ROOT, '.next', 'server', 'app', 'security-and-data.html');

/* ------------------------------------------------------------------ the copy */

/*
 * The exact sentences each branch publishes. Taken from the page sources, and
 * deliberately written out here rather than imported or derived: a harness that
 * computes its expectation from the same expression the page uses would pass
 * whatever that expression produced, including the wrong thing. This is the one
 * place duplication is correct — it is an independent statement of intent.
 *
 * Apostrophes: the emitted HTML escapes them as &#x27;, so these strings avoid
 * apostrophes entirely rather than trying to match either form.
 */
const EXPECT = {
  connected: {
    privacy: [
      'Both of those are connected and working today.',
      'All three are in use today.',
    ],
    security: [
      'All three are in use today.',
    ],
  },
  disconnected: {
    privacy: [
      'That is not switched on yet.',
      'Vercel is in use today. Supabase and Resend are not connected yet, so nothing has reached either of them.',
    ],
    security: [
      'Vercel is in use today; Supabase and Resend are not connected yet, so no enquiry data has reached either of them.',
    ],
  },
};

/* -------------------------------------------------------------- the plumbing */

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

/*
 * Next escapes apostrophes and may insert comment markers between adjacent text
 * nodes, so the emitted HTML is normalised before matching. Entities are decoded
 * rather than the expectations being written pre-escaped, because a reader
 * should be able to compare these strings against the page source by eye.
 */
function normalise(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

function setBranch(value) {
  const src = fs.readFileSync(LAUNCH, 'utf8');
  const next = src.replace(
    /export const DELIVERY_CONNECTED: boolean = (?:true|false);/,
    `export const DELIVERY_CONNECTED: boolean = ${value};`,
  );
  if (next === src && !src.includes(`DELIVERY_CONNECTED: boolean = ${value};`)) {
    throw new Error(
      'Could not rewrite DELIVERY_CONNECTED in launch.ts. The declaration has ' +
        'changed shape and this harness can no longer drive it. Fix the regex ' +
        'rather than deleting the check.',
    );
  }
  fs.writeFileSync(LAUNCH, next);
}

function build() {
  execFileSync(
    process.execPath,
    [path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next'), 'build'],
    { cwd: ROOT, stdio: 'pipe' },
  );
}

/* ------------------------------------------------------------- the assertions */

const results = [];

function check(id, description, condition) {
  results.push({ id, description, pass: Boolean(condition) });
}

/**
 * Assert one branch against the two emitted documents.
 *
 * `expected` is the branch that should be live; `forbidden` is the other one.
 * Both are checked on both pages, so a page that renders neither branch fails
 * the present-check and a page that renders both fails the absent-check.
 */
function assertBranch(label, expected, forbidden) {
  const pages = [
    ['privacy', PRIVACY_HTML],
    ['security', SECURITY_HTML],
  ];

  for (const [page, file] of pages) {
    if (!fs.existsSync(file)) {
      check(`${label}.${page}.exists`, `${page}: prerendered HTML exists`, false);
      continue;
    }
    check(`${label}.${page}.exists`, `${page}: prerendered HTML exists`, true);

    const html = normalise(fs.readFileSync(file, 'utf8'));

    for (const [i, sentence] of expected[page].entries()) {
      check(
        `${label}.${page}.present.${i + 1}`,
        `${page}: publishes "${sentence.slice(0, 58)}..."`,
        html.includes(sentence),
      );
    }
    for (const [i, sentence] of forbidden[page].entries()) {
      check(
        `${label}.${page}.absent.${i + 1}`,
        `${page}: does NOT publish "${sentence.slice(0, 46)}..."`,
        !html.includes(sentence),
      );
    }
  }
}

/* -------------------------------------------------------------------- the run */

const originalBytes = fs.readFileSync(LAUNCH);
const originalHash = sha256(LAUNCH);
let controlPassedWhenItShouldNotHave = null;

console.log('DELIVERY_CONNECTED render proof');
console.log('original launch.ts sha256 :', originalHash);
console.log('');

try {
  console.log('building with DELIVERY_CONNECTED = false ...');
  setBranch('false');
  build();
  assertBranch('false', EXPECT.disconnected, EXPECT.connected);

  console.log('building with DELIVERY_CONNECTED = true ...');
  setBranch('true');
  build();
  assertBranch('true', EXPECT.connected, EXPECT.disconnected);

  /*
   * The control. The tree is still built with `true`, so checking it against the
   * `false` expectations MUST fail. If it does not, these assertions are not
   * reading the emitted HTML and every result above is meaningless.
   */
  const before = results.length;
  assertBranch('CONTROL', EXPECT.disconnected, EXPECT.connected);
  const controlResults = results.splice(before);
  const controlFailures = controlResults.filter(r => !r.pass).length;
  controlPassedWhenItShouldNotHave = controlFailures === 0;
  console.log('');
  console.log(
    `control (inverted expectations against the 'true' build): ` +
      `${controlFailures} of ${controlResults.length} failed, as required`,
  );
} finally {
  fs.writeFileSync(LAUNCH, originalBytes);
  const restoredHash = sha256(LAUNCH);
  console.log('restored launch.ts sha256 :', restoredHash);
  if (restoredHash !== originalHash) {
    console.error('');
    console.error('FATAL: launch.ts was NOT restored byte-identically.');
    console.error('The working tree is modified. Restore it before committing.');
    process.exit(2);
  }
  console.log('rebuilding from the restored source ...');
  build();
}

/* ----------------------------------------------------------------- the report */

console.log('');
console.log('='.repeat(64));
for (const r of results) {
  console.log(`  ${r.pass ? 'PASS' : 'FAIL'}  ${r.id}  ${r.description}`);
}
console.log('='.repeat(64));

const failed = results.filter(r => !r.pass).length;
console.log(`Real assertions passed : ${results.length - failed}`);
console.log(`Real assertions failed : ${failed}`);

if (controlPassedWhenItShouldNotHave) {
  console.error('');
  console.error('RESULT: INVALID — the control did not fail.');
  console.error('The assertions are not reading the emitted HTML, so the');
  console.error('passes above prove nothing. Do not trust this run.');
  process.exit(1);
}

if (failed > 0) {
  console.error('');
  console.error('RESULT: FAIL');
  process.exit(1);
}

console.log('Control behaved correctly, so a real failure would have been reported.');
console.log('RESULT: PASS');
