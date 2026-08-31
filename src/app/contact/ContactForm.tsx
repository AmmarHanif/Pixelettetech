'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { submitContact, type ContactState } from './actions';

const initialState: ContactState = { status: 'idle', message: '' };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn" disabled={pending} style={{ marginTop: 24 }}>
      {pending ? 'Sending…' : 'Send'}
    </button>
  );
}

/**
 * Four fields, as the design specifies.
 *
 * Built on a Server Action so it still submits with JavaScript disabled;
 * `useActionState` only upgrades the feedback, it is not load-bearing.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);
  const err = state.errors ?? {};

  return (
    <form action={formAction} noValidate>
      {/* Announced to screen readers as soon as it appears. */}
      <div aria-live="polite" role="status">
        {state.status !== 'idle' && state.message ? (
          <p className={state.status === 'success' ? 'formnote formnote--ok' : 'formnote formnote--bad'}>
            {state.message}
          </p>
        ) : null}
      </div>

      {state.status === 'success' ? null : (
        <div style={{ display: 'grid', gap: 20, marginTop: state.status === 'error' ? 24 : 0 }}>
          <div className="grid grid-2" style={{ gap: 20 }}>
            <label className="field">
              <span className="field__label">Name</span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={120}
                aria-invalid={err.name ? true : undefined}
                aria-describedby={err.name ? 'err-name' : undefined}
              />
              {err.name ? (
                <span className="field__error" id="err-name">
                  {err.name}
                </span>
              ) : null}
            </label>

            <label className="field">
              <span className="field__label">Company</span>
              <input
                name="company"
                type="text"
                autoComplete="organization"
                required
                maxLength={160}
                aria-invalid={err.company ? true : undefined}
                aria-describedby={err.company ? 'err-company' : undefined}
              />
              {err.company ? (
                <span className="field__error" id="err-company">
                  {err.company}
                </span>
              ) : null}
            </label>
          </div>

          <label className="field">
            <span className="field__label">Work email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={200}
              aria-invalid={err.email ? true : undefined}
              aria-describedby={err.email ? 'err-email' : undefined}
            />
            {err.email ? (
              <span className="field__error" id="err-email">
                {err.email}
              </span>
            ) : null}
          </label>

          <label className="field">
            <span className="field__label">Which process is costing you most?</span>
            <textarea
              name="process"
              required
              maxLength={4000}
              rows={4}
              aria-invalid={err.process ? true : undefined}
              aria-describedby={err.process ? 'err-process' : undefined}
            />
            {err.process ? (
              <span className="field__error" id="err-process">
                {err.process}
              </span>
            ) : null}
          </label>

          {/* Honeypot: hidden from people, irresistible to bots. */}
          <div aria-hidden className="honeypot">
            <label>
              Website
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div>
            <SubmitButton />
            <p className="small" style={{ marginTop: 18, fontSize: 12.5 }}>
              We will use this to reply to your enquiry. Nothing else, and no sequence.{' '}
              <Link href="/privacy">Privacy</Link>.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
