/**
 * THE PRIVACY INTERLOCK, build-output half: Pix T's lead capture cannot ship
 * ahead of the Privacy Statement that describes it.
 *
 * Founder decision, 29 September 2026: Pix T asks for a name and a work email
 * before chatting, records them, and scores the enquiry that follows. The
 * published Statement says the site runs "no profiling of individual visitors",
 * and a lead score is profiling. The founder approved building it now and
 * drafting the Statement's new wording for him and Legal
 * (PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md), on the footing that nothing goes
 * live until he approves that wording. This file and its twin in next.config.ts
 * make the footing mechanical; both use scripts/privacy-interlock-rules.cjs.
 *
 * It reads the BUILD OUTPUT, as scripts/check-public-output.mjs does, because
 * the promise is about what a visitor can load. Lead capture "ships" if the
 * gate's opening question is in the browser code or any rendered page, OR the
 * scoring rules are in the server output. When it ships, /privacy must carry the
 * approved scoring paragraph (id="pix-t-lead-score") and say nothing the score
 * makes false, and the gate's notice must say the name and email are recorded
 * at once.
 *
 * Chained into `npm run build` after the public-output scan. When the approved
 * wording is published, it passes on its own; nothing here needs editing.
 *
 *     node scripts/check-privacy-interlock.mjs
 *
 * NEXT_OUTPUT_DIR points it at another build, for its own tests, and is obeyed
 * only alongside PIX_T_INTERLOCK_TEST=1: a variable left over in an operator's
 * shell must not quietly send the check to the wrong output.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import url from 'node:url';

const require = createRequire(import.meta.url);
const { LEAD_SCORE_MARKER, GATE_NOTICE_MARKER, SCORING_MARKER, decodeEntities, statementProblems } = require('./privacy-interlock-rules.cjs');

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const NEXT = path.resolve(
  process.env.NEXT_OUTPUT_DIR && process.env.PIX_T_INTERLOCK_TEST === '1'
    ? process.env.NEXT_OUTPUT_DIR
    : path.join(ROOT, '.next'),
);

function fail(message) {
  process.stdout.write(`\nPRIVACY INTERLOCK: ${message}\n`);
  process.exit(1);
}

/* The gate's opening question, read from source so this cannot drift from it.
   Matched only up to the apostrophe, which a minifier may escape. */
const enquirySource = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'pix', 'enquiry.ts'), 'utf8');
const askName = /export const ASK_NAME = "([^"]+)"/.exec(enquirySource)?.[1];
if (!askName) {
  fail('src/lib/pix/enquiry.ts no longer declares ASK_NAME as this check expects. Update the check with it.');
}
const gateMarker = askName.split("'")[0];

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}
const read = file => fs.readFileSync(file, 'utf8');

const staticDir = path.join(NEXT, 'static');
const serverDir = path.join(NEXT, 'server');
const privacyHtml = path.join(serverDir, 'app', 'privacy.html');
if (!fs.existsSync(staticDir) || !fs.existsSync(privacyHtml)) {
  fail(`no build output at ${NEXT} (static/ and server/app/privacy.html). Run next build first.`);
}

const browserCode = [...walk(staticDir)].filter(f => f.endsWith('.js'));
const renderedPages = [...walk(path.join(serverDir, 'app'))].filter(f => /\.(html|rsc)$/.test(f));
const serverCode = [...walk(serverDir)].filter(f => f.endsWith('.js'));

const gateShips = [...browserCode, ...renderedPages].some(f => read(f).includes(gateMarker));
const scoringShips = serverCode.some(f => read(f).includes(SCORING_MARKER));
const leadCaptureShips = gateShips || scoringShips;

/* The Statement as a reader meets it: scripts, tags and React's separators
   gone, entities decoded, so an entity-written soft hyphen cannot split a word.
   The marker must be an attribute of an element on the page, not text inside
   a script or a comment. */
const privacyPage = read(privacyHtml).replace(/<script[\s\S]*?<\/script>/gi, ' ');
const privacyText = decodeEntities(privacyPage.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' '));
const hasMarker = new RegExp(`<[a-z][^<>]*\\sid="${LEAD_SCORE_MARKER}"`, 'i').test(
  privacyPage.replace(/<!--[\s\S]*?-->/g, ' '),
);
const problems = statementProblems(privacyText, hasMarker);
const noticeSaysSo = browserCode.some(f => read(f).includes(GATE_NOTICE_MARKER));

process.stdout.write(
  `privacy interlock     : lead capture ${leadCaptureShips ? 'ships' : 'absent'}` +
    `${leadCaptureShips ? ` (gate ${gateShips ? 'in' : 'not in'} pages, scoring ${scoringShips ? 'in' : 'not in'} server)` : ''}; ` +
    `/privacy ${problems.length ? `not ready (${problems.length} problem${problems.length > 1 ? 's' : ''})` : 'ready'}\n`,
);

if (leadCaptureShips && (problems.length || !noticeSaysSo)) {
  fail(
    'Pix T captures and scores leads, but ' +
      [...problems.map(p => `the Privacy Statement: ${p}`), ...(noticeSaysSo ? [] : [`the notice where the name and email are asked does not say "${GATE_NOTICE_MARKER}"`])].join('; ') +
      '.\n\nFounder decision, 29 September 2026: lead capture does not go live before the\n' +
      'Statement describes it. The wording is drafted for the founder and Legal in\n' +
      'PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md. Publish the approved wording on /privacy;\n' +
      'do not weaken this check.\n',
  );
}
process.stdout.write('privacy interlock passed\n');
