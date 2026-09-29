/**
 * THE PRIVACY INTERLOCK: Pix T's lead capture cannot ship ahead of the Privacy
 * Statement that describes it.
 *
 * Founder decision, 29 September 2026: Pix T asks for a name and a work email
 * before chatting, records them, and scores the enquiry that follows. The
 * published Statement says the site runs "no profiling of individual visitors",
 * and a lead score is profiling. The founder approved building it now and
 * drafting the Statement's new wording for him and Legal
 * (PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md), on the footing that nothing goes
 * live until he approves that wording. This file makes the footing mechanical.
 *
 * It reads the BUILD OUTPUT, as scripts/check-public-output.mjs does, because
 * the promise is about what a visitor can load: the gate's opening question in
 * the browser code, and the sentence on the rendered /privacy page. It fails
 * while both are true, and also if the old sentence has gone without a
 * description of the score taking its place.
 *
 * Chained into `npm run build` after the public-output scan. When the approved
 * wording is published, it passes on its own; nothing here needs editing.
 *
 *     node scripts/check-privacy-interlock.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const NEXT = path.resolve(process.env.NEXT_OUTPUT_DIR || path.join(ROOT, '.next'));

function fail(message) {
  process.stdout.write(`\nPRIVACY INTERLOCK: ${message}\n`);
  process.exit(1);
}

/* The gate's opening question, read from source so this cannot drift from it.
   Matched in the build only up to the apostrophe, which a minifier may escape. */
const enquirySource = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'pix', 'enquiry.ts'), 'utf8');
const askName = /export const ASK_NAME = "([^"]+)"/.exec(enquirySource)?.[1];
if (!askName) {
  fail('src/lib/pix/enquiry.ts no longer declares ASK_NAME as this check expects. Update the check with it.');
}
const marker = askName.split("'")[0];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const staticDir = path.join(NEXT, 'static');
const privacyHtml = path.join(NEXT, 'server', 'app', 'privacy.html');
if (!fs.existsSync(staticDir) || !fs.existsSync(privacyHtml)) {
  fail(`no build output at ${NEXT} (static/ and server/app/privacy.html). Run next build first.`);
}

const gateShips = [...walk(staticDir)]
  .filter(file => file.endsWith('.js'))
  .some(file => fs.readFileSync(file, 'utf8').includes(marker));

/* The page as a reader sees it: tags, React's text separators and entities
   gone, whitespace collapsed. */
const privacy = fs
  .readFileSync(privacyHtml, 'utf8')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<!-- -->/g, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .toLowerCase();
const saysNoProfiling = privacy.includes('no profiling of individual visitors');
const describesScore = /\bscor(e|es|ed|ing)\b/.test(privacy);

process.stdout.write(
  `privacy interlock     : Pix T lead gate ${gateShips ? 'ships' : 'absent'}; ` +
    `/privacy ${saysNoProfiling ? 'still says no profiling' : 'no longer says no profiling'}, ` +
    `${describesScore ? 'describes' : 'does not describe'} a score\n`,
);

if (gateShips && (saysNoProfiling || !describesScore)) {
  fail(
    'Pix T asks for a name and email and scores the enquiry, but the Privacy Statement\n' +
      (saysNoProfiling
        ? 'still says the site runs "no profiling of individual visitors".\n'
        : 'does not describe the score.\n') +
      '\nFounder decision, 29 September 2026: lead capture does not go live before the\n' +
      'Statement describes it. The wording is drafted for the founder and Legal in\n' +
      'PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md. Publish the approved wording on /privacy;\n' +
      'do not weaken this check.\n',
  );
}
process.stdout.write('privacy interlock passed\n');
