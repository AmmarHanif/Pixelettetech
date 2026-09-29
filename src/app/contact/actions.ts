'use server';

import { contactEmail } from '@/content/company';
import { deliverEnquiry, type Enquiry } from '@/lib/enquiries';

/**
 * Contact form handling.
 *
 * Four rules govern this file.
 *
 * 1. No secrets in source. Every credential the delivery path needs is read
 *    from the environment by NAME, in `src/lib/enquiries.ts`; no value appears
 *    in this repository. This module is `'use server'`, so Next compiles it to
 *    a server reference and its body never enters a client bundle.
 * 2. Never lose a lead silently. If nothing is configured, or every transport
 *    fails, the visitor is told plainly and given the fallback route, rather
 *    than being shown a success message for an enquiry that went nowhere. A
 *    form that swallows enquiries is worse than no form. This is the single
 *    most important property in the file and the tests exercise it directly.
 * 3. The form transports text and nothing else. There is no file input on this
 *    site, so nothing here parses `multipart/form-data` or handles an upload.
 *    That is deliberate as of 2026-09-11: an upload needs a storage target, a
 *    retention position and a privacy-page consequence, which is a founder
 *    decision, not an engineering one. See
 *    `../UPLOAD-FEASIBILITY-2026-09-11.md` in the project folder. Until it is
 *    taken, no page may offer an upload.
 * 4. No personal data is logged. Failures are logged against a generated
 *    enquiry id and a provider status code, never against a name, an address or
 *    an answer. The rule is enforced in `src/lib/enquiries.ts`, which owns all
 *    of this feature's logging.
 *
 * DELIVERY, changed 2026-09-14. This action used to POST a flat JSON object to
 * `CONTACT_WEBHOOK_URL`, a variable that was never set in any environment, so
 * every submission took the honest-failure path above. It now writes the
 * enquiry to Supabase and sends a notification through Resend. The behaviour
 * when nothing is configured is UNCHANGED and deliberately so: that is still
 * what a preview deployment does, and what production does until the founder
 * supplies credentials. See `CONTACT-FORM-SETUP.md`.
 *
 * The `process` key went with the webhook. It carried a transcript of the four
 * answers for an off-repo consumer that read the webhook, and the reason it was
 * retained - that the consumer was configured outside this repository and could
 * not be inspected - ends when the webhook it consumed is switched off. Neither
 * new destination has a legacy contract to keep: the table's columns are
 * defined in this change, and the email is composed in this change. As a column
 * it would have been a second copy of four fields that already exist, free to
 * drift out of step with them. The rendering itself survives, and is now the
 * body of the notification email.
 */

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  /** Field-level errors, keyed by input name. */
  errors?: Record<string, string>;
};

const MAX = {
  name: 120,
  company: 160,
  email: 200,
  objective: 4000,
  existing: 4000,
  deadline: 200,
  success: 4000,
} as const;

/**
 * What the visitor is told, in the three cases that can arise.
 *
 * Kept together, and kept as data, because the difference between them is the
 * honesty property that rule 2 protects. `SUCCESS` is returned only when the
 * enquiry actually reached something durable.
 */
const MESSAGES = {
  SUCCESS: 'Thank you. One of us will reply personally, not an automated sequence.',
  UNCONFIGURED: `Our contact form is not currently connected. Please email ${contactEmail} so your enquiry reaches a person.`,
  FAILED: `We could not send that just now. Please email ${contactEmail} rather than retrying, so your enquiry is not lost.`,
} as const;

