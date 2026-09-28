'use client';

import Link from 'next/link';
import { type FormEvent, startTransition, useActionState, useCallback, useEffect, useRef, useState } from 'react';

import { submitAssistantEnquiry, type ContactState } from '@/app/contact/actions';
import { QUESTIONS } from '@/content/enquiry-questions';
import type { PixContext } from '@/lib/pix/context';
import {
  EMPTY_DRAFT,
  ENQUIRY_MAX,
  ENQUIRY_OPENING,
  ENQUIRY_STEPS,
  checkAnswer,
  type EnquiryDraft,
} from '@/lib/pix/enquiry';
import { STARTERS, respond, type PixReply } from '@/lib/pix/respond';

/**
 * Pix T, the site assistant.
 *
 * IT STORES NOTHING. No cookie, no localStorage, no sessionStorage. The
 * conversation lives in React state and is gone on reload. That is not
 * incidental tidiness: this site's Cookie Policy enumerates its storage exactly
 * and states plainly that the site sets no cookies, and an assistant that kept
 * a transcript would have made a careful legal page false.
 *
 * IT MAKES ONE KIND OF NETWORK CALL, AND ONLY WHEN ASKED. Answers are computed
 * in the page from data already in the bundle, so asking a question sends
 * nothing anywhere. The one exception is an enquiry the visitor chooses to
 * send: the assistant asks the contact form's four questions, shows every
 * answer back in an editable form carrying the contact form's own notice, and
 * only the Send button submits it - through `submitAssistantEnquiry`, which is
 * the contact form's server action with a different `source`. Same validation,
 * same storage, same notification, same honest failure messages. The Privacy
 * Notice describes exactly that enquiry, so it needed no change.
 *
 * EVERY ANSWER SHOWS ITS SOURCE. Where a reply came from a page, that page is
 * named and linked under the answer. A visitor can check it in one click, which
 * is the only honest way to present an automated answer on a company website.
 *
 * IT IS HANDED WHAT IT MAY SAY. The claims register and the company record are
 * read on the server and arrive here reduced to `context` (see
 * `src/lib/pix/context.ts`). Nothing this file imports may import either
 * register, because everything a client component imports ships to every
 * visitor - which is how, for four days, both registers did.
 */

type Turn = {
  id: number;
  role: 'visitor' | 'assistant';
  text: string;
  path?: string;
  sourceLabel?: string;
  offer?: PixReply['offer'];
};

/** The enquiry in progress: which question is next, and the answers so far. */
type Flow = { step: number; draft: EnquiryDraft; reviewing: boolean };

const GREETING: Turn = {
  id: 0,
  role: 'assistant',
  // The brief's opening state (section 52), word for word.
  text: "Tell me what you're trying to build, automate or improve. I can help you explore the most relevant Pixelette approach.",
};

/** The brief's MESSAGE_MAX_CHARS (section 70); respond() also truncates at this. */
const MESSAGE_MAX = 2000;

const INITIAL_ENQUIRY: ContactState = { status: 'idle', message: '' };

