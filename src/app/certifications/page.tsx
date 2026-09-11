import { ProofStrip } from '@/components/ProofStrip';
import { CertifiedHandoff, ClosingCta } from '@/components/sections';
import { Eyebrow, JsonLd, Section, SectionHead } from '@/components/ui';
import { claimById, publishedClaims } from '@/content/claims';
import { certificationRegister, certified, company, type Certification } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Certification claims and readiness',
  description:
    'What Pixelette Technologies publishes about certification, what it holds back until the evidence supports it, and the route to governance and independent assessment.',
  path: '/certifications',
});

/*
 * Rewritten 2026-09-08 to the handoff's ACCREDITATION-SAFE RULE (section 12)
 * and its TECHNOLOGIES CLAIMS REGISTER.
 *
 * The register's instruction for this page's subject matter is unambiguous:
 * "Corporate ISO / Cyber Essentials badges — HOLD — Publish only with current
 * certificate for exact legal entity, scope and validity", and section 02 lists
 * the ISO 9001 / ISO 27001 / Cyber Essentials Plus badges under "Hold until
 * verified". The handoff's publication rule is blunter still: SELL CAPABILITY.
 * PROVE CLAIMS. DO NOT BORROW CREDENTIALS.
 *
 * So the page no longer asserts held status, and no longer renders the
 * accreditation mark artwork. It states the gate, names what would release it,
 * and gives the reader a route that works today. That is not a weaker page —
 * "we hold these accreditations" that a reader cannot check is precisely the
 * defect the 7 September note on the old version was already circling.
 *
 * Nothing here says the certifications are absent or doubted. It says they are
 * not published yet, which is a statement about evidence, not about the firm.
 */

/** What would release each row. Keyed off the canonical record, not retyped. */
function gateFor(
  status: Certification['status'],
  heldByCertified?: boolean,
  published?: boolean,
) {
  if (published) {
    return {
      state: 'Published',
      release: 'Evidenced for this legal entity and shown on the site.',
    };
  }
  if (heldByCertified) {
    return {
      state: 'Not a Pixelette Technologies claim',
      release: `${company.legalName} does not hold this certificate and does not claim it. ${certified.name} supports readiness and the route to independent assessment.`,
    };
  }
  if (status === 'In progress') {
    return {
      state: 'Not published',
      release: 'A confirmed listing. Until then nothing is asserted either way.',
    };
  }
  return {
    state: 'Held pending evidence',
    release: `A current certificate for ${company.legalName} showing the certified scope and its validity dates.`,
  };
}

const faqs = [
  {
    q: 'Does Pixelette Technologies publish its certifications?',
    a: 'Not until the evidence supports the exact claim. The standing rule on this site is that a certification, badge, award or rating is published only where there is evidence for the precise claim, for the precise legal entity, and where a reader can check it. Certificate detail is provided direct to a reviewer on request instead.',
  },
  {
    q: 'Does Pixelette Technologies hold ISO/IEC 42001?',
    a: `No. ISO/IEC 42001 for AI management systems is a group capability delivered through ${certified.name}. ${company.legalName} does not hold that certificate and does not claim it.`,
  },
  {
    q: 'Does Pixelette Technologies or Pixelette Certified issue certificates?',
    a: `Neither does. A certification decision is made independently of both. ${certified.name} can help scope the requirement, prepare the management system and the supporting evidence, coordinate appropriately credentialed specialists, and support the route to independent assessment where required.`,
  },
  {
    q: 'Is Pixelette Technologies on the AI DPS RM6200 framework?',
    a: 'Registration is in progress and not yet complete. The site says registration is in progress rather than implying a listing that does not yet exist, because a buyer who checks and finds nothing does not come back.',
  },
];

