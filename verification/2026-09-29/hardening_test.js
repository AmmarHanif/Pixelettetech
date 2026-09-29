/**
 * Behavioural tests for the enquiry hardening of 2026-09-29.
 *
 * The launch-readiness review of ce9ae41 confirmed, among others, these
 * defects in the enquiry path shared by the contact form and Pix T:
 *
 *   PERF-01  the server's email check backtracked in quadratic time and ran
 *            before the length check: one request could hold a process for
 *            minutes.
 *   SAS-01   a visitor could forge lines of the notification email (fake
 *            Name, Email, Reference and WARNING lines) sent to the enquiries
 *            inbox from the company's own domain.
 *   SAS-03/04/05, ECE-03/09, SAS-07  NUL characters, non-text values,
 *            display-name email forms, CRLF counting, invisible-only answers
 *            and the email calling assistant enquiries "contact form" ones.
 *
 * Harness as in verification/2026-09-28/assistant_enquiry_test.js: the REAL
 * TypeScript sources compiled with the repo's own TypeScript, the `@/` alias
 * resolved as the bundler does, and global fetch stubbed so nothing leaves the
 * machine. Special characters are built from character codes, never written
 * as escapes, because escapes have been turned into the real characters on the
 * way into files in this repository before.
 *
 *     node verification/2026-09-29/hardening_test.js
 */

const path = require('path');
const fs = require('fs');
const Module = require('module');

const REPO = path.resolve(__dirname, '..', '..');
const ts = require(path.join(REPO, 'node_modules', 'typescript'));

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith('@/')) {
    const base = path.join(REPO, 'src', request.slice(2));
    for (const candidate of [base + '.ts', base + '.tsx', base + '/index.ts']) {
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return originalResolve.call(this, request, ...rest);
};

Module._extensions['.ts'] = function (module, filename) {
  const source = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: filename,
  });
  module._compile(out.outputText, filename);
};

