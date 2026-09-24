/**
 * Fails if the committed knowledge base no longer matches the pages.
 *
 * THE PROBLEM THIS EXISTS FOR. The assistant answers from a generated file. The
 * moment someone edits an FAQ on a page and does not regenerate, the site says
 * one thing and the assistant says another - and nothing breaks, nothing warns,
 * and the assistant goes on confidently quoting copy that was corrected weeks
 * ago. Silent staleness is the whole risk of generating content, so it is made
 * loud here.
 *
 * IT RE-RUNS THE REAL BUILDER rather than reimplementing the extraction. A check
 * that rebuilt the KB its own way would only ever prove that two copies of the
 * logic agree, which is not what anyone wants to know.
 *
 *     node scripts/check-pix-kb.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const COMMITTED = path.join(ROOT, 'src', 'content', 'pix-kb.json');
const TEMP = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pix-kb-')), 'pix-kb.json');

if (!fs.existsSync(COMMITTED)) {
  process.stdout.write('pix-kb.json is missing. Run: node scripts/build-pix-kb.mjs\n');
  process.exit(1);
}

execFileSync(process.execPath, [path.join(HERE, 'build-pix-kb.mjs')], {
  cwd: ROOT,
  env: { ...process.env, PIX_KB_OUT: TEMP },
  stdio: 'pipe',
});

const before = fs.readFileSync(COMMITTED, 'utf8');
const after = fs.readFileSync(TEMP, 'utf8');
fs.rmSync(path.dirname(TEMP), { recursive: true, force: true });

if (before === after) {
  const kb = JSON.parse(before);
  process.stdout.write(
    `pix-kb.json is current (${kb.counts.pages} pages, ${kb.counts.faqs} FAQs, ${kb.counts.pointers} pointers)\n`,
  );
  process.exit(0);
}

/* Say WHAT changed, not just that something did. */
const a = JSON.parse(before);
const b = JSON.parse(after);
const key = d => `${d.kind}|${d.title}`;
const setA = new Map(a.docs.map(d => [key(d), d]));
const setB = new Map(b.docs.map(d => [key(d), d]));

const added = [...setB.keys()].filter(k => !setA.has(k));
const removed = [...setA.keys()].filter(k => !setB.has(k));
const changed = [...setB.keys()].filter(k => setA.has(k) && setA.get(k).text !== setB.get(k).text);

process.stdout.write('pix-kb.json is STALE. The pages have moved on without it.\n\n');
const show = (label, list) => {
  if (!list.length) return;
  process.stdout.write(`  ${label} (${list.length}):\n`);
  for (const k of list.slice(0, 10)) process.stdout.write(`    - ${k.split('|')[1].slice(0, 76)}\n`);
  if (list.length > 10) process.stdout.write(`    ... and ${list.length - 10} more\n`);
};
show('added', added);
show('removed', removed);
show('answer text changed', changed);
process.stdout.write('\nRun: node scripts/build-pix-kb.mjs\n');
process.exit(1);
