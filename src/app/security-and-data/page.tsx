import { CertifiedHandoff, ClosingCta, VerificationTable } from '@/components/sections';
import { Eyebrow, JsonLd, Placeholder, Section, SectionHead, SourceNote } from '@/components/ui';
import { certified, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Security and data',
  description:
    'Certifications, data handling, subprocessors and our AI governance position, published rather than sent on request, so a security review moves faster.',
  path: '/security-and-data',
});

const positions = [
  {
    title: 'Information security management',
    body: 'We operate an ISO 27001:2022 certified information security management system, and an ISO 9001:2015 quality management system, both externally audited. Cyber Essentials Plus adds independently tested technical controls.',
  },
  {
    title: 'Where your data sits',
    body: null,
    placeholder: 'DATA RESIDENCY AND HOSTING REGIONS — confirm per environment before publication',
  },
  {
    title: 'Subprocessors',
    body: null,
    placeholder: 'SUBPROCESSOR REGISTER — publish the current list and the notification period',
  },
  {
    title: 'Retention and deletion',
    body: null,
    placeholder: 'RETENTION SCHEDULE BY DATA CLASS — confirm with the DPO before publication',
  },
  {
    title: 'AI-specific handling',
    body: 'Client data is not used to train third-party foundation models. Where a model processes client data, the processing route, the retention posture of the provider and the entitlement boundary are documented per engagement and form part of the evaluation record.',
  },
  {
    title: 'Incident response',
    body: 'Defined severities with a named responder, a rollback procedure and a written post-incident note that goes into your audit trail. SEV-1 within one hour, SEV-2 within four hours, SEV-3 by the next working day.',
  },
];

const faqs = [
  {
    q: 'Does Pixelette Technologies use client data to train models?',
    a: 'No. Client data is not used to train third-party foundation models. Where a model processes client data, the processing route, the provider’s retention posture and the entitlement boundary are documented per engagement and form part of the evaluation record.',
  },
  {
    q: 'Which security certifications does Pixelette Technologies hold?',
    a: 'ISO 9001:2015, ISO 27001:2022 and Cyber Essentials Plus, all externally audited and independently verifiable. ISO/IEC 42001 for AI management systems is a group capability delivered by Pixelette Certified and is not held by Pixelette Technologies.',
  },
];

export default function SecurityDataPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Security & data', path: '/security-and-data' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Security & data</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            What a reviewer asks for, published before they ask.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Security review delays half of all enterprise deals. Rather than answer the same
            questionnaire forty times, we publish our position and let you check it. We also do not
            claim a certificate we do not hold.
          </p>
          <SourceNote>G2 Buyer Behavior Report, July 2026</SourceNote>
        </div>
      </div>

      <Section labelledBy="verify-heading">
        <h2 className="visually-hidden-heading" id="verify-heading">
          Certifications and verification
        </h2>
        <VerificationTable withHeading={false} />
      </Section>

      <Section labelledBy="positions-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead title="How we handle your data" id="positions-heading" />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {positions.map(p => (
            <div className="card" key={p.title}>
              <h3 className="h4">{p.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {p.body ?? <Placeholder>{p.placeholder}</Placeholder>}
              </p>
            </div>
          ))}
        </div>
        <p className="small" style={{ marginTop: 26, fontStyle: 'italic' }}>
          Unfilled entries are shown rather than hidden. This page is read by security reviewers, and
          a confident-sounding answer we have not verified is worse to them than a visible gap.
        </p>
      </Section>

      <Section labelledBy="gov-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Governance"
              id="gov-heading"
              title="We build it. We do not certify it."
            />
            <p className="body" style={{ marginTop: 20 }}>
              {company.name} engineers and runs the system. Formal AI governance, ISO/IEC 42001 and
              audit are delivered by {certified.name}, a separate practice in the same group with its
              own lead auditors. We will not sell you an audit of our own build, and we will confirm
              that in writing if your procurement team asks.
            </p>
          </div>
          <CertifiedHandoff variant="compact" />
        </div>
      </Section>

      <ClosingCta title="Need something this page does not answer?">
        Send the questionnaire. If the answer is not published yet, we will tell you what it is and
        then publish it.
      </ClosingCta>
    </>
  );
}
