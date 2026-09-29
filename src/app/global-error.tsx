'use client';

import './globals.css';

import { PUBLISHED_CONTACT_EMAIL } from '@/content/contact-address';

/**
 * The last resort: a failure in the root layout itself.
 *
 * It replaces the whole document, so it carries its own html and body and
 * cannot use the site's header, footer or fonts. Until 2026-09-29 this was
 * Next's built-in screen, one centred line reading "Application error: a
 * client-side exception has occurred", with no way home and no route to a
 * person (finding RES-03). It says what happened and gives both.
 *
 * Links are plain anchors, so following one reloads the app instead of
 * carrying the broken state with it.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-GB">
      <body>
        <main className="wrap" style={{ padding: '120px 0 96px' }}>
          <span className="eyebrow">Pixelette Technologies</span>
          <h1 className="h1" style={{ marginTop: 22, maxWidth: '18ch' }}>
            Something went wrong
          </h1>
          <p className="lead" style={{ marginTop: 22 }}>
            The page could not be shown. Try again, go back to the front page, or email{' '}
            <a href={`mailto:${PUBLISHED_CONTACT_EMAIL}`}>{PUBLISHED_CONTACT_EMAIL}</a> and a person will reply.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <button className="btn" onClick={() => reset()} type="button">
              Try again
            </button>
            <a className="btn2" href="/">
              Back to the front page
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
