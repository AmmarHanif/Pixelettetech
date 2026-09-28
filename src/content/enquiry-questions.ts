/**
 * The four qualifying questions every enquiry is asked.
 *
 * They are the handoff's section 14 "Form qualifier"
 * (`design/handoff-2026-09-08/IMPLEMENTATION-COPY.txt`), published verbatim on
 * the homepage as its "What we will ask" card, asked by the contact form, and -
 * since 28 September 2026 - asked by the site assistant when a visitor sends an
 * enquiry through it. The Privacy Notice describes an enquiry as exactly these
 * four answers plus a name, a work email and an optional company, so a fifth
 * question here would make that page untrue.
 *
 * ONE COPY FOR THE BROWSER. The contact form and the assistant both import this.
 * The homepage card (src/app/page.tsx) and the notification email
 * (src/lib/enquiries.ts) keep their own literal copies, and scripts/test-pix.cjs
 * fails if any of them stops matching this word for word.
 */
export const QUESTIONS = {
  objective: 'What are you trying to build or change?',
  existing: 'What exists today?',
  deadline: 'Is there a deadline?',
  success: 'What would a successful result look like?',
} as const;
