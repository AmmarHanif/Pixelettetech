import { Children, isValidElement, type ReactNode } from 'react';

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
 * Does this subtree contain an unfilled `<Placeholder>`?
 *
 * A legal section can be unfinished in two different ways. It can have no
 * `body` at all, which this shell renders as a placeholder itself, and that
 * case is trivially detectable from the `sections` array. Or it can be a
 * finished section with one unresolved clause inside otherwise complete prose —
 * which is how /privacy carries its outstanding transfer-mechanism item. That
 * second case is invisible from the outside, because `body` is an opaque
 * `ReactNode`, so we walk the element tree and look for the component.
 *
 * The walk is over already-constructed React elements, which are plain objects
 * with a finite `props.children` chain, so it terminates and costs nothing —
 * these are static server-rendered documents of a few dozen nodes.
 *
 * `intentional` placeholders are deliberately excluded. They wear the amber
 * styling as a house idiom rather than marking a gap, and counting one would
 * put a permanent "not yet finalised" banner on a finished page.
 */
function containsPlaceholder(node: ReactNode): boolean {
  let found = false;

  Children.forEach(node, child => {
    if (found || !isValidElement(child)) return;

    const props = child.props as { children?: ReactNode; intentional?: boolean };

    if (child.type === Placeholder && !props.intentional) {
      found = true;
      return;
    }

    if (containsPlaceholder(props.children)) found = true;
  });

  return found;
}

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
 *
 * The closing "not yet finalised" notice is CONDITIONAL on the page actually
 * containing one. It used to render unconditionally, which meant /terms,
 * /modern-slavery and /accessibility — all complete, all placeholder-free, each
 * carrying a real review date — told every reader they were unfinished drafts.
 * A notice that fires when there is nothing to notice is not caution; it
 * discredits finished documents and trains a reader to ignore the warning on
 * the one page (/privacy) that genuinely still has an open item.
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
  // Every route by which this page can render an unfilled item: an unset review
  // date, a section with no body, or a placeholder buried inside a body.
  const hasUnfilledItem =
    lastReviewed === null ||
    sections.some(section => !section.body || containsPlaceholder(section.body));

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
            Last reviewed: {lastReviewed ?? <Placeholder>DATE: set at legal sign-off</Placeholder>}
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

        {hasUnfilledItem ? (
          <p className="small" style={{ marginTop: 44, fontStyle: 'italic', maxWidth: '72ch' }}>
            Sections marked in amber are not yet finalised and must be completed and reviewed before
            this page is published. They are shown rather than hidden so that nothing on this site
            reads as settled when it is not.
          </p>
        ) : null}
      </Section>
    </>
  );
}
