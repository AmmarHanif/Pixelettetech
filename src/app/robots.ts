import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/content/company';

/**
 * robots.txt.
 *
 * AI crawlers are allowed deliberately. The commercial strategy of this site is
 * that the methodology is public so a buyer can judge the work before paying
 * for any of it — and buyers increasingly do that judging through an answer
 * engine. Blocking those crawlers would remove the firm from exactly the
 * conversation it is trying to win.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    // Note: the filtered /case-studies?filter= views are intentionally NOT disallowed.
    // They already declare /case-studies as their canonical, and a crawler has to be
    // able to fetch a page to read that canonical — blocking them would leave
    // the duplicates in the index with no signal pointing home.
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
