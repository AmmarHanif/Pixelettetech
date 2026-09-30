import type { MetadataRoute } from 'next';

import { company } from '@/content/company';
import { SITE_IN_DEVELOPMENT } from '@/content/launch';

/**
 * Web app manifest. SEO Phase 1 item 4.
 *
 * WHAT IT ACTUALLY CHANGES, stated plainly because it is easy to oversell: this
 * affects how the site presents when someone saves it to a phone home screen or
 * installs it as an app - the tile, its name, the splash colours. It is NOT a
 * ranking signal. It was on the list as the smallest item on it, and it stays
 * small.
 *
 * `display: 'browser'` is deliberate. The other values ('standalone',
 * 'minimal-ui') strip the browser chrome, which for a marketing site takes away
 * the address bar, the back button and the share control while giving nothing
 * back - this is a site to read and share, not an app to use. Chrome would also
 * start prompting to install it, which is not something anyone asked for.
 *
 * `id` is set explicitly so the identity does not move if the start URL ever
 * changes; browsers otherwise derive it from `start_url` and treat a changed
 * one as a different app.
 *
 * NOT INCLUDED, on purpose: `screenshots` (they drive an install UI this does
 * not want), `shortcuts` (nothing here is a task worth a jump list), and
 * `orientation` (a reading site should follow the device).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: company.name,
    short_name: company.shortName,
    description: company.name,
    start_url: '/',
    scope: '/',
    display: 'browser',
    background_color: '#ffffff', // --paper
    theme_color: '#661a8f', // --brand
    lang: 'en-GB',
    dir: 'ltr',
    /*
     * While the site is hidden, the manifest says so too. `robots.ts` already
     * disallows every crawler and every page carries `noindex`; a manifest that
     * stayed installable would be the one surface still inviting a visitor to
     * keep the unreleased site on their home screen.
     */
    ...(SITE_IN_DEVELOPMENT ? { prefer_related_applications: false } : {}),
    icons: [
      /*
       * EACH FILE IS LISTED TWICE, once per purpose, rather than once with
       * `purpose: 'any maskable'`. The manifest spec allows the space-separated
       * form, but Next's own type does not - `purpose` is
       * `'any' | 'maskable' | 'monochrome'` in
       * next/dist/lib/metadata/types/manifest-types.d.ts - so the combined value
       * fails the build. Two entries pointing at one file is equivalent and
       * costs nothing: the browser fetches whichever it needs, and it is the
       * same asset either way.
       *
       * Serving one file for both purposes is safe only because the mark is
       * drawn at 58% of the canvas by `scripts/build-app-icons.mjs`, which keeps
       * it inside the 80% safe circle a maskable icon is cropped to. Regenerate
       * with that script rather than replacing these by hand, or the crop will
       * cut the tree.
       */
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
