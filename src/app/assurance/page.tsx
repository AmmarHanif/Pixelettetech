import { CertifiedHandoff } from '@/components/sections';
import { Cta, Eyebrow, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { certified, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Rewritten 2026-09-08 to the handoff's section 12 copy and its
 * ACCREDITATION-SAFE RULE.
 *
 * The rule: do not say Pixelette Technologies or Pixelette Certified "holds" an
 * accreditation, issues a certificate, performs an independent audit, or has a
 * named certified-practice status, unless the exact legal entity and status
 * have been verified. Keep the site open about readiness, coordination,
 * credentialed specialists, and independent assessment where required.
 *
 * Two habits had to go from this page. "Certified certifies it" states that a
 * group company issues certification. "With its own lead auditors" is a named
 * certified-practice status, and it was repeated four times — in the meta
 * description, the hero, a card and an FAQ answer — which means it was also
 * riding into the FAQ JSON-LD, where a correction to the prose alone would
 * never have reached it.
 *
 * The commercial point is unchanged and, if anything, sharper: a build team
 * does not assure its own build.
 */

export const metadata = pageMetadata({
  title: 'Assurance and AI governance',
  description:
    'We engineer it. Pixelette Certified helps you govern and evidence it — certification readiness, assurance support, and the route to independent assessment.',
  path: '/assurance',
});

const comparison = [
  {
    row: 'The question',
    tech: 'Can you build it, integrate it and keep it working?',
    cert: 'Can we show a customer, a reviewer or a board that it is governed and evidenced?',
  },
  {
    row: 'Typical work',
    tech: 'Production AI systems, data and integration, evaluation and observability, support and run',
    cert: 'Governance and certification readiness for ISO/IEC 42001 and ISO 27001, Cyber Essentials and SOC 2 preparation, privacy and security-assurance support, and coordination of the route to independent assessment',
  },
  {
    row: 'Engaged as',
    tech: 'Build contract or monthly run contract',
    cert: 'Readiness and governance programme, fixed fee',
  },
  {
    row: 'Who signs it off',
    tech: 'COO, CTO or Head of Product',
    cert: 'CISO, DPO or Head of Risk',
  },
  {
    row: 'Entity',
    tech: company.legalName,
    cert: certified.name,
  },
];

const reasons = [
  {
    title: 'A builder cannot assure its own build',
    body: 'If the same team writes the system and then signs off that the system is safe, you have bought a marketing document rather than an assurance opinion. Splitting the work across two practices is the point, not an inconvenience.',
  },
  {
    title: 'The certification decision is not ours to make',
    body: `Neither ${company.name} nor ${certified.name} issues a certificate or makes a certification decision. Certified helps scope the requirement, prepare the management system and the evidence behind it, and coordinate appropriately credentialed specialists. The assessment itself stays independent of both of us, which is the only reason it is worth anything to your customer.`,
  },
  {
    title: 'You can buy either without the other',
    body: `Plenty of ${certified.name} clients never buy a line of code from us, and plenty of our build clients go elsewhere for governance. Neither engagement is a condition of the other, and we will say so in writing if a procurement team asks.`,
  },
];

const faqs = [
  {
    q: 'Does Pixelette Technologies issue ISO certificates?',
    a: `No. Neither ${company.name} nor ${certified.name} issues a certificate, and neither makes a certification decision — that sits with an independent assessment. ${certified.name} helps scope the requirement, prepare the management system and the supporting evidence, coordinate appropriately credentialed specialists, and support the route to independent assessment where required.`,
  },
  {
    q: 'Why are building and governing split across two practices?',
    a: 'Because a team that writes a system and then signs off that the system is safe has produced a marketing document, not an assurance opinion. Pixelette Technologies engineers it; Pixelette Certified helps you govern, evidence and prepare it for assurance. Every serious reviewer knows the difference.',
  },
  {
    q: 'Do I have to buy both?',
    a: `No. Many ${certified.name} clients never buy a line of code from ${company.name}, and many build clients handle governance elsewhere. Neither engagement is a condition of the other, and Pixelette will confirm that in writing if a procurement team asks.`,
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
          <Eyebrow>Governance when required · Pixelette Group</Eyebrow>
          {/* Handoff section 12, verbatim, and taken from the canonical
              constants rather than retyped — the same two strings appear on the
              front page and in the Certified handoff block, and three hand-typed
              copies of an accreditation-safe sentence is three chances to drift
              back into an unsafe one. */}
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '24ch' }}>
            {certified.positioningLine}
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            {certified.blurb}
          </p>
          <p className="body" style={{ marginTop: 20, maxWidth: '66ch' }}>
            This page exists so that you land in the right place rather than the nearest one.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href={certified.url} external>
              Explore {certified.name}
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
          title="Two practices, two different questions"
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
          title="We do not assure our own work"
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {reasons.map(r => (
            <div className="card" key={r.title}>
              <h3 className="h4">{r.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* By this point the reader has worked through the who-does-what
          comparison, so this block states what Certified does rather than
          interrupting them the way the front page does — and it lists the
          retained-officer services too. The framing sentence is the handoff's
          section 12 wording; the standards are named as the routes Certified
          prepares you for, never as accreditations either company holds. */}
      <CertifiedHandoff
        allServices
        eyebrow={certified.name}
        title="Governance, evidence and readiness for assurance"
        blurb={
          <>
            {certified.blurb} The standards below are the routes it prepares you for, not
            accreditations any Pixelette company holds; the assessment itself stays independent. If
            your next enterprise deal is waiting on governance rather than on a build, that is the
            practice you want.
          </>
        }
      />

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>
    </>
  );
}
