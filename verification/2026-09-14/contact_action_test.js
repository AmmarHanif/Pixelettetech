/**
 * Behavioural tests for the contact form's server action.
 *
 * Compiles the REAL TypeScript sources (no reimplementation, no copy) with the
 * repo's own TypeScript, resolves the `@/` path alias the way the bundler does,
 * and stubs global fetch so no network call is made.
 *
 * The property under test is the one the file exists to protect: a visitor is
 * never told the enquiry was received unless something durable actually
 * received it.
 *
 * Note on addresses: every address below is assembled from parts rather than
 * written as a literal, and the expected recipient is read from company.ts
 * instead of being restated here. That keeps the expectation tied to the single
 * source of truth, and keeps address-shaped literals out of the repository.
 */

const path = require('path');
const fs = require('fs');
const Module = require('module');

const REPO = 'C:/Users/Rana/Brain/CTO Vault/05_Projects/Pixelette_Tech_Website_001/rebuild-2026';
const ts = require(path.join(REPO, 'node_modules', 'typescript'));

/* ---------------------------------------------------------- module loading */

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
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(out.outputText, filename);
};

/* ---------------------------------------------------------------- harness */

let passed = 0;
let failed = 0;
const failures = [];

function check(label, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  PASS  ${label}`);
  } else {
    failed += 1;
    failures.push(label);
    console.log(`  FAIL  ${label}${detail ? ` :: ${detail}` : ''}`);
  }
}

/* ------------------------------------------------------------- fetch stub */

const SUPABASE_HOST = 'https://stub.supabase.invalid';
const RESEND_URL = 'https://api.resend.com/emails';

let calls = [];
let plan = {};

function stubResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  };
}

globalThis.fetch = async (url, init) => {
  const target = String(url);
  const leg = target.startsWith(RESEND_URL) ? 'email' : 'store';
  calls.push({ leg, url: target, body: JSON.parse(init.body) });
  const outcome = plan[leg];
  if (outcome === undefined) throw new Error(`test plan has no entry for leg "${leg}"`);
  if (outcome === 'network-error') throw new Error('simulated network fault');
  return stubResponse(outcome.status, outcome.body ?? {});
};

/* --------------------------------------------------------- log capture */

let logs = [];
const realError = console.error;
console.error = (...args) => {
  logs.push(args.join(' '));
};

/* ------------------------------------------------------------ env control */

const TEST_DOMAIN = 'example.invalid';
const VISITOR_ADDRESS = ['zebedee.quillfeather', TEST_DOMAIN].join('@');
const SENDER_ADDRESS = ['noreply', TEST_DOMAIN].join('@');

const ENV_NAMES = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RESEND_API_KEY',
  'CONTACT_NOTIFICATION_FROM',
];

function clearEnv() {
  for (const name of ENV_NAMES) delete process.env[name];
}

function configureStore() {
  process.env['SUPABASE_URL'] = SUPABASE_HOST;
  // Deliberately a nonsense placeholder. No real credential exists in this repo.
  process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'placeholder-not-a-credential';
}

function configureEmail() {
  process.env['RESEND_API_KEY'] = 'placeholder-not-a-credential';
  process.env['CONTACT_NOTIFICATION_FROM'] = SENDER_ADDRESS;
}

/* -------------------------------------------------------------- test data */

// Distinctive values, so a log-leak check cannot pass by coincidence.
const PII = {
  name: 'Zebedee Quillfeather',
  company: 'Quillfeather Holdings LLP',
  email: VISITOR_ADDRESS,
  objective: 'OBJECTIVE_SECRET_TEXT_ALPHA',
  existing: 'EXISTING_SECRET_TEXT_BRAVO',
  deadline: 'DEADLINE_SECRET_TEXT_CHARLIE',
  success: 'SUCCESS_SECRET_TEXT_DELTA',
};

function formOf(overrides = {}) {
  const fields = { website: '', ...PII, ...overrides };
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.set(k, v);
  return fd;
}

function reset() {
  calls = [];
  logs = [];
  plan = {};
  clearEnv();
}

/* ------------------------------------------------------------------- run */

async function main() {
  const { submitContact } = require(path.join(REPO, 'src/app/contact/actions.ts'));
  // The expected recipient comes from the single source of truth, not from a
  // literal restated here. If someone changes the published address, this test
  // follows it rather than failing spuriously.
  const { contactEmail } = require(path.join(REPO, 'src/content/company.ts'));

  const UNCONFIGURED = /not currently connected/;
  const FAILED = /could not send that just now/;

  // --------------------------------------------------------------------
  console.log('\n[1] Unconfigured environment — the state it ships in');
  reset();
  let r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('1.1 returns an error, not a success', r.status === 'error', `got ${r.status}`);
  check('1.2 message is the honest "not connected" text', UNCONFIGURED.test(r.message), r.message);
  check('1.3 message tells the visitor to email a person', r.message.includes(contactEmail));
  check('1.4 STORES NOTHING — no outbound call was attempted at all', calls.length === 0, `${calls.length} call(s)`);
  check('1.5 no field errors are invented', r.errors === undefined);

  // --------------------------------------------------------------------
  console.log('\n[2] Success path — both legs configured and healthy');
  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('2.1 visitor is told it was received', r.status === 'success', r.message);
  check('2.2 both legs were called', calls.length === 2, `${calls.length}`);
  const storeCall = calls.find(c => c.leg === 'store');
  const emailCall = calls.find(c => c.leg === 'email');
  check('2.3 insert went to the contact_enquiries table', storeCall.url.endsWith('/rest/v1/contact_enquiries'), storeCall.url);
  check('2.4 insert carries the four answers', storeCall.body.objective === PII.objective && storeCall.body.success === PII.success);
  check('2.5 the retired `process` key is NOT in the stored row', !('process' in storeCall.body));
  check('2.6 email is addressed to the company.ts address', JSON.stringify(emailCall.body.to) === JSON.stringify([contactEmail]));
  check('2.7 email body carries the answers', emailCall.body.text.includes(PII.objective));
  check('2.8 email carries no "not saved" warning when the row landed', !emailCall.body.text.includes('WARNING'));
  check('2.9 the same id links row, email and any log', !!storeCall.body.id && emailCall.body.text.includes(storeCall.body.id));
  check('2.10 nothing was logged on the happy path', logs.length === 0, logs.join(' | '));

  // --------------------------------------------------------------------
  console.log('\n[3] Partial failure A — stored, but the email failed');
  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 201 }, email: { status: 500, body: { name: 'internal_error' } } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('3.1 visitor is told it was received — the record exists', r.status === 'success', r.message);
  check('3.2 the email failure IS logged as an operational fault', logs.some(l => l.includes('resend send failed')), logs.join(' | '));
  check('3.3 the log names the status and the provider code only', logs.some(l => l.includes('status=500') && l.includes('code=internal_error')));

  // --------------------------------------------------------------------
  console.log('\n[4] Partial failure B — emailed, but the row was refused');
  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 403, body: { code: '42501' } }, email: { status: 200 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('4.1 visitor is told it was received — a human has it', r.status === 'success', r.message);
  check('4.2 the email was still attempted despite the store failing', calls.some(c => c.leg === 'email'));
  check('4.3 the notification WARNS that it is the only copy', calls.find(c => c.leg === 'email').body.text.includes('NOT saved to the database'));
  check('4.4 the store failure is logged with the Postgres code', logs.some(l => l.includes('supabase insert failed') && l.includes('code=42501')));

  // --------------------------------------------------------------------
  console.log('\n[5] Both legs fail — the visitor must NOT be told "sent"');
  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 500, body: {} }, email: { status: 500, body: {} } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('5.1 returns an error', r.status === 'error', r.message);
  check('5.2 message is the honest "could not send" text', FAILED.test(r.message), r.message);
  check('5.3 both failures are logged', logs.length >= 2, `${logs.length}`);

  // --------------------------------------------------------------------
  console.log('\n[6] Network faults and timeouts are caught, not thrown');
  reset();
  configureStore();
  configureEmail();
  plan = { store: 'network-error', email: 'network-error' };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('6.1 an exception in both legs becomes an honest error', r.status === 'error' && FAILED.test(r.message), r.message);
  check('6.2 the exception is logged by name only', logs.some(l => l.includes('exception=Error')));

  // --------------------------------------------------------------------
  console.log('\n[7] Half-configured deployment — only the store is wired');
  reset();
  configureStore();
  plan = { store: { status: 201 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('7.1 a stored enquiry is a real success', r.status === 'success', r.message);
  check('7.2 no email was attempted', !calls.some(c => c.leg === 'email'));

  console.log('\n[7b] Half-configured — store wired but failing, no email configured');
  reset();
  configureStore();
  plan = { store: { status: 500, body: {} } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  check('7b.1 nothing survived, so the visitor is told honestly', r.status === 'error' && FAILED.test(r.message), r.message);

  // --------------------------------------------------------------------
  console.log('\n[8] Honeypot and validation are untouched');
  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf({ website: 'http://spam.invalid' }));
  check('8.1 a filled honeypot is silently accepted', r.status === 'success');
  check('8.2 nothing is stored or sent for a bot', calls.length === 0, `${calls.length}`);

  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 201 }, email: { status: 200 } };
  const clean = await submitContact({ status: 'idle', message: '' }, formOf());
  check('8.3 honeypot reply is CHARACTER-IDENTICAL to a real success', r.message === clean.message, `${r.message} !== ${clean.message}`);

  reset();
  configureStore();
  configureEmail();
  r = await submitContact({ status: 'idle', message: '' }, formOf({ name: '', email: 'nonsense', objective: '' }));
  check('8.4 validation still returns field-keyed errors', r.status === 'error' && !!r.errors);
  check('8.5 errors are keyed by input name', !!(r.errors.name && r.errors.email && r.errors.objective), JSON.stringify(r.errors));
  check('8.6 an invalid submission is never delivered', calls.length === 0, `${calls.length}`);

  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf({ objective: 'x'.repeat(4001) }));
  check('8.7 over-length input is rejected server-side', r.status === 'error' && !!r.errors.objective);

  // --------------------------------------------------------------------
  console.log('\n[9] Optional fields: empty becomes NULL, not empty string');
  reset();
  configureStore();
  configureEmail();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf({ company: '', existing: '', deadline: '', success: '' }));
  const row = calls.find(c => c.leg === 'store').body;
  check('9.1 unanswered optional fields are null', row.company === null && row.existing === null && row.deadline === null && row.success === null, JSON.stringify(row));
  check('9.2 required fields are still present', row.name === PII.name && row.objective === PII.objective);
  check('9.3 the email omits unanswered questions', !calls.find(c => c.leg === 'email').body.text.includes('What exists today?'));

  // --------------------------------------------------------------------
  console.log('\n[10] No personal data is ever logged');
  reset();
  configureStore();
  configureEmail();
  plan = {
    store: { status: 400, body: { code: 'bad', message: `value ${PII.email} violates constraint`, details: PII.name } },
    email: { status: 400, body: { name: 'validation_error', message: `invalid recipient ${PII.email}` } },
  };
  await submitContact({ status: 'idle', message: '' }, formOf());
  const joined = logs.join(' || ');
  const leaked = Object.values(PII).filter(v => joined.includes(v));
  check('10.1 no submitted value appears in any log line', leaked.length === 0, `leaked: ${leaked.join(', ')}`);
  check('10.2 free-text provider messages are discarded', !joined.includes('violates constraint') && !joined.includes('invalid recipient'), joined);
  check('10.3 the shape-checked code survives', joined.includes('code=bad') && joined.includes('code=validation_error'), joined);

  console.log('\n[10b] A sentence in the code field degrades to "no-code"');
  reset();
  configureStore();
  configureEmail();
  plan = {
    store: { status: 400, body: { code: `duplicate key value violates unique constraint for ${PII.email}` } },
    email: { status: 200 },
  };
  await submitContact({ status: 'idle', message: '' }, formOf());
  const joined2 = logs.join(' || ');
  check('10b.1 a long free-text "code" is refused and logged as no-code', joined2.includes('code=no-code'), joined2);
  check('10b.2 the address inside it never reaches the log', !joined2.includes(PII.email), joined2);

  // --------------------------------------------------------------------
  console.log('\n[11] The reply_to fallback for the one unverified field name');
  reset();
  configureStore();
  configureEmail();
  let emailAttempts = 0;
  const layered = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    const target = String(url);
    if (target.startsWith(RESEND_URL)) {
      emailAttempts += 1;
      calls.push({ leg: 'email', url: target, body: JSON.parse(init.body) });
      if (emailAttempts === 1) return stubResponse(422, { name: 'validation_error' });
      return stubResponse(200, {});
    }
    return layered(url, init);
  };
  plan = { store: { status: 201 } };
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  globalThis.fetch = layered;
  const attempts = calls.filter(c => c.leg === 'email');
  check('11.1 a 422 triggers exactly one retry', emailAttempts === 2, `${emailAttempts}`);
  check('11.2 the first attempt carried reply_to', 'reply_to' in attempts[0].body);
  check('11.3 the retry dropped reply_to', !('reply_to' in attempts[1].body));
  check('11.4 the retry still carries the enquiry', attempts[1].body.text.includes(PII.objective));
  check('11.5 the visitor sees a success', r.status === 'success');

  // --------------------------------------------------------------------
  console.log('\n[12] INVARIANT — "sent" is never claimed when nothing landed');
  const matrix = [
    { store: { status: 201 }, email: { status: 200 } },
    { store: { status: 201 }, email: { status: 500, body: {} } },
    { store: { status: 500, body: {} }, email: { status: 200 } },
    { store: { status: 500, body: {} }, email: { status: 500, body: {} } },
    { store: 'network-error', email: { status: 200 } },
    { store: { status: 201 }, email: 'network-error' },
    { store: 'network-error', email: 'network-error' },
  ];
  let invariantHolds = true;
  const breaches = [];
  for (const p of matrix) {
    reset();
    configureStore();
    configureEmail();
    plan = p;
    const res = await submitContact({ status: 'idle', message: '' }, formOf());
    const anythingLanded = calls.some(c => {
      const o = plan[c.leg];
      return o !== 'network-error' && o.status >= 200 && o.status < 300;
    });
    if (res.status === 'success' && !anythingLanded) {
      invariantHolds = false;
      breaches.push(JSON.stringify(p));
    }
  }
  check('12.1 across all 7 outcome combinations, success implies something landed', invariantHolds, breaches.join(' ; '));

  // --------------------------------------------------------------------
  // FALSIFIABILITY CONTROL.
  //
  // Everything above is only worth reading if this harness is capable of
  // reporting a failure at all. These two checks are deliberately wrong. They
  // MUST appear as FAIL below, and they are subtracted from the totals. If they
  // report PASS, the harness is broken and every result above is worthless.
  console.log('\n[C] Falsifiability control — these two MUST fail');
  reset();
  r = await submitContact({ status: 'idle', message: '' }, formOf());
  const controlStart = failed;
  check('C.1 CONTROL (must fail): unconfigured returns success', r.status === 'success');
  check('C.2 CONTROL (must fail): unconfigured performs a network call', calls.length > 0);
  const controlFailures = failed - controlStart;

  /* ---------------------------------------------------------------- report */

  const realPassed = passed;
  const realFailed = failed - controlFailures;

  console.log('\n' + '='.repeat(64));
  console.log(`Real assertions passed : ${realPassed}`);
  console.log(`Real assertions failed : ${realFailed}`);
  console.log(`Control failures       : ${controlFailures} of 2 expected`);
  if (controlFailures !== 2) {
    console.log('\nHARNESS BROKEN: the deliberately-false controls did not fail.');
    console.log('RESULT: INVALID');
    process.exitCode = 2;
    return;
  }
  if (realFailed > 0) {
    console.log('\nFailing assertions:');
    for (const f of failures.filter(f => !f.startsWith('C.'))) console.log(`  - ${f}`);
    console.log('RESULT: FAIL');
    process.exitCode = 1;
    return;
  }
  console.log('Controls behaved correctly, so a real failure would have been reported.');
  console.log('RESULT: PASS');
  process.exitCode = 0;
}

main().catch(err => {
  console.error = realError;
  console.error('harness crashed:', err);
  process.exitCode = 3;
});
