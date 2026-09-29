/**
 * Fails the build if the claims register, the case-study evidence notes, or the
 * unpublished rows of the company record reach anything a visitor can download.
 *
 * THE INCIDENT THIS EXISTS FOR. From 24 to 28 September 2026 the site assistant
 * imported the claims register and the company record into browser code, and
 * every page shipped the whole of both: each HELD claim with its hold
 * instruction, every internal evidence note, the certification rows the site
 * deliberately does not publish. Nothing failed. `tsc` was clean, the build was
 * clean and every page rendered correctly - the leak was in what the pages
 * carried, not in what they showed.
 *
 * SO THIS CHECKS THE OUTPUT, NOT THE CODE. Whatever route internal text takes -
 * an import, a shared chunk, a prop that serialises a whole row, a note pasted
 * into a page - it arrives as text, and text can be searched. scripts/test-pix.cjs
 * walks the import graph, which is the usual cause; this checks the result.
 *
 * WHAT IS SEARCHED: everything a visitor can fetch that the build produces or
 * serves - .next/static (browser assets), every prerendered page under
 * .next/server/app (.html, .rsc payloads, .body route output), the 404 and 500
 * pages under .next/server/pages, and public/ (the web root). NOT the server
 * bundles, which run on the server and legitimately contain every register.
 * Routes rendered per request have no build output and CANNOT be checked here;
 * they are listed on every run rather than silently passed.
 *
 * HOW. Two kinds of evidence, both read from the source files on every run so
 * they cannot go stale:
 *   - FIELD NAMES only the internal records use. Minifiers keep property names,
 *     so a bundled register always carries them, whatever else changes.
 *   - COVERAGE of each internal text. Every note, instruction and withheld
 *     label is cut into 32-character windows of plain text, and a file fails if
 *     it contains at least half of any one text's windows. A leaked note matches
 *     close to all of them; the site quoting a sentence that a note also quotes
 *     matches a small fraction (11% at most when this was written). One pass
 *     with a rolling hash, so the cost does not grow with the number of notes.
 * Hits are reported by source - file, row, field - and never by printing the
 * text, so a failing build log does not become a copy of the register.
 *
 *     node scripts/check-public-output.mjs            (npm run build runs it)
 *     NEXT_OUTPUT_DIR=<dir> node scripts/check-public-output.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import ts from 'typescript';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const NEXT = path.resolve(process.env.NEXT_OUTPUT_DIR || path.join(ROOT, '.next'));

function fail(message) {
  process.stdout.write(`${message}\n`);
  process.exit(1);
}

/* ----------------------------------------------------- the internal texts */

function parse(rel) {
  const file = path.join(ROOT, rel);
  return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

/** The object rows of the array literal assigned to `name`. Loud if it has moved. */
function rowsOf(sf, name) {
  let found = null;
  const visit = node => {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText() === name &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      found = node.initializer;
    }
    if (!found) ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!found) fail(`\`${name}\` not found in ${path.relative(ROOT, sf.fileName)}. Update this check with it.`);
  return found.elements.filter(ts.isObjectLiteralExpression);
}

function prop(row, key) {
  for (const p of row.properties) {
    if (ts.isPropertyAssignment(p) && p.name.getText() === key) return p.initializer;
  }
  return null;
}

/** Every `key: ...` initializer anywhere in a file. */
function everyProp(sf, key) {
  const out = [];
  const visit = node => {
    if (ts.isPropertyAssignment(node) && node.name.getText() === key) out.push(node.initializer);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** Every piece of literal text in an initializer: strings, template parts, concatenations. */
function pieces(node) {
  const out = [];
  const visit = n => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) out.push(n.text);
    else if (ts.isTemplateHead(n) || ts.isTemplateMiddle(n) || ts.isTemplateTail(n)) out.push(n.text);
    ts.forEachChild(n, visit);
  };
  if (node) visit(node);
  return out;
}

const texts = []; // { source, pieces }
const add = (source, node) => {
  const p = pieces(node);
  if (p.length) texts.push({ source, pieces: p });
};

for (const row of rowsOf(parse('src/content/claims.ts'), 'claims')) {
  const id = pieces(prop(row, 'id'))[0] ?? '(no id)';
  const verified = pieces(prop(row, 'status'))[0] === 'VERIFIED';
  // A VERIFIED row's label and detail ARE published; its notes never are.
  const fields = verified
    ? ['evidenceNote', 'publicationInstruction']
    : ['label', 'detail', 'evidenceNote', 'publicationInstruction'];
  for (const field of fields) {
    const node = prop(row, field);
    if (node) add(`claims.ts ${id}.${field}`, node);
  }
}