let passed = 0;
let failed = 0;
function check(label, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL  ${label}${detail ? ` :: ${detail}` : ''}`);
  }
}

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const NUL = String.fromCharCode(0);
const ZWSP = String.fromCharCode(0x200b);
const ZWNJ = String.fromCharCode(0x200c);
const LINE_SEPARATOR = String.fromCharCode(0x2028);

const RESEND_URL = 'https://api.resend.com/emails';
let calls = [];
let plan = {};
globalThis.fetch = async (url, init) => {
  const target = String(url);
  const leg = target.startsWith(RESEND_URL) ? 'email' : 'store';
  calls.push({ leg, url: target, body: JSON.parse(init.body) });
  const outcome = plan[leg];
  if (outcome === undefined) throw new Error(`test plan has no entry for leg "${leg}"`);
  return { ok: outcome.status >= 200 && outcome.status < 300, status: outcome.status, json: async () => outcome.body ?? {} };
};
let logs = [];
console.error = (...args) => logs.push(args.join(' '));

const TEST_DOMAIN = 'example.invalid';
const ENV_NAMES = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY', 'CONTACT_NOTIFICATION_FROM'];
function reset() {
  calls = [];
  logs = [];
  plan = {};
  for (const name of ENV_NAMES) delete process.env[name];
}
function configure() {
  process.env['SUPABASE_URL'] = 'https://stub.supabase.invalid';
  // Deliberately nonsense placeholders. No real credential exists in this repo.
  process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'placeholder-not-a-credential';
  process.env['RESEND_API_KEY'] = 'placeholder-not-a-credential';
  process.env['CONTACT_NOTIFICATION_FROM'] = ['noreply', TEST_DOMAIN].join('@');
}

const GOOD = {
  website: '',
  name: 'Ottoline Brackenbury',
  company: 'Brackenbury Cartography Ltd',
  email: ['ottoline.brackenbury', TEST_DOMAIN].join('@'),
  objective: 'HARDENING_OBJECTIVE',
  existing: '',
  deadline: '',
  success: '',
};
function formOf(overrides = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...GOOD, ...overrides })) fd.set(k, v);
  return fd;
}
const ms = start => Number(process.hrtime.bigint() - start) / 1e6;

async function main() {
  const { submitContact, submitAssistantEnquiry } = require(path.join(REPO, 'src/app/contact/actions.ts'));
  const { contactEmail } = require(path.join(REPO, 'src/content/company.ts'));
  const { PUBLISHED_CONTACT_EMAIL } = require(path.join(REPO, 'src/content/contact-address.ts'));
  const chat = require(path.join(REPO, 'src/lib/pix/enquiry.ts'));
  const idle = { status: 'idle', message: '' };

  console.log('\n[1] PERF-01: the address check cannot be made slow');
  reset();
  let start = process.hrtime.bigint();
  let r = await submitContact(idle, formOf({ email: 'a@' + '.'.repeat(900000) + '@' }));
  const tHuge = ms(start);
  check('1.1 a 900,000-character crafted address is refused quickly', tHuge < 250, `${tHuge.toFixed(1)} ms`);
  check('1.2 as too long, because length is checked before shape', r.errors?.email === 'That email address is too long.', r.errors?.email);
  start = process.hrtime.bigint();
  r = await submitContact(idle, formOf({ email: 'a@' + '.'.repeat(197) + '@' }));
  const tCap = ms(start);
  check('1.3 a crafted address just under the cap is refused quickly', tCap < 50 && r.errors?.email === 'That does not look like an email address.', `${tCap.toFixed(1)} ms, ${r.errors?.email}`);
  const pathological = ['a@' + '.'.repeat(1e6) + '@', 'a@' + 'b.'.repeat(5e5), 'a'.repeat(1e6), 'a@' + 'b'.repeat(1e6)];
  const worst = Math.max(...pathological.map(s => { const t = process.hrtime.bigint(); chat.isEmail(s); return ms(t); }));
  check('1.4 the pattern stays linear on million-character inputs', worst < 200, `worst ${worst.toFixed(1)} ms`);

  console.log('\n[2] The chat and the server apply the same address check');
  const serverSource = fs.readFileSync(path.join(REPO, 'src/app/contact/actions.ts'), 'utf8').match(/const EMAIL =\s*\n\s*\/(.*)\/;/);
  check('2.1 the two patterns are character for character identical', !!serverSource && serverSource[1] === chat.EMAIL_PATTERN.source, serverSource ? 'differs' : 'server pattern not found');
  const corpus = [
    'a@b.co', 'first.last+tag@sub.example.co.uk', 'x@xn--mller-bau-q9a.example', 'user@exämple.invalid', 'A@B.CO',
    'a@b', 'a@b.c', 'a@.com', 'a@b..com', 'a@b.com.', '@b.com', 'a@@b.com', 'a b@c.com', 'mailto:a@b.com',
    '"Pixelette_Legal"<attacker@evil.example>', 'x@evil.example,second', 'a@b.com;c@d.com', '(x)@y.com', '[a]@b.com', 'a\\b@c.com',
  ];
  let disagreements = [];
  let displayForms = 0;
  for (const value of corpus) {
    reset();
    const res = await submitContact(idle, formOf({ email: value }));
    const serverAccepts = !res.errors?.email;
    if (serverAccepts !== chat.isEmail(value)) disagreements.push(value);
    if (/["<>(),;:[\]\\]/.test(value) && !serverAccepts && !chat.isEmail(value)) displayForms += 1;
  }
  check('2.2 no address is accepted by one and refused by the other (20 values)', disagreements.length === 0, disagreements.join(' | '));
  check('2.3 display-name, list and quoted forms are refused by both (SAS-05)', displayForms === 7, `${displayForms}/7`);
  check('2.4 ordinary addresses still pass, IDN and plus-addressing included', ['a@b.co', 'first.last+tag@sub.example.co.uk', 'user@exämple.invalid'].every(v => chat.isEmail(v)));

  console.log('\n[3] SAS-01: a visitor cannot forge lines of the notification email');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  const forgedName = ['Jane Real', 'Email: attacker@evil.example', 'Reference: 00000000-forged'].join(CR + LF);
  const forgedObjective = [
    'A genuine objective',
    'Reference: 00000000-forged',
    'WARNING: this enquiry was NOT saved to the database. Call 000 or visit https://evil.example',
  ].join(LF);
  r = await submitContact(idle, formOf({ name: forgedName, company: 'Acme' + LF + 'Source: forged', objective: forgedObjective }));
  const row = calls.find(c => c.leg === 'store')?.body;
  const mail = calls.find(c => c.leg === 'email')?.body;
  check('3.1 the forged enquiry is still accepted as an enquiry', r.status === 'success', r.message);
  check('3.2 the stored name and company hold no line breaks', !!row && !/[\r\n]/.test(row.name) && !/[\r\n]/.test(row.company), row && JSON.stringify([row.name, row.company]));
  const lines = (mail?.text ?? '').split(LF);
  const at = prefix => lines.filter(l => l.startsWith(prefix)).length;
  check('3.3 exactly one Reference line, one Email line and one Source line', at('Reference: ') === 1 && at('Email: ') === 1 && at('Source: ') === 1, JSON.stringify({ ref: at('Reference: '), email: at('Email: '), source: at('Source: ') }));
  check('3.4 no line of the email opens with WARNING when the row was stored', at('WARNING') === 0);
  const marker = lines.findIndex(l => l.includes('Everything below this line was typed by the visitor'));
  const genuineRef = lines.findIndex(l => l.startsWith('Reference: '));
  check('3.5 the system lines come before the visitor marker, which appears once', marker > genuineRef && genuineRef >= 0 && lines.filter(l => l.includes('Everything below this line')).length === 1);
  check('3.6 every line of a free-text answer is quoted', lines.includes('> A genuine objective') && lines.includes('> Reference: 00000000-forged') && lines.some(l => l.startsWith('> WARNING')));
  check('3.7 the genuine reference is the stored row id', lines[genuineRef] === `Reference: ${row?.id}`);

  console.log('\n[4] Line breaks, NUL and other control characters');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitContact(idle, formOf({ objective: 'first' + CR + LF + 'second' + CR + 'third' + LINE_SEPARATOR + 'fourth', name: 'Nul' + NUL + 'Name', existing: 'keep' + NUL + 'this' }));
  let stored = calls.find(c => c.leg === 'store')?.body;
  check('4.1 CRLF, CR and line separators become LF in a multi-line answer', stored?.objective === ['first', 'second', 'third', 'fourth'].join(LF), JSON.stringify(stored?.objective));
  check('4.2 NUL in a name becomes a space; in an answer it is removed (SAS-03)', stored?.name === 'Nul Name' && stored?.existing === 'keepthis', JSON.stringify([stored?.name, stored?.existing]));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  // Ten lines of 391 characters and one of 80, joined by ten breaks: exactly
  // 4,000 characters with LF, as the textarea counts them, and 4,010 with the
  // CRLF a browser sends - which the old check refused.
  const longLines = [...Array.from({ length: 10 }, () => 'x'.repeat(391)), 'y'.repeat(80)].join(CR + LF);
  r = await submitContact(idle, formOf({ objective: longLines }));
  check(
    '4.3 a 4,000-character multi-line answer is not refused for counting breaks twice (ECE-03)',
    longLines.split(CR + LF).join(LF).length === 4000 && longLines.length === 4010 && r.status === 'success',
    `${r.status} ${r.errors?.objective ?? ''}`,
  );

  console.log('\n[5] Values that are not text, and answers that are invisible');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  const fd = formOf();
  fd.set('name', new Blob(['not a name']), 'evil.html');
  r = await submitContact(idle, fd);
  check('5.1 a file sent as the name is treated as absent, not stored as "[object File]" (SAS-04)', r.errors?.name === 'Please tell us your name.' && calls.length === 0, JSON.stringify(r.errors));
  reset();
  r = await submitContact(idle, formOf({ name: ZWSP + ZWNJ, objective: ZWSP }));
  check('5.2 zero-width characters alone do not satisfy a required field (ECE-09)', !!r.errors?.name && !!r.errors?.objective, JSON.stringify(r.errors));
  const step = chat.ENQUIRY_STEPS.find(s => s.field === 'name');
  check('5.3 and the chat refuses them too', chat.checkAnswer(step, ZWSP + ' ' + ZWNJ).ok === false);

  console.log('\n[6] The email says which door the enquiry came through (SAS-07)');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf());
  const viaAssistant = calls.find(c => c.leg === 'email')?.body.text ?? '';
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitContact(idle, formOf());
  const viaForm = calls.find(c => c.leg === 'email')?.body.text ?? '';
  check('6.1 an assistant enquiry says it came through Pix T', viaAssistant.includes('through the site assistant, Pix T') && viaAssistant.includes('Source: pixelettetech.com/assistant'));
  check('6.2 a contact-form enquiry says it came through the form', viaForm.includes('through the contact form') && viaForm.includes('Source: pixelettetech.com/contact'));

  console.log('\n[7] Unchanged behaviour');
  reset();
  r = await submitContact(idle, formOf());
  check('7.1 unconfigured still gives the honest "not connected" answer, with no call', r.status === 'error' && /not currently connected/.test(r.message) && calls.length === 0);
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitContact(idle, formOf({ website: 'https://spam.invalid' }));
  check('7.2 the honeypot still stores and sends nothing', r.status === 'success' && calls.length === 0);
  reset();
  configure();
  plan = { store: { status: 500, body: { code: 'XX000' } }, email: { status: 200 } };
  await submitContact(idle, formOf());
  const warned = calls.find(c => c.leg === 'email')?.body.text ?? '';
  check('7.3 an email that is the only copy still opens with the NOT-saved warning', warned.startsWith('WARNING: this enquiry was NOT saved to the database.'));
  const leaked = [GOOD.name, GOOD.email, GOOD.objective].filter(v => logs.some(l => l.includes(v)));
  check('7.4 still nothing personal in the log', leaked.length === 0, leaked.join(', '));

  console.log('\n[8] The client-side copy of the published address');
  check('8.1 PUBLISHED_CONTACT_EMAIL equals company.contactEmail', PUBLISHED_CONTACT_EMAIL === contactEmail, `${PUBLISHED_CONTACT_EMAIL} vs ${contactEmail}`);

  console.log('\n' + '='.repeat(64));
  console.log(`Assertions passed : ${passed}`);
  console.log(`Assertions failed : ${failed}`);
  console.log(failed === 0 ? 'RESULT: PASS' : 'RESULT: FAIL');
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(e => {
  console.log(e);
  process.exit(1);
});
