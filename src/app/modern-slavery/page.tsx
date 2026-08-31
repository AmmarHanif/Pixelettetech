import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Modern slavery statement',
  description:
    'Pixelette Technologies’ position on modern slavery and human trafficking in its business and supply chain.',
  path: '/modern-slavery',
});

export default function ModernSlaveryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Modern slavery', path: '/modern-slavery' },
        ])}
      />
      <LegalPage
        eyebrow="Modern slavery"
        title="Modern slavery and human trafficking."
        intro="Our position on modern slavery in our business and our supply chain, and the steps we take to keep it out of both."
        lastReviewed={null}
        sections={[
          {
            heading: 'Scope of this statement',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                This statement covers {company.legalName} and the services it delivers. Publishing it
                is a matter of policy: the turnover threshold at which a statement becomes mandatory
                under section 54 of the Modern Slavery Act 2015 is a separate question from whether a
                buyer’s procurement team will ask for one, and they do.
              </p>
            ),
          },
          {
            heading: 'Our business and supply chain',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We are a software engineering firm delivering web, mobile, custom software, blockchain
                and AI engineering work. Our supply chain consists principally of cloud infrastructure
                providers, software licences and professional services, alongside our own employed and
                contracted engineering staff.
              </p>
            ),
          },
          {
            heading: 'Policies and due diligence',
            pending: 'POLICY SET AND SUPPLIER DUE-DILIGENCE PROCESS — confirm before publication',
          },
          {
            heading: 'Risk assessment',
            pending: 'RISK ASSESSMENT AND THE CONTROLS THAT FOLLOW FROM IT',
          },
          {
            heading: 'Training',
            pending: 'STAFF TRAINING POSITION',
          },
          {
            heading: 'Approval',
            pending: 'BOARD APPROVAL, SIGNATORY AND FINANCIAL YEAR COVERED',
          },
        ]}
      />
    </>
  );
}