everyProp(parse('src/content/work.ts'), 'evidenceNote').forEach((node, i) =>
  add(`work.ts evidenceNote #${i + 1}`, node),
);

for (const row of rowsOf(parse('src/content/company.ts'), 'certificationRegister')) {
  if (prop(row, 'published')?.kind === ts.SyntaxKind.TrueKeyword) continue;
  const standard = pieces(prop(row, 'standard'))[0] ?? '(unnamed row)';
  for (const p of row.properties) {
    if (ts.isPropertyAssignment(p)) add(`company.ts certificationRegister "${standard}".${p.name.getText()}`, p.initializer);
  }
}

/*
 * REVIEWED EXCEPTIONS: internal text that is also legitimately public, so a page
 * carrying it is not a leak. Every entry needs its reason, and an entry is a
 * decision that the text is not sensitive - not a way to quieten a failure.
 */
const PUBLIC_ANYWAY = {
  'company.ts certificationRegister "AI DPS RM6200".note':
    'The name of a public purchasing scheme, which /contact already refers to and may spell out.',
};

const STRUCTURAL = [
  ['claims.ts field name `publicationInstruction`', 'publicationInstruction'],
  ['claims.ts / work.ts field name `evidenceNote`', 'evidenceNote'],
  ['company.ts certificationRegister field name `heldByCertified`', 'heldByCertified'],
];

/*
 * CERTIFICATE DATES ARE NEVER PUBLISHED. Founder instruction, 24 September
 * 2026, reaffirmed 29 September: no certificate date - issue, expiry or any
 * other - appears anywhere on the site. company.ts keeps the dates because the
 * footer uses the expiry to drop a lapsed certificate; this check makes sure
 * they go no further.
 *
 * The fingerprint loop above skips rows marked `published`, because their
 * standard names ARE public. That left the dates of exactly those rows, the
 * held certificates, unchecked. So every date in every row - in a date field or
 * inside any other text - is looked for here, in each form a page would
 * realistically print it: written out, abbreviated, ordinal, numeric in UK and
 * US order, and ISO. Matching ignores case, non-breaking spaces and the
 * `<!-- -->` separators React puts between adjacent JSX text, so a date split
 * across expressions is still one date. Found dates are reported by row and
 * field, never by printing the date.
 *
 * Month and year alone ("March 2027") is NOT looked for. It is ordinary prose,
 * and a check that fails on ordinary prose is a check someone switches off.
 */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function datesIn(text) {
  const found = [...text.matchAll(/\b\d{4}-\d{2}-\d{2}\b/g)].map(m => m[0]);
  const prose = /\b(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})\b/g;
  for (const [, d, month, y] of text.matchAll(prose)) {
    found.push(`${y}-${String(MONTHS.indexOf(month) + 1).padStart(2, '0')}-${d.padStart(2, '0')}`);
  }
  return found;
}
function ordinal(d) {
  if (d % 100 >= 11 && d % 100 <= 13) return `${d}th`;
  return `${d}${['th', 'st', 'nd', 'rd'][d % 10] ?? 'th'}`;
}
function formsOf(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const dd = String(d).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  const forms = [
    ['ISO 8601', iso],
    ['day/month/year', `${dd}/${mm}/${y}`],
    ['day/month/year', `${d}/${m}/${y}`],
    ['month/day/year', `${mm}/${dd}/${y}`],
    ['month/day/year', `${m}/${d}/${y}`],
    ['day.month.year', `${dd}.${mm}.${y}`],
    ['day-month-year', `${dd}-${mm}-${y}`],
  ];
  const month = MONTHS[m - 1];
  for (const name of [month, month.slice(0, 3), ...(month === 'September' ? ['Sept'] : [])]) {
    forms.push(
      ['day month year', `${d} ${name} ${y}`],
      ['day month year', `${ordinal(d)} ${name} ${y}`],
      ['month day, year', `${name} ${d}, ${y}`],
      ['month day, year', `${name} ${ordinal(d)}, ${y}`],
    );
  }
  const unique = new Map();
  for (const [kind, form] of forms) if (!unique.has(form.toLowerCase())) unique.set(form.toLowerCase(), kind);
  return [...unique].map(([form, kind]) => [kind, form]);
}
/* Folds what a page may put between the parts of a date to a plain space, and
   lower-cases, so the forms above can be matched as plain substrings. */
