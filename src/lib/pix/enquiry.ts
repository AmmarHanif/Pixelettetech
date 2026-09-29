import { QUESTIONS } from '@/content/enquiry-questions';

/**
 * The enquiry the assistant can take in the chat. Pure: no network, no storage.
 *
 * LEAD QUALIFICATION HERE MEANS THE FOUR QUESTIONS, NOT A SCORE. The previous
 * site's assistant scored every visitor from 0 to 100 and sorted them into
 * tiers. This one asks exactly what the contact form asks, in the same words,
 * and hands the answers to the same server action. The Privacy Notice describes
 * an enquiry as those answers plus a name, a work email and an optional
 * company, and describes no scoring or profiling - so anything beyond this
 * would make that page untrue, and it is not to be changed.
 *
 * NOTHING IS SENT UNTIL THE VISITOR PRESSES SEND. The questions fill a draft in
 * component state; the last step shows every answer in an editable form with
 * the same notice the contact form carries, and only that form submits.
 */

export type EnquiryField = 'objective' | 'existing' | 'deadline' | 'success' | 'name' | 'email' | 'company';
export type EnquiryDraft = Record<EnquiryField, string>;

export const EMPTY_DRAFT: EnquiryDraft = {
  objective: '',
  existing: '',
  deadline: '',
  success: '',
  name: '',
  email: '',
  company: '',
};

/** The limits src/app/contact/actions.ts enforces, checked early as a courtesy. */
export const ENQUIRY_MAX: Readonly<Record<EnquiryField, number>> = {
  objective: 4000,
  existing: 4000,
  deadline: 200,
  success: 4000,
  name: 120,
  email: 200,
  company: 160,
};

export type EnquiryStep = { field: EnquiryField; ask: string; optional: boolean };

/** Asked in this order. The four qualifying questions first, word for word. */
export const ENQUIRY_STEPS: readonly EnquiryStep[] = [
  { field: 'objective', ask: QUESTIONS.objective, optional: false },
  { field: 'existing', ask: QUESTIONS.existing, optional: true },
  { field: 'deadline', ask: QUESTIONS.deadline, optional: true },
  { field: 'success', ask: QUESTIONS.success, optional: true },
  { field: 'name', ask: 'What name should the team reply to?', optional: false },
  { field: 'email', ask: 'And a work email for the reply?', optional: false },
  { field: 'company', ask: 'Which company is this for?', optional: true },
];

export const ENQUIRY_OPENING =
  'I will ask the four questions the team asks everyone, then a name and an email to reply to. ' +
  'Skip anything marked optional. Nothing is sent until you have checked it and pressed Send.';

/**
 * The same test the server applies, so a typo is caught before the form.
 * Character for character the pattern in src/app/contact/actions.ts, whose
 * comment explains it: linear by construction (finding PERF-01) and no
 * display-name or list forms (finding SAS-05). The hardening test in
 * verification/2026-09-29 fails if the two ever differ.
 */
export const EMAIL_PATTERN =
  /^[^\s@"<>()[\],;:\\]+@[^\s@"<>()[\],;:\\.]+(?:\.[^\s@"<>()[\],;:\\.]+)*\.[^\s@"<>()[\],;:\\.]{2,}$/;

export function isEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export type AnswerCheck = { ok: true; value: string } | { ok: false; problem: string };

export function checkAnswer(step: EnquiryStep, raw: string): AnswerCheck {
  const typed = String(raw ?? '').trim();
  // Zero-width marks alone are not an answer; the server treats them as empty
  // too (finding ECE-09).
  const value = typed.replace(/[\p{Cf}\s]/gu, '') === '' ? '' : typed;
  if (!value) {
    return step.optional ? { ok: true, value: '' } : { ok: false, problem: 'That one is needed. ' + step.ask };
  }
  if (value.length > ENQUIRY_MAX[step.field]) {
    return { ok: false, problem: `Please keep that under ${ENQUIRY_MAX[step.field].toLocaleString('en-GB')} characters.` };
  }
  if (step.field === 'email' && !isEmail(value)) {
    return { ok: false, problem: 'That does not look like an email address. ' + step.ask };
  }
  return { ok: true, value };
}
