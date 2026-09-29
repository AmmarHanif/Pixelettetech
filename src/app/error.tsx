'use client';

import Link from 'next/link';

import { PUBLISHED_CONTACT_EMAIL } from '@/content/contact-address';

/**
 * A page that failed while rendering in the browser.
 *
 * Until 2026-09-29 the site had no error boundary at all, so any such failure
 * showed Next's bare "Application error: a client-side exception has occurred"
 * in place of the whole site: no header, no way home, no contact route
 * (finding RES-03). This renders inside the root layout, so the header and
 * footer stay, and it offers the three ways out a visitor needs.
 *
 * The markup copies the 404 page's classes rather than importing its
 * components: those come from src/components/ui.tsx, which imports the schema
 * helpers and through them the company record and the work register, and a
 * client component would ship both to every visitor.
 */
export default function PageError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="sec sec--flush" style={{ padding: '120px 0 96px' }}>
      <div className="wrap">
        <span className="eyebrow">Something went wrong</span>
        <h1 className="h1" style={{ marginTop: 22, maxWidth: '18ch' }}>
          This page could not be shown
        </h1>
        <p className="lead" style={{ marginTop: 22 }}>
          The rest of the site is working. Try the page again, go back to the front page, or email{' '}
          <a href={`mailto:${PUBLISHED_CONTACT_EMAIL}`}>{PUBLISHED_CONTACT_EMAIL}</a> and a person will reply.
        </p>
        <div className="btn-row" style={{ marginTop: 34 }}>
          <button className="btn" onClick={() => reset()} type="button">
            Try again
          </button>
          <Link className="btn2" href="/">
            Back to the front page
          </Link>
        </div>
      </div>
    </section>
  );
}
