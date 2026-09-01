import { CertifiedHandoff } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  JsonLd,
  Placeholder,
  Section,
  SectionHead,
} from '@/components/ui';
import { certified, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Assurance and AI governance',
  description:
    'We build the AI; Pixelette Certified certifies it. Assurance and ISO 42001 are delivered by a separate group practice with its own lead auditors.',
  path: '/assurance',
});

const comparison = [
  {
    row: 'The question',
    tech: 'Can you build it, integrate it and keep it working?',
    cert: 'Can we show a customer, an auditor or a board that it is governed?',
  },
  {
    row: 'Typical work',
    tech: 'Production AI systems, data and integration, evaluation and observability, support and run',
    cert: 'ISO/IEC 42001 AI management system, ISO 27001, Cyber Essentials, GDPR, SOC 2, security review support',
  },
  {
    row: 'Engaged as',
    tech: 'Build contract or monthly run contract',
    cert: 'Certification programme, fixed fee',
  },
  {
    row: 'Who signs it off',
    tech: 'COO, CTO or Head of Product',
    cert: 'CISO, DPO or Head of Risk',
  },
  {
    row: 'Entity',
    tech: 'Pixelette Technologies Ltd',
    cert: 'Pixelette Certified',
  },
];

const reasons = [
  {
    title: 'A builder cannot assure its own build',
    body: 'If the same team writes the system and then signs off that the system is safe, you have bought a marketing document rather than an assurance opinion. Splitting the work across two practices is the point, not an inconvenience.',
  },
  {
    title: 'Certification belongs to accredited bodies',
    body: null,
  },
  {
    title: 'You can buy either without the other',
    body: 'Plenty of Certified clients never buy a line of code from us, and plenty of our build clients certify elsewhere. Neither engagement is a condition of the other, and we will say so in writing if a procurement team asks.',
  },
];

const faqs = [
  {
    q: 'Does Pixelette Technologies issue ISO certificates?',
    a: 'No. Neither Pixelette Technologies nor Pixelette Certified issues an ISO certificate — that is the role of an accredited certification body. Pixelette Certified builds the management system, produces the artefacts, runs the internal audit and stands with you through the external one.',
  },
  {
    q: 'Why are building and certifying split across two practices?',
    a: 'Because a team that writes a system and then signs off that the system is safe has produced a marketing document, not an assurance opinion. Pixelette Technologies builds and runs; Pixelette Certified assures. Every serious reviewer knows the difference.',
  },
  {
    q: 'Do I have to buy both?',
    a: 'No. Many Pixelette Certified clients never buy a line of code from Pixelette Technologies, and many build clients certify elsewhere. Neither engagement is a condition of the other, and Pixelette will confirm that in writing if a procurement team asks.',
  },
];

export default function AssurancePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Assurance', path: '/assurance' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Assurance · Pixelette Group</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            We build the AI. {certified.name} certifies it.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Assurance, AI governance and certification are not delivered by {company.name}. They are
            delivered by {certified.name}, a separate practice inside the same group with its own lead
            auditors. This page exists so that you land in the right place rather than the nearest one.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href={certified.url} external>
              Go to {certified.name}
            </Cta>
            <Cta href="/ai-engineering" variant="secondary">
              See how we build AI
            </Cta>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- who does what */}
      <Section labelledBy="split-heading">
        <SectionHead
          eyebrow="Who does what"
          id="split-heading"
          title="Two practices, two different questions."
          lead="Most suppliers blur these together because it sells a bigger number. We keep them apart because a build team grading its own homework is not assurance, and every serious reviewer knows it."
        />

        <div className="table-scroll" style={{ marginTop: 36 }}>
          <table>
            <thead>
              <tr>
                <th scope="col">
                  <span className="visually-hidden-heading">Comparison</span>
                </th>
                <th scope="col">{company.name}</th>
                <th scope="col">{certified.name}</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(r => (
                <tr key={r.row}>
                  <th
                    scope="row"
                    style={{
                      fontFamily: 'var(--sans)',
                      fontSize: 14.5,
                      textTransform: 'none',
                      letterSpacing: 0,
                      color: 'var(--ink)',
                      fontWeight: 600,
                      borderBottom: '1px solid var(--line)',
                      padding: '14px 16px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {r.row}
                  </th>
                  <td>{r.tech}</td>
                  <td>{r.cert}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ------------------------------------------------- why we separate */}
      <Section labelledBy="sep-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Why we keep them separate"
          id="sep-heading"
          title="We do not audit our own work."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {reasons.map(r => (
            <div className="card" key={r.title}>
              <h3 className="h4">{r.title}</h3>
              {r.body ? (
                <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                  {r.body}
                </p>
              ) : (
                <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                  Neither practice issues an ISO certificate. {certified.name} builds the management
                  system, produces the artefacts, runs the internal audit and stands with you through
                  the external one.{' '}
                  {/* Accreditation wording is legally load-bearing and stays
                      unfilled until it has been checked against ISO/IEC 42006. */}
                  <Placeholder>VERIFY: ISO/IEC 42006 accreditation wording before publication</Placeholder>
                </p>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Board 10's own copy for this block. By this point the reader has worked
          through the who-does-what comparison, so it states what Certified sells
          rather than interrupting them the way the front page does — and it
          lists the retained-officer services too. */}
      <CertifiedHandoff
        allServices
        eyebrow={certified.name}
        title="Compliance, governance and cyber trust."
        blurb={
          <>
            ISO 27001, ISO/IEC 42001 for AI management systems, Cyber Essentials, GDPR, SOC 2, vCISO
            and vDPO, delivered on a fixed fee by certified lead auditors. If your next enterprise
            deal is waiting on a certificate, that is the practice you want.
          </>
        }
      />
    </>
  );
}