/*
 * THE ADDRESS CHECK, rewritten 2026-09-29 after the launch-readiness review.
 *
 * Still deliberately permissive: the only thing worth rejecting here is input
 * that cannot possibly be an address, because over-strict patterns reject real
 * ones. Two things changed.
 *
 * LINEAR BY CONSTRUCTION. The previous pattern, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
 * let the domain's `[^\s@]+` and the final `\.[^\s@]{2,}` both claim the same
 * dots, so a crafted value backtracked in quadratic time: 40,000 characters
 * took about 2 s, and one ~900 KB request could hold a server process for
 * minutes (finding PERF-01). Here no domain label can contain a dot, so every
 * dot is a label boundary and any input can be split exactly one way. It also
 * runs only after the length check below, so it never sees more than 200
 * characters.
 *
 * NO DISPLAY NAMES OR LISTS. The address becomes the notification's reply-to,
 * so quotes, angle brackets, parentheses, square brackets, commas, semicolons,
 * colons and backslashes are refused: they are what turn an address into
 * `"Someone" <a@b.example>` or a list (finding SAS-05). A real address loses
 * nothing.
 *
 * src/lib/pix/enquiry.ts carries the identical pattern so the chat and this
 * action can never disagree; verification/2026-09-29/hardening_test.js
 * compares them.
 */
const EMAIL =
  /^[^\s@"<>()[\],;:\\]+@[^\s@"<>()[\],;:\\.]+(?:\.[^\s@"<>()[\],;:\\.]+)*\.[^\s@"<>()[\],;:\\.]{2,}$/;

function isEmail(value: string): boolean {
  return EMAIL.test(value);
}

/*
 * READING THE FORM, tightened 2026-09-29 (findings SAS-01, SAS-03, SAS-04,
 * ECE-03, ECE-09).
 *
 * A value that is not a string - a file part, or anything a caller sends that
 * the form never would - is treated as absent rather than stored as
 * "[object File]".
 *
 * A single-line field cannot carry a line break. That is what let a submitted
 * name forge extra "Name:" and "Email:" lines in the notification email. Every
 * control or line-separator character in one becomes a space.
 *
 * A multi-line answer keeps its line breaks, normalised to \n. Browsers send a
 * textarea's breaks as \r\n, which made each one count twice against a limit
 * the textarea counts once. Every other control character goes, NUL included,
 * which the database would refuse.
 *
 * A value made only of invisible characters (zero-width marks and whitespace)
 * is empty: it cannot satisfy a required field.
 *
 * Characters are handled by CODEPOINT, as in src/lib/enquiries.ts, rather than
 * by control-character escapes that can be mangled on the way into the file.
 */
function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

function isLineBreakOrControl(code: number): boolean {
  return code < 32 || code === 127 || code === 0x85 || code === 0x2028 || code === 0x2029;
}

function singleLine(value: string): string {
  return Array.from(value, character =>
    isLineBreakOrControl(character.codePointAt(0) ?? 0) ? ' ' : character,
  )
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function multiLine(value: string): string {
  return Array.from(value.replace(/\r\n?/g, '\n'), character => {
    const code = character.codePointAt(0) ?? 0;
    if (character === '\n' || character === '\t') return character;
    if (code === 0x85 || code === 0x2028 || code === 0x2029) return '\n';
    return isLineBreakOrControl(code) ? '' : character;
  })
    .join('')
    .trim();
}

function visible(value: string): string {
  return value.replace(/[\p{Cf}\s]/gu, '') === '' ? '' : value;
}

/** The contact form on /contact. */
export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  return acceptEnquiry(formData, 'pixelettetech.com/contact');
}

/**
 * The same enquiry, taken by the site assistant.
 *
 * ONE PIPELINE, TWO DOORS. The assistant asks the four questions in the chat,
 * shows the visitor every answer in an editable form, and submits it here. From
 * this line on nothing differs from the contact form: the same validation, the
 * same honeypot, the same storage and notification, the same honest failure
 * messages. The only difference recorded is `source`, which the table carries
 * precisely so a second surface never has to be told apart by guesswork.
 *
 * That is why the Privacy Notice needs no change for it: it describes an
 * enquiry as a name, a company, a work email and four answers, handled by
 * Vercel, Supabase and Resend, and that is all this sends, through those three.
 */
export async function submitAssistantEnquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  return acceptEnquiry(formData, 'pixelettetech.com/assistant');
}

type EnquirySource = 'pixelettetech.com/contact' | 'pixelettetech.com/assistant';

