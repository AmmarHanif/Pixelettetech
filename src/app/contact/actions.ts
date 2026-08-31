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
 */

export type ContactState = {
  status: 'idle' | 'success' | 'error';
  message: string;
  /** Field-level errors, keyed by input name. */
  errors?: Record<string, string>;
};

const MAX = { name: 120, company: 160, email: 200, process: 4000 } as const;

function isEmail(value: string): boolean {
  // Deliberately permissive: the only thing worth rejecting here is input that
  // cannot possibly be an address. Over-strict patterns reject real ones.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
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
  // Named `processText`, not `process`, so it cannot shadow the Node global.
  const processText = String(formData.get('process') ?? '').trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please tell us your name.';
  else if (name.length > MAX.name) errors.name = 'That name is too long.';

  if (!company) errors.company = 'Please tell us which company you are with.';
  else if (company.length > MAX.company) errors.company = 'That company name is too long.';

  if (!email) errors.email = 'Please give us a work email so we can reply.';
  else if (!isEmail(email)) errors.email = 'That does not look like an email address.';
  else if (email.length > MAX.email) errors.email = 'That email address is too long.';

  if (!processText) errors.process = 'Tell us the process, even in one line.';
  else if (processText.length > MAX.process)
    errors.process = 'Please shorten this to under 4,000 characters.';

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
        process: processText,
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
