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
