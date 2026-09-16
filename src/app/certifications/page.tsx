import { ProofStrip } from '@/components/ProofStrip';
import { CertifiedHandoff, ClosingCta } from '@/components/sections';
import { Eyebrow, Faqs, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { type Claim, claimById, publishedClaims } from '@/content/claims';
import { certificationRegister, certified, company, type Certification } from '@/content/company';
import { SOURCES } from '@/content/sources';
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
 *
 * UPDATED 2026-09-14. Two of them are now published: ISO/IEC 27001:2022 and
 * ISO 9001, each with its certificate number, its issuing body and its dates,
 * on certificate detail the founder supplied for Pixelette Technologies Ltd.
 * The page's argument is unchanged and this is the first day it has had
 * anything to demonstrate it with — "what we can evidence, and what we hold
 * back" now shows both halves instead of one. The accreditation mark artwork
 * stays unrendered and the certificate documents stay unpublished (ADR-0012):
 * what is published is the checkable facts, not a badge and not a PDF.
 *
 * The register table below still lists every standard, published or not, and
 * that is the part of this page that must not be tidied as rows release. A
 * table showing only what publishes is a badge wall with extra columns.
 */

/**
 * What would release each row. Keyed off the canonical record, not retyped.
 *
 * Takes the whole row as of 2026-09-14, rather than three of its fields. The
 * published branch used to be unreachable and said only "Evidenced for this
 * legal entity and shown on the site", which on the day it first rendered would
 * have been the weakest cell in the table: this column is headed "What releases
 * it", and for a row that IS released the honest answer is the evidence that
 * released it, named. Passing the row is what lets it say so without this
 * function growing a fourth and fifth positional argument.
 */
function gateFor(cert: Certification) {
  const { status, heldByCertified, published } = cert;
  if (published) {
    return {
      state: 'Published',
      release:
        cert.certificateNumber && cert.validTo
          ? `Certificate ${cert.certificateNumber} for ${company.legalName}, with its issuing body and dates shown above. Expires ${cert.validTo}. The document itself goes to your reviewer on request.`
          : 'Evidenced for this legal entity and shown on the site.',
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
  /*
   * REWRITTEN 2026-09-14, and this array is emitted as FAQPage JSON-LD below,
   * so it is the answer a machine gets as well as the one a reader gets. The
   * previous wording — "Not until the evidence supports the exact claim" —
   * became false the day two rows published, and a false answer in structured
   * data outlives its correction on the page.
   *
   * It names two certificates and then closes the set with "everything else in
   * the register on this page is held back", which forecloses every other badge
   * this company has had attributed to it without naming one of them. Naming a
   * held standard in order to deny it puts that standard into the JSON-LD, and
   * a negation is the first thing an answer engine drops.
   */
  {
    q: 'Does Pixelette Technologies publish its certifications?',
    a: `Two of them, in full. ISO/IEC 27001:2022 under certificate AMER800409, and ISO 9001 under certificate AMER37046 — both held by ${company.legalName} and both issued by Americo Quality Standards Registech Pvt. Ltd, which the certificates record as accredited by the United Accreditation Foundation. Each is published with its certificate number, its issuing body and its dates, because the standing rule on this site is that a certification, badge, award or rating is published only where there is evidence for the precise claim, for the precise legal entity, and where a reader can check it. No other certification, badge, award or rating is published. The certificate documents themselves are not published; the detail goes direct to a reviewer on request.`,
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
    a: 'Registration is in progress and not yet complete. Once listed, Pixelette can be shortlisted through the dynamic purchasing system and invited into the relevant further competition.',
  },
];

export default function CertificationsPage() {
  // The register row that governs this page, quoted rather than paraphrased.
  const badgeClaim = claimById('iso-cyber-essentials-badges');

  /*
   * The rows that cleared that instruction, read back out of the register.
   *
   * Named ids rather than a filter over `publishedClaims()`, because this
   * sentence is about certification specifically and `publishedClaims()` will
   * one day also return a Clutch rating or a client-logo row. A filter would
   * quietly fold those into a sentence about certificates.
   *
   * The status is re-checked here even though `claimById` found the row: this
   * paragraph asserts that these standards are PUBLISHED, so it must read the
   * same field `publishedClaims()` reads. If a row is returned to HELD the
   * sentence disappears on its own rather than going stale.
   */
  const releasedCertificates = (['iso-27001-certificate', 'iso-9001-certificate'] as const)
    .map(id => claimById(id))
    .filter((claim): claim is Claim => claim?.status === 'VERIFIED');

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
            What we can evidence, and what we hold back
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            {company.name} publishes a certification, badge, rating or award only where there is
            evidence for the exact claim, for the exact legal entity, and where you can check it.
            Anything that does not meet that bar is held back rather than shown — including our own.
          </p>

          {/*
            The proof strip renders VERIFIED register rows only, and renders
            nothing at all when there are none.

            From 8 September to 14 September 2026 this was the zero case running
            in production: `publishedClaims()` was empty, and the strip rendered
            no heading, no empty frame and no gap in the layout. On 14 September
            two certification rows moved to VERIFIED and the strip appeared here
            with no edit to this file, which is the property the register was
            built for — stated then as "a row moved to VERIFIED appears here with
            no other edit anywhere", and now observed rather than predicted.

            Each badge prints the row's `detail` beneath it, so what appears is
            the certificate number, the issuing body and the dates rather than a
            bare standard name. The zero case has not gone anywhere: it is what
            runs again on 11 March 2027 if the 27001 certificate is not renewed.
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
          title="Every claim on this page has to resolve to something a reviewer can check"
          lead="Security review delays roughly half of enterprise deals, so the useful thing is not another badge wall — it is a straight account of what is published, what is not, and what would change that."
        />
        {/*
          ADDED 2026-09-14, and the omission was worse here than it would be
          anywhere else on the site.

          The heading directly above this reads "Every claim on this page has to
          resolve to something a reviewer can check", and the sentence under it
          asserted a third-party figure with no attribution at all — on the one
          page whose entire argument is that we do not do that. /certifications
          contained no SourceNote of any kind. The same G2 figure was already
          cited properly twice elsewhere, at security-and-data:360 and
          sections.tsx:628, so this was an omission rather than an unsourced
          claim: the evidence existed and simply was not printed where the claim
          was made.

          Taken from SOURCES rather than retyped, unlike the two older call
          sites which hardcode the string. One constant means a corrected
          citation reaches every instance; those two should be migrated when
          someone is next in that file.
        */}
        <SourceNote style={{ marginTop: 14 }}>{SOURCES.g2}</SourceNote>

        {/*
          The standing instruction, and then what has actually met it.
          Both, from 2026-09-14, and the second half is not decoration: the row
          quoted here covers three standards, two of which are now published,
          so the instruction printed on its own would read on this page as
          though the ISO badges above it were still held. It is still quoted
          verbatim — it is the founder's wording and remains the live gate for
          the standard that has produced no certificate — but it is no longer
          the last word on the line.
        */}
        {badgeClaim ? (
          <p className="src" style={{ marginTop: 26 }}>
            {/*
              WAS: "Claims register, {badgeClaim.id}: {badgeClaim.publicationInstruction}",
              which printed our internal claim id and our own instruction to
              ourselves - "HOLD - Publish only with current certificate for exact
              legal entity, scope and validity." Removed for launch 2026-09-16:
              this page is a procurement resource, not internal project
              documentation.

              THE SUBSTANCE IS KEPT as a public principle, because the discipline
              it describes is exactly why the certificates above are credible.
              The governed instruction stays in claims.ts, which still gates
              everything.

              FOR REVIEW: this sentence is no longer COMPOSED from
              publicationInstruction, so the two can drift. If the register's
              test changes, change this sentence with it.
            */}
            A certification is published on this page only where a current certificate names the
            legal entity, the scope and the validity dates.
            {releasedCertificates.length > 0 ? (
              <>
                {' '}
                Met, and published above, by{' '}
                {releasedCertificates.map(claim => claim.label).join(' and ')}. Every other standard
                in the table below is held to the same test and has not met it.
              </>
            ) : null}
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
                  const gate = gateFor(cert);
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

          2026-09-14: the problem turned out to be worse than "a search that may
          not return us". The founder reports that the International
          Accreditation Forum ceased operations on 1 January 2026 and that
          iaf.nu now presents itself as a legacy archive naming a successor
          body. The two IAF CertSearch links in src/content/company.ts are
          removed. Two disciplines applied to that removal and both matter:

            1. THAT REPORT IS NOT VERIFIED HERE. Raw network access is blocked
               in the session that made this change, so neither iaf.nu nor
               iafcertsearch.org was loaded and neither the closure nor the
               current state of iafcertsearch.org was confirmed first-hand. So
               the closure is NOT asserted in rendered copy anywhere on this
               site — not here, not on /security-and-data, not in llms.txt. It
               is recorded in comments as what it is: a founder report, acted on
               because acting on it costs nothing and the alternative risks
               sending buyers to a dead registry.
            2. NO SUCCESSOR URL IS INVENTED. Nobody in this project has loaded
               the successor body's register or confirmed it holds these
               certificates, so no replacement link appears. The route that
               replaces it is the one this paragraph already described and
               ADR-0012 already chose, plus the facts now printed above: the
               certificate number and the issuing body are on the page, so a
               reviewer can go to the body direct without any register at all.

          The paragraph itself needed only one change — it promised to send the
          detail rather than publish it, and the detail is now published too.
        */}
        <p className="body" style={{ marginTop: 30, maxWidth: '66ch' }}>
          The certificate number and the issuing body for each published standard are printed above,
          so you can take them straight to the certification body. We do not link you to a
          third-party register search: a search that does not return us reads like an empty claim,
          and it is not a route we can promise on anyone else&rsquo;s behalf. If your review needs
          the certificate itself, ask and we will send what we can evidence direct to your reviewer.
        </p>
      </Section>

      <Section labelledBy="frameworks-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="Public sector" id="frameworks-heading" title="Framework routes" />
        <div className="card" style={{ marginTop: 32, maxWidth: '72ch' }}>
          <h3 className="h4">AI DPS RM6200</h3>
          <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
            {/*
              TWO CHANGES 2026-09-16, both founder-instructed.
              (1) The direct-award claim is removed: a DPS operates by FURTHER
                  COMPETITION among listed suppliers, so it was not a correct
                  description of the route. Do not reinstate without
                  authoritative Crown Commercial Service evidence.
              (2) The sentence explaining WHY we phrase it this way is gone. This
                  page is a procurement resource, not a record of our own
                  editorial reasoning - demonstrate the discipline rather than
                  narrate it.
            */}
            <b>Registration in progress.</b> Once listed, Pixelette can be shortlisted through the
            DPS and invited into the relevant further competition.
          </p>
        </div>
      </Section>

      {/* Handoff section 12, from the canonical constants rather than retyped. */}
      <CertifiedHandoff
        eyebrow="Governance when required"
        title="Need governance and assurance around what you are building?"
        blurb={certified.blurb}
      />

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Governance is a separate conversation">
        {certified.positioningLine} If your next deal is waiting on governance rather than on a
        build, we will hand you straight over.
      </ClosingCta>
    </>
  );
}
