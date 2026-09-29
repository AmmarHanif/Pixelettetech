import { QUESTIONS } from '@/content/enquiry-questions';

/**
 * The enquiry the assistant takes in the chat. Pure: no network, no storage.
 *
 * CHANGED 2026-09-29 ON THE FOUNDER'S INSTRUCTION: "At the start ask for name
 * and email then start chatting. Hi (Visitor Name) Greetings how Can i help
 * you? Discover what he want. Lead Scoring Email Alert Store in Supabase."
 *
 * Until then this file said lead qualification meant the four questions and
 * never a score, because the Privacy Statement describes no scoring or
 * profiling. The founder chose to add both and to change the Statement. The
 * score is computed on the server (src/lib/lead-score.ts), never here, and the
 * build refuses to pass until the Statement's new wording is published
 * (scripts/check-privacy-interlock.mjs).
 *
 * THE FLOW NOW: a name, then a work email, each checked here; the founder's
 * greeting; then discovery - the same four questions and the company, asked
 * after the visitor's first message, each skippable, the whole of it
 * stoppable. The answers are sent when discovery ends, not before, and the
 * visitor is told so before the first question.
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

/** Discovery: the questions above less the name and email, which Pix T already has. */
export const DISCOVERY_STEPS: readonly EnquiryStep[] = ENQUIRY_STEPS.filter(
  s => s.field !== 'name' && s.field !== 'email',
);

/* The founder's words, 29 September 2026, and the steps either side of them. */
export const ASK_NAME = "Before we start, what's your name?";
export const askEmail = (name: string) => `Thanks, ${name}. What's your work email?`;
export const greeting = (name: string) => `Hi ${name}, greetings! How can I help you?`;
export const DISCOVERY_OPENING =
  'So the team can help properly, a few quick questions. Your answers go to them with your name and email ' +
  'when we finish. Skip any you like, or stop at any point.';

/*
 * Whether a message reads as a question rather than a description of what the
 * visitor wants. After the greeting, a description is taken as the answer to
 * the first discovery question; a question is answered and the first discovery
 * question is asked in full. A wrong guess costs one repeated question, never a
 * wrong answer, which is why a simple test is enough.
 */
const QUESTION_START =
  /^(what|how|why|when|where|who|which|can|could|do|does|did|is|are|was|were|will|would|should|may|have|has|tell me|explain)\b/i;

export function looksLikeQuestion(text: string): boolean {
  const value = text.trim();
  return value.endsWith('?') || QUESTION_START.test(value);
}

/**
 * The name step. As `checkAnswer` for the name, and one more thing: a visitor
 * who types a question or an address here has not given a name, and Pix T
 * should say so rather than greet them by their question.
 */
/** The email step: the enquiry's own check, asked in the gate's words. */
export function checkEmail(raw: string): AnswerCheck {
  return checkAnswer({ field: 'email', ask: "What's your work email?", optional: false }, raw);
}

export function checkName(raw: string): AnswerCheck {
  const check = checkAnswer(ENQUIRY_STEPS.find(s => s.field === 'name')!, raw);
  if (!check.ok) return { ok: false, problem: `That one is needed. ${ASK_NAME}` };
  if (check.value.includes('@') || check.value.endsWith('?') || check.value.split(/\s+/).length > 8) {
    return { ok: false, problem: `I'll come to that in a moment. First, what's your name?` };
  }
  return check;
}

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
