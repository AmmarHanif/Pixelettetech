import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Newsreader, Outfit } from 'next/font/google';

import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { JsonLd } from '@/components/ui';
import { SITE_URL, company } from '@/content/company';
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
   * Known limit, recorded rather than glossed: the device is a canopy of
   * detached squares, so at 16px the individual squares fall below a pixel and
   * merge. The tree silhouette still reads; the squares do not. That is the
   * artwork's own ceiling at that size, not the rasteriser's.
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
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </body>
    </html>
  );
}
