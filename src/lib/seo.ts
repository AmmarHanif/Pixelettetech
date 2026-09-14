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
 * `h1` is carried here so the homepage and the graph cannot drift apart.
 *
 * IT NO LONGER "STAYS EXACTLY AS WRITTEN", which is what this line said until
 * 2026-09-14. The founder removed the three full stops on that date, so the
 * manifesto reads "Engineering that ships · Chains that hold · AI built into
 * both". Deleting the trailing stop alone would have run the three statements
 * together in every context that renders this as ONE string — the schema, the
 * social-card alt text, `company.tagline` — so the sentence breaks became middle
 * dots. The rendered H1 has no separators at all, because there each statement
 * is already its own block element and the line break does the work.
 *
 * FOUR COPIES OF THIS LINE EXIST and they were changed together: here, the three
 * spans in src/app/page.tsx, the three text blocks in src/app/opengraph-image.tsx
 * and `company.tagline`. Changing fewer would have left the social card
 * punctuated differently from the page it advertises.
 */
/*
 * TITLE AND DESCRIPTION SHORTENED 2026-09-14, on an external homepage audit.
 *
 * The title was 74 characters and the description 162; both truncate in most
 * result displays, and every inner page was already correctly sized, so this was
 * a homepage-only defect.
 *
 * THE AUDIT PROPOSED TWO TITLES AND NEITHER IS USED, for a reason worth
 * recording rather than silently overruling. Its first option, "AI and software
 * engineering | Pixelette Technologies" (52), drops blockchain from the title of
 * a company that names it as a specialist practice in its own H1. Its second,
 * "Software, AI and blockchain engineering | Pixelette" (51), keeps blockchain by
 * dropping "Technologies" — and that is the one to refuse. This site spends
 * ADR-0005, a footer group band, an llms.txt section and a subOrganization graph
 * keeping four Pixelette companies distinct. A homepage title that says only
 * "Pixelette" hands back the exact ambiguity all of that exists to remove.
 *
 * What is used keeps all three practices AND the full entity name at 55
 * characters, which is shorter than either proposal that kept the qualifier.
 *
 * The description is the audit's own wording, taken verbatim. It measures 154
 * characters rather than the 148 the audit states — checked rather than trusted,
 * and still comfortably inside the practical limit where 162 was not.
 */
export const HOMEPAGE_SEO = {
  title: 'Engineering, AI and blockchain | Pixelette Technologies',
  description:
    'We design, build and run software products, AI systems and intelligent workflows, with specialist blockchain engineering where it genuinely creates value.',
  h1: 'Engineering that ships · Chains that hold · AI built into both',
} as const;

/**
 * Per-page metadata builder.
 *
 * Three things every page gets and the old site frequently missed: a canonical
 * URL, an OpenGraph image, and a description written as an answer rather than a
 * keyword list. The last of those matters most for answer engines, which quote a
 * description far more often than they quote an H1.
 *
 * CORRECTED 2026-09-14: the first sentence said "a page-specific OpenGraph
 * image", and that was never true. All 40 static pages share the one generated
 * /opengraph-image; only case studies pass their own, and only where the
 * client's name permission has cleared. The card is fine — the claim about it
 * was not, and a reader trusting that sentence would go looking for per-page
 * artwork that does not exist.
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
      /*
       * Dimensions are declared ONLY for the generated card, 2026-09-14.
       *
       * This line used to read `{ url: image, width: 1200, height: 630 }`
       * unconditionally, and the numbers were false on every page that supplied
       * its own image. Measured on disk: not one of the 29 case-study PNGs is
       * 1200x630 — seventeen are 675x420, seven are 675x419, and neom.png and
       * sandoz.png are 512x320, which is below the 600x315 floor for a large
       * card entirely. aia.png is 346x214.
       *
       * Declaring a size a file does not have is worse than declaring none.
       * LinkedIn, Slack and Facebook allocate the box from the declared
       * numbers, so they crop or drop a card that arrives at a different shape,
       * and a crawler has no reason to doubt what the tag says. Omitting the
       * dimensions lets each platform read the real size from the file.
       *
       * `/opengraph-image` genuinely is 1200x630 — it is generated at that size
       * in src/app/opengraph-image.tsx — so it keeps its declaration, and it is
       * what all 40 static pages use.
       *
       * The real fix for the case studies is re-exporting the artwork at
       * 1200x630, which needs image tooling and a design decision about
       * cropping. Until then this stops the site asserting something untrue.
       */
      images: [
        image === '/opengraph-image'
          ? { url: image, width: 1200, height: 630, alt: input.title }
          : { url: image, alt: input.title },
      ],
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
