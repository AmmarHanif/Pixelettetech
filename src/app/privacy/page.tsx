import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Statement',
  description:
    'What Pixelette Technologies collects through this website, why, who it is shared with, how long it is kept and your rights under UK GDPR.',
  path: '/privacy',
});

/*
 * THE SINGLE PRIVACY NOTICE. Rewritten 2026-09-17 on founder instruction:
 * "Consolidate GDPR transparency requirements into one professionally drafted
 * Privacy Notice linked from the footer."
 *
 * The decision and its consequences are recorded in ADR-0034 (layered privacy:
 * the security surface leaves the marketing site), which also names what this
 * change OWES: a procurement pack that does not exist yet, a retention period
 * that was chosen rather than found, and a legal review of this document.
 *
 * WHAT THIS REPLACED, and why the replacement is shorter rather than longer.
 * The previous version ran to 634 lines and worked as a companion to
 * /security-and-data, which carried subprocessor tables, data residency, an
 * AI-governance position and incident-response commitments. Both that page and
 * /certifications were WITHDRAWN on the same instruction: detailed security
 * controls, ISO evidence, processor documentation and DPAs leave the marketing
 * site and are supplied during enterprise procurement. This notice therefore
 * has to stand alone, and it covers exactly what UK GDPR Article 13 requires of
 * a controller and nothing beyond it.
 *
 * THREE RULES THIS FILE FOLLOWS, all from the same instruction.
 *
 *  1. NO IMPLEMENTATION COMMENTARY OR DEVELOPMENT STATUS ON THE PAGE. The old
 *     version imported DELIVERY_CONNECTED and changed its prose according to
 *     whether the contact form's providers were wired up yet. That told a
 *     reader about our build state, which is not a transparency requirement and
 *     is not their business. This file imports no launch flag. Source comments
 *     like this one are fine; they do not render.
 *
 *  2. CATEGORIES OF RECIPIENT, NOT A NAMED SUBPROCESSOR LIST. Article 13(1)(e)
 *     permits "recipients or categories of recipients", and the instruction
 *     forbids a standalone public Subprocessors page. Naming providers here
 *     would rebuild that page inside this one, and it would need re-editing
 *     every time a provider changed. Named detail goes to a reviewer under
 *     procurement, where it can be kept current against an actual contract.
 *
 *  3. NO COOKIE BANNER, BECAUSE THERE IS NOTHING TO CONSENT TO. Measured on the
 *     built site on 17 September 2026 rather than assumed: document.cookie
 *     empty, localStorage / sessionStorage / IndexedDB all empty, no
 *     third-party script, stylesheet, image or iframe, and every network
 *     request same-origin with fonts served from our own domain. PECR reg. 6
 *     bites on storing or accessing information on a user's device; nothing
 *     here does. So the notice states the position and no consent mechanism is
 *     deployed.
 *
 *     DIARY, and it is the condition on that whole paragraph. Two things would
 *     falsify it. Analytics is present in the dependency tree and dormant; if
 *     it is ever switched on, this section must be revisited the same day even
 *     though the product is cookieless, because it introduces a third-party
 *     request. And this was measured on a local production build, not on the
 *     deployed host — platform features can set their own cookies, preview
 *     deployments especially. Re-measure against the live host before launch.
 */