const HARD_SPACE = new RegExp(`[${String.fromCharCode(0xa0)}${String.fromCharCode(0x202f)}]`, 'g');
function comparable(content) {
  return content.replace(/<!-- -->/g, '').replace(HARD_SPACE, ' ').replace(/&nbsp;|&#160;|&#xa0;/gi, ' ').toLowerCase();
}
/* A whole date only: "1 january 2027" is inside "21 january 2027", and
   "1/1/2027" is inside "11/1/2027". Neither is this date. */
function occurs(text, form) {
  for (let i = text.indexOf(form); i !== -1; i = text.indexOf(form, i + 1)) {
    if (!/\d/.test(text[i - 1] ?? '') && !/\d/.test(text[i + form.length] ?? '')) return true;
  }
  return false;
}
const certificateDates = []; // { source, forms }, one per row and date
for (const row of rowsOf(parse('src/content/company.ts'), 'certificationRegister')) {
  const standard = pieces(prop(row, 'standard'))[0] ?? '(unnamed row)';
  const seen = new Set();
  for (const p of row.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const field = p.name.getText();
    const source = `company.ts certificationRegister "${standard}".${field}`;
    const dates = datesIn(pieces(p.initializer).join(' '));
    // A date field this cannot read would drop out of the check in silence.
    if (!dates.length && /valid|issued|expir|recert|date/i.test(field)) {
      fail(`${source} holds no date this check can read - its shape has changed. Teach datesIn the new shape.`);
    }
    for (const iso of dates) {
      if (seen.has(iso)) continue;
      seen.add(iso);
      certificateDates.push({ source, forms: formsOf(iso) });
    }
  }
}

/* -------------------------------------------------------------- fingerprints */

/*
 * Windows are cut from runs of plain characters only - ASCII letters, digits,
 * spaces and light punctuation. Those survive minification, JSON and HTML
 * escaping byte for byte, where a quote, an apostrophe or a typographic dash
 * may be re-escaped and stop matching.
 */
const W = 32;
const PLAIN_RUN = /[A-Za-z0-9][A-Za-z0-9 ,.;:()-]*/g;
let tooShort = 0;
for (const t of texts) {
  const w = new Set();
  for (const piece of t.pieces) {
    for (const run of piece.match(PLAIN_RUN) || []) {
      for (let i = 0; i + W <= run.length; i += W) w.add(run.slice(i, i + W));
    }
  }
  t.windows = [...w];
  if (!t.windows.length) tooShort += 1;
}
const fingerprinted = texts.filter(t => t.windows.length).length;
if (!fingerprinted) fail('Read no text from the registers - their shape has changed. Update this check with them.');

const B = 257;
let POW = 1;
for (let i = 0; i < W - 1; i += 1) POW = Math.imul(POW, B) >>> 0;
const hashOf = s => {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(h, B) + s.charCodeAt(i)) >>> 0;
  return h;
};

const byHash = new Map(); // hash -> [{ window, text, index }]
texts.forEach((t, ti) =>
  t.windows.forEach((w, k) => {
    const h = hashOf(w);
    if (!byHash.has(h)) byHash.set(h, []);
    byHash.get(h).push({ w, ti, k });
  }),
);

/** text index -> set of window indexes found in `content` */
function windowsIn(content) {
  const found = new Map();
  if (content.length < W) return found;
  let h = hashOf(content.slice(0, W));
  for (let i = 0; ; i += 1) {
    const candidates = byHash.get(h);
    if (candidates) {
      for (const c of candidates) {
        if (content.startsWith(c.w, i)) {
          if (!found.has(c.ti)) found.set(c.ti, new Set());
          found.get(c.ti).add(c.k);
        }
      }
    }
    if (i + W >= content.length) break;
    h = (Math.imul((h - Math.imul(content.charCodeAt(i), POW)) >>> 0, B) + content.charCodeAt(i + W)) >>> 0;
  }
  return found;
}

/* ------------------------------------------------------- what is public */

const staticDir = path.join(NEXT, 'static');
const appDir = path.join(NEXT, 'server', 'app');
const manifestPath = path.join(NEXT, 'prerender-manifest.json');
if (!fs.existsSync(staticDir) || !fs.existsSync(appDir) || !fs.existsSync(manifestPath)) {
  fail(`No complete build output at ${path.relative(ROOT, NEXT) || NEXT}. Run next build first.`);
}

const BINARY = /\.(woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|ico|mp4|webm|mov|glb|gltf|wasm|pdf|docx?|zip)$/i;
function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const groups = {
  'browser assets': [...walk(staticDir)].filter(f => !BINARY.test(f)),
  'prerendered pages': [
    ...[...walk(appDir)].filter(f => /\.(html|rsc|body)$/.test(f)),
    ...[...walk(path.join(NEXT, 'server', 'pages'))].filter(f => f.endsWith('.html')),
  ],
  'files in public/': [...walk(path.join(ROOT, 'public'))].filter(f => !BINARY.test(f)),
};

/*
 * A CHECK THAT SCANS NOTHING PASSES EVERYTHING. So the build is held to what it
 * must contain: a root layout chunk, and output for every route the prerender
 * manifest says was prerendered.
 */
