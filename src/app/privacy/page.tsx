import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy',
  description:
    'What Pixelette Technologies collects through this website, why, and what rights you have under UK GDPR.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ])}
      />
      <LegalPage
        eyebrow="Privacy"
        title="What we collect, and what we do with it."
        intro="Short version: we use what you send us to reply to you. There is no sequence, no list, and nothing sold on."
        lastReviewed={null}
        sections={[
          {
            heading: 'Who the controller is',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                {company.legalName}, registered in England and Wales under company number{' '}
                {company.crn}, at {company.addressLine}, is the data controller for personal data
                collected through this website.
              </p>
            ),
          },
          {
            heading: 'What this site collects',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  The contact form collects your name, company, work email address and the description
                  of the process you write. Nothing else is collected through it, and none of the
                  fields are optional-but-tracked.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  This site loads no third-party fonts, trackers or advertising scripts. Typefaces are
                  served from our own domain specifically so that visiting a page does not disclose
                  your IP address to a third party.
                </p>
              </>
            ),
          },
          {
            heading: 'Why we are allowed to hold it',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We rely on legitimate interests (Article 6(1)(f) UK GDPR) to respond to a business
                enquiry you have chosen to send us. You can object to that processing at any time, and
                we will stop.
              </p>
            ),
          },
          {
            heading: 'How long we keep it',
            pending: 'RETENTION SCHEDULE — confirm periods per data class with the DPO',
          },
          {
            heading: 'Who else processes it',
            pending: 'SUBPROCESSOR REGISTER — hosting, email and CRM processors, with locations',
          },
          {
            heading: 'Cookies',
            pending:
              'COOKIE POSITION — confirm whether any non-essential cookies are set before publication',
          },
          {
            heading: 'Your rights',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Under UK GDPR you have the right to access a copy of your personal data, to have
                  inaccurate data corrected, to have data erased, to restrict or object to processing,
                  and to data portability. You also have the right to complain to the Information
                  Commissioner’s Office at ico.org.uk.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  To exercise any of these, contact us through the{' '}
                  <Link href="/contact">contact page</Link>.
                </p>
              </>
            ),
          },
          {
            heading: 'ICO registration',
            pending: 'ICO REGISTRATION NUMBER',
          },
        ]}
      />
    </>
  );
}
