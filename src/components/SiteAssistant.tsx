'use client';

import Link from 'next/link';
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';

/* BOTH SIDES, because they are not alternatives. The branding constants came
   from one session and the enquiry flow from another, and the file needs every
   one of them - `ContactState` is used a few lines below. A merge that picked a
   side here would have compiled away half of somebody's work. */
import { startAssistantChat, submitAssistantEnquiry, type ContactState } from '@/app/contact/actions';
import { QUESTIONS } from '@/content/enquiry-questions';
import { PixSignal, type PixPhase } from '@/components/PixSignal';
import { PIX_T_DESCRIPTOR, PIX_T_NAME } from '@/lib/pix/branding';
import type { PixContext } from '@/lib/pix/context';
import {
  ASK_NAME,
  DISCOVERY_OPENING,
  DISCOVERY_STEPS,
  EMPTY_DRAFT,
  ENQUIRY_MAX,
  askEmail,
  checkAnswer,
  checkEmail,
  checkName,
  greeting,
  looksLikeQuestion,
  type EnquiryDraft,
} from '@/lib/pix/enquiry';
import { STARTERS, respond, type PixReply } from '@/lib/pix/respond';

/**
 * Pix T, the site assistant.
 *
 * IT ASKS WHO THE VISITOR IS FIRST (founder instruction, 29 September 2026). A
 * name, then a work email, then "That is all I need for now, {name}. How may I help you today?".
 * The name and email are recorded as they are given (`startAssistantChat`), so
 * a visitor who leaves early is not lost, and the notice under the box says
 * what they are for: Article 13 wants that at the point of collection, and this
 * is one. Recording them can fail without the chat failing - the enquiry at the
 * end carries them again, through the path that reports honestly.
 *
 * THEN IT FINDS OUT WHAT THEY WANT. After the visitor's first message Pix T
 * asks the contact form's four questions and the company, each skippable, and
 * says before the first of them that the answers go to the team. When the last
 * is answered the enquiry is sent through the review form below - scored on the
 * server, stored, and emailed to the team. If sending fails, that form stays
 * open with every answer in it and says so honestly.
 *
 * WHAT IT STILL DOES NOT KEEP. No cookie, no localStorage, no sessionStorage:
 * the conversation lives in React state and is gone on reload. The visitor's
 * own questions never leave the page - answers are computed here from data
 * already in the bundle. Only the name, the email and the discovery answers are
 * sent, and the panel's footer says exactly that.
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

/** Discovery in progress: which question is next, and the answers so far. */
type Flow = { step: number; draft: EnquiryDraft; reviewing: boolean };

/** Who the visitor said they are. `ref` names the recorded contact, once known. */
type Visitor = { name: string; email: string; ref: string | null };

/*
 * THE OPENING, CHANGED 2026-09-29. Pix T used to open with the brief's section
 * 52 line, "Tell me what you're trying to build, automate or improve. I can
 * help you explore the most relevant Pixelette approach." The founder's
 * instruction of 29 September replaces it: the name and email first, then his
 * greeting, word for word (src/lib/pix/enquiry.ts). What section 52 asked for
 * survives as the first discovery question, which asks exactly that.
 */
const FIRST_TURN: Turn = { id: 0, role: 'assistant', text: ASK_NAME };

/** The brief's MESSAGE_MAX_CHARS (section 70); respond() also truncates at this. */
const MESSAGE_MAX = 2000;

/**
 * The server's answer to the enquiry, or `unconfirmed` when no answer arrived:
 * the connection failed, a gateway replied instead of the site, or the page is
 * older than the deployment that received it. In that case nobody here knows
 * whether the enquiry landed, and the visitor is told exactly that.
 */
type ReviewState = ContactState & { unconfirmed?: boolean };

const INITIAL_ENQUIRY: ReviewState = { status: 'idle', message: '' };

/** When a Send has taken long enough that the visitor should be offered a way out. */
const SLOW_SEND_MS = 15000;

/** What is true when the visitor closes an enquiry, which decides what Pix T says. */
type CancelKind = 'unsent' | 'refused' | 'unconfirmed';

/*
 * THE SIGNAL'S RHYTHM, 2026-10-02 (founder's interaction table; see
 * PixSignal.tsx). Answers are computed here and are ready at once, so without a
 * beat there would be no "thinking" to show. Every assistant turn is therefore
 * held for THINK_MS while the points travel the rim, then appears with the
 * pulse (RESPOND_MS), then the flash (FINISH_MS) and back to idle. 650ms is
 * long enough to read as a reply rather than a page update, short enough not to
 * feel slower than it is. Under prefers-reduced-motion there is no animation to
 * wait for, so there is no beat either: turns appear at once, as before.
 */
