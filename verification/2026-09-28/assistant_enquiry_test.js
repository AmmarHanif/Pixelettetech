/**
 * Behavioural tests for the enquiry Pix T takes in the chat.
 *
 * The assistant submits through `submitAssistantEnquiry`, the contact form's
 * server action with a different `source`. The claim that needs proving is the
 * one the Privacy Notice depends on: an enquiry sent from the assistant is the
 * SAME enquiry as one sent from the form - the same fields, the same checks,
 * the same honeypot, the same honest failures, stored and notified the same
 * way - and nothing else about the visitor goes with it.
 *
 * Harness copied from verification/2026-09-14/contact_action_test.js: the REAL
 * TypeScript sources compiled with the repo's own TypeScript, the `@/` alias
 * resolved as the bundler does, global fetch stubbed so no network call is
 * made. Unlike that file, the repository is found relative to this one, so it
 * runs from any checkout.
 *
 *     node verification/2026-09-28/assistant_enquiry_test.js
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

const RESEND_URL = 'https://api.resend.com/emails';
let calls = [];
let plan = {};
globalThis.fetch = async (url, init) => {
  const target = String(url);
  const leg = target.startsWith(RESEND_URL) ? 'email' : 'store';
  calls.push({ leg, url: target, body: JSON.parse(init.body), headers: init.headers || {} });
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

const PII = {
  name: 'Ottoline Brackenbury',
  company: 'Brackenbury Cartography Ltd',
  email: ['ottoline.brackenbury', TEST_DOMAIN].join('@'),
  objective: 'ASSISTANT_OBJECTIVE_ECHO',
  existing: 'ASSISTANT_EXISTING_FOXTROT',
  deadline: 'ASSISTANT_DEADLINE_GOLF',
  success: 'ASSISTANT_SUCCESS_HOTEL',
};
function formOf(overrides = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ website: '', ...PII, ...overrides })) fd.set(k, v);
  return fd;
}

async function main() {
  const { submitAssistantEnquiry, submitContact } = require(path.join(REPO, 'src/app/contact/actions.ts'));
  const { contactEmail } = require(path.join(REPO, 'src/content/company.ts'));
  const idle = { status: 'idle', message: '' };

  console.log('\n[1] Unconfigured - the state every environment ships in');
  reset();
  let r = await submitAssistantEnquiry(idle, formOf());
  check('1.1 honest "not connected" error, not a success', r.status === 'error' && /not currently connected/.test(r.message), r.message);
  check('1.2 it names the address a person reads', r.message.includes(contactEmail));
  check('1.3 no outbound call at all', calls.length === 0, `${calls.length} call(s)`);

  console.log('\n[2] Configured - stored and notified exactly as the form would be');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitAssistantEnquiry(idle, formOf());
  const store = calls.find(c => c.leg === 'store');
  const email = calls.find(c => c.leg === 'email');
  check('2.1 the visitor is told it was received', r.status === 'success', r.message);
  check('2.2 stored in the same table as the contact form', !!store && store.url.endsWith('/rest/v1/contact_enquiries'), store && store.url);
  check('2.3 the row records that it came from the assistant', store && store.body.source === 'pixelettetech.com/assistant', store && store.body.source);
  /* Updated 2026-09-29. The four lead_* columns are the founder's lead score,
     which the published Notice does not yet describe: its replacement wording is
     drafted (PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md) and
     scripts/check-privacy-interlock.mjs fails the build until it is published.
     Anything else in the row still fails here. */
  const allowed = ['id', 'name', 'company', 'email', 'objective', 'existing', 'deadline', 'success', 'source', 'created_at'];
  const lead = ['lead_ref', 'lead_score', 'lead_band', 'lead_reasons'];
  const extra = store ? Object.keys(store.body).filter(k => !allowed.includes(k) && !lead.includes(k)) : ['(no row)'];
  check('2.4 the row holds nothing beyond the Notice\'s fields and the drafted lead score', extra.length === 0, extra.join(', '));
  check('2.5 the row carries the four answers', store && store.body.objective === PII.objective && store.body.success === PII.success);
  check('2.6 the notification goes to the published address', !!email && JSON.stringify(email.body.to) === JSON.stringify([contactEmail]));
  check('2.7 the notification says where the enquiry came from', !!email && email.body.text.includes('Source: pixelettetech.com/assistant'));
  check('2.8 nothing logged on the happy path', logs.length === 0, logs.join(' | '));

  console.log('\n[3] The same checks as the contact form');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  const bare = await submitAssistantEnquiry(idle, formOf({ objective: '', email: 'not-an-address' }));
  const viaForm = await submitContact(idle, formOf({ objective: '', email: 'not-an-address' }));
  check('3.1 a missing objective and a bad email are refused', bare.status === 'error' && !!bare.errors?.objective && !!bare.errors?.email);
  check('3.2 with the same field errors the form gives', JSON.stringify(bare.errors) === JSON.stringify(viaForm.errors));
  check('3.3 nothing was sent for an invalid enquiry', calls.length === 0, `${calls.length} call(s)`);

  console.log('\n[4] The honeypot');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitAssistantEnquiry(idle, formOf({ website: 'https://spam.invalid' }));
  check('4.1 a bot is shown the ordinary success message', r.status === 'success');
  check('4.2 and nothing is stored or sent', calls.length === 0, `${calls.length} call(s)`);

  console.log('\n[5] Nothing personal in logs when delivery fails');
  reset();
  configure();
  plan = { store: { status: 500, body: { code: 'XX000' } }, email: { status: 500, body: { name: 'internal_error' } } };
  r = await submitAssistantEnquiry(idle, formOf());
  check('5.1 a total failure is admitted, with the fallback address', r.status === 'error' && r.message.includes(contactEmail), r.message);
  const leaked = Object.values(PII).filter(v => logs.some(l => l.includes(v)));
  check('5.2 no name, address or answer reached the log', leaked.length === 0, leaked.join(', '));

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
