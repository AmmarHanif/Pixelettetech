import Link from 'next/link';

import { Section } from '@/components/ui';

/*
 * The 404 for /blog/<something-that-was-never-an-article>.
 *
 * WHY THIS EXISTS RATHER THAN A CATCH-ALL REDIRECT. Until the migration a
 * `/blog/:path*` wildcard sent every blog URL to /insights, which was right when
 * none of them resolved. It cannot stay now that 36 of them do, because Next
 * evaluates redirects before routing and the wildcard would hide the very
 * articles it was standing in for.
 *
 * SO THE REMAINDER GETS AN HONEST 404 INSTEAD OF A SILENT BOUNCE. A URL that was
 * never published should say so: a 301 to a hub tells a search engine the two
 * pages are equivalent, which is false, and tells a reader nothing about why
 * they did not get what they clicked. This page says what happened and points at
 * both the archive and current thinking, which is more use than either the
 * redirect or a bare 404 was.
 */
export default function BlogNotFound() {
  return (
    <Section labelledBy="blog-404-heading" style={{ paddingTop: 96 }}>
      <h1 className="h2" id="blog-404-heading" style={{ maxWidth: '20ch' }}>
        We could not find that article
      </h1>
      <p className="lead" style={{ marginTop: 20, maxWidth: '60ch' }}>
        It may have been removed, or the link may be incomplete. Articles published on our
        previous site are still available in the archive.
      </p>
      <p className="body" style={{ marginTop: 26 }}>
        <Link href="/insights/archive">Browse the archive</Link>
        {' · '}
        <Link href="/insights">Current thinking</Link>
        {' · '}
        <Link href="/contact">Contact us</Link>
      </p>
    </Section>
  );
}
