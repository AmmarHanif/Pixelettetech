/**
 * Fails if any heading on the site ends with a full stop.
 *
 * WHY THIS EXISTS RATHER THAN A NOTE SOMEWHERE. The house style is sentence
 * case with no terminal full stop on a heading, given by the founder on
 * 2026-09-17 and applied then. On 2026-09-24 twenty-five headings arrived
 * carrying one, across six files, because two long briefs wrote their headings
 * with full stops and the copy was taken verbatim. Copying punctuation out of a
 * brief is not the same as following the house style, and the difference is
 * invisible while you are doing it.
 *
 * A rule that has to be remembered on every page will be missed on some page.
 * This is the same reasoning as check-pix-kb.mjs: turn the thing that silently
 * drifts into a thing that fails loudly.
 *
 *     node scripts/check-headings.mjs
 *
 * WHAT COUNTS AS A HEADING: literal text inside <h1> to <h4>, a `title` prop
 * passed to SectionHead / ClosingCta / FeatureCard, and a `title:` field on a
 * record that renders as one.
 *
 * WHAT IS DELIBERATELY IGNORED: body copy, leads, summaries, card descriptions,
 * FAQ answers and article prose, which are sentences and keep their full stops.
 * An internal full stop inside a heading is also fine - "Don't just read about
 * immersive. Try it" is correct, because the first stop is doing grammatical
 * work and only the last one is decoration.
 *
 * The migrated archive under content/archive is excluded: that is somebody
 * else's published writing and is not ours to restyle.
 *
 * KNOWN BLIND SPOT, stated rather than discovered later. This reads SOURCE
 * LITERALS, so a heading passed as an expression - `title={archive.title}`,
 * `title={group.label}`, `title={item.title}`, `title={s.label}`, all of which
 * exist - is invisible to it. A data file could quietly supply a full stop and
 * this would still report a clean site. The complete check is over the BUILT
 * output after `next build`, which sees every heading whatever route its string
 * took; that scan was run on 2026-09-24 across 90 pages and found none outside
 * the migrated archive. Re-run it rather than trusting this alone when a
 * heading's text comes from data.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '..', 'src');

/** Files whose `title:` data fields render as headings. */
const TITLE_KEY_FILES = new Set([
  'components/ImmersiveShowcase.tsx',
  'content/insights.ts',
]);

const HEADING_JSX = /<(h[1-4])\b[^>]*>\s*([^<>{}]+?)\s*<\/\1>/gs;
const TITLE_PROP = /title="([^"]*?)"/g;
const TITLE_KEY = /\btitle:\s*(["'])([^"']*?)\1/g;

const endsWithStop = s => {
  const t = s.trim();
  return t.endsWith('.') && !t.endsWith('...');
};

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.tsx') || e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

const offences = [];

for (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).replace(/\\/g, '/');
  if (rel.startsWith('content/archive/')) continue;
  const s = fs.readFileSync(file, 'utf8');

  for (const m of s.matchAll(HEADING_JSX)) {
    const text = m[2].replace(/\s+/g, ' ').trim();
    if (endsWithStop(text)) offences.push({ rel, kind: `<${m[1]}>`, text });
  }
  for (const m of s.matchAll(TITLE_PROP)) {
    if (endsWithStop(m[1])) offences.push({ rel, kind: 'title=', text: m[1] });
  }
  if (TITLE_KEY_FILES.has(rel)) {
    for (const m of s.matchAll(TITLE_KEY)) {
      if (endsWithStop(m[2])) offences.push({ rel, kind: 'title:', text: m[2] });
    }
  }
}

if (offences.length === 0) {
  process.stdout.write('headings: no terminal full stops\n');
  process.exit(0);
}

process.stdout.write(`HEADINGS ENDING IN A FULL STOP: ${offences.length}\n\n`);
for (const o of offences) {
  process.stdout.write(`  ${o.rel}\n    ${o.kind}  ${o.text}\n`);
}
process.stdout.write('\nHouse style: sentence case, no terminal full stop on a heading.\n');
process.exit(1);