async function acceptEnquiry(formData: FormData, source: EnquirySource): Promise<ContactState> {
  // Honeypot. Real users never fill a field they cannot see; bots fill everything.
  //
  // The reply is the real success message, character for character. It used to
  // be a shorter, different one, which handed a bot the tell it needed: two
  // distinguishable successes let a scripted caller work out which field was
  // the trap and then avoid it. Identical output reveals nothing.
  if (field(formData, 'website').trim() !== '') {
    return { status: 'success', message: MESSAGES.SUCCESS };
  }

  const name = visible(singleLine(field(formData, 'name')));
  const company = visible(singleLine(field(formData, 'company')));
  const email = visible(singleLine(field(formData, 'email')));

  // The four qualifying answers. Names avoid `process`, which would shadow the
  // Node global. The deadline is a single-line field on both forms.
  const objective = visible(multiLine(field(formData, 'objective')));
  const existing = visible(multiLine(field(formData, 'existing')));
  const deadline = visible(singleLine(field(formData, 'deadline')));
  const success = visible(multiLine(field(formData, 'success')));

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please tell us your name.';
  else if (name.length > MAX.name) errors.name = 'That name is too long.';

  // Company is optional, so only its length is checked.
  if (company.length > MAX.company) errors.company = 'That company name is too long.';

  // Length BEFORE shape: no pattern ever runs on more than 200 characters.
  if (!email) errors.email = 'Please give us a work email so we can reply.';
  else if (email.length > MAX.email) errors.email = 'That email address is too long.';
  else if (!isEmail(email)) errors.email = 'That does not look like an email address.';

  // Of the four questions only the first is required — without it there is no
  // enquiry to reply to. The other three are asked of everyone and answered by
  // whoever can. Lengths are still checked server-side, because `maxLength` on
  // the control is a courtesy to the visitor, not a constraint on a caller.
  if (!objective)
    errors.objective = 'Tell us what you are trying to build or change, even in one line.';
  else if (objective.length > MAX.objective)
    errors.objective = 'Please shorten this to under 4,000 characters.';

  if (existing.length > MAX.existing)
    errors.existing = 'Please shorten this to under 4,000 characters.';

  if (deadline.length > MAX.deadline) errors.deadline = 'Please keep this to a short line.';

  if (success.length > MAX.success)
    errors.success = 'Please shorten this to under 4,000 characters.';

  if (Object.keys(errors).length > 0) {
    return { status: 'error', message: 'Please check the highlighted fields.', errors };
  }

  const enquiry: Enquiry = {
    // Generated here, before anything is attempted, so that the row, the email
    // and any server log line all name the same enquiry. It is the only handle
    // on a submission that is safe to write to a log.
    id: crypto.randomUUID(),
    name,
    company,
    email,
    objective,
    existing,
    deadline,
    success,
    source,
    receivedAt: new Date().toISOString(),
  };

  const outcome = await deliverEnquiry(enquiry);

  // Nothing is configured. Not the visitor's fault and not a fault at all in a
  // preview deployment, so it says what is true and gives the route that works.
  // This is the path every environment takes until credentials are supplied.
  if (outcome.store === 'unconfigured' && outcome.email === 'unconfigured') {
    return { status: 'error', message: MESSAGES.UNCONFIGURED };
  }

  // The honesty rule, stated as code: success requires that the enquiry reached
  // something that survives this request. Either destination will do, and they
  // fail independently, so one surviving is a real success rather than a
  // consolation - the enquiry is either in the record, or in front of a person,
  // or both. When only one landed, `deliverEnquiry` has already logged the
  // other as an operational fault, and a notification that went out without a
  // stored row says so in its own body.
  if (outcome.store === 'ok' || outcome.email === 'ok') {
    return { status: 'success', message: MESSAGES.SUCCESS };
  }

  // Configured, attempted, and nothing survived. The visitor is told so.
  return { status: 'error', message: MESSAGES.FAILED };
}
