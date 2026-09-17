import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Newsreader, Outfit } from 'next/font/google';

import { AnalyticsEvents } from '@/components/AnalyticsEvents';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { JsonLd } from '@/components/ui';
import { SITE_URL, company } from '@/content/company';
import { ANALYTICS_ENABLED } from '@/lib/analytics';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import { HOMEPAGE_SEO } from '@/lib/seo';

import './globals.css';

/**
 * Fonts are self-hosted through next/font rather than linked to Google's CDN.
 * That removes a render-blocking third-party request, eliminates the layout
 * shift the linked version causes, and keeps visitor IPs off a third party —
 * which the security-and-data page has to be able to state truthfully.
 */
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  style: ['normal'],
  variable: '--font-newsreader',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

/**
 * Site-level metadata.
 *
 * `title.default` and `description` are the approved homepage SEO block from
 * the 8 September 2026 handoff, verbatim. They are the site's fallback identity
 * — every page that does not set its own title or description inherits these,
 * as does the OpenGraph card — so the approved wording belongs here rather than
 * only on `/`. The `default` is used as written; the template applies only to
 * titles a child page supplies, which is why the homepage builder in
 * `src/lib/seo.ts` marks its title absolute.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOMEPAGE_SEO.title,
    template: `%s — ${company.name}`,
  },
  description: HOMEPAGE_SEO.description,
  applicationName: company.name,
  authors: [{ name: company.name, url: SITE_URL }],
  creator: company.name,
  publisher: company.legalName,
  formatDetection: { telephone: false, address: false, email: false },
  alternates: { canonical: SITE_URL },
  /**
   * Both files behind these two paths were, until 8 September 2026, ANOTHER
   * COMPANY'S mark: a blue rounded square with a serif "A", in all three
   * favicon sizes and at 180px. The paths are unchanged and correct; what they
   * serve was replaced with the Pixelette tree device, taken from
   * public/pixelette-logo-white.svg and set on the brand purple below —
   * `themeColor` and `--brand` are the same #661a8f, so the tile matches the
   * browser UI colour this file already declares.
   *
   * The two are drawn differently on purpose. `apple-touch-icon.png` is a
   * full-bleed opaque square with square corners, because iOS applies its own
   * corner mask and composites alpha onto black — rounded corners here would
   * put black wedges on a home screen. `favicon.ico` carries 16, 32 and 48px
   * entries with an 18% corner radius, as uncompressed BGRA BMP (not
   * PNG-in-ICO), which is what the previous file used and what every ICO
   * parser reads.
   *
   * THAT KNOWN LIMIT WAS HIT AND IS NOW FIXED, 2026-09-17. The note used to end
   * here saying the 16px canopy merges into mush and that this was "the
   * artwork's own ceiling at that size". Correct, and the founder duly reported
   * the tab icon as an indistinct blob.
   *
   * A downscale could never have fixed it, so the 16px frame is now DRAWN ON
   * THE PIXEL GRID rather than resampled: a solid crown silhouette, which is
   * what makes it read at tab size, with purple square notches punched back in
   * so the device's square motif survives. 32 and 48 are untouched and were
   * verified pixel-identical to the previous file - the mark is unchanged
   * everywhere it already worked.
   *
   * Two intermediate attempts are worth knowing about before anyone "tidies"
   * this. Putting the canopy squares on a strict regular pitch read as a
   * BUILDING, not a tree; the irregularity is the foliage. Scattering them
   * freely lost the crown boundary and the trunk with it. The silhouette is
   * what carries the shape at 16px; the squares are texture on top of it.
   *
   * The file is written by hand in verification/... rather than through
   * Pillow's ICO writer, because that writer picks its own encoding and this
   * file must stay uncompressed BGRA BMP.
   */
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: company.name,
    url: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: '#661a8f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${outfit.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <head>
        {/*
          llms.txt is discoverable, added 2026-09-14 on an external audit.

          The file has existed and been good since the rebuild, and nothing on
          the site pointed at it: no link element, no footer link, no mention in
          robots.ts. The only non-comment reference anywhere was the
          Content-Type header in next.config.ts. A brief an agent has to guess
          the location of is a brief most agents will not read.

          `rel="alternate"` with an explicit text/plain type is the convention
          the llms.txt proposal uses. It costs one tag and no render.
        */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM brief" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        {/*
          Analytics. Both halves are gated on ONE switch, `ANALYTICS_ENABLED`
          in `src/lib/analytics.ts`, which is `false` today. While it is
          false nothing below renders, so no script is requested, no beacon
          is sent and no listener is attached — which is what keeps the
          published privacy page true. Read the switch's own comment before
          changing it; the reasons it is off are not only that the site is
          still de-indexed.

          `<Analytics />` is Vercel's pageview component. It carries its own
          use-client directive and its own `<Suspense>` boundary inside the
          package, so it can be rendered straight from this Server Component.
          `<AnalyticsEvents />` is this repository's only analytics client
          component: one delegated click listener for every tracked CTA on
          the site.

          The directive is described rather than quoted, deliberately. A
          literal copy of it in a comment makes THIS file answer a grep for
          client components, and this file is not one — it is the root
          layout and must stay a Server Component.
        */}
        {ANALYTICS_ENABLED ? (
          <>
            <Analytics />
            <AnalyticsEvents />
          </>
        ) : null}
      </body>
    </html>
  );
}
