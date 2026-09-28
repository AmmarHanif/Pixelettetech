/**
 * Fails if archive or legacy material has reached the assistant's knowledge base.
 *
 * WHY THIS EXISTS. The Pix T brief makes old-website content a HARD
 * architectural exclusion: nothing from the previous site may be ingested,
 * indexed or made available for grounding. Today that holds, and it holds for a
 * structural reason rather than a declared one - build-pix-kb.mjs walks static
 * `page.tsx` routes, and the 39 migrated articles reach the site through the
 * dynamic `/blog/[slug]` route, which the builder does not index.
 *
 * A PROPERTY THAT HOLDS BY ACCIDENT OF STRUCTURE IS THE ONE THAT BREAKS
 * SILENTLY. Give an archive article a static route, or teach the builder to
 * read `src/content/**`, and the previous site's marketing copy enters the
 * corpus with nothing to say so. The counts would still look healthy: the KB
 * would simply have more documents in it.
 *
 * SO THIS CHECKS CONTENT, NOT PATHS. A path check would pass a file that had
 * archive prose pasted into a current page, which is the interesting failure
 * rather than the obvious one. Distinctive sentences are taken from every
 * archive article and looked for in the KB's own text.
 *
 *     node scripts/check-pix-kb-sources.mjs
 *
 * WHAT IS DELIBERATELY ALLOWED. The /insights/archive INDEX page may appear.
 * The brief permits Pix T to say an archive exists, navigate to it, and
 * describe it as historical - and that page's own description does exactly
 * that. What may not appear is any archive ARTICLE's content.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const KB = path.join(ROOT, 'src', 'content', 'pix-kb.json');
const ARCHIVE = path.join(ROOT, 'src', 'content', 'archive');

/** The index page is a signpost to the archive, which the brief permits. */
const ALLOWED_ARCHIVE_PATHS = new Set(['/insights/archive']);

/** Route prefixes that may never contribute grounding content. */
const FORBIDDEN_PREFIXES = ['/archive/', '/legacy/', '/old/', '/deprecated/', '/held/'];

const failures = [];

const kb = JSON.parse(fs.readFileSync(KB, 'utf8'));
const docs = kb.docs ?? [];
if (docs.length === 0) {
  failures.push('the knowledge base is empty, so this check would pass vacuously');
}

/* ---- 1. no forbidden route may contribute a document -------------------- */
for (const d of docs) {
  const p = d.path ?? '';
  if (FORBIDDEN_PREFIXES.some(pre => p.startsWith(pre))) {
    failures.push(`forbidden route in the KB: ${p}`);
  }
  if (p.startsWith('/insights/archive/')) {
    failures.push(`an archive ARTICLE is in the KB: ${p}`);
  }
}

/* ---- 2. no archive ARTICLE text may appear in any document --------------
   The real test. Sentences are taken from the articles themselves, so this
   keeps working as the archive changes and cannot be satisfied by renaming a
   route. */
const kbText = docs.map(d => `${d.title ?? ''} ${d.text ?? ''}`).join('\n').toLowerCase();

let articles = [];
if (fs.existsSync(ARCHIVE)) {
  articles = fs
    .readdirSync(ARCHIVE)
    .filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');
}
if (articles.length === 0) {
  failures.push('no archive articles were found, so the content check would pass vacuously');
}

let sentencesChecked = 0;
for (const file of articles) {
  const src = fs.readFileSync(path.join(ARCHIVE, file), 'utf8');
  // Paragraph literals, as the migration writes them: ["p", "…"].
  const paras = [...src.matchAll(/\["p",\s*"((?:[^"\\]|\\.){80,})"\]/g)].map(m => m[1]);
  for (const para of paras.slice(0, 3)) {
    // A long, specific run of words. Short fragments would collide with
    // ordinary English and report a leak that is not one.
    const probe = para
      .replace(/\\[nrt"']/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .slice(0, 12)
      .join(' ')
      .toLowerCase();
    if (probe.split(' ').length < 10) continue;
    sentencesChecked += 1;
    if (kbText.includes(probe)) {
      failures.push(`archive prose is in the KB, from ${file}: "${probe.slice(0, 70)}…"`);
    }
  }
}

/* ---- 3. every indexed route must be on the explicit allowlist ------------
   Section 5. The allowlist lives in src/lib/pix/allowlist.ts as families rather
   than pages, so this fails when a NEW top-level section starts grounding
   answers - a decision worth making deliberately - and not merely because
   somebody added a page to an approved one. The prefixes are mirrored here
   rather than imported because this script is plain node and the allowlist is
   TypeScript; the test below asserts the two agree, so the copy cannot drift
   silently. */
const ALLOWED = [
  '/about-us', '/accessibility', '/ai-automation', '/ar-vr-development-services',
  '/assurance', '/blockchain', '/case-studies', '/contact', '/cookies',
  '/engineering', '/industries', '/insights', '/method', '/modern-slavery',
  '/privacy', '/support-continuous-improvement', '/terms-conditions',
];
const allowedSrc = fs.readFileSync(
  path.join(ROOT, 'src', 'lib', 'pix', 'allowlist.ts'), 'utf8');
for (const a of ALLOWED) {
  if (!allowedSrc.includes(`'${a}'`)) {
    failures.push(`this script allows ${a} but allowlist.ts does not; they have drifted`);
  }
}
for (const d of docs) {
  const p = d.path ?? '';
  const ok = p === '/' || ALLOWED.some(a => p === a || p.startsWith(`${a}/`));
  if (!ok) failures.push(`route not on the approved allowlist: ${p}`);
}

/* ---- 4. the one permitted archive entry must still be a signpost -------- */
const archiveDocs = docs.filter(d => (d.path ?? '').includes('archive'));
for (const d of archiveDocs) {
  if (!ALLOWED_ARCHIVE_PATHS.has(d.path)) {
    failures.push(`unexpected archive-related doc: ${d.path}`);
  }
}
const indexDoc = archiveDocs.find(d => d.path === '/insights/archive');
if (indexDoc && !/historical/i.test(indexDoc.text ?? '')) {
  failures.push(
    'the archive index page no longer describes itself as historical, so Pix T could ' +
      'present it as current guidance',
  );
}

/* ---- report ------------------------------------------------------------- */
process.stdout.write(
  `pix-kb sources: ${docs.length} docs, ${articles.length} archive articles, ` +
    `${sentencesChecked} probe sentences\n`,
);

if (failures.length === 0) {
  process.stdout.write('pix-kb sources: no archive or legacy content in the grounding corpus\n');
  process.exit(0);
}

process.stdout.write(`\nPIX T SOURCE VIOLATIONS: ${failures.length}\n\n`);
for (const f of failures) process.stdout.write(`  ${f}\n`);
process.stdout.write(
  '\nThe previous site is a hard exclusion: its content may not ground Pix T.\n',
);
process.exit(1);
