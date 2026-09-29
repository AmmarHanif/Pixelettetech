'use client';

import { track } from '@vercel/analytics/react';
import Link from 'next/link';
import { type FormEvent, useActionState, useEffect, useRef, useState } from 'react';

import { QUESTIONS } from '@/content/enquiry-questions';
import { ANALYTICS_ENABLED, ANALYTICS_EVENTS, ANALYTICS_SURFACES } from '@/lib/analytics';
import { analyticsAllowed } from '@/lib/privacy';

import { submitContact, type ContactState } from './actions';

/** The server's answer, or `unconfirmed` when no answer arrived (see `submit`). */
type FormState = ContactState & { unconfirmed?: boolean };

const initialState: ContactState = { status: 'idle', message: '' };

/** When a Send has taken long enough that the visitor should hear about it. */
const SLOW_SEND_MS = 15000;

/*
 * The four qualifying questions are the handoff's section 14 "Form qualifier",
 * published verbatim on the homepage card. Until 2026-09-11 this form asked four
 * different ones, so a visitor was told what would be asked and then met
 * something else; the spec's four are the authority. They now live in
 * `src/content/enquiry-questions.ts`, shared with the site assistant, which asks
 * the same four when it takes an enquiry. They cannot come from `./actions`: a
 * server-action module may export nothing but async functions.
 */

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" className="btn" disabled={pending} style={{ marginTop: 24 }}>
      {pending ? 'Sending…' : 'Send'}
    </button>
  );
}

type FieldProps = {
  name: string;
  label: string;
  /** Server-side message for this field, if the last submission failed on it. */
  error?: string;
  hint?: string;
  /** Optional fields say so in the label; everything else carries `required`. */
  optional?: boolean;
  maxLength: number;
  autoComplete?: string;
  type?: 'text' | 'email';
  /** Present means a textarea; absent means a single-line input. */
  rows?: number;
};

/**
 * One labelled control, with its hint and its error wired to it.
 *
 * Written once rather than seven times so the accessibility contract cannot
 * drift between fields: every control has a real `<label for>`, every hint and
 * every error is named in `aria-describedby`, and requiredness is carried by
 * the `required` attribute and stated in the visible label.
 */
