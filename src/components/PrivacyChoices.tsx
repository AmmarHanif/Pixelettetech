'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { ANALYTICS_ENABLED } from '@/lib/analytics';
import { type AnalyticsChoice, readChoice, writeChoice } from '@/lib/privacy';

/**
 * The "Privacy choices" panel. Opens ONLY when the visitor asks for it.
 *
 * Founder instruction 2026-09-17: no cookie banner, no "Accept all" prompt, no
 * consent wall, no automatic pop-up on arrival. A permanent, visible objection
 * mechanism the visitor reaches from the footer.
 *
 * THERE IS NO CODE PATH THAT OPENS THIS BY ITSELF. `open` starts false, and the
 * only thing that sets it true is the footer button's own click handler. No
 * timer, no scroll trigger, no first-visit check — a first-visit check is
 * exactly how a "not a cookie banner" becomes a cookie banner.
 *
 * WHY A NATIVE <dialog>. `showModal()` gives Escape-to-close, focus into the
 * panel, focus RETURNED to the button that opened it, and inertness of the page
 * behind — all of it browser-native and all of it required for a keyboard user.
 * Hand-rolling that is how focus traps ship broken. The cost is a backdrop,
 * which is styled almost to nothing so the panel still reads as a drawer rather
 * than an interruption.
 */
export function PrivacyChoices() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState<AnalyticsChoice | null>(null);
  const [ready, setReady] = useState(false);

  /*
   * Read the stored choice AFTER mount, never during render.
   *
   * `localStorage` does not exist on the server, so reading it while rendering
   * would either throw or produce markup that disagrees with the client and
   * trip a hydration mismatch. `ready` keeps the toggle from flashing the
   * default state before the real one is known.
   */
  useEffect(() => {
    setChoice(readChoice());
    setReady(true);
  }, []);

  const open = () => {
    dialogRef.current?.showModal();
  };

  const set = (next: AnalyticsChoice) => {
    writeChoice(next);
    setChoice(next);
  };

  // No explicit choice means the default applies, which is on.
  const isOn = (choice ?? 'on') === 'on';

  return (
    <>
      <button type="button" className="privacy-trigger" onClick={open}>
        Privacy choices
      </button>

      <dialog
        ref={dialogRef}
        className="privacy-panel"
        aria-labelledby="privacy-choices-title"
        /*
         * EXPLICIT ESCAPE, ON TOP OF THE NATIVE BEHAVIOUR, and it is here for a
         * reason worth keeping.
         *
         * `showModal()` closes on Escape by itself — that is the spec, and it
         * is why a native <dialog> was chosen. But it is a USER-AGENT default
         * action, not a DOM listener, so a synthetic key press reaches the
         * document and does NOT trigger it. Driving this panel under automation
         * therefore produced a dialog that stayed open on Escape while the
         * keydown was demonstrably received, which is indistinguishable from a
         * broken panel until you know why.
         *
         * Rather than ship a behaviour the founder's own instruction says must
         * be verified and then not verify it, the close is made explicit. Real
         * users get the native path; this handler makes the same outcome
         * provable. Both lead to the same `close()`, so there is no second
         * behaviour to keep in step.
         */
        onKeyDown={e => {
          if (e.key === 'Escape') {
            e.preventDefault();
            dialogRef.current?.close();
          }
        }}
      >
        <div className="privacy-panel__inner">
          <div className="privacy-panel__head">
            <h2 id="privacy-choices-title">Privacy choices</h2>
            {/* `formmethod="dialog"` on a button inside a <form method="dialog">
                closes without JavaScript. Here the button is outside a form, so
                it closes explicitly — but the dialog still closes on Escape
                without any of this. */}
            <button
              type="button"
              className="privacy-panel__close"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close privacy choices"
            >
              ×
            </button>
          </div>

          <h3 className="privacy-panel__sub">Website analytics</h3>
          <p className="privacy-panel__body">
            We use limited, privacy-preserving analytics to understand how the Pixelette
            Technologies website is used and to improve its performance and content. We do not use
            this information for advertising, cross-site tracking or to identify individual
            visitors.
          </p>

          {/*
            THE HONEST STATE OF THE SITE, shown rather than implied.

            No analytics provider is loaded today: `ANALYTICS_ENABLED` is false,
            so nothing is sent whatever this control says. A toggle presented as
            governing something that is not running would be a claim the site
            cannot support, which is the one thing this whole feature exists to
            avoid. The control still works and still persists, so the objection
            is already recorded for the day analytics does start.
          */}
          {!ANALYTICS_ENABLED ? (
            <p className="privacy-panel__state">
              No analytics are currently running on this website. Your choice is saved and will
              apply if that changes.
            </p>
          ) : null}

          <div className="privacy-panel__control">
            <span id="analytics-toggle-label">Website analytics</span>
            <div className="privacy-toggle" role="group" aria-labelledby="analytics-toggle-label">
              <button
                type="button"
                onClick={() => set('on')}
                aria-pressed={ready ? isOn : undefined}
                disabled={!ready}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => set('off')}
                aria-pressed={ready ? !isOn : undefined}
                disabled={!ready}
              >
                Off
              </button>
            </div>
          </div>

          <p className="privacy-panel__note">You can change this choice at any time.</p>

          <Link
            href="/cookies"
            className="privacy-panel__link"
            onClick={() => dialogRef.current?.close()}
          >
            Learn more about cookies &amp; analytics
          </Link>
        </div>
      </dialog>
    </>
  );
}