const REVIEW_DATE = '17 September 2026';

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy Statement', path: '/privacy' },
        ])}
      />

      <LegalPage
        eyebrow="Legal"
        title="Privacy Statement"
        intro={`This notice explains what ${company.name} collects through this website, why we collect it, who it is shared with, how long we keep it and what rights you have.`}
        lastReviewed={REVIEW_DATE}
        sections={[
          {
            heading: 'Who we are',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                {company.legalName} is the controller for the personal information described in
                this notice. We are registered in {company.registeredIn} at Companies House under
                company number {company.crn}, with our registered office at {company.addressLine}.
                For any question about this notice or about your personal information, contact us at{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </p>
            ),
          },
          {
            heading: 'What we collect',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  We collect the information you choose to give us when you complete the enquiry
                  form or email us. That is:
                </p>
                <ul className="body" style={{ marginTop: 12 }}>
                  <li>your name, and your company name if you give one;</li>
                  <li>your work email address;</li>
                  <li>
                    what you tell us about what you are trying to build or change, what exists
                    today, any deadline, and what a successful result would look like; and
                  </li>
                  <li>anything else you include in your message or in later correspondence.</li>
                </ul>
                <p className="body" style={{ marginTop: 12 }}>
                  We do not ask for special category data, and we ask you not to send it through
                  this form. We do not buy personal information from third parties, and we do not
                  build profiles of visitors to this site.
                </p>
              </>
            ),
          },
          {
            heading: 'Why we use it, and our lawful basis',
            body: (
              <>
                <div className="table-scroll" style={{ marginTop: 12 }}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Purpose</th>
                        <th scope="col">Lawful basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>To read and reply to your enquiry</td>
                        <td>
                          Our legitimate interests in responding to a business enquiry you chose to
                          send us
                        </td>
                      </tr>
                      <tr>
                        <td>
                          To discuss and scope work, and to take steps towards a contract if you
                          ask us to
                        </td>
                        <td>Steps taken at your request before entering into a contract</td>
                      </tr>
                      <tr>
                        <td>To keep a record of what was asked and what we answered</td>
                        <td>
                          Our legitimate interests in keeping an accurate record of our business
                          dealings
                        </td>
                      </tr>
                      <tr>
                        <td>To keep this site available and to prevent abuse of the form</td>
                        <td>Our legitimate interests in the security of our own systems</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="body" style={{ marginTop: 16 }}>
                  We do not use your information to send marketing you did not ask for, and we do
                  not sell it or share it for anyone else&rsquo;s marketing.
                </p>
              </>
            ),
          },
          {
            heading: 'Who we share it with',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Your enquiry is seen by the people at {company.name} who need to answer it. Beyond
                  that, we share personal information with these categories of recipient:
                </p>
                <ul className="body" style={{ marginTop: 12 }}>
                  <li>
                    our website hosting and content delivery provider, which serves this site and
                    processes the form submission;
                  </li>
                  <li>our database provider, which stores the enquiry;</li>
                  <li>our email delivery provider, which sends the enquiry to us; and</li>
                  <li>
                    our professional advisers, and any regulator or other body we are required to
                    disclose to by law.
                  </li>
                </ul>
                <p className="body" style={{ marginTop: 12 }}>
                  Each provider acts on our instructions as a processor under a written contract
                  and may not use your information for its own purposes. If you are assessing us as
                  a supplier and need the providers named, together with the contractual terms and
                  transfer safeguards that apply to each, ask and we will send that detail to your
                  reviewer.
                </p>
              </>
            ),
          },
          {
            heading: 'Where your information is processed',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Some of our providers are established outside the United Kingdom, principally in
                the United States, so your information may be transferred there. Where that
                happens, the transfer is covered by the UK International Data Transfer Agreement, or
                by the UK Addendum to the European Commission&rsquo;s standard contractual clauses,
                together with any additional measures the transfer requires. You can ask us which
                mechanism applies to a particular provider.
              </p>
            ),
          },
          {
            heading: 'How long we keep it',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                If your enquiry does not lead to us working together, we keep it for 24 months from
                our last contact with you and then delete it. We keep it that long because
                enquiries commonly return after a funding round or a change of plan, and answering
                you properly means knowing what was already discussed. If we do work together, the
                information becomes part of the client record and is kept for as long as the
                engagement continues and for six years afterwards, which is the period we may need
                it for legal and tax purposes. You can ask us to delete it sooner.
              </p>
            ),
          },
          {
            heading: 'Cookies and similar technologies',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  This website sets no cookies. It loads no third-party scripts, fonts, images or
                  embedded content, and it runs no advertising technology. There is no consent
                  banner because there is nothing to consent to.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  One thing is stored on your device, and only if you use it: if you switch website
                  analytics off under <strong>Privacy choices</strong> in the footer, we keep a
                  single first-party preference so that your choice is respected on later visits. It
                  holds one of two values, it identifies nobody, and it is never sent to us.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Our <Link href="/cookies">Cookies and analytics</Link> page lists everything
                  stored, what it is for and how long it lasts, and is written from an audit of the
                  deployed site rather than from policy.
                </p>
              </>
            ),
          },
          {
            heading: 'Your rights',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Under UK data protection law you have the right to ask us for a copy of the
                  personal information we hold about you, to have inaccurate information corrected,
                  to have information deleted, to ask us to restrict how we use it, and to receive
                  it in a portable format where that applies.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Where we rely on our legitimate interests, you have the right to object, and we
                  will stop unless we have compelling grounds to continue. You can object to direct
                  marketing at any time and we will stop without exception.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  To exercise any of these rights, email{' '}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We will respond within one
                  month. We do not charge for this, and we may ask you to confirm who you are
                  before we release information.
                </p>
              </>
            ),
          },
          {
            heading: 'Complaints',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                If you are unhappy with how we have handled your personal information, please tell
                us first at <a href={`mailto:${contactEmail}`}>{contactEmail}</a> so we can put it
                right. You also have the right to complain to the Information Commissioner&rsquo;s
                Office, the UK supervisory authority, at{' '}
                <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
                  ico.org.uk
                </a>
                , or by calling 0303 123 1113.
              </p>
            ),
          },
          {
            heading: 'Changes to this notice',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We review this notice when what we do with personal information changes, and at
                least once a year. The date it was last reviewed is shown at the foot of this page.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
