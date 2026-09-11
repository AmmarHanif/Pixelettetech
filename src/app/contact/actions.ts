'use server';

import { contactEmail } from '@/content/company';

/**
 * Contact form handling.
 *
 * Two rules govern this file.
 *
 * 1. No secrets in source. The delivery endpoint is read from the
 *    CONTACT_WEBHOOK_URL environment variable at runtime; only the variable
 *    NAME appears here, never a value.
 * 2. Never lose a lead silently. If the transport is not configured or the
 *    downstream call fails, the visitor is told plainly and given the fallback
 *    route, rather than being shown a success message for an enquiry that went
 *    nowhere. A form that swallows enquiries is worse than no form.
 * 3. The form transports text and nothing else. There is no file input on this
 *    site, so nothing here parses `multipart/form-data` or handles an upload.
 *    That is deliberate as of 2026-09-11: an upload needs a storage target, a
 *    retention position and a privacy-page consequence, which is a founder
 *    decision, not an engineering one. See
 *    `../UPLOAD-FEASIBILITY-2026-09-11.md` in the project folder. Until it is
 *    taken, no page may offer an upload — the homepage offered one before that
 *    date and this action could not have received it.
 */

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  /** Field-level errors, keyed by input name. */
  errors?: Record<string, string>;
};

/**
 * The handoff's section 14 "Form qualifier", in its order.
 *
 * The same four strings are the form's labels (`./ContactForm.tsx`) and the
 * homepage's "What we will ask" card (`src/app/page.tsx`). All three must read
 * identically; this module cannot export them for the other two to import,
 * because a `'use server'` module may export only async functions.
 */
const QUESTIONS = [
  ['objective', 'What are you trying to build or change?'],
  ['existing', 'What exists today?'],
  ['deadline', 'Is there a deadline?'],
  ['success', 'What would a successful result look like?'],
] as const;

const MAX = {
  name: 120,
  company: 160,
  email: 200,
  objective: 4000,
  existing: 4000,
  deadline: 200,
  success: 4000,
} as const;

function isEmail(value: string): boolean {
  // Deliberately permissive: the only thing worth rejecting here is input that
  // cannot possibly be an address. Over-strict patterns reject real ones.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

/**
 * The answered questions as one readable block, question above answer.
 *
 * Three of the four are optional, so an unanswered question is left out rather
 * than forwarded as an empty heading: whoever reads the enquiry should see what
 * was said, not what was skipped.
 */
function transcript(answers: Record<string, string>): string {
  return QUESTIONS.filter(([key]) => answers[key] !== '')
    .map(([key, question]) => `${question}\n${answers[key]}`)
    .join('\n\n');
}

export async function submitContact(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot. Real users never fill a field they cannot see; bots fill everything.
  if (String(formData.get('website') ?? '').trim() !== '') {
    return { status: 'success', message: 'Thank you. We will reply within one working day.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();

  // The four qualifying answers. Names avoid `process`, which would shadow the
  // Node global.
  const objective = String(formData.get('objective') ?? '').trim();
  const existing = String(formData.get('existing') ?? '').trim();
  const deadline = String(formData.get('deadline') ?? '').trim();
  const success = String(formData.get('success') ?? '').trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please tell us your name.';
  else if (name.length > MAX.name) errors.name = 'That name is too long.';

  // Company is optional, so only its length is checked.
  if (company.length > MAX.company) errors.company = 'That company name is too long.';

  if (!email) errors.email = 'Please give us a work email so we can reply.';
  else if (!isEmail(email)) errors.email = 'That does not look like an email address.';
  else if (email.length > MAX.email) errors.email = 'That email address is too long.';

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

  const endpoint = process.env.CONTACT_WEBHOOK_URL;

  if (!endpoint) {
    // Configuration fault, not a visitor fault. Say so honestly and give the
    // fallback rather than pretending the enquiry was received.
    console.error('[contact] CONTACT_WEBHOOK_URL is not set — enquiry was not delivered.');
    return {
      status: 'error',
      message:
        `Our contact form is not currently connected. Please email ${contactEmail} so your enquiry reaches a person.`,
    };
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        company,
        email,
        // `process` is a retained key, not a live field. Until 2026-09-11 the
        // form asked one question — "Which process is costing you most?" — and
        // forwarded the answer under this name. Whatever consumes
        // CONTACT_WEBHOOK_URL is configured outside this repository and cannot
        // be read from here, so the key stays rather than disappearing from the
        // payload, now carrying every answered question as one readable block.
        // The four fields below are the authoritative ones; a consumer that
        // reads them can stop reading this.
        process: transcript({ objective, existing, deadline, success }),
        objective,
        existing,
        deadline,
        success,
        source: 'pixelettetech.com/contact',
        receivedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Delivery endpoint returned ${response.status}`);
    }
  } catch (error) {
    console.error('[contact] delivery failed:', error);
    return {
      status: 'error',
      message:
        `We could not send that just now. Please email ${contactEmail} rather than retrying, so your enquiry is not lost.`,
    };
  }

  return {
    status: 'success',
    message: 'Thank you. One of us will reply within one working day — not a sequence.',
  };
}
