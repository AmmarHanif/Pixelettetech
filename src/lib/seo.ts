import type { Metadata } from 'next';

import { SITE_URL, company } from '@/content/company';
import { SITE_IN_DEVELOPMENT } from '@/content/launch';

/**
 * The approved homepage SEO block, verbatim.
 *
 * Source: "NAVIGATION, SERVICE PAGES & SEO > Homepage SEO" in the founder's
 * implementation handoff of 8 September 2026. These three strings are copy, not
 * code, and they are not to be paraphrased, truncated or keyword-tuned in
 * passing — the title is the one place the three commercial engines appear in
 * the order the positioning sets, and the description is the sentence answer
 * engines quote most often.
 *
 * `h1` is carried here so the homepage and the graph cannot drift apart. It is
 * the brand manifesto line and stays exactly as written.
 */
export const HOMEPAGE_SEO = {
  title: 'Pixelette Technologies | Software Engineering, AI & Automation, Blockchain',
  description:
    'Design, build, automate and operate custom software, AI-powered products and intelligent workflows, with specialist blockchain engineering where it creates value.',
  h1: 'Engineering that ships. Chains that hold. AI built into both.',
} as const;

/**
 * Per-page metadata builder.
 *
 * Three things every page gets and the old site frequently missed: a canonical
 * URL, a page-specific OpenGraph image, and a description written as an answer
 * rather than a keyword list. The last one matters for answer engines, which
 * quote the description far more often than they quote the H1.
 */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  /**
   * Emit the title exactly as given, bypassing the root layout's
   * "%s — Pixelette Technologies" template. Needed where the approved title
   * already carries the company name, as the homepage title does; without it
   * the template appends a second one.
   */
  absoluteTitle?: boolean;
  /** Omit to fall back to the shared social card. */
  ogImage?: string;
  noIndex?: boolean;
  /** Publication metadata, for insight articles. */
  article?: { publishedTime?: string; modifiedTime?: string; authors?: string[] };
}): Metadata {
  const url = `${SITE_URL}${input.path === '/' ? '' : input.path}`;
  // The generated opengraph-image file convention only covers the segment it
  // sits in — it is NOT inherited by nested routes — so every page names the
  // generated route explicitly. Without this, only the home page had a card.
  const image = input.ogImage ?? '/opengraph-image';

  return {
    title: input.absoluteTitle ? { absolute: input.title } : input.title,
    description: input.description,
    alternates: { canonical: url },
    // SITE_IN_DEVELOPMENT forces noindex across every page that uses this
    // helper — which is every page. See src/content/launch.ts before launch.
    robots: SITE_IN_DEVELOPMENT || input.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: input.article ? 'article' : 'website',
      siteName: company.name,
      locale: 'en_GB',
      title: input.title,
      description: input.description,
      url,
      images: [{ url: image, width: 1200, height: 630, alt: input.title }],
      ...(input.article ?? {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
      images: [image],
    },
  };
}

/**
 * Homepage metadata, built from the approved SEO block.
 *
 * A named builder rather than three loose strings, so `/` cannot end up with a
 * hand-edited variant of the approved title. Intended use in `src/app/page.tsx`:
 *
 *   export const metadata = homepageMetadata();
 */
export function homepageMetadata(): Metadata {
  return pageMetadata({
    title: HOMEPAGE_SEO.title,
    description: HOMEPAGE_SEO.description,
    path: '/',
    absoluteTitle: true,
  });
}

/** Title suffix applied by the root layout template. */
export const TITLE_SUFFIX = `${company.name}`;
