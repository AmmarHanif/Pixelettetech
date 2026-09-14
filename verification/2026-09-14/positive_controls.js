/**
 * Positive controls.
 *
 * A green check is worth nothing until it has been shown to go red. This script
 * deliberately breaks the code twice, proves each gate catches the break, then
 * restores the file and proves the restore is byte-identical by hash.
 *
 *   CONTROL A — the type-check. Inject a type error; tsc must exit non-zero.
 *   CONTROL B — the behavioural suite. Make the action claim success when
 *               nothing was delivered; the suite must go RED on the honesty
 *               assertions specifically.
 *
 * Any failure to restore is reported loudly: the file's hash before and after
 * must match exactly.
 */

const fs = require('fs');
const crypto = require('crypto');
const { spawnSync } = require('child_process');
const path = require('path');

const REPO = 'C:/Users/Rana/Brain/CTO Vault/05_Projects/Pixelette_Tech_Website_001/rebuild-2026';
const TARGET = path.join(REPO, 'src/app/contact/actions.ts');
const TSC = path.join(REPO, 'node_modules/typescript/bin/tsc');
const TSCONFIG = path.join(REPO, 'tsconfig.json');
const SUITE = path.join(__dirname, 'contact_action_test.js');

const sha = buf => crypto.createHash('sha256').update(buf).digest('hex');

// Read as a BUFFER, not a string: a string round-trip could normalise line
// endings or a BOM and silently "restore" a file that is not the original.
const ORIGINAL = fs.readFileSync(TARGET);
const ORIGINAL_HASH = sha(ORIGINAL);

console.log(`target      : ${TARGET}`);
console.log(`bytes       : ${ORIGINAL.length}`);
console.log(`sha256      : ${ORIGINAL_HASH}\n`);

function restore() {
  fs.writeFileSync(TARGET, ORIGINAL);
  const after = sha(fs.readFileSync(TARGET));
  if (after !== ORIGINAL_HASH) {
    console.log(`RESTORE FAILED: ${after} !== ${ORIGINAL_HASH}`);
    process.exit(9);
  }
  return after;
}

function runTsc() {
  const r = spawnSync(process.execPath, [TSC, '-p', TSCONFIG, '--noEmit', '--incremental', 'false', '--pretty', 'false'], {
    encoding: 'utf8',
    cwd: REPO,
  });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

function runSuite() {
  const r = spawnSync(process.execPath, [SUITE], { encoding: 'utf8', cwd: __dirname });
  return { code: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

let verdicts = [];

/* ------------------------------------------------- CONTROL A: type-check */

console.log('=== CONTROL A — inject a type error, tsc must FAIL ===');
fs.writeFileSync(
  TARGET,
  ORIGINAL.toString('utf8') + '\nconst __control: number = "this is not a number";\n',
);
const broken = runTsc();
console.log(`  tsc exit = ${broken.code}`);
console.log(`  tsc says : ${broken.out.trim().split('\n').slice(0, 2).join(' / ') || '(no output)'}`);
const aCaught = broken.code !== 0 && /is not assignable to type 'number'/.test(broken.out);
verdicts.push(['A1 tsc rejects the injected type error', aCaught]);

const hashA = restore();
verdicts.push(['A2 file restored byte-identically', hashA === ORIGINAL_HASH]);

const healed = runTsc();
console.log(`  tsc exit after restore = ${healed.code}`);
verdicts.push(['A3 tsc is green again after restore', healed.code === 0]);

/* --------------------------------------------- CONTROL B: honesty mutant */

console.log('\n=== CONTROL B — make the action lie, the suite must FAIL ===');
const src = ORIGINAL.toString('utf8');
const HONEST = `  return { status: 'error', message: MESSAGES.FAILED };`;
const MUTANT = `  return { status: 'success', message: MESSAGES.SUCCESS };`;

if (!src.includes(HONEST)) {
  console.log('  CANNOT MUTATE: the honest-failure return was not found verbatim.');
  console.log('  This control is INVALID; treat the suite as unproven.');
  restore();
  process.exit(8);
}
fs.writeFileSync(TARGET, src.replace(HONEST, MUTANT));
console.log('  mutation applied: total-failure path now claims success');

const mutated = runSuite();
console.log(`  suite exit = ${mutated.code}`);
const redLines = mutated.out.split('\n').filter(l => l.includes('FAIL') && !l.includes('CONTROL'));
console.log(`  real assertions that went RED = ${redLines.length}`);
for (const l of redLines.slice(0, 8)) console.log(`    ${l.trim()}`);

const bCaught = mutated.code === 1 && redLines.length > 0;
verdicts.push(['B1 the suite goes RED when the action lies', bCaught]);
verdicts.push([
  'B2 the honesty invariant [12.1] is among the failures',
  mutated.out.includes('FAIL  12.1'),
]);
verdicts.push([
  'B3 the total-failure case [5.1] is among the failures',
  mutated.out.includes('FAIL  5.1'),
]);

const hashB = restore();
verdicts.push(['B4 file restored byte-identically', hashB === ORIGINAL_HASH]);

const healedSuite = runSuite();
console.log(`  suite exit after restore = ${healedSuite.code}`);
verdicts.push(['B5 suite is green again after restore', healedSuite.code === 0]);

/* ------------------------------------------------------------- verdict */

console.log('\n' + '='.repeat(64));
let ok = true;
for (const [label, pass] of verdicts) {
  console.log(`  ${pass ? 'PASS' : 'FAIL'}  ${label}`);
  if (!pass) ok = false;
}
console.log('='.repeat(64));
console.log(`final sha256 : ${sha(fs.readFileSync(TARGET))}`);
console.log(`original     : ${ORIGINAL_HASH}`);
console.log(`RESULT: ${ok ? 'CONTROLS VALID' : 'CONTROLS INVALID'}`);
process.exitCode = ok ? 0 : 1;
