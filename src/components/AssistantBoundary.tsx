'use client';

import { Component, type ReactNode } from 'react';

/**
 * Keeps a failure inside Pix T from taking the page down with it.
 *
 * Pix T is mounted in the root layout, on every page. An error thrown while it
 * renders would otherwise travel past every page to the global error page and
 * replace the whole site with it (finding RES-03). Caught here, only the
 * assistant is lost: the page, its navigation and a route to a person stay.
 *
 * The known trigger is outside this codebase. Browser translation rewrites the
 * text nodes React manages, and React then throws on its next update.
 *
 * The fallback is a plain link rather than a client-side one, so following it
 * reloads the app instead of carrying the broken state with it. It logs
 * nothing: the site sends no telemetry, and its privacy page says so.
 */
export class AssistantBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <a className="asst-launch asst-launch--text" href="/contact">
          Contact us
        </a>
      );
    }
    return this.props.children;
  }
}
