/**
 * Re-encode the case-study images in /public/work as WebP at several widths.
 *
 * WHY. The PNGs are the heaviest thing the site ships: 2.7 MB across ten files,
 * the largest 870 KB, against 6.7 MB of public assets in total. They are
 * screenshots of product UI, which PNG stores badly and WebP stores well.
 *
 * THE WIDTHS ARE MEASURED, NOT GUESSED. The same image renders at three sizes:
 *
 *   357px  homepage, `.grid-3`
 *   545px  /case-studies index, `.grid-2`
 *   1110px case-study detail page, the hero - full content width
 *
 * Both grids collapse to one column at `max-width: 860px`, and the page content
 * is capped at `--wrap: 1160px` less two 24px gutters. So the ladder below
 * covers 1x and 2x of each: 360 and 720 for the homepage, 720 and 1120 for the
 * index, 1120 and 2240 for the detail hero.
 *
 * NOTHING IS UPSCALED. A width above the source's own is skipped, because
 * inventing pixels only adds bytes. That matters here: seven of the ten sources
 * are 675px wide and are ALREADY being upscaled by the browser to fill the
 * 1110px detail hero. Re-encoding cannot fix that - it needs larger exports from
 * whoever holds the originals - and this script reports which ones so the gap is
 * visible rather than silently encoded at a size that implies detail it lacks.
 *
 * WEBP ONLY, NO AVIF. `/public/hero` already ships WebP at three widths and no
 * AVIF, so this follows the convention the repo already set rather than adding a
 * second one. AVIF would save a little more and costs a much slower encode; it
 * can be added later for both directories together if it is ever worth it.
 *
 * The PNGs are KEPT. They are the `<img>` fallback inside `<picture>`, they are
 * only fetched by a browser with no WebP support, and keeping them preserves the
 * property the Media component's own comment cares about: the site stays
 * deployable to any static host with no image optimiser in front of it.
 *
 *   node scripts/build-work-images.mjs [--check]
 *
 * `--check` reports what WOULD be written and exits non-zero if anything is
 * missing or stale, so CI can catch a new PNG added without its WebP set.
 */
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const DIR = join(HERE, '..', 'public', 'work');
const WIDTHS = [360, 720, 1120, 2240];
const QUALITY = 86; // screenshots carry small text; below ~80 it starts to smear
const CHECK = process.argv.includes('--check');

const kb = n => `${Math.round(n / 1024)} KB`;

const sources = (await readdir(DIR)).filter(f => f.toLowerCase().endsWith('.png')).sort();
if (sources.length === 0) {
  console.error('no PNGs in public/work — nothing to do');
  process.exit(1);
}

let pngBytes = 0;
let webpBytes = 0;
const missing = [];
const undersized = [];
const rows = [];

for (const file of sources) {
  const src = join(DIR, file);
  const { name } = parse(file);
  const meta = await sharp(src).metadata();
  const srcBytes = (await stat(src)).size;
  pngBytes += srcBytes;

  // Never upscale: a width beyond the source adds bytes and no detail.
  const widths = WIDTHS.filter(w => w <= meta.width);
  if (widths.length === 0) widths.push(meta.width);
  if (!widths.includes(meta.width) && meta.width < Math.max(...WIDTHS)) widths.push(meta.width);

  if (meta.width < 1120) {
    undersized.push({ file, width: meta.width });
  }

  const written = [];
  for (const w of widths.sort((a, b) => a - b)) {
    const out = join(DIR, `${name}-${w}.webp`);
    if (CHECK) {
      if (!existsSync(out)) missing.push(`${name}-${w}.webp`);
      else webpBytes += (await stat(out)).size;
      written.push(w);
      continue;
    }
    const buf = await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toBuffer();
    await writeFile(out, buf);
    webpBytes += buf.length;
    written.push(w);
  }
  rows.push({ file, dims: `${meta.width}x${meta.height}`, srcBytes, written });
}

console.log(`\n${CHECK ? 'checking' : 'writing'} WebP for ${sources.length} case-study images\n`);
for (const r of rows) {
  console.log(`  ${r.file.padEnd(26)} ${r.dims.padEnd(12)} ${kb(r.srcBytes).padStart(7)}  ->  ${r.written.join(', ')}`);
}

console.log(`\n  PNG total   ${kb(pngBytes)}`);
console.log(`  WebP total  ${kb(webpBytes)}   (all widths together)`);

if (undersized.length) {
  console.log(`\n  SOURCE TOO SMALL FOR THE DETAIL-PAGE HERO (needs 1120 for a 1x display, 2240 for 2x):`);
  for (const u of undersized) console.log(`    ${u.file.padEnd(26)} ${u.width}px`);
  console.log(`  These are upscaled by the browser today and re-encoding cannot change that.`);
  console.log(`  Larger exports are needed from whoever holds the originals.`);
}

/*
 * THE SRCSET TABLE IS A SECOND COPY OF THIS SCRIPT'S OUTPUT, so --check verifies
 * it too. `WORK_WIDTHS` in src/components/ui.tsx lists the widths each image has.
 * A srcset entry whose file does not exist 404s; one that is missing silently
 * serves a smaller image than the browser asked for. Neither shows up in a build.
 * Two places holding the same fact drift, so this makes the drift loud.
 */
if (CHECK) {
  const ui = await readFile(join(HERE, '..', 'src', 'components', 'ui.tsx'), 'utf8');
  const block = /const WORK_WIDTHS: Record<string, number\[\]> = \{([\s\S]*?)\n\};/.exec(ui);
  if (!block) {
    console.log('\n  WORK_WIDTHS not found in src/components/ui.tsx - the srcset table cannot be checked\n');
    process.exit(1);
  }
  const table = new Map();
  for (const m of block[1].matchAll(/'?([a-z0-9-]+)'?:\s*\[([0-9,\s]+)\]/g)) {
    table.set(m[1], m[2].split(',').map(n => Number(n.trim())).filter(Boolean));
  }
  for (const r of rows) {
    const name = parse(r.file).name;
    const declared = table.get(name);
    if (!declared) { missing.push(`WORK_WIDTHS is missing "${name}"`); continue; }
    const a = declared.join(','), b = r.written.join(',');
    if (a !== b) missing.push(`WORK_WIDTHS["${name}"] says [${a}] but the files are [${b}]`);
  }
  for (const name of table.keys()) {
    if (!rows.some(r => parse(r.file).name === name)) {
      missing.push(`WORK_WIDTHS has "${name}" with no PNG in public/work`);
    }
  }
}

if (CHECK && missing.length) {
  console.log(`\n  OUT OF STEP:`);
  for (const m of missing) console.log(`    ${m}`);
  console.log(`\n  Run: node scripts/build-work-images.mjs   (then update WORK_WIDTHS if the widths changed)\n`);
  process.exit(1);
}
console.log('');