const THINK_MS = 650;
const RESPOND_MS = 900;
const FINISH_MS = 650;

/** How long the ball is shown alone before "Ask Pix T" opens out beside it. */
const LABEL_DELAY_MS = 2500;

/** How close, in px from the ball's centre, counts as "approaching", and
    how far it must go again to count as having left. The gap is hysteresis: a
    pointer resting near one radius would otherwise restart the trace on every
    wobble across it. */
const NEAR_PX = 170;
const LEAVE_PX = 200;

const replyTurn = (reply: PixReply): Omit<Turn, 'id'> => ({
  role: 'assistant',
  text: reply.text,
  path: reply.path,
  sourceLabel: reply.sourceLabel,
  offer: reply.offer,
});

export function SiteAssistant({ context }: { context: PixContext }) {
  const [open, setOpen] = useState(false);
  /* Once opened, the panel is hidden rather than unmounted when closed, so an
     enquiry being sent, and edits in the review form, survive Close and Escape.
     Until then it is not rendered, so the page's first HTML is unchanged. */
  const [opened, setOpened] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([FIRST_TURN]);
  const [draft, setDraft] = useState('');
  /* The two steps before the chat, then null for the rest of it. */
  const [identify, setIdentify] = useState<'name' | 'email' | null>('name');
  const [pendingName, setPendingName] = useState('');
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  /* Whether the visitor has sent anything since the greeting: the first message
     is what starts discovery. */
  const [chatted, setChatted] = useState(false);
  /* One enquiry per conversation. Once it is delivered the offers go. */
  const [leadSent, setLeadSent] = useState(false);
  const [flow, setFlow] = useState<Flow | null>(null);
  /* Remounts the review form for each new enquiry, so its server state starts clean. */
  const [reviewKey, setReviewKey] = useState(0);
  /* The Signal's state: thinking while turns are held, then responding, then
     finished. `busy` is the enquiry form's own send in flight, which also shows
     as thinking. `near` is the pointer approaching the closed launcher. */
  const [phase, setPhase] = useState<PixPhase>('idle');
  const [busy, setBusy] = useState(false);
  const [near, setNear] = useState(false);
  /* The launcher opens out into the "Ask Pix T" pill once, LABEL_DELAY_MS
     after the page loads (founder, 2026-10-02): the ball first, then the words. */
  const [labelled, setLabelled] = useState(false);
  /* Opened, Pix T first shows a compact dock - three suggested questions over
     a message bar (founder, 2026-10-02) - and becomes the full conversation on
     the first question asked. A question asked before the visitor has given
     their name and email is kept, and answered once they have. */
  const [expanded, setExpanded] = useState(false);
  const pendingQuestion = useRef<string | null>(null);
  /* The name-and-email box shown in the dock after a question; null when not
     shown. */
  const [details, setDetails] = useState<{ name: string; email: string; problem: string } | null>(null);
  const held = useRef<Omit<Turn, 'id'>[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const thinking = useRef(false);
  const reducedMotion = useRef(false);
  const launchRef = useRef<HTMLButtonElement>(null);
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const append = useCallback((added: Omit<Turn, 'id'>[]) => {
    if (added.length) setTurns(prev => [...prev, ...added.map(t => ({ ...t, id: nextId.current++ }))]);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  /* Release the held assistant turns: they appear, the symbol pulses, the ball
     flashes once and settles. */
  const release = useCallback(() => {
    clearTimers();
    thinking.current = false;
    const out = held.current;
    held.current = [];
    append(out);
    setPhase('responding');
    timers.current.push(
      setTimeout(() => setPhase('finished'), RESPOND_MS),
      setTimeout(() => setPhase('idle'), RESPOND_MS + FINISH_MS),
    );
    /* The input was read-only for the beat; hand the caret back, unless the
       visitor has since gone somewhere else on the page. */
    const active = document.activeElement;
    const panel = document.getElementById('site-assistant-panel');
    if (!active || active === document.body || panel?.contains(active)) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [append, clearTimers]);

  /* The visitor's own turns appear at once. Pix T's are held for the thinking
     beat and released together, so a reply and the question after it arrive as
     one answer. A visitor turn never overtakes a held reply: anything held is
     released first. */
  const say = useCallback(
    (...added: Omit<Turn, 'id'>[]) => {
      const mine = added.filter(t => t.role === 'visitor');
      const theirs = added.filter(t => t.role === 'assistant');
      if (mine.length && held.current.length) release();
      append(mine);
      if (!theirs.length) return;
      if (reducedMotion.current) {
        /* Anything still held from before the preference changed goes first. */
        if (held.current.length) release();
        append(theirs);
        return;
      }
      held.current.push(...theirs);
      if (thinking.current) return;
      clearTimers();
      thinking.current = true;
      setPhase('thinking');
      timers.current.push(setTimeout(release, THINK_MS));
    },
    [append, clearTimers, release],
  );

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = m.matches;
    const onChange = () => {
      reducedMotion.current = m.matches;
      if (m.matches && held.current.length) release();
    };
    m.addEventListener('change', onChange);
    return () => {
      m.removeEventListener('change', onChange);
      clearTimers();
    };
  }, [clearTimers, release]);

  useEffect(() => {
    const t = setTimeout(() => setLabelled(true), LABEL_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  /* "User approaches": the pointer comes within NEAR_PX of the closed
     launcher, and has left once it is beyond LEAVE_PX. Only for a mouse or
     trackpad - a finger has no approach. The launcher is position: fixed, so
     its centre is measured once and again on resize, not on every move; each
     move is a subtraction, and React re-renders only when the answer flips. */
  useEffect(() => {
    if (open) {
      setNear(false);
      return;
    }
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let cx = 0;
    let cy = 0;
    /* The ball is always the right-hand end of the launcher, whether it is
       a lone circle or the opened-out pill, so its centre is measured from
       the right edge. Re-measured when the pill opens, as well as on resize. */
    const place = () => {
      const r = launchRef.current?.getBoundingClientRect();
      if (r) {
        cx = r.right - r.height / 2;
        cy = r.top + r.height / 2;
      }
    };
    place();
    const onMove = (e: PointerEvent) => {
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      setNear(prev => (prev ? d < LEAVE_PX : d < NEAR_PX));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', place);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', place);
    };
  }, [open]);

  const focusInput = useCallback(() => setTimeout(() => inputRef.current?.focus(), 0), []);

  /* Discovery, with whatever the visitor has already told us. The name and the
     email are known, so only the four questions and the company are asked. */
  const startDiscovery = useCallback(
    (objective = '') => {
      if (!visitor) return;
      const step = objective ? 1 : 0;
      const ask = DISCOVERY_STEPS[step];
      /* However it began, discovery counts as the visitor's start: a later
         message after Stop is a question, not a reason to begin again. */
      setChatted(true);
      setFlow({
        step,
        draft: { ...EMPTY_DRAFT, name: visitor.name, email: visitor.email, objective },
        reviewing: false,
      });
      say(
        { role: 'assistant', text: DISCOVERY_OPENING },
        { role: 'assistant', text: ask.optional ? `${ask.ask} (optional)` : ask.ask },
      );
      focusInput();
    },
    [focusInput, say, visitor],
  );

  /* After a Send the server refused or could not deliver, the enquiry reached
     this site and went no further. After a Send whose answer never came back,
     nobody here knows, so Pix T says so rather than guessing either way. The
     name and email were recorded at the start, which the notice said, so
     "nothing was sent" is no longer the thing to say. */
  const cancelEnquiry = useCallback(
    (kind: CancelKind) => {
      setFlow(null);
      say({
        role: 'assistant',
        text:
          kind === 'unsent'
            ? 'Stopped. Those answers were not sent. Ask me anything, or start again with Send an enquiry below.'
            : kind === 'refused'
              ? `Enquiry closed. It did not reach the team. You can email ${context.contactEmail} instead.`
              : `Enquiry closed. It may still have reached the team. If you do not hear back, please email ${context.contactEmail}.`,
      });
      focusInput();
    },
    [context.contactEmail, focusInput, say],
  );

  /* The name, then the email. Neither can be skipped: the founder asked for
     both before the chat begins. */
  const identifyStep = useCallback(
    (text: string) => {
      const echo = text ? [{ role: 'visitor' as const, text }] : [];
      if (identify === 'name') {
        const check = checkName(text);
        if (!check.ok) {
          say(...echo, { role: 'assistant', text: check.problem });
          return;
        }
        setPendingName(check.value);
        setIdentify('email');
        say({ role: 'visitor', text: check.value }, { role: 'assistant', text: askEmail(check.value) });
        return;
      }
      const check = checkEmail(text);
      if (!check.ok) {
        say(...echo, { role: 'assistant', text: check.problem });
        return;
      }
      setVisitor({ name: pendingName, email: check.value, ref: null });
      setIdentify(null);
      say({ role: 'visitor', text: check.value }, { role: 'assistant', text: greeting(pendingName) });
      /* Recorded now, so a visitor who leaves early is not lost. Never awaited
         by the chat, and a failure is not the visitor's problem: the enquiry
         carries the same details again at the end. */
      const data = new FormData();
      data.set('name', pendingName);
      data.set('email', check.value);
      data.set('website', honeypotRef.current?.value ?? '');
      startAssistantChat(data).then(
        result => {
          if (result.ref) setVisitor(v => (v ? { ...v, ref: result.ref } : v));
        },
        () => undefined,
      );
    },
    [identify, pendingName, say],
  );

  /* The dock's name-and-email box. Both are checked by Pix T's own rules; on
     success the visitor is recorded exactly as the chat's own steps record
     them, and the conversation opens on the question that was asked. */
  const submitDetails = useCallback(() => {
    if (!details) return;
    const name = checkName(details.name.trim());
    if (!name.ok) return setDetails({ ...details, problem: name.problem });
    const email = checkEmail(details.email.trim());
    if (!email.ok) return setDetails({ ...details, problem: email.problem });
    setVisitor({ name: name.value, email: email.value, ref: null });
    setIdentify(null);
    setDetails(null);
    setTurns([]);
    setExpanded(true);
    const data = new FormData();
    data.set('name', name.value);
    data.set('email', email.value);
    data.set('website', honeypotRef.current?.value ?? '');
    startAssistantChat(data).then(
      result => {
        if (result.ref) setVisitor(v => (v ? { ...v, ref: result.ref } : v));
      },
      () => undefined,
    );
  }, [details]);

  /* One answer to the current discovery question. An empty answer is a skip. */
  const answer = useCallback(
    (raw: string) => {
      if (!flow || flow.reviewing) return;
      const step = DISCOVERY_STEPS[flow.step];
      const check = checkAnswer(step, raw);
      if (!check.ok) {
        say({ role: 'assistant', text: check.problem });
        return;
      }
      const nextDraft = { ...flow.draft, [step.field]: check.value };
      const next = flow.step + 1;
      const shown = { role: 'visitor' as const, text: check.value || 'Skip' };
      if (next < DISCOVERY_STEPS.length) {
        const ask = DISCOVERY_STEPS[next];
        setFlow({ step: next, draft: nextDraft, reviewing: false });
        say(shown, { role: 'assistant', text: ask.optional ? `${ask.ask} (optional)` : ask.ask });
      } else {
        setFlow({ step: next, draft: nextDraft, reviewing: true });
        setReviewKey(k => k + 1);
        say(shown, { role: 'assistant', text: 'Thank you. Sending this to the team now.' });
      }
      setDraft('');
    },
    [flow, say],
  );

  const send = useCallback(
    (raw: string) => {
      /* One exchange at a time: a second message while Pix T is still
         thinking would land between the question and its answer. */
      if (thinking.current) return;
      const text = raw.trim();
      if (!expanded) {
        if (!text) return;
        setDraft('');
        if (identify) {
          /* Name and email still come first, as the founder asked: a small
             box in the dock asks for both, and the question is answered once
             they are given (founder, 2026-10-02). */
          pendingQuestion.current = text;
          setDetails({ name: '', email: '', problem: '' });
          return;
        }
        setExpanded(true);
      }
      if (identify) {
        identifyStep(text);
        setDraft('');
        focusInput();
        return;
      }
      if (flow && !flow.reviewing) {
        answer(text);
        focusInput();
        return;
      }
      if (!text) return;
      const reply: PixReply = respond(text, context);
      if (!chatted && !leadSent && !flow) {
        /* The first message after the greeting starts discovery. A question is
           answered, then the first discovery question is asked in full; a
           description of what they want IS the answer to it, so it is kept and
           discovery moves on. A description gets a reply only when Pix T has a
           real one - "I don't have enough information" would read as a refusal
           of what the visitor just said. */
        setChatted(true);
        if (looksLikeQuestion(text)) {
          say({ role: 'visitor', text }, replyTurn(reply));
          startDiscovery();
        } else {
          const answered = reply.via !== 'no-answer' && reply.via !== 'ask-more';
          say({ role: 'visitor', text }, answered ? replyTurn(reply) : { role: 'assistant', text: 'Thanks, that helps.' });
          startDiscovery(text.slice(0, ENQUIRY_MAX.objective));
        }
      } else {
        say({ role: 'visitor', text }, replyTurn(reply));
      }
      setDraft('');
      focusInput();
    },
    [answer, chatted, context, expanded, flow, focusInput, identify, identifyStep, leadSent, say, startDiscovery],
  );

  /* The question asked from the dock, answered once the greeting has landed. */
  useEffect(() => {
    if (visitor && phase === 'idle' && !thinking.current && pendingQuestion.current) {
      const q = pendingQuestion.current;
      pendingQuestion.current = null;
      send(q);
    }
  }, [phase, send, visitor]);

  /* A delivered enquiry ends the flow, confirmed in the server's own words. */
  const finishEnquiry = useCallback(
    (message: string) => {
      setFlow(null);
      setLeadSent(true);
      say({ role: 'assistant', text: message });
      focusInput();
    },
    [focusInput, say],
  );

  /* Keep the newest turn in view without yanking the whole page around. A
     hidden panel keeps no scroll position, so reopening scrolls again. */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, flow?.reviewing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open, labelled]);

  /* Escape closes, as a dialog should. The conversation is kept until reload.
     Focus goes back to the launcher when it was inside the panel: the panel
     is hidden, and focus left on a hidden input falls to <body>, which loses
     a keyboard user's place on the page. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const inPanel = document.getElementById('site-assistant-panel')?.contains(document.activeElement);
      setOpen(false);
      if (inPanel) launchRef.current?.focus();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const asking = flow && !flow.reviewing ? DISCOVERY_STEPS[flow.step] : null;
  /* What the one input is for right now, which decides its label, its hints and
     its limit. */
  const input = !expanded
    ? { label: `Ask ${PIX_T_NAME} a question`, placeholder: 'Hello! How can I help you?', autoComplete: 'off', type: 'text', max: MESSAGE_MAX }
    : identify === 'name'
    ? { label: 'Your name', placeholder: 'Your name', autoComplete: 'name', type: 'text', max: ENQUIRY_MAX.name }
    : identify === 'email'
      ? { label: 'Your work email', placeholder: 'you@company.com', autoComplete: 'email', type: 'email', max: ENQUIRY_MAX.email }
      : asking
        ? {
            label: asking.ask,
            placeholder: 'Type your answer',
            autoComplete: asking.field === 'company' ? 'organization' : 'off',
            type: 'text',
            max: ENQUIRY_MAX[asking.field],
          }
        : { label: `Ask ${PIX_T_NAME} a question`, placeholder: 'Type your message', autoComplete: 'off', type: 'text', max: MESSAGE_MAX };
  const stepping = identify !== null || asking !== null;
  /* While a reply is held, nothing that belongs to the NEXT step is on screen:
     no starters, offers or Skip/Stop for a question not yet asked, and no
     enquiry send before Pix T has said it is sending. They arrive with the
     turn they follow. */
  const holding = phase === 'thinking';
  const canOffer = visitor !== null && !flow && !leadSent && !holding;

  return (
    <>
      {/* THE LAUNCHER IS THE SIGNAL BALL (PixSignal, founder's direction of
          2026-10-02), not the words "Ask Pix T": a light purple sphere of
          flowing white and dark-purple pixels, with the interaction states.
          It replaced the Pixelette tree, which the founder had removed from the
          ball the same day. Because there is no visible label, the button
          carries an `aria-label`: a control with no text has NO accessible
          name otherwise. The ball is aria-hidden, so nothing is announced
          twice. Open, the close glyph sits over the ball, so the control does
          not jump.
          aria-controls is set only once the panel exists: before the first
          open there is nothing for it to point at. */}
      <button
        aria-expanded={open}
        aria-controls={opened ? 'site-assistant-panel' : undefined}
        aria-label={open ? `Close ${PIX_T_NAME}` : `Ask ${PIX_T_NAME}, ${PIX_T_DESCRIPTOR}`}
        className={`asst-launch asst-launch--signal${labelled ? ' is-labelled' : ''}${open ? ' asst-launch--open' : ''}`}
        onClick={() => {
          setOpened(true);
          setOpen(v => !v);
        }}
        ref={launchRef}
        type="button"
      >
        {/* The visible words. The button's aria-label already begins with
            them, so they are hidden from the accessibility tree rather than
            read twice. */}
        <span aria-hidden className="asst-launch__label">
          Ask {PIX_T_NAME}
        </span>
        <PixSignal near={near && !open} phase={busy ? 'thinking' : phase} />
        {open ? (
          <svg aria-hidden className="asst-launch__x" viewBox="0 0 24 24">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : null}
      </button>

      {opened ? (
        <div
          aria-label={`${PIX_T_NAME}, ${PIX_T_DESCRIPTOR}`}
          className={`asst-panel${expanded ? '' : ' asst-panel--dock'}`}
          hidden={!open}
          id="site-assistant-panel"
          role="dialog"
        >
          {!expanded ? (
            <div className="asst-dock">
              <button aria-label={`Close ${PIX_T_NAME}`} className="asst-dock__close" onClick={() => setOpen(false)} type="button">
                <svg aria-hidden viewBox="0 0 24 24">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              {details ? (
                <form
                  className="asst-details"
                  noValidate
                  onSubmit={e => {
                    e.preventDefault();
                    submitDetails();
                  }}
                >
                  <p className="asst-details__lead">Happy to help. Before I answer, may I take your name and work email?</p>
                  <label htmlFor="asst-details-name">Your name</label>
                  <input
                    autoComplete="name"
                    autoFocus
                    id="asst-details-name"
                    maxLength={ENQUIRY_MAX.name}
                    onChange={e => setDetails({ ...details, name: e.target.value, problem: '' })}
                    value={details.name}
                  />
                  <label htmlFor="asst-details-email">Work email</label>
                  <input
                    autoComplete="email"
                    id="asst-details-email"
                    maxLength={ENQUIRY_MAX.email}
                    onChange={e => setDetails({ ...details, email: e.target.value, problem: '' })}
                    type="email"
                    value={details.email}
                  />
                  {details.problem ? (
                    <p className="asst-details__error" role="alert">
                      {details.problem}
                    </p>
                  ) : null}
                  <button className="asst-send" type="submit">
                    Continue
                  </button>
                  {/* The notice at the point of collection, as in the chat. */}
                  <p className="asst-details__notice">
                    We record your name and email as soon as you give them, so the team can reply even if you leave
                    before finishing. See our{' '}
                    <Link href="/privacy" onClick={() => setOpen(false)}>
                      Privacy Notice
                    </Link>
                    .
                  </p>
                </form>
              ) : null}
              <div className="asst-dock__questions" hidden={details !== null}>
                {STARTERS.slice(0, 3).map(q => (
                  <button className="asst-dock__q" key={q} onClick={() => send(q)} type="button">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="asst-head" hidden={!expanded}>
            {/* The same core, small: this is where thinking, responding and
                finished are seen while the panel is open. */}
            <PixSignal phase={busy ? 'thinking' : phase} size="sm" />
            <div>
              <p className="asst-title">{PIX_T_NAME}</p>
              {/* Section 12: say what it is, once, without underselling it. */}
              <p className="asst-sub">{PIX_T_DESCRIPTOR}</p>
            </div>
          </div>

          {/* aria-busy while a reply is held, so a screen reader announces the
              reply when it lands rather than the wait. Not during an enquiry
              send: that can take seconds, a busy live region announces nothing
              meanwhile, and the review form reports its own outcome. */}
          <div aria-busy={holding} aria-live="polite" className="asst-log" hidden={!expanded} ref={logRef}>
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
                {t.role === 'assistant' && t.offer === 'enquiry' && canOffer ? (
                  <button className="asst-offer" onClick={() => startDiscovery()} type="button">
                    Send an enquiry here
                  </button>
                ) : null}
              </div>
            ))}

            {flow?.reviewing && visitor && !holding ? (
              <EnquiryReview
                autoSubmit
                contactEmail={context.contactEmail}
                onBusy={setBusy}
                draft={flow.draft}
                key={reviewKey}
                leadRef={visitor.ref}
                onCancel={cancelEnquiry}
                onDelivered={finishEnquiry}
              />
            ) : null}
          </div>

          {expanded && visitor && !chatted && !flow && !holding ? (
            <div className="asst-starters">
              {STARTERS.map(s => (
                <button className="asst-chip" key={s} onClick={() => send(s)} type="button">
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          {asking && !holding ? (
            <div className="asst-flowbar">
              <span>
                Question {flow!.step + 1} of {DISCOVERY_STEPS.length}
              </span>
              <span>
                {asking.optional ? (
                  <button onClick={() => answer('')} type="button">
                    Skip
                  </button>
                ) : null}{' '}
                <button onClick={() => cancelEnquiry('unsent')} type="button">
                  Stop
                </button>
              </span>
            </div>
          ) : null}

          {flow?.reviewing || details ? null : (
            <form
              className="asst-form"
              /* Pix T's own checks answer a malformed email in the chat. Without
                 this, type="email" let the browser block the submit with its own
                 tooltip, and the visitor never heard from Pix T. */
              noValidate
              onSubmit={e => {
                e.preventDefault();
                send(draft);
              }}
            >
              <label className="visually-hidden-heading" htmlFor="asst-input">
                {input.label}
              </label>
              <input
                autoComplete={input.autoComplete}
                className="asst-input"
                id="asst-input"
                maxLength={input.max}
                onChange={e => setDraft(e.target.value)}
                placeholder={holding ? `${PIX_T_NAME} is thinking…` : input.placeholder}
                /* Read-only for the beat, so nothing can be typed against a
                   question that is about to change underneath it. */
                readOnly={holding}
                ref={inputRef}
                type={input.type}
                value={draft}
              />
              {expanded ? (
                <button className="asst-send" disabled={holding || (!stepping && !draft.trim())} type="submit">
                  {stepping ? 'Next' : 'Ask'}
                </button>
              ) : (
                <button aria-label="Send" className="asst-send asst-send--icon" disabled={!draft.trim()} type="submit">
                  <svg aria-hidden viewBox="0 0 24 24">
                    <path d="M4 12l16-8-6 16-2.5-6.5L4 12z" />
                  </svg>
                </button>
              )}
            </form>
          )}

          {/* The same honeypot as the enquiry form: hidden from people, filled by
              bots, and sent with the name and email. */}
          <div aria-hidden className="honeypot">
            <label>
              Website
              <input autoComplete="off" name="website" ref={honeypotRef} tabIndex={-1} type="text" />
            </label>
          </div>

          <p className="asst-foot" hidden={!expanded}>
            {identify ? (
              /* The notice at the point of collection. It began as the contact
                 form's (founder wording, 2026-09-17), which says only that the
                 information is used to respond. Here the name and email are
                 recorded the moment they are given, whether or not an enquiry
                 follows, so the notice says so (security review S5, 29
                 September). Proposed to the founder and Legal with the Statement
                 draft; the privacy interlock checks for "as soon as you give
                 them". */
              <>
                We record your name and email as soon as you give them, so the team can reply even if you leave before
                finishing. See our{' '}
                <Link href="/privacy" onClick={() => setOpen(false)}>
                  Privacy Notice
                </Link>{' '}
                for more information.{' '}
              </>
            ) : (
              <>
                Your name, email and answers to {PIX_T_NAME}&rsquo;s questions go to the team. The rest of this chat is
                not stored.{' '}
              </>
            )}
            {canOffer ? (
              <>
                <button className="asst-linkbtn" onClick={() => startDiscovery()} type="button">
                  Send an enquiry
                </button>
                {' · '}
              </>
            ) : null}
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
 * The enquiry, as it is sent - and, if sending fails, as it can be corrected
 * and sent again.
 *
 * Since 2026-09-29 Pix T submits this itself when discovery ends (`autoSubmit`),
 * having said before the first question that it would. Before then it waited
 * for the visitor to press Send; that button is still here for a retry.
 *
 * THE CONTACT FORM'S FIELDS, NAMES AND NOTICE. The field names are the ones
 * the server action reads, the four labels are the shared questions, the
 * honeypot is the contact form's, and the notice under Send is the founder's
 * just-in-time wording from the contact form, verbatim - Article 13 wants the
 * information at the point of collection, and this is a point of collection.
 */
function EnquiryReview({
  autoSubmit = false,
  contactEmail,
  draft,
  leadRef,
  onBusy,
  onDelivered,
  onCancel,
}: {
  /** Send as soon as it appears: discovery has already told the visitor it will. */
  autoSubmit?: boolean;
  contactEmail: string;
  draft: EnquiryDraft;
  /** The chat contact recorded at the start, so the enquiry can name it. */
  leadRef: string | null;
  /** Told when a send starts and ends, so the Signal can show it thinking. */
  onBusy?: (busy: boolean) => void;
  onDelivered: (message: string) => void;
  onCancel: (kind: CancelKind) => void;
}) {
  const [state, setState] = useState<ReviewState>(INITIAL_ENQUIRY);
  const [pending, setPending] = useState(false);
  const [slow, setSlow] = useState(false);
  /* Set synchronously, so two submits in the same tick send once; `pending`
     is state, and two scripted submits both read it before it updates
     (finding ECE-06). */
  const inFlight = useRef(false);
  const reported = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const autoSent = useRef(false);

  /* SENT BY ITSELF SINCE 2026-09-29. Discovery tells the visitor before the
     first question that the answers go to the team when it ends, so the end of
     discovery is the send. It goes through this form's own submit, so every
     failure behaviour below still holds: a refusal or a lost answer leaves the
     form open with the answers in it, an honest message and a working Send. */
  useEffect(() => {
    if (!autoSubmit || autoSent.current) return;
    autoSent.current = true;
    formRef.current?.requestSubmit();
  }, [autoSubmit]);

  /* Only a delivered enquiry ends the flow. Any failure - a field to put right,
     delivery unconfigured or down, or an answer that never came back - leaves
     the form open with the visitor's answers in it, so they can correct it or
     copy it into the email the message asks for. */
  useEffect(() => {
    if (state.status !== 'success' || reported.current) return;
    reported.current = true;
    onDelivered(state.message);
  }, [state, onDelivered]);

  /* The Signal thinks while a send is in flight, and stops if this form goes
     away mid-send. */
  useEffect(() => {
    onBusy?.(pending);
  }, [onBusy, pending]);
  useEffect(() => () => onBusy?.(false), [onBusy]);

  /* A Send the server has not answered in 15 seconds gets an honest note and a
     working Cancel. The server gives each provider 8 seconds, so a healthy send
     never gets here (finding RES-04). */
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => setSlow(true), SLOW_SEND_MS);
    return () => clearTimeout(timer);
  }, [pending]);

  /*
   * THE ACTION IS CALLED DIRECTLY, INSIDE A TRY, rather than through
   * useActionState, since 2026-09-29.
   *
   * Through useActionState a failure in transit - the phone losing signal, a
   * gateway error, a stale action after a redeploy, a response lost after the
   * row was stored - rejected into React, which re-threw it during render, and
   * with no error boundary Next replaced EVERY page with "Application error".
   * The visitor lost the page and the enquiry together (findings ECE-01 and
   * RES-01, reproduced by five independent runs). Caught here, it becomes an
   * honest message and the answers stay on screen.
   *
   * It stays out of <form action> for the reason it left it on 2026-09-28:
   * React 19 resets a form's fields once an action completes, which put the
   * chat answers back over the visitor's corrections.
   */
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    const data = new FormData(event.currentTarget);
    setPending(true);
    let next: ReviewState;
    try {
      next = await submitAssistantEnquiry(state, data);
    } catch {
      next = { status: 'error', message: '', unconfirmed: true };
    }
    inFlight.current = false;
    setPending(false);
    setSlow(false);
    setState(next);
  };

  const unconfirmedMessage =
    `We could not confirm that your enquiry was sent: the connection may have dropped. It may still have reached us. ` +
    `Please email ${contactEmail} so it is not lost; your answers are still here to copy.`;
  const message = state.unconfirmed ? unconfirmedMessage : state.message;
  const cancelKind: CancelKind =
    pending || state.unconfirmed ? 'unconfirmed' : state.status === 'error' ? 'refused' : 'unsent';

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
    <form className="asst-review" noValidate onSubmit={submit} ref={formRef}>
      {/* Links this enquiry to the contact recorded at the start. The server
          accepts only the shape of a reference it issues. */}
      <input name="leadRef" type="hidden" value={leadRef ?? ''} />
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
      {!pending && state.status === 'error' && message ? (
        <p className="asst-review-error" role="status">
          {message}
        </p>
      ) : null}
      {slow ? (
        <p className="asst-review-error" role="status">
          This is taking longer than it should. It may still arrive. If you would rather not wait, close it and
          email {contactEmail}.
        </p>
      ) : null}
      <div className="asst-review-actions">
        <button className="asst-send" disabled={pending} type="submit">
          {pending ? 'Sending…' : 'Send'}
        </button>
        {/* Not in the first seconds of a send: the enquiry may already be
            delivered, and "nothing was sent" would be untrue. Once a send is
            slow, closing is allowed and Pix T says it may still arrive. */}
        <button
          className="asst-linkbtn"
          disabled={pending && !slow}
          onClick={() => onCancel(cancelKind)}
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