function Field({
  name,
  label,
  error,
  hint,
  optional = false,
  maxLength,
  autoComplete,
  type = 'text',
  rows,
}: FieldProps) {
  const id = `field-${name}`;
  const hintId = hint ? `hint-${name}` : undefined;
  const errorId = error ? `err-${name}` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ');

  const shared = {
    id,
    name,
    maxLength,
    required: !optional,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy === '' ? undefined : describedBy,
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {optional ? `${label} (optional)` : label}
      </label>
      {hint ? (
        <span
          className="small"
          id={hintId}
          style={{ display: 'block', marginTop: -2, marginBottom: 8, fontSize: 12.5 }}
        >
          {hint}
        </span>
      ) : null}
      {rows === undefined ? (
        <input {...shared} type={type} autoComplete={autoComplete} />
      ) : (
        <textarea {...shared} rows={rows} />
      )}
      {error ? (
        <span className="field__error" id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}

/**
 * A name, a reply address, and the four questions the homepage says we will
 * ask.
 *
 * Name and work email are not spec questions and are not meant to be: they are
 * the operational minimum, because a brief with no-one to reply to is not an
 * enquiry. Company is kept — it is already part of the payload this form
 * forwards — but made optional, since the handoff's own close is "Bring us the
 * problem, not the specification" and a company name has never been the thing
 * that qualifies a brief.
 *
 * Only what we cannot reply or begin qualifying without is required: a name, an
 * address, and what the visitor is trying to build or change. The other three
 * questions are asked of everyone and answered by whoever can — a first-contact
 * visitor legitimately may not know what exists today, when it is needed, or
 * what success looks like, and an unanswered question is more useful than a
 * forced one.
 *
 * TWO PATHS TO ONE SERVER ACTION, since 2026-09-29.
 *
 * WITHOUT JAVASCRIPT the form posts natively through `useActionState` and the
 * server renders the answer. That path is unchanged and still works.
 *
 * WITH JAVASCRIPT, `submit` below prevents that and calls the action itself,
 * inside a try. Through `useActionState`, any failure in transit - a dropped
 * connection, a gateway error, a stale action after a redeploy, a response lost
 * after the enquiry was stored - rejected into React, which re-threw it during
 * render. With no error boundary, Next replaced the whole page with
 * "Application error" and the visitor's enquiry was lost (finding RES-02).
 * Calling the action directly has a second effect: React no longer clears the
 * fields when an answer comes back. Through <form action> it cleared them after
 * every answer, "Please check the highlighted fields." included, so a visitor
 * who mistyped an email lost the whole enquiry.
 */
export function ContactForm({ contactEmail }: { contactEmail: string }) {
  const [serverState, formAction] = useActionState(submitContact, initialState);
  const [clientState, setClientState] = useState<FormState | null>(null);
  const [pending, setPending] = useState(false);
  const [slow, setSlow] = useState(false);
  /* Set synchronously, so two submits in the same tick send once. */
  const inFlight = useRef(false);

  // The JavaScript path's answer when there is one; the no-JavaScript answer otherwise.
  const state: FormState = clientState ?? serverState;
  const err = state.errors ?? {};

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    const data = new FormData(event.currentTarget);
    setPending(true);
    let next: FormState;
    try {
      next = await submitContact(initialState, data);
    } catch {
      next = { status: 'error', message: '', unconfirmed: true };
    }
    inFlight.current = false;
    setPending(false);
    setSlow(false);
    setClientState(next);
  };

  /* A Send the server has not answered in 15 seconds gets an honest note. The
     server gives each provider 8 seconds, so a healthy send never gets here. */
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setSlow(true), SLOW_SEND_MS);
    return () => clearTimeout(timer);
  }, [pending]);

  const message = state.unconfirmed
    ? `We could not confirm that your enquiry was sent: the connection may have dropped. It may still have reached us. ` +
      `Please email ${contactEmail} so it is not lost; your answers are still below to copy.`
    : state.message;

  /*
   * The completed conversion — checklist item 21's "booked conversations".
   *
   * Reported from the SERVER'S answer, not from the submit button. A click on
   * Send is an attempt: it can fail validation, and the delivery path can be
   * unconfigured (it is today, by design — see `CONTACT-FORM-SETUP.md`), in
   * which case the visitor is told to email instead. Counting attempts as
   * conversions would overstate the one number the founder would act on
   * hardest.
   *
   * "The webhook can be unset" is what this said until 2026-09-14, and the
   * wording outlived the thing it named: commit a3745f0 replaced the webhook
   * with Supabase storage and Resend delivery. The distinction the comment
   * exists to draw is unchanged — attempt is not success — but it now has two
   * legs rather than one, and `submitContact` returns success only if at least
   * one of them landed. So this still counts what the server actually did.
   *
   * The ref is load-bearing and not belt-and-braces. `reactStrictMode` is on
   * (`next.config.ts`), so React invokes effects twice in development, and
   * `state` is re-read on every render of this component. Without the guard a
   * single successful enquiry reports two or more times.
   */
  const reported = useRef(false);
  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    /* The visitor's objection, checked here as well as in the delegated click
       listener. This event does not come through that listener - a form
       submission reports its own success - so gating one and not the other
       would leave exactly one analytics event still firing for a visitor who
       had switched analytics off, on the page where they are most likely to
       have opened the panel. */
    if (!analyticsAllowed()) return;
    if (state.status !== 'success') return;
    if (reported.current) return;
    reported.current = true;
    track(ANALYTICS_EVENTS.CONTACT_FORM_SUBMITTED, {
      surface: ANALYTICS_SURFACES.CONTACT_FORM,
    });
  }, [state.status]);

  return (
    <form action={formAction} noValidate onSubmit={submit}>
      {/* Announced to screen readers as soon as it appears. */}
      <div aria-live="polite" role="status">
        {!pending && state.status !== 'idle' && message ? (
          <p className={state.status === 'success' ? 'formnote formnote--ok' : 'formnote formnote--bad'}>
            {message}
          </p>
        ) : null}
        {slow ? (
          <p className="formnote formnote--bad">
            This is taking longer than it should. It may still arrive. If you would rather not wait, email{' '}
            {contactEmail}.
          </p>
        ) : null}
      </div>

      {state.status === 'success' ? null : (
        <div style={{ display: 'grid', gap: 20, marginTop: state.status === 'error' ? 24 : 0 }}>
          <div className="grid grid-2" style={{ gap: 20 }}>
            <Field name="name" label="Name" autoComplete="name" maxLength={120} error={err.name} />
            <Field
              name="company"
              label="Company"
              autoComplete="organization"
              maxLength={160}
              optional
              error={err.company}
            />
          </div>

          <Field
            name="email"
            label="Your contact email"
            type="email"
            autoComplete="email"
            maxLength={200}
            error={err.email}
          />

          <Field
            name="objective"
            label={QUESTIONS.objective}
            rows={4}
            maxLength={4000}
            error={err.objective}
          />

          <Field
            name="existing"
            label={QUESTIONS.existing}
            rows={3}
            maxLength={4000}
            optional
            error={err.existing}
          />

          <Field
            name="deadline"
            label={QUESTIONS.deadline}
            maxLength={200}
            optional
            hint="Whatever you know: a date, a quarter, or “not yet”."
            error={err.deadline}
          />

          <Field
            name="success"
            label={QUESTIONS.success}
            rows={3}
            maxLength={4000}
            optional
            error={err.success}
          />

          {/* Honeypot: hidden from people, irresistible to bots. */}
          <div aria-hidden className="honeypot">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div>
            <SubmitButton pending={pending} />
            {/* JUST-IN-TIME NOTICE, founder wording verbatim, 2026-09-17.
                Article 13 wants the information given AT THE POINT OF
                COLLECTION, so this sits with the submit button rather than
                relying on a footer link the reader has already scrolled past.
                It is deliberately two sentences: what we do with it, and where
                the full account is. Do not expand it — the detail belongs in
                the Privacy Notice, and a long notice here gets skipped. */}
            <p className="small" style={{ marginTop: 18, fontSize: 12.5 }}>
              We use the information you provide to respond to your enquiry. See our{' '}
              <Link href="/privacy">Privacy Notice</Link> for more information.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
