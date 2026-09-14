import { Cta, Eyebrow, FLink, Section } from '@/components/ui';

/*
 * CANONICAL EXPLICITLY NULLED, 2026-09-14.
 *
 * This object bypassed `pageMetadata`, so it inherited the root layout's
 * `alternates: { canonical: SITE_URL }` — every 404 on the site was declaring
 * the HOMEPAGE as its canonical URL. Largely inert while the 404 is noindexed,
 * but it is a false statement emitted on every mistyped path, and the reason it
 * happened is the footgun worth naming: a root-level canonical default silently
 * applies to any page that forgets the helper.
 *
 * `canonical: null` rather than a self-referencing canonical, because a 404 has
 * no canonical URL to point at — it is not a page, it is the absence of one.
 */
export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <Section flush style={{ padding: '120px 0 96px' }}>
      <Eyebrow>404</Eyebrow>
      <h1 className="h1" style={{ marginTop: 22, maxWidth: '18ch' }}>
        That page is not here
      </h1>
      <p className="lead" style={{ marginTop: 22 }}>
        The link may be old, or we may have moved it. The two practices and the AI work are all one
        click away.
      </p>
      <div className="btn-row" style={{ marginTop: 34 }}>
        <Cta href="/">Back to the front page</Cta>
        <Cta href="/contact" variant="secondary">
          Contact us
        </Cta>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: 44, display: 'grid', gap: 10 }}>
        <li>
          <FLink href="/engineering">Engineering — web, mobile and custom software</FLink>
        </li>
        <li>
          <FLink href="/blockchain">Blockchain — tokenisation and decentralised systems</FLink>
        </li>
        <li>
          <FLink href="/ai-engineering">AI engineering</FLink>
        </li>
        <li>
          <FLink href="/case-studies">Work</FLink>
        </li>
      </ul>
    </Section>
  );
}