export default function CertificationsPage() {
  // The register row that governs this page, quoted rather than paraphrased.
  const badgeClaim = claimById('iso-cyber-essentials-badges');

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
          <Eyebrow>Certification claims</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            What we can evidence, and what we hold back.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            {company.name} publishes a certification, badge, rating or award only where there is
            evidence for the exact claim, for the exact legal entity, and where you can check it.
            Anything that does not meet that bar is held back rather than shown — including our own.
          </p>

          {/*
            The proof strip renders VERIFIED register rows only, and renders
            nothing at all when there are none. Today `publishedClaims()` is
            empty, so this is the zero case running in production: no heading,
            no empty frame, no gap in the layout. A row moved to VERIFIED
            appears here with no other edit anywhere.
          */}
          <ProofStrip
            claims={publishedClaims()}
            heading="Verified and published"
            note="Every badge, rating and number on this site passes an evidence gate before it is shown."
          />
        </div>
      </div>

      <Section labelledBy="cert-gate-heading">
        <SectionHead
          eyebrow="Evidence gate"
          id="cert-gate-heading"
          title="Every claim on this page has to resolve to something a reviewer can check."
          lead="Security review delays roughly half of enterprise deals, so the useful thing is not another badge wall — it is a straight account of what is published, what is not, and what would change that."
        />

        {badgeClaim ? (
          <p className="src" style={{ marginTop: 26 }}>
            Claims register, {badgeClaim.id}: {badgeClaim.publicationInstruction}
          </p>
        ) : null}

        {/* Same discipline as the proof strip: an empty register renders no
            table rather than a header row over nothing. */}
        {certificationRegister.length > 0 ? (
          <div className="table-scroll" style={{ marginTop: 34 }}>
            <table>
              <caption className="small" style={{ textAlign: 'left', paddingBottom: 12 }}>
                Standards in scope for {company.legalName}, and the publication status of each.
              </caption>
              <thead>
                <tr>
                  <th scope="col">Standard</th>
                  <th scope="col">Publication status</th>
                  <th scope="col">What releases it</th>
                </tr>
              </thead>
              <tbody>
                {certificationRegister.map(cert => {
                  const gate = gateFor(cert.status, cert.heldByCertified, cert.published);
                  return (
                    <tr key={cert.standard}>
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
                        }}
                      >
                        {cert.standard}
                        {cert.note ? (
                          <span className="small" style={{ display: 'block', fontSize: 12.5 }}>
                            {cert.note}
                          </span>
                        ) : null}
                      </th>
                      <td>{gate.state}</td>
                      <td>{gate.release}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        {/*
          Kept from the 7 September revision, which was right about the problem:
          the public registers are search interfaces rather than deep links, and
          IAF CertSearch asks for a free account before it will search at all. A
          reader who clicks, cannot find us, and is not told why reasonably
          concludes the claim is empty. Under DMCCA 2024 s.226 an overall
          presentation can mislead even where every statement in it is true.
          The answer is the same as before — give a route that always works —
          but it now sits behind the gate rather than beside an assertion.
        */}
        <p className="body" style={{ marginTop: 30, maxWidth: '66ch' }}>
          If your review needs certificate detail, ask and we will send what we can evidence — the
          certificate number, the issuing body and the expiry date — direct to your reviewer, rather
          than pointing you at a register search that may not return us.
        </p>
      </Section>

      <Section labelledBy="frameworks-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Public sector" id="frameworks-heading" title="Framework routes" />
        <div className="card" style={{ marginTop: 32, maxWidth: '72ch' }}>
          <h3 className="h4">AI DPS RM6200</h3>
          <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
            <b>Registration in progress.</b> Once listed, direct award and further competition are
            both available. We say registration is in progress rather than implying a listing that
            does not yet exist, because a buyer who checks and finds nothing does not come back.
          </p>
        </div>
      </Section>

      {/* Handoff section 12, from the canonical constants rather than retyped. */}
      <CertifiedHandoff
        eyebrow="Governance when required"
        title="Need governance and assurance around what you are building?"
        blurb={certified.blurb}
      />

      <ClosingCta title="Governance is a separate conversation.">
        {certified.positioningLine} If your next deal is waiting on governance rather than on a
        build, we will hand you straight over.
      </ClosingCta>
    </>
  );
}
