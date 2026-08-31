import type { Metadata } from 'next';

import { SITE_URL, company } from '@/content/company';

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
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noIndex
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

/** Title suffix applied by the root layout template. */
export const TITLE_SUFFIX = `${company.name}`;
