import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/content/company';
import { routes } from '@/content/nav';
import { caseStudies } from '@/content/work';

/**
 * Sitemap, generated from the same `routes` list the footer renders from.
 * Adding a page in one place publishes it in both, which is how the previous
 * site's footer and sitemap ended up disagreeing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = routes.map(route => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const workRoutes = caseStudies.map(cs => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...workRoutes];
}
