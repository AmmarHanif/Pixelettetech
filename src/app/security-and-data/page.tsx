import { CertifiedHandoff, ClosingCta, VerificationTable } from '@/components/sections';
import {
  Eyebrow,
  FLink,
  JsonLd,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { certified, company } from '@/content/company';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Security and data',
  description:
    'Data handling, subprocessors, our AI governance position and what we do and do not publish about certification, given rather than sent on request.',
  path: '/security-and-data',
});

const positions = [
  {
    /*
     * Was: "We operate an ISO 27001:2022 certified information security
     * management system, and an ISO 9001:2015 quality management system, both
     * externally audited. Cyber Essentials Plus adds independently tested
     * technical controls."
     *
     * Withdrawn 2026-09-08. All three badges are HELD in the claims register
     * (claims.ts `iso-cyber-essentials-badges`): the handoff publishes a
     * certification "only with current certificate for exact legal entity,
     * scope and validity", and design/certificates/ is empty. "Externally
     * audited" made it worse by asserting a specific assurance activity.
     *
     * It becomes a visible placeholder rather than quieter prose because that
     * is this page's own stated policy, printed twelve lines below: unfilled
     * entries are shown rather than hidden, because a confident-sounding answer
     * we have not verified is worse to a security reviewer than a visible gap.
     * The page now applies that rule to itself.
     */
    title: 'Information security management',
    body: null,
    placeholder:
      'ISMS SCOPE AND CERTIFICATION EVIDENCE — published once the certificate number, issuing body and expiry date can be shown for the exact legal entity',
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
  /*
   * Was: "Which security certifications does Pixelette Technologies hold? —
   * ISO 9001:2015, ISO 27001:2022 and Cyber Essentials Plus, all externally
   * audited and independently verifiable. ISO/IEC 42001 ... delivered by
   * Pixelette Certified..."
   *
   * This one mattered more than the card above it, because `faqSchema` puts
   * every answer on this array into JSON-LD. A held claim in structured data
   * outlives its removal from the page: an answer engine goes on repeating it
   * long after the human-readable site stopped saying it. Rewritten 2026-09-08
   * to the claims register and the handoff's ACCREDITATION-SAFE RULE, which
   * also forbids saying a group company "delivers" a standard or audits anyone.
   */
  {
    q: 'Which security certifications does Pixelette Technologies publish?',
    a: 'None at present. A certification is published on this site only with a current certificate for the exact legal entity, its scope and its validity, and until that can be shown for Pixelette Technologies Ltd nothing is asserted either way — a badge a reviewer cannot check is not evidence. Where a programme needs formal governance, certification readiness, privacy or security-assurance support, Pixelette Certified can help scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment.',
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
            publish a badge you cannot check.
          </p>
          <SourceNote>G2 Buyer Behavior Report, July 2026</SourceNote>
        </div>
      </div>

      {/*
        The section states its own position in copy, then renders the table.
        Both halves matter, and the copy is not decoration: `certifications` is
        empty until a row carries a certificate for the exact legal entity, so
        a reviewer who arrives looking for a badge wall needs to be told why
        there is not one, in the same place they looked. Written to read
        correctly in both states — it describes the standard the table is held
        to, not the number of rows in it, so it stays true on the day the first
        row publishes. The table's own empty state is handled inside
        `VerificationTable`, not duplicated here.
      */}
      <Section labelledBy="verify-heading">
        <Eyebrow>Verification</Eyebrow>
        <h2 className="h2" id="verify-heading" style={{ marginTop: 18 }}>
          What we publish about certification, and what we hold back.
        </h2>
        <p className="body" style={{ marginTop: 20, maxWidth: '68ch' }}>
          A certification appears on this site only with a current certificate for{' '}
          {company.legalName} — its scope, and its validity — set out so that you can check it
          rather than take it. Anything that does not clear that bar is held back rather than
          softened, and nothing is asserted either way in the meantime.
        </p>
        <p style={{ marginTop: 16 }}>
          <FLink href="/certifications">
            The full register, standard by standard, and what would release each one
          </FLink>
        </p>
        {/* `withHeading={false}` zeroes the table's own top margin, on the
            assumption that it is the first thing in its section. It no longer
            is, so the spacing is restored here rather than by turning the
            component's heading back on and printing a second one. */}
        <div style={{ marginTop: 34 }}>
          <VerificationTable withHeading={false} />
        </div>
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
            {/*
              Was: title "We build it. We do not certify it.", and a body saying
              "Formal AI governance, ISO/IEC 42001 and audit are delivered by
              Pixelette Certified, a separate practice in the same group with
              its own lead auditors."

              Both breached the handoff's ACCREDITATION-SAFE RULE, which forbids
              saying a Pixelette company holds an accreditation, issues a
              certificate, performs an independent audit or has a named
              certified-practice status until the exact legal entity and status
              are verified (claims.ts `certified-cross-sell`). "We do not
              certify it" says Certified does; "its own lead auditors" is a
              named certified-practice status; "audit ... delivered by" is an
              independent-audit claim.

              The title is now the handoff's own section 12 replacement line,
              read from company.ts so it cannot drift from the other places it
              appears. The separation-of-duties point — the part that actually
              sells — is kept: it just says we will not assure our own build,
              rather than naming who audits.
            */}
            <SectionHead eyebrow="Governance" id="gov-heading" title={certified.positioningLine} />
            <p className="body" style={{ marginTop: 20 }}>
              {company.name} engineers and runs the system. Where a programme needs formal
              governance, certification readiness, privacy or security-assurance support,{' '}
              {certified.name} can help scope the requirement, coordinate appropriately credentialed
              specialists and support the route to independent assessment. Independent assurance
              stays independent: we will not assure our own build, and we will confirm that in
              writing if your procurement team asks.
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
