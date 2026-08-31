import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Terms',
  description: 'Terms governing use of the Pixelette Technologies website.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Terms', path: '/terms' },
        ])}
      />
      <LegalPage
        eyebrow="Terms"
        title="Terms of use for this website."
        intro="These terms cover the website only. Engagement terms are set out in the contract for the work and are not varied by anything on this page."
        lastReviewed={null}
        sections={[
          {
            heading: 'Who these terms are with',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                This website is operated by {company.legalName}, registered in England and Wales under
                company number {company.crn}, at {company.addressLine}.
              </p>
            ),
          },
          {
            heading: 'The status of what is published here',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Prices shown on this site — the AI Value Baseline band and the Support &amp; Run
                  tiers — are indicative published ranges, not an offer capable of acceptance. The
                  price for a specific engagement is the one in your proposal.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Statistics attributed to third-party research are reproduced with their source
                  named. Those sources are not ours and we do not warrant them; we cite them so you can
                  check them.
                </p>
              </>
            ),
          },
          {
            heading: 'Intellectual property',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Content on this site is owned by {company.legalName} or used with permission. Client
                names and logos appear with the client’s permission and remain the property of their
                respective owners.
              </p>
            ),
          },
          {
            heading: 'Limitation of liability',
            pending: 'LIABILITY WORDING — requires legal review before publication',
          },
          {
            heading: 'Governing law',
            pending: 'GOVERNING LAW AND JURISDICTION CLAUSE — confirm with legal',
          },
        ]}
      />
    </>
  );
}
