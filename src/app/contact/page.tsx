import Link from 'next/link';

import { Mail, Pin, Shield } from '@/components/Icons';
import { Eyebrow, FLink, JsonLd, Placeholder, Section, SectionHead } from '@/components/ui';
import { company, contactEmail, pressEmail } from '@/content/company';
import { breadcrumbSchema, contactPageSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

import { ContactForm } from './ContactForm';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Four fields. One of us replies, not a sequence. If a value baseline is not the right next step we will say so on the call.',
  path: '/contact',
});

const faqs = [
  {
    q: 'How quickly does Pixelette Technologies reply to an enquiry?',
    a: 'Within one working day, from a person rather than an automated sequence. If a value baseline is not the right next step, we say so on the call.',
  },
  {
    q: 'Where do I find answers for a security questionnaire?',
    a: 'Most answers are already published on our security and data page: our certification status, subprocessors, data residency and our AI governance policy. We publish the answers rather than sending them on request; certificate documents themselves are held internally and verifiable on the public registers.',
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '18ch' }}>
            Tell us the process that annoys you most.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Four fields. One of us replies, not a sequence. If a baseline is not the right next step we
            will say so on the call.
          </p>
        </div>
      </div>

      <Section flush style={{ paddingTop: 48 }} labelledBy="contact-heading">
        <h2 className="visually-hidden-heading" id="contact-heading">
          Get in touch
        </h2>

        <div className="split split--wide-right">
          <div className="stack-24">
            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} aria-hidden>
                <Pin size={20} />
              </span>
              <div>
                <b style={{ display: 'block', fontSize: 15 }}>{company.legalName}</b>
                <address className="small" style={{ fontStyle: 'normal', marginTop: 6 }}>
                  {company.address.street}
                  <br />
                  {company.address.locality} {company.address.postalCode}
                </address>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} aria-hidden>
                <Mail size={20} />
              </span>
              <div>
                <b style={{ display: 'block', fontSize: 15 }}>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                </b>
                <span className="small" style={{ display: 'block', marginTop: 6 }}>
                  Replies within one working day
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }} aria-hidden>
                <Shield size={20} />
              </span>
              <div>
                <b style={{ display: 'block', fontSize: 15 }}>Security questionnaires</b>
                <span className="small" style={{ display: 'block', marginTop: 6 }}>
                  Most answers are already published on our{' '}
                  <Link href="/security-and-data">security and data page</Link>.
                </span>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 36 }}>
            <h3 className="h3">Book a value baseline</h3>
            <p className="small" style={{ marginTop: 10 }}>
              £6,000 to £12,000, four weeks, fixed price.
            </p>
            <div style={{ marginTop: 28 }}>
              <ContactForm />
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="routes-heading">
        <h2 className="visually-hidden-heading" id="routes-heading">
          Other routes in
        </h2>
        <div className="grid grid-3">
          <div className="card">
            <h3 className="h4">Procurement and security</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              Our certification status, subprocessors, data residency and AI governance policy are
              published rather than sent on request.
            </p>
            <p style={{ marginTop: 16 }}>
              <FLink href="/security-and-data">Security & data page</FLink>
            </p>
          </div>

          <div className="card">
            <h3 className="h4">Public sector</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              <Placeholder>AI DPS RM6200 REGISTRATION IN PROGRESS</Placeholder> Direct award and
              further competition both available once listed.
            </p>
            <p style={{ marginTop: 16 }}>
              <FLink href="/certifications">Framework details</FLink>
            </p>
          </div>

          <div className="card">
            <h3 className="h4">Press and speaking</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              We publish our methodology and follow UK AI standards work closely. Happy to talk on the
              record.
            </p>
            <p style={{ marginTop: 16 }}>
              <a href={`mailto:${pressEmail}`}>{pressEmail}</a>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
