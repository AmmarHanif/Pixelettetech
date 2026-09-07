import type { ReactNode } from 'react';

import { Eyebrow, Placeholder, Section } from '@/components/ui';
import { company } from '@/content/company';

export type LegalSection = {
  heading: string;
  /** Verified copy. Where this is null the `pending` note renders instead. */
  body?: ReactNode;
  /** Text describing what still needs legal or DPO sign-off. */
  pending?: string;
};

/**
 * Shared shell for the legal pages.
 *
 * These documents are legally load-bearing. Anything that is a matter of fact
 * (who the controller is, what the contact form collects, what rights apply
 * under UK GDPR) is stated. Anything that requires a decision or a review we
 * have not seen — retention periods, the subprocessor register, the ICO
 * registration number — renders as a visible placeholder. Inventing that text
 * would produce a policy that reads well and is wrong, which is the worst of
 * both outcomes.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  lastReviewed,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  lastReviewed: string | null;
}) {
  return (
    <>
      <div className="hero-glow" style={{ padding: '72px 0 48px' }}>
        <div className="wrap">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="h1p" style={{ marginTop: 22, maxWidth: '20ch' }}>
            {title}
          </h1>
          <p className="lead" style={{ marginTop: 22 }}>
            {intro}
          </p>
          <p className="small" style={{ marginTop: 22 }}>
            {company.legalName} · Registered in England and Wales, company number {company.crn} ·
            Registered office {company.addressLine} · VAT {company.vat}
          </p>
          <p className="small" style={{ marginTop: 8 }}>
            Last reviewed: {lastReviewed ?? <Placeholder>DATE — set at legal sign-off</Placeholder>}
          </p>
        </div>
      </div>

      <Section flush style={{ paddingTop: 48 }}>
        <div className="legal">
          {sections.map(section => (
            <section key={section.heading}>
              <h2 className="h3">{section.heading}</h2>
              {section.body ? (
                <div className="legal__body">{section.body}</div>
              ) : (
                <p className="body" style={{ marginTop: 12 }}>
                  <Placeholder>{section.pending ?? 'PENDING LEGAL SIGN-OFF'}</Placeholder>
                </p>
              )}
            </section>
          ))}
        </div>

        <p className="small" style={{ marginTop: 44, fontStyle: 'italic', maxWidth: '72ch' }}>
          Sections marked in amber are not yet finalised and must be completed and reviewed before
          this page is published. They are shown rather than hidden so that nothing on this site reads
          as settled when it is not.
        </p>
      </Section>
    </>
  );
}
