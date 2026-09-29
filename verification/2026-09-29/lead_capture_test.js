/**
 * Behavioural tests for Pix T lead capture, added 2026-09-29 on the founder's
 * instruction: "At the start ask for name and email then start chatting. Hi
 * (Visitor Name) Greetings how Can i help you? Discover what he want. Lead
 * Scoring Email Alert Store in Supabase." Extended the same day for the fixes
 * the security review asked for (S1-S5, N1-N7), and for the three its re-check
 * asked for (NEW-1 to NEW-3). Once the approved Statement was published, the
 * interlock cases in sections [6] and [8] were rebuilt to write their own
 * Statement, so the live page's wording cannot disarm them (see section [6]).
 *
 *   [1] the scoring rules, band by band, and that they explain themselves
 *   [2] the chat's own steps: the name, the email, the greeting, discovery
 *   [3] startAssistantChat: the contact recorded before chatting
 *   [4] the scored enquiry: the row, the reference, the alert and its cautions
 *   [5] a database without the lead columns loses the score, not the lead
 *   [6] the privacy interlock on the build output (needs a build first)
 *   [7] the rate limits on both Pix T actions
 *   [8] the privacy interlock in next.config.ts, which every production build runs
 *
 * Harness as in hardening_test.js: the REAL TypeScript sources compiled with
 * the repo's own TypeScript, the `@/` alias resolved as the bundler does, and
 * global fetch stubbed so nothing leaves the machine. `next/headers` is stubbed
 * so section [7] can play a client connection; everywhere else there is none,
 * as for any code run outside a request. Placeholders only; no credential
 * exists in this repository. Special characters are built from character codes.
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

/* A stand-in for next/headers: a client address while section [7] sets one,
   and the "outside a request" error Next gives otherwise. */
const HEADERS_STUB = path.join(os.tmpdir(), `next-headers-stub-${process.pid}.js`);
fs.writeFileSync(
  HEADERS_STUB,
  "exports.headers = async () => { if (!globalThis.__fakeClient) throw new Error('outside a request'); " +
    "return new Headers({ 'x-forwarded-for': globalThis.__fakeClient }); };\n",
);

const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request === 'next/headers') return HEADERS_STUB;
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
const RLO = String.fromCharCode(0x202e);
const ZWSP = String.fromCharCode(0x200b);
const SHY = String.fromCharCode(0xad);
const CYRILLIC_E = String.fromCharCode(0x435);
const RSQUO = String.fromCharCode(0x2019);

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
const onlyRef = r => !!r && JSON.stringify(Object.keys(r)) === '["ref"]' && UUID.test(r.ref);

/* The wording drafted for /privacy (PRIVACY-STATEMENT-DRAFT-PIX-T-LEADS.md,
   changes 5 and 6), as the page would carry it once approved. */
const APPROVED_SENTENCE =
  'no advertising or remarketing technology, no cross-site tracking and no session recording or heatmaps. ' +
  'We do not share visitor data with advertising platforms, and we do not match your browsing of this website to a ' +
  'person or to a CRM record. The one thing we do score is an enquiry you send through Pix T';
const APPROVED_PARAGRAPH =
  'When you send an enquiry through Pix T, we give it a lead score from 0 to 100 and a band (cold, warm, hot or ' +
  'urgent) so that we can see which enquiries to answer first. The score uses only what you told Pix T. It only ' +
  'affects the order in which we look at enquiries: a person reads every enquiry and decides whether and how to ' +
  'reply. Enquiries sent through the contact form are not scored.';
const OLD_SENTENCE =
  'no advertising or remarketing technology, no cross-site tracking, no session recording or heatmaps, and no profiling of individual visitors';

