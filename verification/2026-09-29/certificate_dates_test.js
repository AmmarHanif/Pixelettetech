/**
 * Negative control for the certificate-date check in
 * scripts/check-public-output.mjs, added 2026-09-29.
 *
 * Founder instruction, 24 September 2026, reaffirmed 29 September: no
 * certificate date appears anywhere on the site. The build enforces it; this
 * proves the enforcement bites. It plants dates into a COPY of the build output
 * (and, for the public/ and register-shape cases, a copy of the repo root) in
 * every form the check claims to cover, and asserts the scanner fails on each -
 * and passes on ordinary prose and on other dates that merely contain a
 * certificate date. The real .next and src are never written.
 *
 * Special characters are built from character codes, never written as escapes,
 * for the reason verification/2026-09-29/hardening_test.js gives.
 *
 *     npm run build
 *     node verification/2026-09-29/certificate_dates_test.js
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const SITE = path.resolve(__dirname, '..', '..');
const SP = fs.mkdtempSync(path.join(os.tmpdir(), 'cert-dates-'));
const OUT = path.join(SP, 'next');
const FAKE = path.join(SP, 'root');

fs.mkdirSync(path.join(OUT, 'server'), { recursive: true });
fs.cpSync(path.join(SITE, '.next/static'), path.join(OUT, 'static'), { recursive: true });
fs.cpSync(path.join(SITE, '.next/server/app'), path.join(OUT, 'server/app'), { recursive: true });
fs.copyFileSync(path.join(SITE, '.next/prerender-manifest.json'), path.join(OUT, 'prerender-manifest.json'));
fs.mkdirSync(path.join(FAKE, 'scripts'), { recursive: true });
fs.mkdirSync(path.join(FAKE, 'src/content'), { recursive: true });
fs.copyFileSync(path.join(SITE, 'scripts/check-public-output.mjs'), path.join(FAKE, 'scripts/check-public-output.mjs'));
for (const f of ['claims.ts', 'work.ts', 'company.ts']) fs.copyFileSync(path.join(SITE, 'src/content', f), path.join(FAKE, 'src/content', f));
fs.cpSync(path.join(SITE, 'public'), path.join(FAKE, 'public'), { recursive: true });
fs.symlinkSync(path.join(SITE, 'node_modules'), path.join(FAKE, 'node_modules'));

const run = root => {
  const r = spawnSync('node', [path.join(root, 'scripts/check-public-output.mjs')], { env: { ...process.env, NEXT_OUTPUT_DIR: OUT }, encoding: 'utf8' });
  return { code: r.status, out: r.stdout + r.stderr };
};

const NBSP = String.fromCharCode(0xa0);
const page = path.join(OUT, 'server/app/about-us.html');
const pageOriginal = fs.readFileSync(page, 'utf8');
const plant = text => fs.writeFileSync(page, pageOriginal.replace('</body>', `<p>${text}</p></body>`));

let failures = 0;
let checks = 0;
const expect = (label, ok, detail = '') => {
  checks += 1;
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
};

// 1. Baseline: the untouched copy passes.
let r = run(SITE);
expect('baseline copy passes', r.code === 0, `exit ${r.code}`);

// 2. Every realistic form of a certificate date fails the scan, and the date itself is never printed.
const mustFail = [
  ['11 March 2027', 'day month year'], ['11th March 2027', 'day month year'], ['11 Mar 2027', 'day month year'],
  ['March 11, 2027', 'month day, year'], ['Mar 11, 2027', 'month day, year'], ['March 11th, 2027', 'month day, year'],
  ['11/03/2027', 'day/month/year'], ['11/3/2027', 'day/month/year'], ['03/11/2027', 'month/day/year'], ['3/11/2027', 'month/day/year'],
  ['11.03.2027', 'day.month.year'], ['11-03-2027', 'day-month-year'], ['2027-03-11', 'ISO 8601'],
  ['11<!-- --> <!-- -->March<!-- --> <!-- -->2027', 'day month year'], ['11&nbsp;March 2027', 'day month year'],
  [`11${NBSP}March 2027`, 'day month year'], ['11 MARCH 2027', 'day month year'],
  ['1st January 2027', 'day month year'], ['Jan 1, 2027', 'month day, year'], ['01/01/2027', 'day/month/year'],
  ['2 January 2026', 'day month year'], ['12 March 2026', 'day month year'],
  ['11 March 2029', 'day month year'], ['1 January 2029', 'day month year'],
];
for (const [text, kind] of mustFail) {
  plant(`Certificate valid to ${text}.`);
  r = run(SITE);
  const bare = text.replace(/<!-- -->/g, '').replace(/&nbsp;/g, ' ').replace(NBSP, ' ').toLowerCase();
  expect(`fails on ${JSON.stringify(text)}`, r.code === 1 && r.out.includes('A CERTIFICATE DATE IS IN PUBLIC OUTPUT') && r.out.includes(`written ${kind}  ->  server/app/about-us.html`) && !r.out.toLowerCase().includes(bare), `exit ${r.code}`);
}

// 3. Ordinary prose and near-misses do not trip it - including other dates that CONTAIN a certificate date.
for (const text of ['March 2027', '12 March 2027', '11 March 2028', '2027', 'ISO 27001:2022', '21 January 2027', '11 January 2027', '12 January 2026', '11/1/2027', '21st January 2027', 'Jan 11, 2027']) {
  plant(`We said ${text}.`);
  r = run(SITE);
  expect(`passes on ${JSON.stringify(text)}`, r.code === 0, `exit ${r.code}`);
}
fs.writeFileSync(page, pageOriginal);

// 4. Browser assets are covered: a date inside a JS chunk fails.
const chunk = fs.readdirSync(path.join(OUT, 'static/chunks/app')).find(f => /^layout-.*\.js$/.test(f));
const chunkPath = path.join(OUT, 'static/chunks/app', chunk);
const chunkOriginal = fs.readFileSync(chunkPath, 'utf8');
fs.writeFileSync(chunkPath, chunkOriginal + '\n;var v="2027-01-01";');
r = run(SITE);
expect('fails on a date inside a browser JS chunk', r.code === 1 && r.out.includes('ISO 8601  ->  static'), `exit ${r.code}`);
fs.writeFileSync(chunkPath, chunkOriginal);

// 5. public/ is covered (copy of the repo root, same build copy).
const llms = path.join(FAKE, 'public/llms.txt');
const llmsOriginal = fs.readFileSync(llms, 'utf8');
fs.writeFileSync(llms, llmsOriginal + '\nISO 9001 valid to 1 January 2027.\n');
r = run(FAKE);
expect('fails on a date in public/llms.txt', r.code === 1 && r.out.includes('llms.txt'), `exit ${r.code}`);
fs.writeFileSync(llms, llmsOriginal);
r = run(FAKE);
expect('copied root passes once restored', r.code === 0, `exit ${r.code}`);

// 6. Fails closed when a register date field changes shape.
const company = path.join(FAKE, 'src/content/company.ts');
const companyOriginal = fs.readFileSync(company, 'utf8');
fs.writeFileSync(company, companyOriginal.replace("validTo: '11 March 2027'", "validTo: 'the eleventh of March, 2027'"));
r = run(FAKE);
expect('fails closed on an unreadable date field', r.code === 1 && r.out.includes('"ISO 27001:2022".validTo holds no date this check can read'), `exit ${r.code}`);
fs.writeFileSync(company, companyOriginal);

// 7. A date written inside another field (not a date field) is still a certificate date.
fs.writeFileSync(company, companyOriginal.replace("note: 'Quality management system'", "note: 'Quality management system, audited 5 June 2026'"));
plant('Audited 5 June 2026.');
r = run(FAKE);
expect('a date inside a note is treated as a certificate date', r.code === 1 && r.out.includes('"ISO 9001:2015".note, written day month year'), `exit ${r.code}`);
fs.writeFileSync(company, companyOriginal);
fs.writeFileSync(page, pageOriginal);

// 8. A date and register content together: both are reported, and the scan still fails.
plant('Valid to 11 March 2027. publicationInstruction');
r = run(SITE);
expect('reports a date and register content together', r.code === 1 && r.out.includes('A CERTIFICATE DATE IS IN PUBLIC OUTPUT') && r.out.includes('INTERNAL REGISTER CONTENT IS IN PUBLIC OUTPUT'), `exit ${r.code}`);
fs.writeFileSync(page, pageOriginal);

console.log(`\n${failures ? `${failures} FAILED` : 'ALL PASSED'} (${checks} checks)`);
fs.unlinkSync(path.join(FAKE, 'node_modules'));
fs.rmSync(SP, { recursive: true, force: true });
process.exit(failures ? 1 : 0);
