/**
 * Generate the square app icons the web manifest needs.
 *
 * WHY THIS EXISTS. A manifest without icons is worse than no manifest: the
 * install prompt and the home-screen tile fall back to a screenshot or a blank
 * square. Before this, the only square asset on the site was a 180x180
 * apple-touch-icon; `pixelette-logo-1024.png` is 1024x285, a wide lockup, which
 * letterboxes to nothing useful in a square tile.
 *
 * WHAT IT DRAWS. The tree mark, white, centred on the brand ground (#661a8f,
 * `--brand`) - the same treatment as the assistant launcher, so the tile a
 * visitor saves matches the button they pressed.
 *
 * THE MARK OCCUPIES 58% OF THE CANVAS, which is not an aesthetic choice. A
 * `maskable` icon is cropped by the platform to whatever shape it likes - circle,
 * squircle, rounded square - and only the middle 80% by diameter is guaranteed to
 * survive. At 58% the mark sits inside that safe circle with room to spare, so
 * the same file serves `any` and `maskable` without a second asset and without
 * losing the top of the tree on Android.
 *
 *   node scripts/build-app-icons.mjs [--check]
 *
 * `--check` verifies the files exist and are the right size, so a build cannot
 * ship a manifest pointing at an icon nobody generated.
 */
import { readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC = join(HERE, '..', 'public');
const MARK = join(PUBLIC, 'pixelette-mark-white.svg');
const BRAND = { r: 0x66, g: 0x1a, b: 0x8f, alpha: 1 }; // --brand #661a8f
const SIZES = [192, 512];
const MARK_FRACTION = 0.58;
const CHECK = process.argv.includes('--check');

if (!existsSync(MARK)) {
  console.error(`missing source mark: ${MARK}`);
  process.exit(1);
}

const svg = await readFile(MARK);
const results = [];
let failed = false;

for (const size of SIZES) {
  const out = join(PUBLIC, `icon-${size}.png`);

  if (CHECK) {
    if (!existsSync(out)) {
      console.log(`  MISSING  icon-${size}.png`);
      failed = true;
      continue;
    }
    const meta = await sharp(out).metadata();
    const bytes = (await stat(out)).size;
    if (meta.width !== size || meta.height !== size) {
      console.log(`  WRONG SIZE  icon-${size}.png is ${meta.width}x${meta.height}, expected ${size}x${size}`);
      failed = true;
      continue;
    }
    results.push({ size, bytes });
    continue;
  }

  /* Rasterise the mark to the safe-zone width, then centre it on the brand
     ground. `fit: 'contain'` with a transparent background keeps the mark's own
     aspect ratio - the tree is taller than it is wide, so forcing a square here
     would stretch it. */
  const markPx = Math.round(size * MARK_FRACTION);
  const mark = await sharp(svg, { density: 384 })
    .resize({ width: markPx, height: markPx, fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const buf = await sharp({
    create: { width: size, height: size, channels: 4, background: BRAND },
  })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(out, buf);
  results.push({ size, bytes: buf.length });
}

console.log(`\n${CHECK ? 'checking' : 'writing'} app icons\n`);
for (const r of results) {
  console.log(`  icon-${r.size}.png`.padEnd(22) + `${r.size}x${r.size}`.padEnd(12) + `${Math.round(r.bytes / 1024)} KB`);
}

if (CHECK && failed) {
  console.log(`\n  Run: node scripts/build-app-icons.mjs\n`);
  process.exit(1);
}
console.log('');