export function SiteAssistant({ context }: { context: PixContext }) {
  const [open, setOpen] = useState(false);
  /* Once opened, the panel is hidden rather than unmounted when closed, so an
     enquiry being sent, and edits in the review form, survive Close and Escape.
     Until then it is not rendered, so the page's first HTML is unchanged. */
  const [opened, setOpened] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const [flow, setFlow] = useState<Flow | null>(null);
  /* Remounts the review form for each new enquiry, so its server state starts clean. */
  const [reviewKey, setReviewKey] = useState(0);
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const say = useCallback((...added: Omit<Turn, 'id'>[]) => {
    setTurns(prev => [...prev, ...added.map(t => ({ ...t, id: nextId.current++ }))]);
  }, []);

  const startEnquiry = useCallback(() => {
    setFlow({ step: 0, draft: { ...EMPTY_DRAFT }, reviewing: false });
    say({ role: 'assistant', text: ENQUIRY_OPENING }, { role: 'assistant', text: ENQUIRY_STEPS[0].ask });
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [say]);

  /* Before Send nothing has left the page. After a Send that failed, the
     enquiry reached this site's server and went no further, so say that. */
  const cancelEnquiry = useCallback(
    (afterFailedSend: boolean) => {
      setFlow(null);
      say({
        role: 'assistant',
        text: afterFailedSend
          ? `Enquiry closed. It did not reach the team. You can email ${context.contactEmail} instead.`
          : 'Enquiry cancelled. Nothing was sent.',
      });
    },
    [context.contactEmail, say],
  );

  /* One answer to the current question. An empty answer is a skip. */
  const answer = useCallback(
    (raw: string) => {
      if (!flow || flow.reviewing) return;
      const step = ENQUIRY_STEPS[flow.step];
      const check = checkAnswer(step, raw);
      if (!check.ok) {
        say({ role: 'assistant', text: check.problem });
        return;
      }
      const nextDraft = { ...flow.draft, [step.field]: check.value };
      const next = flow.step + 1;
      const shown = { role: 'visitor' as const, text: check.value || 'Skip' };
      if (next < ENQUIRY_STEPS.length) {
        const ask = ENQUIRY_STEPS[next];
        setFlow({ step: next, draft: nextDraft, reviewing: false });
        say(shown, { role: 'assistant', text: ask.optional ? `${ask.ask} (optional)` : ask.ask });
      } else {
        setFlow({ step: next, draft: nextDraft, reviewing: true });
        setReviewKey(k => k + 1);
        say(shown, {
          role: 'assistant',
          text: 'Here is everything. Change anything you like, then press Send. Nothing has been sent yet.',
        });
      }
      setDraft('');
    },
    [flow, say],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (flow && !flow.reviewing) {
        answer(text);
        return;
      }
      if (!text) return;
      const reply: PixReply = respond(text, context);
      say(
        { role: 'visitor', text },
        { role: 'assistant', text: reply.text, path: reply.path, sourceLabel: reply.sourceLabel, offer: reply.offer },
      );
      setDraft('');
    },
    [answer, context, flow, say],
  );

  /* A delivered enquiry ends the flow, confirmed in the server's own words. */
  const finishEnquiry = useCallback(
    (message: string) => {
      setFlow(null);
      say({ role: 'assistant', text: message });
    },
    [say],
  );

  /* Keep the newest turn in view without yanking the whole page around. A
     hidden panel keeps no scroll position, so reopening scrolls again. */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, flow?.reviewing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* Escape closes, as a dialog should. The conversation is kept until reload. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const asking = flow && !flow.reviewing ? ENQUIRY_STEPS[flow.step] : null;

  return (
    <>
      <button
        aria-expanded={open}
        aria-controls="site-assistant-panel"
        className="asst-launch"
        onClick={() => {
          setOpened(true);
          setOpen(v => !v);
        }}
        type="button"
      >
        {open ? 'Close' : 'Ask Pix T'}
      </button>

      {opened ? (
        <div
          aria-label="Pix T, AI assistant"
          className="asst-panel"
          hidden={!open}
          id="site-assistant-panel"
          role="dialog"
        >
          <div className="asst-head">
            <p className="asst-title">Pix T</p>
            <p className="asst-sub">AI assistant</p>
          </div>

          <div aria-live="polite" className="asst-log" ref={logRef}>
            {turns.map(t => (
              <div className={`asst-turn asst-turn--${t.role}`} key={t.id}>
                <p className="asst-bubble">{t.text}</p>
                {t.role === 'assistant' && t.path ? (
                  <p className="asst-source">
                    Relevant:{' '}
                    <Link href={t.path} onClick={() => setOpen(false)}>
                      {t.sourceLabel ?? 'Open the page'} &rarr;
                    </Link>
                  </p>
                ) : null}
                {t.role === 'assistant' && t.offer === 'enquiry' && !flow ? (
                  <button className="asst-offer" onClick={startEnquiry} type="button">
                    Send an enquiry here
                  </button>
                ) : null}
              </div>
            ))}

            {flow?.reviewing ? (
              <EnquiryReview
                draft={flow.draft}
                key={reviewKey}
                onCancel={cancelEnquiry}
                onDelivered={finishEnquiry}
              />
            ) : null}
          </div>

          {turns.length === 1 && !flow ? (
            <div className="asst-starters">
              {STARTERS.map(s => (
                <button className="asst-chip" key={s} onClick={() => send(s)} type="button">
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {asking ? (
            <div className="asst-flowbar">
              <span>
                Enquiry, question {flow!.step + 1} of {ENQUIRY_STEPS.length}
              </span>
              <span>
                {asking.optional ? (
                  <button onClick={() => answer('')} type="button">
                    Skip
                  </button>
                ) : null}{' '}
                <button onClick={() => cancelEnquiry(false)} type="button">
                  Cancel
                </button>
              </span>
            </div>
          ) : null}

          {flow?.reviewing ? null : (
            <form
              className="asst-form"
              /* The flow's own check answers a malformed email in the chat. Without
                 this, the email question's type="email" let the browser block the
                 submit with its own tooltip, and the visitor never heard from Pix T. */
              noValidate
              onSubmit={e => {
                e.preventDefault();
                send(draft);
              }}
            >
              <label className="visually-hidden-heading" htmlFor="asst-input">
                {asking ? asking.ask : 'Ask Pix T a question'}
              </label>
              <input
                autoComplete={asking?.field === 'email' ? 'email' : asking?.field === 'name' ? 'name' : 'off'}
                className="asst-input"
                id="asst-input"
                maxLength={asking ? ENQUIRY_MAX[asking.field] : MESSAGE_MAX}
                onChange={e => setDraft(e.target.value)}
                placeholder={asking ? 'Type your answer' : "Tell me what you're working on"}
                ref={inputRef}
                type={asking?.field === 'email' ? 'email' : 'text'}
                value={draft}
              />
              <button className="asst-send" disabled={!asking && !draft.trim()} type="submit">
                {asking ? 'Next' : 'Ask'}
              </button>
            </form>
          )}

          <p className="asst-foot">
            This chat is not recorded. An enquiry you choose to send goes to the team the same way as the contact
            form.{' '}
            {flow ? null : (
              <>
                <button className="asst-linkbtn" onClick={startEnquiry} type="button">
                  Send an enquiry
                </button>
                {' · '}
              </>
            )}
            <Link href="/contact" onClick={() => setOpen(false)}>
              Contact page
            </Link>
          </p>
        </div>
      ) : null}
    </>
  );
}


/**
 * The enquiry, shown back before anything is sent.
 *
 * THE CONTACT FORM'S FIELDS, NAMES AND NOTICE. The field names are the ones
 * the server action reads, the four labels are the shared questions, the
 * honeypot is the contact form's, and the notice under Send is the founder's
 * just-in-time wording from the contact form, verbatim - Article 13 wants the
 * information at the point of collection, and this is a point of collection.
 */
function EnquiryReview({
  draft,
  onDelivered,
  onCancel,
}: {
  draft: EnquiryDraft;
  onDelivered: (message: string) => void;
  onCancel: (afterFailedSend: boolean) => void;
}) {
  const [state, dispatch, pending] = useActionState(submitAssistantEnquiry, INITIAL_ENQUIRY);
  const reported = useRef(false);

  /* Only a delivered enquiry ends the flow. Any failure - a field to put right,
     or delivery unconfigured or down - leaves the form open with the visitor's
     answers in it, as the contact form intends, so they can correct it or copy
     it into the email the failure message asks for. */
  useEffect(() => {
    if (state.status !== 'success' || reported.current) return;
    reported.current = true;
    onDelivered(state.message);
  }, [state, onDelivered]);

  /* Dispatched by hand rather than through <form action>: React 19 resets a
     form's uncontrolled fields once an action completes, even one that returns
     field errors, which put the chat answers back over the visitor's
     corrections (observed in the browser run on 2026-09-28). */
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };

  const err = state.errors ?? {};
  const field = (
    name: keyof EnquiryDraft,
    label: string,
    options: { rows?: number; type?: 'email'; optional?: boolean; autoComplete?: string } = {},
  ) => {
    const id = `asst-review-${name}`;
    const common = {
      'aria-describedby': err[name] ? `${id}-error` : undefined,
      'aria-invalid': err[name] ? true : undefined,
      autoComplete: options.autoComplete ?? 'off',
      defaultValue: draft[name],
      id,
      maxLength: ENQUIRY_MAX[name],
      name,
    };
    return (
      <label htmlFor={id}>
        {options.optional ? `${label} (optional)` : label}
        {options.rows ? <textarea rows={options.rows} {...common} /> : <input type={options.type ?? 'text'} {...common} />}
        {err[name] ? (
          <span className="asst-review-error" id={`${id}-error`}>
            {err[name]}
          </span>
        ) : null}
      </label>
    );
  };

  return (
    <form className="asst-review" noValidate onSubmit={submit}>
      {field('objective', QUESTIONS.objective, { rows: 3 })}
      {field('existing', QUESTIONS.existing, { rows: 2, optional: true })}
      {field('deadline', QUESTIONS.deadline, { optional: true })}
      {field('success', QUESTIONS.success, { rows: 2, optional: true })}
      {field('name', 'Name', { autoComplete: 'name' })}
      {field('email', 'Work email', { type: 'email', autoComplete: 'email' })}
      {field('company', 'Company', { optional: true, autoComplete: 'organization' })}

      {/* Honeypot: hidden from people, irresistible to bots. The contact form's own. */}
      <div aria-hidden className="honeypot">
        <label>
          Website
          <input autoComplete="off" name="website" tabIndex={-1} type="text" />
        </label>
      </div>

      {/* Beside Send, where the visitor is looking when the answer arrives. */}
      {state.status === 'error' && state.message ? (
        <p className="asst-review-error" role="status">
          {state.message}
        </p>
      ) : null}
      <div className="asst-review-actions">
        <button className="asst-send" disabled={pending} type="submit">
          {pending ? 'Sending…' : 'Send'}
        </button>
        {/* Not while sending: the enquiry may already be delivered, and
            "nothing was sent" would then be untrue. */}
        <button
          className="asst-linkbtn"
          disabled={pending}
          onClick={() => onCancel(state.status === 'error')}
          type="button"
        >
          Cancel
        </button>
      </div>
      {/* The contact form's just-in-time notice, founder wording verbatim (2026-09-17). */}
      <p className="asst-notice">
        We use the information you provide to respond to your enquiry. See our <Link href="/privacy">Privacy Notice</Link>{' '}
        for more information.
      </p>
    </form>
  );
}
