/**
 * Behavioural tests for Pix T lead capture, added 2026-09-29 on the founder's
 * instruction: "At the start ask for name and email then start chatting. Hi
 * (Visitor Name) Greetings how Can i help you? Discover what he want. Lead
 * Scoring Email Alert Store in Supabase."
 *
 *   [1] the scoring rules, band by band, and that they explain themselves
 *   [2] the chat's own steps: the name, the email, the greeting, discovery
 *   [3] startAssistantChat: the contact recorded before chatting
 *   [4] the scored enquiry: the row, the reference, the alert
 *   [5] a database without the lead columns loses the score, not the lead
 *   [6] the privacy interlock refuses a build that would ship the gate before
 *       the Privacy Statement describes it (needs a build: next build first)
 *
 * Harness as in hardening_test.js: the REAL TypeScript sources compiled with
 * the repo's own TypeScript, the `@/` alias resolved as the bundler does, and
 * global fetch stubbed so nothing leaves the machine. Placeholders only; no
 * credential exists in this repository.
 *
 *     node verification/2026-09-29/lead_capture_test.js
 */

const path = require('path');
const fs = require('fs');
const os = require('os');
const Module = require('module');
const { spawnSync } = require('child_process');

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

/* Every outbound call is recorded and answered from the plan, by leg. A plan
   entry may be a list, answered in order, for a leg called more than once. */
const RESEND_URL = 'https://api.resend.com/emails';
let calls = [];
let plan = {};
globalThis.fetch = async (url, init) => {
  const target = String(url);
  const leg = target.startsWith(RESEND_URL)
    ? 'email'
    : target.endsWith('/rest/v1/assistant_contacts')
      ? 'contact'
      : 'store';
  calls.push({ leg, url: target, body: JSON.parse(init.body) });
  const entry = plan[leg];
  const outcome = Array.isArray(entry) ? entry.shift() : entry;
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
  process.env['SUPABASE_SERVICE_ROLE_KEY'] = 'placeholder-not-a-credential';
  process.env['RESEND_API_KEY'] = 'placeholder-not-a-credential';
  process.env['CONTACT_NOTIFICATION_FROM'] = ['noreply', TEST_DOMAIN].join('@');
}

const WORK_EMAIL = ['ottoline.brackenbury', TEST_DOMAIN].join('@');
const LEAD = {
  website: '',
  name: 'Ottoline Brackenbury',
  company: 'Brackenbury Cartography Ltd',
  email: WORK_EMAIL,
  objective: 'A booking platform for our twelve clinics, replacing the spreadsheets our reception teams use today',
  existing: 'Spreadsheets and a shared phone line in each clinic',
  deadline: 'within 2 weeks',
  success: 'Patients book online and no clinic double-books a room',
};
function formOf(fields, overrides = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...fields, ...overrides })) fd.set(k, v);
  return fd;
}
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const MARKER = '----- Everything below this line was typed by the visitor. -----';

