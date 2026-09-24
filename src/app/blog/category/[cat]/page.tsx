import { notFound } from 'next/navigation';

/*
 * Unknown /blog/category/<x>.
 *
 * WHY A ROUTE THAT ONLY 404s. The previous site's four real category archives
 * are handled by redirects in next.config.ts, and redirects are evaluated before
 * routing, so this file never sees them. What it does see is every OTHER
 * /blog/category/... URL - a mistyped one, or a guess.
 *
 * Without it those paths matched no route at all and fell through to the site's
 * general 404, which is correct in status and unhelpful in substance: a reader
 * who arrived from a blog link is told the page is missing and not told that the
 * articles still exist. Existing as a route means `notFound()` resolves to
 * app/blog/not-found.tsx, which points at the archive.
 *
 * It renders nothing and is never statically generated: `generateStaticParams`
 * returns an empty list, so no page is built and every request 404s.
 */
export function generateStaticParams(): { cat: string }[] {
  return [];
}

export default function UnknownBlogCategory(): never {
  notFound();
}
