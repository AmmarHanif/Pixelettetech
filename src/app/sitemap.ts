import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/content/company';
import { routes } from '@/content/nav';
import { caseStudies, publishedDetail } from '@/content/work';

/**
 * Sitemap, generated from the same `routes` list the footer renders from.
 * Adding a page in one place publishes it in both, which is how the previous
 * site's footer and sitemap ended up disagreeing.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * NO `lastModified`, changed 2026-09-14.
   *
   * It used to be `new Date()`, evaluated once and stamped on all 69 URLs. That
   * told Google every page on the site changed on every deploy, including the
   * legal pages and the nine empty case studies. Google discounts `lastmod` for
   * a site once it proves unreliable, and a signal that always says "everything
   * just changed" carries exactly as much information as one that says nothing.
   *
   * Omitting it is better than faking it. The field is optional, and an absent
   * `lastmod` is read as "no claim" rather than as a stale one — the same
   * discipline the rest of this repository applies to figures it cannot
   * evidence.
   *
   * To publish real dates, give the content a dated field — a `publishedOn` on
   * CaseStudyFields, or a git mtime read at build — and emit it only where one
   * exists. Do not reintroduce a build timestamp.
   */
  const staticRoutes = routes.map(route => ({
    url: `${SITE_URL}${route.path === '/' ? '' : route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /*
   * The nine case studies with no published narrative drop to 0.3.
   *
   * All 29 shipped at 0.7, which advertised nine deliberately-empty pages to
   * Google at the same weight as twenty written ones. Their emptiness is by
   * design (ADR-0003 — a placeholder stays visible until a real engagement
   * fills it); telling a crawler they are as important as the full write-ups is
   * not. `publishedDetail` is the same gate `caseStudySchema` uses to decide
   * whether to emit an Article at all, so the two cannot drift apart.
   *
   * They stay IN the sitemap rather than being dropped: the pages exist, they
   * are linked from /case-studies, and hiding them from the sitemap while
   * linking them from the site is the kind of inconsistency a crawler notices.
   * The priority says what they are.
   */
  const workRoutes = caseStudies.map(cs => ({
    url: `${SITE_URL}/case-studies/${cs.slug}`,
    changeFrequency: 'monthly' as const,
    priority: publishedDetail(cs) ? 0.7 : 0.3,
  }));

  return [...staticRoutes, ...workRoutes];
}
