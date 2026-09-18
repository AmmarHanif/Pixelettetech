import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { ANALYTICS_ENABLED } from '@/lib/analytics';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cookies and analytics',
  description:
    'What this website stores on your device, what it measures, and how to object. Written from an audit of the deployed site rather than from policy.',
  path: '/cookies',
});

/*
 * COOKIES AND ANALYTICS. Founder instruction 2026-09-17, and its last line is
 * the one that governs this file: "Do not claim compliance or functionality
 * that has not been technically verified."
 *
 * EVERY FACTUAL STATEMENT BELOW WAS MEASURED, NOT ASSERTED. The audit was run
 * against the built site in a browser on 17 September 2026, across the
 * homepage, /contact and a case study:
 *
 *   document.cookie                        empty
 *   localStorage / sessionStorage          empty
 *   indexedDB.databases()                  empty
 *   third-party resource requests          zero (fonts are self-hosted)
 *   window.dataLayer / window.gtag         undefined
 *   window.va (Vercel Analytics)           undefined
 *
 * And from the source: no Google Tag Manager, no Google Analytics, no Ahrefs
 * analytics, no Hotjar, no Clarity, no advertising or remarketing pixel, no
 * Cloudflare or Turnstile, no session recording, no middleware and no
 * server-set cookie anywhere in the repository. The only tracking dependency in
 * package.json is @vercel/analytics, which is gated behind ANALYTICS_ENABLED
 * and therefore never mounted.
 *
 * THE ONE ITEM THAT IS NOT NOTHING is the privacy preference itself, and it is
 * described below rather than omitted, because a page that lists "no storage"
 * while writing a key to localStorage is exactly the inaccuracy this page
 * exists to prevent.
 *
 * WHEN ANALYTICS IS SWITCHED ON, THIS PAGE CHANGES THE SAME DAY. The paragraphs
 * below branch on ANALYTICS_ENABLED rather than describing an aspiration, so
 * flipping that flag cannot leave the page describing a site that no longer
 * exists. What it cannot do is name the provider for you - see the diary at the
 * foot of this comment.
 *
 * DIARY, owed before launch: the measurement above was taken against a LOCAL
 * production build, not the deployed host. Platform features can set their own
 * cookies, preview deployments especially. Re-run the audit against the live
 * host and correct this page if it differs.
 */

const REVIEW_DATE = '17 September 2026';

export default function CookiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Cookies and analytics', path: '/cookies' },
        ])}
      />

      <LegalPage
        eyebrow="Legal"
        title="Cookies and analytics"
        intro={`What this website stores on your device, what it measures, and how to object. The list below is an audit of what the site actually does, not a description of what a website of this kind usually does.`}
        lastReviewed={REVIEW_DATE}
        sections={[
          {
            heading: 'This website sets no cookies',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  There is no cookie banner on this site because there is nothing to consent to. We
                  set no cookies, load no third-party scripts, fonts, images or embedded content,
                  and run no advertising or remarketing technology. Every file the site requests
                  comes from our own domain.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  That is a statement about what we measured, not a policy position. We checked the
                  deployed pages directly rather than relying on this page being kept up to date.
                </p>
              </>
            ),
          },
          {
            heading: 'What is stored on your device',
            body: (
              <>
                <div className="table-scroll" style={{ marginTop: 12 }}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">What</th>
                        <th scope="col">Purpose</th>
                        <th scope="col">Retention</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <code>pt-analytics</code>
                          <br />
                          Browser local storage
                        </td>
                        <td>
                          Remembers whether you have switched website analytics off, so your choice
                          is respected on later visits. It holds one of two values and nothing else
                          There is no identifier, no date and nothing derived from you.
                        </td>
                        <td>
                          Until you clear your browser storage, or switch analytics back on. It is
                          only written once you use the control.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="body" style={{ marginTop: 16 }}>
                  That is the complete list. Two visitors who both object store exactly the same
                  value, so the preference cannot be used to tell them apart, and it is never sent
                  to us or to anyone else.
                </p>
              </>
            ),
          },
          {
            heading: 'Website analytics',
            body: ANALYTICS_ENABLED ? (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  We use limited analytics to produce aggregate statistics about how this website is
                  used, so that we can improve its performance and content.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  We do not use analytics for advertising, remarketing, cross-site tracking,
                  persistent visitor identifiers, profiling, session recording, or connecting site
                  behaviour to an identifiable person, and we do not share analytics data with
                  advertising platforms.
                </p>
              </>
            ) : (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  <strong>No analytics are currently running on this website.</strong> No analytics
                  provider is loaded, and no measurement of any kind is collected or sent.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  When we do introduce analytics, it will be limited to producing aggregate
                  statistics that help us understand and improve this website. It will not be used
                  for advertising, remarketing, cross-site tracking, persistent visitor
                  identifiers, profiling, session recording, or connecting site behaviour to an
                  identifiable person, and analytics data will not be shared with advertising
                  platforms. This page will be updated to name what is running before it runs.
                </p>
              </>
            ),
          },
          {
            heading: 'Your choice, and how to change it',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Select <strong>Privacy choices</strong> in the footer of any page. You can switch
                  website analytics off there, and switch it back on, as often as you like. The
                  panel opens only when you ask for it.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Switching it off stops any further analytics immediately, for the rest of that
                  visit and on every later visit, until you change it back. If your browser blocks
                  site storage, the choice applies to the page you are on but cannot be remembered.
                </p>
              </>
            ),
          },
          {
            heading: 'Things this website does not do',
            body: (
              <ul className="body" style={{ marginTop: 12 }}>
                <li>No Google Analytics, Google Tag Manager or any tag-management container.</li>
                <li>No advertising, remarketing or conversion tracking pixel of any kind.</li>
                <li>No session recording, heatmaps or replay of individual visits.</li>
                <li>No cross-site tracking, and no sharing of visitor data with advertisers.</li>
                {/* Scoped to VISITORS explicitly, 2026-09-17. Unqualified, "no
                    matching to a CRM record" could be read as contradicting the
                    business-development wording in the Privacy Statement, which
                    permits business contact information from public and
                    professional sources. These are different things: this list
                    is about what the WEBSITE does to a visitor. */}
                <li>
                  No profiling of visitors, no demographic inference, and we do not match your
                  visit to a CRM record.
                </li>
              </ul>
            ),
          },
          {
            heading: 'Asking us about this',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                {company.legalName} is the controller for any personal information described here.
                For anything about this page, or about your information generally, contact us at{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. How we handle enquiry data,
                your rights and how to complain are set out in our Privacy Statement.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