const layoutChunks = groups['browser assets'].filter(f => /[\\/]chunks[\\/]app[\\/]layout-[^\\/]*\.js$/.test(f));
if (!layoutChunks.length) fail('No root layout chunk in .next/static - this is not a complete build.');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const prerendered = Object.keys(manifest.routes || {});
const noOutput = prerendered.filter(route => {
  const base = path.join(appDir, route === '/' ? 'index' : route.slice(1));
  return !['.html', '.rsc', '.body'].some(ext => fs.existsSync(base + ext));
});
if (!prerendered.length || noOutput.length) {
  fail(`Prerendered routes with no output to scan: ${noOutput.join(', ') || '(the manifest lists none)'}`);
}

const routesPath = path.join(NEXT, 'app-path-routes-manifest.json');
const allRoutes = fs.existsSync(routesPath) ? Object.values(JSON.parse(fs.readFileSync(routesPath, 'utf8'))) : [];
const dynamicSsg = Object.keys(manifest.dynamicRoutes || {});
const perRequest = [...new Set(allRoutes)]
  .filter(r => !prerendered.includes(r) && !dynamicSsg.includes(r) && !r.startsWith('/_'))
  .sort();

/* ------------------------------------------------------------------ search */

const hits = [];
const dateHits = [];
for (const file of Object.values(groups).flat()) {
  const content = fs.readFileSync(file, 'utf8');
  const where = path.relative(file.startsWith(NEXT) ? NEXT : ROOT, file);
  for (const [source, needle] of STRUCTURAL) {
    if (content.includes(needle)) hits.push(`${source}  ->  ${where}`);
  }
  const plain = comparable(content);
  for (const { source, forms } of certificateDates) {
    const kinds = new Set(forms.filter(([, form]) => occurs(plain, form)).map(([kind]) => kind));
    for (const kind of kinds) dateHits.push(`${source}, written ${kind}  ->  ${where}`);
  }
  for (const [ti, found] of windowsIn(content)) {
    const t = texts[ti];
    const coverage = found.size / t.windows.length;
    if (coverage >= 0.5 && !PUBLIC_ANYWAY[t.source]) {
      hits.push(`${t.source} (${Math.round(coverage * 100)}% of its text)  ->  ${where}`);
    }
  }
}

const counts = Object.entries(groups).map(([k, v]) => `${v.length} ${k}`).join(', ');
process.stdout.write(
  `public output scanned : ${counts}\n` +
    `internal texts        : ${fingerprinted} fingerprinted from claims.ts, work.ts and company.ts; ` +
    `${tooShort} too short to fingerprint (caught by field name if bundled)\n` +
    `not covered           : ${perRequest.length ? `rendered per request, so no build output to scan: ${perRequest.join(', ')}` : 'nothing'}\n` +
    `certificate dates     : ${certificateDates.length} from company.ts, looked for in ${certificateDates.reduce((n, c) => n + c.forms.length, 0)} written forms\n`,
);

if (dateHits.length) {
  process.stdout.write(`\nA CERTIFICATE DATE IS IN PUBLIC OUTPUT - ${dateHits.length} hit(s):\n`);
  for (const h of dateHits.slice(0, 40)) process.stdout.write(`  - ${h}\n`);
  if (dateHits.length > 40) process.stdout.write(`  ... and ${dateHits.length - 40} more\n`);
  process.stdout.write(
    '\nNo certificate date is published anywhere on this site: founder instruction,\n' +
      '24 September 2026, reaffirmed 29 September. The footer names the standard\n' +
      'only, and the detail goes to a reviewer on request. Remove the date from the\n' +
      'page. If the match is a different date that falls on the same day - an\n' +
      "article's publication date, say - record that in review and exclude that one\n" +
      'file here with the reason; never exclude a page that talks about certification.\n',
  );
}

if (hits.length) {
  process.stdout.write(`\nINTERNAL REGISTER CONTENT IS IN PUBLIC OUTPUT - ${hits.length} hit(s):\n`);
  for (const h of hits.slice(0, 40)) process.stdout.write(`  - ${h}\n`);
  if (hits.length > 40) process.stdout.write(`  ... and ${hits.length - 40} more\n`);
  process.stdout.write(
    '\nA client component is importing a register, directly or through another module, a\n' +
      'server component is passing register rows to one as props, or internal text has\n' +
      'been copied into a page. Pass only what the browser needs, built on the server -\n' +
      'see src/lib/pix/context.ts for the pattern. If the text is genuinely public, add\n' +
      'it to PUBLIC_ANYWAY in this file with the reason.\n',
  );
  process.exit(1);
}
if (dateHits.length) process.exit(1);
process.stdout.write('no internal register content found in the scanned output\n');