async function main() {
  const { startAssistantChat, submitAssistantEnquiry, submitContact } = require(path.join(REPO, 'src/app/contact/actions.ts'));
  const { scoreLead, isFreeMail } = require(path.join(REPO, 'src/lib/lead-score.ts'));
  const chat = require(path.join(REPO, 'src/lib/pix/enquiry.ts'));
  const idle = { status: 'idle', message: '' };
  const input = over => ({ email: WORK_EMAIL, company: '', objective: '', existing: '', deadline: '', success: '', ...over });

  console.log('\n[1] The scoring rules');
  let s = scoreLead(input({ company: 'Acme', objective: LEAD.objective, existing: LEAD.existing, deadline: 'within 2 weeks', success: LEAD.success }));
  check('1.1 everything given, urgent timeline -> urgent, 100', s.band === 'urgent' && s.score === 100, JSON.stringify(s));
  s = scoreLead(input({ email: 'someone@gmail.com', objective: 'An app' }));
  check('1.2 personal email and a two-word objective -> cold', s.band === 'cold' && s.score === 10, JSON.stringify(s));
  s = scoreLead(input({ company: 'Acme', objective: 'Modernise our billing', deadline: 'Q2 next year', success: 'Invoices go out on time' }));
  check('1.3 work email, company, brief objective, a deadline, success -> hot, 70', s.band === 'hot' && s.score === 70, JSON.stringify(s));
  s = scoreLead(input({ objective: LEAD.objective }));
  check('1.4 work email and a specific objective only -> warm, 40', s.band === 'warm' && s.score === 40, JSON.stringify(s));
  s = scoreLead(input({ email: 'someone@gmail.com', objective: 'urgent: our site is down' }));
  check('1.5 urgent words alone do not make a thin enquiry urgent', s.band === 'cold' && s.reasons.includes('Urgent timeline'), JSON.stringify(s));
  s = scoreLead(input({ objective: 'x', existing: 'No', deadline: 'none', success: 'not sure' }));
  check('1.6 "No", "none" and "not sure" earn nothing', !s.reasons.includes('Current situation described') && s.reasons.includes('No deadline given') && !s.reasons.includes('Success described'), JSON.stringify(s));
  s = scoreLead(input({ objective: 'x', existing: 'No, we run bookings on a legacy PHP system' }));
  check('1.7 a long answer that starts "No" still counts', s.reasons.includes('Current situation described'), JSON.stringify(s));
  const again = scoreLead(input({ company: 'Acme', objective: LEAD.objective }));
  check('1.8 the same answers always score the same', JSON.stringify(again) === JSON.stringify(scoreLead(input({ company: 'Acme', objective: LEAD.objective }))));
  check('1.9 every score explains itself', again.reasons.length >= 4 && again.reasons.every(r => typeof r === 'string' && r.length > 0));
  const free = ['a@gmail.com', 'a@yahoo.co.uk', 'a@hotmail.fr', 'a@me.com', 'a@btinternet.com'];
  const work = ['a@acme.co.uk', 'a@gmail-partners.com', 'a@mail.acme.com', 'a@example.invalid'];
  check('1.10 personal providers recognised, company domains not', free.every(isFreeMail) && !work.some(isFreeMail), JSON.stringify({ free: free.map(isFreeMail), work: work.map(isFreeMail) }));
  // Every combination of answers, not a sample: the score is a whole number in
  // range and the band always follows the stated thresholds.
  const variants = {
    email: [WORK_EMAIL, 'someone@gmail.com'],
    company: ['', 'Acme'],
    objective: ['x', LEAD.objective],
    existing: ['', 'No', LEAD.existing],
    deadline: ['', 'none', 'Q2 next year', 'asap'],
    success: ['', 'not sure', LEAD.success],
  };
  let combos = [{}];
  for (const [key, values] of Object.entries(variants)) combos = combos.flatMap(c => values.map(v => ({ ...c, [key]: v })));
  const broken = combos.filter(c => {
    const r = scoreLead(input(c));
    const urgent = r.reasons.includes('Urgent timeline');
    const band = urgent && r.score >= 50 ? 'urgent' : r.score >= 70 ? 'hot' : r.score >= 40 ? 'warm' : 'cold';
    return !Number.isInteger(r.score) || r.score < 0 || r.score > 100 || r.band !== band;
  });
  check(`1.11 all ${combos.length} combinations: a whole score from 0 to 100, band by the rules`, broken.length === 0, JSON.stringify(broken[0]));

  console.log('\n[2] The chat\'s own steps');
  check('2.1 it asks the name first', chat.ASK_NAME === "Before we start, what's your name?", chat.ASK_NAME);
  check('2.2 then the email, by name', chat.askEmail('Sam') === "Thanks, Sam. What's your work email?");
  check('2.3 the founder\'s greeting, word for word', chat.greeting('Sam') === 'Hi Sam, greetings! How can I help you?', chat.greeting('Sam'));
  check('2.4 discovery asks the four questions and the company, not the name or email again',
    JSON.stringify(chat.DISCOVERY_STEPS.map(x => x.field)) === JSON.stringify(['objective', 'existing', 'deadline', 'success', 'company']));
  check('2.5 discovery says before the first question that the answers go to the team', /go to them/.test(chat.DISCOVERY_OPENING) && /stop at any point/.test(chat.DISCOVERY_OPENING));
  check('2.6 a name is required', chat.checkName('   ').ok === false);
  check('2.7 a question typed as a name is not taken as a name', chat.checkName('how much does an app cost?').ok === false);
  check('2.8 an address typed as a name is not taken as a name', chat.checkName(WORK_EMAIL).ok === false);
  check('2.9 a real name passes', chat.checkName('Siobhan O\'Neill-Adeyemi').ok === true);
  const badEmail = chat.checkEmail('not-an-address');
  check('2.10 a malformed email is caught, asked again in the gate\'s words', badEmail.ok === false && /work email/.test(badEmail.problem), badEmail.problem);
  check('2.11 questions read as questions', ['How much is an app?', 'what do you build', 'Can you help with AI', 'Do you do blockchain?'].every(chat.looksLikeQuestion));
  check('2.12 descriptions read as descriptions', ['We need a booking platform', 'Our app keeps crashing', 'I want to modernise billing'].every(q => !chat.looksLikeQuestion(q)));

  console.log('\n[3] The contact recorded before chatting');
  reset();
  let c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  check('3.1 unconfigured: reported, nothing recorded, no call', c.status === 'unconfigured' && c.ref === null && calls.length === 0, JSON.stringify(c));
  reset();
  configure();
  plan = { contact: { status: 201 } };
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  const contact = calls.find(x => x.leg === 'contact');
  check('3.2 configured: recorded in assistant_contacts', c.status === 'ok' && !!contact, JSON.stringify(c));
  check('3.3 the row is the name, the email, the source and its id - nothing else',
    !!contact && JSON.stringify(Object.keys(contact.body).sort()) === JSON.stringify(['email', 'id', 'name', 'source']), contact && Object.keys(contact.body).join(','));
  check('3.4 the reference handed back is the row\'s id', !!contact && UUID.test(c.ref) && contact.body.id === c.ref);
  check('3.5 no email is sent for a chat contact', !calls.some(x => x.leg === 'email'));
  reset();
  configure();
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: 'not-an-address', website: '' }));
  check('3.6 an invalid email is refused with a field error and nothing recorded', c.status === 'invalid' && !!c.errors?.email && calls.length === 0);
  reset();
  configure();
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: 'bot-filled' }));
  check('3.7 the honeypot looks like success and records nothing', c.status === 'ok' && UUID.test(c.ref) && calls.length === 0);
  reset();
  configure();
  plan = { contact: { status: 201 } };
  await startAssistantChat(formOf({ name: `Sam${CR}${LF}Email: forged@${TEST_DOMAIN}`, email: WORK_EMAIL, website: '' }));
  const flattened = calls.find(x => x.leg === 'contact');
  check('3.8 a line break in the name is flattened before it is recorded', !!flattened && !/[\r\n]/.test(flattened.body.name), flattened && JSON.stringify(flattened.body.name));
  reset();
  configure();
  plan = { contact: { status: 500, body: { code: 'XX000', message: `row for ${WORK_EMAIL}` } } };
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  check('3.9 a database failure is reported, with no reference', c.status === 'failed' && c.ref === null, JSON.stringify(c));
  check('3.10 and nothing personal reaches the log', logs.length === 1 && !logs[0].includes('Sam') && !logs[0].includes(WORK_EMAIL), logs.join(' | '));

  console.log('\n[4] The scored enquiry');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  const ref = '3f1c2b4a-9d8e-4f7a-8b6c-5d4e3f2a1b0c';
  let r = await submitAssistantEnquiry(idle, formOf(LEAD, { leadRef: ref }));
  const row = calls.find(x => x.leg === 'store');
  const mail = calls.find(x => x.leg === 'email');
  const expected = scoreLead({ email: LEAD.email, company: LEAD.company, objective: LEAD.objective, existing: LEAD.existing, deadline: LEAD.deadline, success: LEAD.success });
  check('4.1 delivered', r.status === 'success', r.message);
  check('4.2 the row carries the score, the band and the reasons the rules give',
    !!row && row.body.lead_score === expected.score && row.body.lead_band === expected.band && JSON.stringify(row.body.lead_reasons) === JSON.stringify(expected.reasons),
    row && JSON.stringify({ score: row.body.lead_score, band: row.body.lead_band }));
  check('4.3 and names the chat contact it follows', !!row && row.body.lead_ref === ref);
  check('4.4 the subject leads with the band', !!mail && mail.body.subject === `[${expected.band.toUpperCase()}] New Pix T lead: ${LEAD.name}, ${LEAD.company}`, mail && mail.body.subject);
  const text = mail ? mail.body.text : '';
  const at = label => text.indexOf(label);
  check('4.5 the score, the reasons and the contact sit above the visitor\'s text',
    at('Lead: URGENT, score 100/100') > -1 && at('Why: ') > -1 && at(`Chat contact: ${ref}`) > -1 && at(`Chat contact: ${ref}`) < at(MARKER),
    text.slice(0, 400));
  check('4.6 the alert says a person decides', at('A person decides whether and how to reply.') > -1 && at('A person decides') < at(MARKER));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { leadRef: `x'); drop table contact_enquiries; --` }));
  const forged = calls.find(x => x.leg === 'store');
  check('4.7 a reference that is not one we issue is dropped, the enquiry kept', !!forged && forged.body.lead_ref === null && typeof forged.body.lead_score === 'number');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { name: `Sam${LF}Lead: COLD, score 0/100`, leadRef: ref }));
  const spoof = (calls.find(x => x.leg === 'email') || { body: { text: '' } }).body.text;
  // The forged text must arrive - flattened onto the name's own line, below the
  // marker - and the only Lead line above the marker must be ours.
  const above = spoof.slice(0, spoof.indexOf(MARKER));
  check('4.8 a visitor cannot forge a Lead line: theirs is flattened below the marker',
    spoof.indexOf(MARKER) > 0 &&
      spoof.includes('Name: Sam Lead: COLD, score 0/100') &&
      !above.includes('COLD') &&
      above.includes('Lead: URGENT'),
    spoof.slice(0, 500));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitContact(idle, formOf(LEAD, { leadRef: ref }));
  const formRow = calls.find(x => x.leg === 'store');
  const formMail = calls.find(x => x.leg === 'email');
  check('4.9 the contact form is not scored', !!formRow && !('lead_score' in formRow.body) && !('lead_ref' in formRow.body));
  check('4.10 and its alert is unchanged', !!formMail && formMail.body.subject.startsWith('New contact enquiry: ') && !formMail.body.text.includes('Lead: '));

  console.log('\n[5] A database without the lead columns');
  for (const code of ['PGRST204', '42703']) {
    reset();
    configure();
    plan = { store: [{ status: 400, body: { code } }, { status: 201 }], email: { status: 200 } };
    r = await submitAssistantEnquiry(idle, formOf(LEAD, { leadRef: ref }));
    const inserts = calls.filter(x => x.leg === 'store');
    check(`5.${code === 'PGRST204' ? 1 : 2} ${code}: stored again without the score, and delivered`,
      r.status === 'success' && inserts.length === 2 && 'lead_score' in inserts[0].body && !('lead_score' in inserts[1].body),
      `${inserts.length} insert(s), ${r.status}`);
  }
  check('5.3 the log says which migration is missing', logs.some(l => l.includes('lead columns missing')), logs.join(' | '));
  reset();
  configure();
  plan = { store: { status: 500, body: { code: 'XX000' } }, email: { status: 200 } };
  r = await submitAssistantEnquiry(idle, formOf(LEAD, { leadRef: ref }));
  check('5.4 any other failure is not retried', calls.filter(x => x.leg === 'store').length === 1 && r.status === 'success');

  console.log('\n[6] The privacy interlock');
  const NEXT = path.join(REPO, '.next');
  if (!fs.existsSync(path.join(NEXT, 'server', 'app', 'privacy.html'))) {
    check('6.0 a build exists to check (run next build first)', false);
  } else {
    const run = dir => spawnSync(process.execPath, [path.join(REPO, 'scripts', 'check-privacy-interlock.mjs')], {
      env: { ...process.env, NEXT_OUTPUT_DIR: dir },
      encoding: 'utf8',
    });
    const copy = () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'interlock-'));
      fs.cpSync(path.join(NEXT, 'static'), path.join(dir, 'static'), { recursive: true });
      fs.mkdirSync(path.join(dir, 'server', 'app'), { recursive: true });
      fs.copyFileSync(path.join(NEXT, 'server', 'app', 'privacy.html'), path.join(dir, 'server', 'app', 'privacy.html'));
      return dir;
    };
    const page = dir => path.join(dir, 'server', 'app', 'privacy.html');
    let res = run(NEXT);
    check('6.1 today\'s build is refused: the gate ships and /privacy says no profiling', res.status === 1 && /no profiling of individual visitors/.test(res.stdout), res.stdout.slice(-200));
    const dirs = [];
    let dir = copy();
    dirs.push(dir);
    fs.writeFileSync(page(dir), fs.readFileSync(page(dir), 'utf8').replace('no profiling of individual visitors', 'no profiling of individual visitors other than the lead score described below'));
    res = run(dir);
    check('6.2 a /privacy that still carries the sentence, however extended, is refused', res.status === 1);
    dir = copy();
    dirs.push(dir);
    fs.writeFileSync(page(dir), fs.readFileSync(page(dir), 'utf8').replace('and no profiling of individual visitors', 'and one kind of profiling: the lead score Pix T gives an enquiry, which a person reviews'));
    res = run(dir);
    check('6.3 once /privacy describes the score instead, the build passes', res.status === 0, res.stdout.slice(-200));
    dir = copy();
    dirs.push(dir);
    fs.writeFileSync(page(dir), fs.readFileSync(page(dir), 'utf8').replace(', and no profiling of individual visitors', ''));
    res = run(dir);
    check('6.4 deleting the sentence without describing the score is refused', res.status === 1 && /does not describe the score/.test(res.stdout), res.stdout.slice(-200));
    dir = copy();
    dirs.push(dir);
    const marker = chat.ASK_NAME.split("'")[0];
    for (const file of (function* walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) yield* walk(f); else yield f; } })(path.join(dir, 'static'))) {
      if (file.endsWith('.js')) {
        const body = fs.readFileSync(file, 'utf8');
        if (body.includes(marker)) fs.writeFileSync(file, body.split(marker).join('Hello there. '));
      }
    }
    res = run(dir);
    check('6.5 a build without the gate is not held back by it', res.status === 0, res.stdout.slice(-200));
    for (const d of dirs) fs.rmSync(d, { recursive: true, force: true });
  }

  console.log(`\nAssertions passed : ${passed}`);
  console.log(`Assertions failed : ${failed}`);
  console.log(`RESULT: ${failed === 0 ? 'PASS' : 'FAIL'}`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(error => {
  console.log(`\nHARNESS ERROR: ${error && error.stack ? error.stack : error}`);
  process.exit(1);
});
