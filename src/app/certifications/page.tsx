import { CertifiedHandoff, ClosingCta, VerificationTable } from '@/components/sections';
import { Eyebrow, JsonLd, Placeholder, Section, SectionHead } from '@/components/ui';
import { certified, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Certifications',
  description:
    'Every certification we hold, with the register you can verify it on, and a clear statement of the one certificate held elsewhere in the group.',
  path: '/certifications',
});

const faqs = [
  {
    q: 'Does Pixelette Technologies hold ISO/IEC 42001?',
    a: 'No. ISO/IEC 42001 for AI management systems is a group capability delivered by Pixelette Certified, a separate practice with its own lead auditors. Pixelette Technologies Limited does not hold that certificate and does not claim it.',
  },
  {
    q: 'Is Pixelette Technologies on the AI DPS RM6200 framework?',
    a: 'Registration is in progress and not yet complete. Once listed, both direct award and further competition routes are available. Until then, the site says registration is in progress rather than implying the listing exists.',
  },
];

export default function CertificationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Certifications', path: '/certifications' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Certifications</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            What we hold, and what we do not.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Every certification held by {company.legalName}, with the register you can check it on.
            The one certificate we do not hold is stated as plainly as the ones we do.
          </p>
        </div>
      </div>

      <Section labelledBy="cert-table-heading">
        <h2 className="visually-hidden-heading" id="cert-table-heading">
          Certification register
        </h2>
        <VerificationTable withHeading={false} />
      </Section>

      <Section labelledBy="frameworks-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Public sector" id="frameworks-heading" title="Framework routes" />
        <div className="card" style={{ marginTop: 32, maxWidth: '72ch' }}>
          <h3 className="h4">AI DPS RM6200</h3>
          <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
            <Placeholder>REGISTRATION IN PROGRESS</Placeholder> Once listed, direct award and further
            competition are both available. We say registration is in progress rather than implying a
            listing that does not yet exist, because a buyer who checks and finds nothing does not come
            back.
          </p>
        </div>
      </Section>

      <CertifiedHandoff />

      <ClosingCta title="Certification is a separate conversation.">
        If your next deal is waiting on a certificate rather than on a build, {certified.name} is the
        practice you want, and we will hand you straight over.
      </ClosingCta>
    </>
  );
}
