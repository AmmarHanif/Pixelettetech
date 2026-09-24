'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { STARTERS, respond, type PixReply } from '@/lib/pix/respond';

/**
 * The site assistant.
 *
 * IT STORES NOTHING. No cookie, no localStorage, no sessionStorage, no request
 * to any server - the answer is computed in the page from data already in the
 * bundle. That is not incidental tidiness: this site's Cookie Policy enumerates
 * its storage exactly and states plainly that the site sets no cookies, and the
 * comment at the top of that page warns that listing "no storage" while writing
 * a key is precisely the inaccuracy it exists to prevent. An assistant that kept
 * a transcript would have made a careful legal page false. So the conversation
 * lives in React state and is gone on reload, and the Cookie Policy needs no
 * edit.
 *
 * IT ALSO MAKES NO NETWORK CALL, which means no API key, no rate limiting, no
 * IP handling, no bot verification and no personal data leaving the browser.
 * The founder's instruction was to build this without an LLM API key; doing the
 * retrieval in the page rather than on a server is what turns that constraint
 * into an advantage instead of a compromise.
 *
 * EVERY ANSWER SHOWS ITS SOURCE. Where a reply came from a page, that page is
 * named and linked under the answer. A visitor can check it in one click, which
 * is the only honest way to present an automated answer on a company website.
 */

type Turn = {
  id: number;
  role: 'visitor' | 'assistant';
  text: string;
  path?: string;
  sourceLabel?: string;
};

const GREETING: Turn = {
  id: 0,
  role: 'assistant',
  text:
    'I answer from the published pages of this site, and I say so when I cannot find something rather than guessing. What would you like to know?',
};

export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const send = useCallback((raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const reply: PixReply = respond(text);
    setTurns(prev => [
      ...prev,
      { id: nextId.current++, role: 'visitor', text },
      {
        id: nextId.current++,
        role: 'assistant',
        text: reply.text,
        path: reply.path,
        sourceLabel: reply.sourceLabel,
      },
    ]);
    setDraft('');
  }, []);

  /* Keep the newest turn in view without yanking the whole page around. */
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  /* Escape closes, as a dialog should. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        aria-expanded={open}
        aria-controls="site-assistant-panel"
        className="asst-launch"
        onClick={() => setOpen(v => !v)}
        type="button"
      >
        {open ? 'Close' : 'Ask about this site'}
      </button>

      {open ? (
        <div
          aria-label="Site assistant"
          className="asst-panel"
          id="site-assistant-panel"
          ref={panelRef}
          role="dialog"
        >
          <div className="asst-head">
            <p className="asst-title">Site assistant</p>
            {/* Said once, at the top, rather than implied. */}
            <p className="asst-sub">
              Automated. Answers come from this website&rsquo;s own pages.
            </p>
          </div>

          <div aria-live="polite" className="asst-log" ref={logRef}>
            {turns.map(t => (
              <div className={`asst-turn asst-turn--${t.role}`} key={t.id}>
                <p className="asst-bubble">{t.text}</p>
                {t.role === 'assistant' && t.path ? (
                  <p className="asst-source">
                    <Link href={t.path} onClick={() => setOpen(false)}>
                      {t.sourceLabel ? `Read it on ${t.sourceLabel}` : 'Open the page'}
                    </Link>
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          {turns.length === 1 ? (
            <div className="asst-starters">
              {STARTERS.map(s => (
                <button className="asst-chip" key={s} onClick={() => send(s)} type="button">
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <form
            className="asst-form"
            onSubmit={e => {
              e.preventDefault();
              send(draft);
            }}
          >
            <label className="visually-hidden-heading" htmlFor="asst-input">
              Ask a question about this website
            </label>
            <input
              autoComplete="off"
              className="asst-input"
              id="asst-input"
              maxLength={300}
              onChange={e => setDraft(e.target.value)}
              placeholder="Ask about the work, the method, the certifications"
              ref={inputRef}
              value={draft}
            />
            <button className="asst-send" disabled={!draft.trim()} type="submit">
              Ask
            </button>
          </form>

          <p className="asst-foot">
            It will not quote prices or timelines, and it does not record anything you type.{' '}
            <Link href="/contact" onClick={() => setOpen(false)}>
              Talk to a person
            </Link>
            .
          </p>
        </div>
      ) : null}
    </>
  );
}