async function main() {
  const { startAssistantChat, submitAssistantEnquiry, submitContact } = require(path.join(REPO, 'src/app/contact/actions.ts'));
  const { scoreLead, isFreeMail } = require(path.join(REPO, 'src/lib/lead-score.ts'));
  const limits = require(path.join(REPO, 'src/lib/action-limits.ts'));
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
  check('1.4 an unlisted email and a specific objective only -> warm, 40', s.band === 'warm' && s.score === 40, JSON.stringify(s));
  s = scoreLead(input({ email: 'someone@gmail.com', objective: 'urgent: our site is down' }));
  check('1.5 urgent words alone do not make a thin enquiry urgent', s.band === 'cold' && s.reasons.includes('Urgent timeline'), JSON.stringify(s));
  s = scoreLead(input({ objective: 'x', existing: 'No', deadline: 'none', success: 'not sure' }));
  check('1.6 "No", "none" and "not sure" earn nothing', !s.reasons.includes('Current situation described') && s.reasons.includes('No deadline given') && !s.reasons.includes('Success described'), JSON.stringify(s));
  s = scoreLead(input({ objective: 'x', existing: 'No, we run bookings on a legacy PHP system' }));
  check('1.7 a long answer that starts "No" still counts', s.reasons.includes('Current situation described'), JSON.stringify(s));
  const again = scoreLead(input({ company: 'Acme', objective: LEAD.objective }));
  check('1.8 the same answers always score the same', JSON.stringify(again) === JSON.stringify(scoreLead(input({ company: 'Acme', objective: LEAD.objective }))));
  check('1.9 the email reason says only what is checked', again.reasons.includes('Email not at a listed personal provider') && !again.reasons.some(r => /work email/i.test(r)), again.reasons.join('; '));
  const free = ['a@gmail.com', 'a@yahoo.co.uk', 'a@hotmail.fr', 'a@me.com', 'a@btinternet.com', 'a@outlook.com', 'a@web.de', 'a@live.co.uk'];
  const work = ['a@acme.co.uk', 'a@gmail-partners.com', 'a@mail.acme.com', 'a@example.invalid', 'a@live.acme.com', 'a@outlook.acme.io'];
  check('1.10 personal providers recognised; company domains and subdomains not',
    free.every(isFreeMail) && !work.some(isFreeMail), JSON.stringify({ free: free.map(isFreeMail), work: work.map(isFreeMail) }));
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
  const assistantSource = fs.readFileSync(path.join(REPO, 'src/components/SiteAssistant.tsx'), 'utf8');
  check('2.13 the notice where the name and email are asked says they are recorded at once (review S5)',
    assistantSource.includes('We record your name and email as soon as you give them'));

  console.log('\n[3] The contact recorded before chatting');
  reset();
  let c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  const outcomes = [c];
  check('3.1 unconfigured: nothing recorded, no call', onlyRef(c) && calls.length === 0, JSON.stringify(c));
  reset();
  configure();
  plan = { contact: { status: 201 } };
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  outcomes.push(c);
  const contact = calls.find(x => x.leg === 'contact');
  check('3.2 configured: recorded in assistant_contacts', !!contact, JSON.stringify(calls));
  check('3.3 the row is the name, the email, the source and its id - nothing else',
    !!contact && JSON.stringify(Object.keys(contact.body).sort()) === JSON.stringify(['email', 'id', 'name', 'source']), contact && Object.keys(contact.body).join(','));
  check('3.4 the reference handed back is the row\'s id', !!contact && contact.body.id === c.ref);
  check('3.5 no email is sent for a chat contact', !calls.some(x => x.leg === 'email'));
  reset();
  configure();
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: 'not-an-address', website: '' }));
  outcomes.push(c);
  check('3.6 an invalid email is not recorded', calls.length === 0);
  reset();
  configure();
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: 'bot-filled' }));
  outcomes.push(c);
  check('3.7 the honeypot records nothing', calls.length === 0);
  reset();
  configure();
  plan = { contact: { status: 201 } };
  await startAssistantChat(formOf({ name: `Sam${CR}${LF}Email: forged@${TEST_DOMAIN}`, email: WORK_EMAIL, website: '' }));
  const flattened = calls.find(x => x.leg === 'contact');
  check('3.8 a line break in the name is flattened before it is recorded', !!flattened && !/[\r\n]/.test(flattened.body.name), flattened && JSON.stringify(flattened.body.name));
  reset();
  configure();
  plan = { contact: { status: 201 } };
  await startAssistantChat(formOf({ name: `Sam ${RLO}fdp.eciovni${ZWSP}`, email: WORK_EMAIL, website: '' }));
  const bidi = calls.find(x => x.leg === 'contact');
  check('3.9 direction and zero-width characters are taken out of the name (review N3)', !!bidi && bidi.body.name === 'Sam fdp.eciovni', bidi && JSON.stringify(bidi.body.name));
  reset();
  configure();
  plan = { contact: { status: 500, body: { code: 'XX000', message: `row for ${WORK_EMAIL}` } } };
  c = await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  outcomes.push(c);
  check('3.10 a database failure leaves nothing personal in the log', logs.length === 1 && !logs[0].includes('Sam') && !logs[0].includes(WORK_EMAIL), logs.join(' | '));
  check('3.11 every outcome answers in the same shape: a reference and nothing else (review N2)', outcomes.every(onlyRef), JSON.stringify(outcomes));
  reset();
  configure();
  let threw = null;
  try {
    outcomes.push(await startAssistantChat('name=Sam'), await startAssistantChat(null));
  } catch (error) {
    threw = error;
  }
  check('3.12 anything but form data is answered, not thrown on, and records nothing (review N4)', !threw && outcomes.slice(-2).every(onlyRef) && calls.length === 0, threw && threw.message);
  threw = null;
  let bad;
  try {
    bad = await submitAssistantEnquiry(idle, 'objective=x');
  } catch (error) {
    threw = error;
  }
  check('3.13 the enquiry action refuses a non-form caller the same way', !threw && bad && bad.status === 'error' && calls.length === 0, threw ? threw.message : JSON.stringify(bad));

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
  check('4.5 the score, the reasons and the contact link, labelled unverified, sit above the visitor\'s text',
    at('Lead: URGENT, score 100/100') > -1 && at('Why: ') > -1 && at(`Chat contact (unverified link): ${ref}`) > -1 && at(`Chat contact (unverified link): ${ref}`) < at(MARKER),
    text.slice(0, 600));
  check('4.6 the alert says the score verifies nothing and warns against acting on requests (review S4)',
    at('They do not verify identity, company or urgency.') > -1 && at('Never act on a payment, credential or data request from an enquiry.') > -1 && at('Never act on') < at(MARKER));
  check('4.7 and that a person decides', at('A person decides whether and how to reply.') > -1 && at('A person decides') < at(MARKER));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { leadRef: `x'); drop table contact_enquiries; --` }));
  const forged = calls.find(x => x.leg === 'store');
  check('4.8 a reference not shaped like one is dropped, the enquiry kept', !!forged && forged.body.lead_ref === null && typeof forged.body.lead_score === 'number');
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { name: `Sam${LF}Lead: COLD, score 0/100`, leadRef: ref }));
  const spoof = (calls.find(x => x.leg === 'email') || { body: { text: '' } }).body.text;
  const above = spoof.slice(0, spoof.indexOf(MARKER));
  check('4.9 a visitor cannot forge a Lead line: theirs is flattened below the marker',
    spoof.indexOf(MARKER) > 0 && spoof.includes('Name: Sam Lead: COLD, score 0/100') && !above.includes('COLD') && above.includes('Lead: URGENT'),
    spoof.slice(0, 500));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  const lookalike = ['finance', `pix${CYRILLIC_E}lette.example`].join('@');
  await submitAssistantEnquiry(idle, formOf(LEAD, { email: lookalike, leadRef: ref }));
  const lookText = (calls.find(x => x.leg === 'email') || { body: { text: '' } }).body.text;
  check('4.10 an address with non-ASCII characters is flagged above the marker (review S4)',
    lookText.indexOf('CAUTION: the email address contains characters outside plain ASCII') > -1 &&
      lookText.indexOf('CAUTION: the email address') < lookText.indexOf(MARKER),
    lookText.slice(0, 300));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { name: 'Finance Director', company: 'Pixelette Technologies', leadRef: ref }));
  const ownText = (calls.find(x => x.leg === 'email') || { body: { text: '' } }).body.text;
  check('4.11 an enquiry using Pixelette\'s own name is flagged above the marker (review S4)',
    ownText.indexOf("CAUTION: this enquiry uses Pixelette's own name or domain") > -1 &&
      ownText.indexOf('CAUTION: this enquiry') < ownText.indexOf(MARKER));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { name: `Sam ${RLO}fdp.eciovni`, leadRef: ref }));
  const rloMail = calls.find(x => x.leg === 'email');
  check('4.12 no direction override reaches the subject (review N3)', !!rloMail && !rloMail.body.subject.includes(RLO) && rloMail.body.subject.includes('Sam fdp.eciovni'), rloMail && JSON.stringify(rloMail.body.subject));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitContact(idle, formOf(LEAD, { leadRef: ref }));
  const formRow = calls.find(x => x.leg === 'store');
  const formMail = calls.find(x => x.leg === 'email');
  check('4.13 the contact form is not scored', !!formRow && !('lead_score' in formRow.body) && !('lead_ref' in formRow.body));
  check('4.14 and its alert has no score', !!formMail && formMail.body.subject.startsWith('New contact enquiry: ') && !formMail.body.text.includes('Lead: '));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  await submitAssistantEnquiry(idle, formOf(LEAD, { email: ['founder', 'xn--pxelette-thh.example'].join('@'), leadRef: ref }));
  const punyText = (calls.find(x => x.leg === 'email') || { body: { text: '' } }).body.text;
  check('4.15 a look-alike domain in its plain-ASCII (xn--) spelling is flagged above the marker (re-check NEW-3)',
    punyText.indexOf('CAUTION: the email address has an internationalised (xn--) domain') > -1 &&
      punyText.indexOf('CAUTION: the email address') < punyText.indexOf(MARKER),
    punyText.slice(0, 300));
  reset();
  configure();
  plan = { store: { status: 201 }, email: { status: 200 } };
  r = await submitAssistantEnquiry(idle, formOf(LEAD, { name: 'Pixelette Finance Team', company: '', leadRef: ref }));
  const nameText = (calls.find(x => x.leg === 'email') || { body: { text: '' } }).body.text;
  check('4.16 Pixelette\'s name in the name field alone, with no company, is flagged (re-check NEW-3)',
    r.status === 'success' &&
      nameText.indexOf("CAUTION: this enquiry uses Pixelette's own name or domain") > -1 &&
      nameText.indexOf('CAUTION: this enquiry') < nameText.indexOf(MARKER),
    `${r.status}: ${nameText.slice(0, 300)}`);
  check('4.17 an ordinary enquiry carries no caution', text.length > 0 && !text.includes('CAUTION'));

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

  console.log('\n[6] The privacy interlock on the build output');
  const NEXT = path.join(REPO, '.next');
  const dirs = [];
  if (!fs.existsSync(path.join(NEXT, 'server', 'app', 'privacy.html'))) {
    check('6.0 a build exists to check (run next build first)', false);
  } else {
    const run = (dir, flag = true) =>
      spawnSync(process.execPath, [path.join(REPO, 'scripts', 'check-privacy-interlock.mjs')], {
        env: { ...process.env, NEXT_OUTPUT_DIR: dir, PIX_T_INTERLOCK_TEST: flag ? '1' : '' },
        encoding: 'utf8',
      });
    function* walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) yield* walk(f);
        else yield f;
      }
    }
    /* A copy of the output a test can change: browser code, the rendered
       pages, and the server code that carries the scoring rules. */
    const copy = () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'interlock-'));
      dirs.push(dir);
      fs.cpSync(path.join(NEXT, 'static'), path.join(dir, 'static'), { recursive: true });
      fs.cpSync(path.join(NEXT, 'server'), path.join(dir, 'server'), { recursive: true });
      return dir;
    };
    const page = dir => path.join(dir, 'server', 'app', 'privacy.html');
    const scrub = (dir, needle, replacement, filter) => {
      for (const file of walk(dir)) {
        if (!filter(file)) continue;
        const body = fs.readFileSync(file, 'utf8');
        if (body.includes(needle)) fs.writeFileSync(file, body.split(needle).join(replacement));
      }
    };

    /* THE FIXTURES WRITE THEIR OWN STATEMENT. They used to edit the live
       /privacy, replacing its old sentence. Once the founder published the
       approved wording (main, c3d647b, 29 September), every such replace was a
       no-op: the negative cases saw a compliant page and went red, and a case
       could pass while testing nothing. Each case below writes the whole of
       the page's <main> itself, so what /privacy says today cannot disarm it.
       The live page is checked once, on its own terms (6.1). */
    const MARKED =
      `<h3 id="pix-t-lead-score">How we prioritise enquiries from Pix T</h3><p>${APPROVED_PARAGRAPH}</p>` +
      `<p>We run ${APPROVED_SENTENCE}.</p>`;
    const OLD = `<p>We run ${OLD_SENTENCE}.</p>`;
    const plus = sentence => `${MARKED}<p>${sentence}</p>`;
    const MAIN = /<main\b[^>]*>[\s\S]*<\/main>/;
    const withStatement = body => {
      const dir = copy();
      const html = fs.readFileSync(page(dir), 'utf8');
      if (!MAIN.test(html)) throw new Error('the built /privacy has no <main> for the fixtures to write');
      fs.writeFileSync(page(dir), html.replace(MAIN, () => `<main id="main">${body}</main>`));
      return dir;
    };

    let res = run(NEXT);
    check('6.1 the build as it stands passes for the right reason: lead capture ships and /privacy is ready',
      res.status === 0 && /lead capture ships/.test(res.stdout) && /\/privacy ready/.test(res.stdout), res.stdout.slice(-300));
    let dir = withStatement(MARKED);
    res = run(dir);
    check('6.2 the drafted wording, with its marker, passes', res.status === 0, res.stdout.slice(-300));
    dir = withStatement(OLD);
    const flagged = run(dir);
    res = run(dir, false);
    check('6.3 NEXT_OUTPUT_DIR alone is ignored: the old Statement it points at is refused only with the test flag',
      flagged.status === 1 && /no profiling/.test(flagged.stdout) && /pix-t-lead-score/.test(flagged.stdout) &&
        res.stdout === run(NEXT, false).stdout && res.stdout !== flagged.stdout,
      `${flagged.stdout.slice(-150)} | ${res.stdout.slice(-150)}`);
    const falseWordings = [
      ['no profiling or scoring of individual visitors', plus('We run no profiling or scoring of individual visitors.')],
      ['we do not score or profile visitors', plus('We do not score or profile visitors.')],
      ['no profiling of visitors, with "scored" elsewhere', '<p>We run no profiling of visitors.</p><p>Nothing here is scored.</p>'],
      ['the old phrase split by a soft hyphen, plus "no scoring"', plus(`We run no pro${SHY}filing of individual visitors and no scoring.`)],
      ['the old phrase split by a soft-hyphen entity', plus('We run no pro&shy;filing of individual visitors.')],
    ];
    for (const [label, body] of falseWordings) {
      res = run(withStatement(body));
      check(`6.4 refused: ${label} (review S1)`, res.status === 1, res.stdout.slice(-200));
    }
    res = run(withStatement(MARKED.replace(' id="pix-t-lead-score"', '')));
    check('6.5 the drafted wording without its marker is refused', res.status === 1 && /pix-t-lead-score/.test(res.stdout), res.stdout.slice(-200));
    const gateMarker = chat.ASK_NAME.split("'")[0];
    dir = withStatement(OLD);
    scrub(dir, gateMarker, 'Hello there. ', f => /\.(js|html|rsc)$/.test(f) && !f.includes(`${path.sep}server${path.sep}chunks`));
    res = run(dir);
    check('6.6 with the gate hidden from the pages, the scoring in the server output still refuses the build (review S1)', res.status === 1 && /scoring in server/.test(res.stdout), res.stdout.slice(-300));
    dir = withStatement(OLD);
    scrub(dir, gateMarker, 'Hello there. ', f => /\.(js|html|rsc)$/.test(f));
    scrub(dir, 'Email not at a listed personal provider', 'Something else entirely', f => f.endsWith('.js'));
    res = run(dir);
    check('6.7 with no gate and no scoring anywhere, even the old Statement holds nothing back', res.status === 0 && /lead capture absent/.test(res.stdout), res.stdout.slice(-300));
    dir = withStatement(MARKED);
    scrub(dir, 'as soon as you give them', 'when you like', f => f.endsWith('.js'));
    res = run(dir);
    check('6.8 the approved Statement is not enough if the notice does not say the details are recorded at once (review S5)', res.status === 1 && /as soon as you give them/.test(res.stdout), res.stdout.slice(-300));
    /* The approved paragraph published, with a sentence it makes false beside it. */
    const contradictions = [
      [`We don${RSQUO}t profile visitors. (the typographic apostrophe this page uses)`, `We don${RSQUO}t profile visitors.`],
      ['We don&#8217;t score visitors. (the same, as a character reference)', 'We don&#8217;t score visitors.'],
      ["Pixelette doesn't profile or score visitors.", "Pixelette doesn't profile or score visitors."],
      ['We will not profile you.', 'We will not profile you.'],
      ['There is no individual profiling.', 'There is no individual profiling.'],
      ['We cannot score you.', 'We cannot score you.'],
      ['We run no cross-site profiling.', 'We run no cross-site profiling.'],
      ['We must not profile visitors.', 'We must not profile visitors.'],
    ];
    for (const [label, sentence] of contradictions) {
      res = run(withStatement(plus(sentence)));
      check(`6.9 refused with the marker present: ${label} (re-check NEW-1)`, res.status === 1, res.stdout.slice(-200));
    }
    res = run(withStatement(MARKED.replace('<h3 id="pix-t-lead-score">', '<!-- <h3 id="pix-t-lead-score"> --><h3>')));
    check('6.10 a marker inside an HTML comment does not count', res.status === 1 && /pix-t-lead-score/.test(res.stdout), res.stdout.slice(-200));
    res = run(withStatement(plus('&#x110000; &#99999999999;')));
    check('6.11 a character reference that is no character is read as a space, not a crash', res.status === 0 && /privacy interlock passed/.test(res.stdout), (res.stdout + res.stderr).slice(-200));
  }

  console.log('\n[7] The rate limits');
  reset();
  configure();
  limits.__resetActionLimitsForTest();
  globalThis.__fakeClient = '203.0.113.7';
  plan = { contact: Array.from({ length: 20 }, () => ({ status: 201 })) };
  const starts = [];
  for (let i = 0; i < 12; i += 1) starts.push(await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' })));
  check('7.1 one connection records ten chat contacts in ten minutes, not twelve', calls.filter(x => x.leg === 'contact').length === 10, `${calls.filter(x => x.leg === 'contact').length} recorded`);
  check('7.2 and a refused call answers exactly like any other', starts.every(onlyRef));
  check('7.3 the refusal is logged, with no address and no name', logs.filter(l => l.includes('chat-start refused: rate limit')).length === 2 && !logs.some(l => l.includes('203.0.113.7') || l.includes('Sam')), logs.join(' | '));
  globalThis.__fakeClient = '198.51.100.23';
  calls = [];
  await startAssistantChat(formOf({ name: 'Sam Taylor', email: WORK_EMAIL, website: '' }));
  check('7.4 another connection is not held back by the first', calls.filter(x => x.leg === 'contact').length === 1);
  globalThis.__fakeClient = '203.0.113.7';
  calls = [];
  logs = [];
  plan = { store: Array.from({ length: 20 }, () => ({ status: 201 })), email: Array.from({ length: 20 }, () => ({ status: 200 })) };
  const sent = [];
  for (let i = 0; i < 11; i += 1) sent.push(await submitAssistantEnquiry(idle, formOf(LEAD, { leadRef: ref })));
  check('7.5 one connection sends ten enquiries an hour, and the eleventh is refused', sent.slice(0, 10).every(x => x.status === 'success') && sent[10].status === 'error' && calls.filter(x => x.leg === 'store').length === 10, sent[10] && sent[10].message);
  check('7.6 the refusal says so and gives the address to write to', /several enquiries from this connection/.test(sent[10].message) && sent[10].message.includes('sales@'), sent[10].message);
  globalThis.__fakeClient = null;
  const key = 'test-key';
  limits.__resetActionLimitsForTest();
  const t0 = Date.UTC(2026, 8, 29, 9, 0, 0);
  const first = Array.from({ length: 11 }, () => limits.allowAction('chat-start', key, t0));
  const later = limits.allowAction('chat-start', key, t0 + 10 * 60 * 1000 + 1);
  check('7.7 the ten-minute window refills after ten minutes', first.slice(0, 10).every(Boolean) && first[10] === false && later === true);
  let dayRun = 0;
  for (let m = 0; m < 12; m += 1) for (let i = 0; i < 10; i += 1) if (limits.allowAction('chat-start', 'day-key', t0 + m * 11 * 60 * 1000)) dayRun += 1;
  check('7.8 and a day allows thirty however they are spread', dayRun === 30, `${dayRun} allowed`);
  const k1 = limits.clientKey(new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1' }));
  check('7.9 the key is a hash, never the address, and the same for the same address',
    typeof k1 === 'string' && !k1.includes('203') && k1 === limits.clientKey(new Headers({ 'x-real-ip': '203.0.113.7' })) && limits.clientKey(new Headers()) === null);
  limits.__resetActionLimitsForTest();

  console.log('\n[8] The privacy interlock that every production build runs (next.config.ts, review S2)');
  const { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } = require(path.join(REPO, 'node_modules', 'next', 'constants'));
  const loadConfig = root => {
    const file = path.join(root, 'next.config.ts');
    delete require.cache[file];
    return require(file).default;
  };
  const guarded = (fn, env = {}) => {
    const saved = {};
    for (const k of ['PIX_T_PRIVACY_INTERLOCK', 'VERCEL', 'CI']) {
      saved[k] = process.env[k];
      if (env[k] === undefined) delete process.env[k];
      else process.env[k] = env[k];
    }
    const warn = console.warn;
    console.warn = () => undefined;
    try {
      return { value: fn() };
    } catch (error) {
      return { error };
    } finally {
      console.warn = warn;
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  };
  const config = loadConfig(REPO);
  let out = guarded(() => config(PHASE_PRODUCTION_BUILD));
  check('8.1 a production build of today\'s source goes ahead: the published Statement covers lead capture', !out.error, out.error && out.error.message.slice(0, 200));
  out = guarded(() => config(PHASE_DEVELOPMENT_SERVER));
  check('8.2 development is not held up by it', !out.error && !!out.value && out.value.poweredByHeader === false);
  /* A copy of the sources the check reads. ITS PRIVACY PAGE IS WRITTEN BY EACH
     CASE, for the reason given in section 6: the live page's wording must not
     be able to disarm a negative case. */
  const tree = fs.mkdtempSync(path.join(os.tmpdir(), 'interlock-src-'));
  dirs.push(tree);
  for (const rel of ['next.config.ts', 'scripts/privacy-interlock-rules.cjs', 'src/lib/lead-score.ts', 'src/components/SiteAssistant.tsx']) {
    fs.mkdirSync(path.dirname(path.join(tree, rel)), { recursive: true });
    fs.copyFileSync(path.join(REPO, rel), path.join(tree, rel));
  }
  fs.mkdirSync(path.join(tree, 'src/app/privacy'), { recursive: true });
  fs.symlinkSync(path.join(REPO, 'node_modules'), path.join(tree, 'node_modules'));
  const pageFile = path.join(tree, 'src/app/privacy/page.tsx');
  const pageOf = body => `export default function PrivacyPage() {\n  return (\n    <main>\n${body}\n    </main>\n  );\n}\n`;
  const MARKED_JSX =
    `      <h3 className="h4" id="pix-t-lead-score">How we prioritise enquiries from Pix T</h3>\n` +
    `      <p className="body">${APPROVED_PARAGRAPH}</p>\n      <p className="body">We run ${APPROVED_SENTENCE}.</p>`;
  const OLD_PAGE = pageOf(`      <p className="body">We run ${OLD_SENTENCE}.</p>`);
  const APPROVED_PAGE = pageOf(MARKED_JSX);
  const plusJsx = jsx => pageOf(`${MARKED_JSX}\n      ${jsx}`);
  const build = (source, env) => {
    fs.writeFileSync(pageFile, source);
    return guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD), env);
  };
  out = build(OLD_PAGE, { PIX_T_PRIVACY_INTERLOCK: 'bypass-for-local-testing-only' });
  check('8.3 a local test build may bypass it, deliberately', !out.error, out.error && out.error.message.slice(0, 200));
  out = build(OLD_PAGE, { PIX_T_PRIVACY_INTERLOCK: 'bypass-for-local-testing-only', VERCEL: '1' });
  const onCi = build(OLD_PAGE, { PIX_T_PRIVACY_INTERLOCK: 'bypass-for-local-testing-only', CI: '1' });
  check('8.4 the bypass is refused on Vercel and in CI', !!out.error && !!onCi.error);
  out = build(OLD_PAGE);
  check('8.5 without the bypass, the old Statement is refused on both counts',
    !!out.error && /no profiling/.test(out.error.message) && /pix-t-lead-score/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  out = build(APPROVED_PAGE);
  check('8.6 with the drafted wording in the source, a production build goes ahead', !out.error, out.error && out.error.message.slice(0, 300));
  out = build(APPROVED_PAGE.replace(' id="pix-t-lead-score"', ''));
  check('8.7 without the marker it is refused', !!out.error && /pix-t-lead-score/.test(out.error.message));
  fs.writeFileSync(pageFile, OLD_PAGE);
  const scoringFile = path.join(tree, 'src/lib/lead-score.ts');
  const movedScoring = path.join(tree, 'src/lib/scoring/leads.ts');
  fs.mkdirSync(path.dirname(movedScoring), { recursive: true });
  fs.renameSync(scoringFile, movedScoring);
  out = guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD));
  check('8.8 moving the scoring module does not switch the check off (re-check NEW-2c)', !!out.error && /no profiling/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  fs.renameSync(movedScoring, scoringFile);
  const assistantFile = path.join(tree, 'src/components/SiteAssistant.tsx');
  const assistantOriginal = fs.readFileSync(assistantFile, 'utf8');
  fs.renameSync(scoringFile, `${scoringFile}.off`);
  fs.writeFileSync(assistantFile, 'export default function SiteAssistant() {\n  return null;\n}\n');
  out = guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD));
  check('8.9 a tree whose sources carry no lead capture is not held back', !out.error, out.error && out.error.message.slice(0, 200));
  fs.renameSync(`${scoringFile}.off`, scoringFile);
  fs.writeFileSync(assistantFile, assistantOriginal);
  out = build(APPROVED_PAGE.replace('<h3 className="h4" id="pix-t-lead-score">', '{/* <h3 id="pix-t-lead-score"> */}<h3 className="h4">'));
  check('8.10 a marker only inside a comment does not count (re-check NEW-2a)', !!out.error && /pix-t-lead-score/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  out = build(plusJsx('<p className="body">We don&rsquo;t profile visitors.</p>'));
  check('8.11 "don&rsquo;t profile" in the source is refused (re-check NEW-1)', !!out.error && /don't profile/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  out = build(plusJsx(`<p className="body">Pixelette doesn&apos;t{' '}\n<em>score</em> visitors.</p>`));
  check('8.12 so is a negation split by a tag and a JSX space', !!out.error && /doesn't score/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  fs.writeFileSync(pageFile, APPROVED_PAGE);
  const oldNotice = assistantOriginal
    .replace('We record your name and email as soon as you give them, so the team', 'We use your name and email to respond to you, so the team')
    .replace(/as soon as you give\s+them"\. \*\//, 'as soon as you give them". */');
  check('8.13 (setup) the old notice back in place, the phrase quoted on one line in a comment',
    oldNotice.includes('as soon as you give them". */') && !oldNotice.includes('as soon as you give them, so'));
  fs.writeFileSync(assistantFile, oldNotice);
  out = guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD));
  check('8.14 a notice quoted only in a comment does not count (re-check NEW-2b)', !!out.error && /as soon as you give them/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  fs.writeFileSync(assistantFile, assistantOriginal.replace('as soon as you give them, so the team', 'as soon as you\n                give them, so the team'));
  out = guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD));
  check('8.15 the real notice re-wrapped over two lines still counts', !out.error, out.error && out.error.message.slice(0, 200));
  fs.writeFileSync(assistantFile, assistantOriginal);
  const scoringOriginal = fs.readFileSync(scoringFile, 'utf8');
  fs.writeFileSync(scoringFile, scoringOriginal.split('Email not at a listed personal provider').join('Work email given'));
  out = guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD), { PIX_T_PRIVACY_INTERLOCK: 'bypass-for-local-testing-only' });
  check('8.16 scoring code without the phrase the output check looks for is refused, bypass or not (re-check NEW-2c)', !!out.error && /SCORING_MARKER/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  fs.writeFileSync(scoringFile, scoringOriginal);
  const realArgv = process.argv;
  process.argv = [realArgv[0], path.join(REPO, 'node_modules', '.bin', 'next'), 'lint'];
  out = build(OLD_PAGE);
  process.argv = realArgv;
  check('8.17 `next lint`, which loads the config in the build phase but builds nothing, is not held up even by the old Statement', !out.error, out.error && out.error.message.slice(0, 200));
  fs.writeFileSync(scoringFile, `// ${'Email not at a listed personal provider'}\n${scoringOriginal.split('Email not at a listed personal provider').join('Work email given')}`);
  out = guarded(() => loadConfig(tree)(PHASE_PRODUCTION_BUILD), { PIX_T_PRIVACY_INTERLOCK: 'bypass-for-local-testing-only' });
  check('8.18 and the phrase kept only in a comment does not count, since comments do not ship', !!out.error && /SCORING_MARKER/.test(out.error.message), out.error ? out.error.message.slice(0, 200) : 'no error');
  fs.writeFileSync(scoringFile, scoringOriginal);

  for (const d of dirs) fs.rmSync(d, { recursive: true, force: true });
  fs.rmSync(HEADERS_STUB, { force: true });
  console.log(`\nAssertions passed : ${passed}`);
  console.log(`Assertions failed : ${failed}`);
  console.log(`RESULT: ${failed === 0 ? 'PASS' : 'FAIL'}`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(error => {
  console.log(`\nHARNESS ERROR: ${error && error.stack ? error.stack : error}`);
  process.exit(1);
});
