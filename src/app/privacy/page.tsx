import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { JsonLd, Placeholder } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy',
  description:
    'What Pixelette Technologies collects through this website, why, and what rights you have under UK GDPR.',
  path: '/privacy',
});

/*
 * Scope of the 2026-09-07 revision: ONLY what a verified statutory provision
 * compels. Founder instruction was to change what the law requires and nothing
 * that is commercial judgment.
 *
 * Each section below names the provision it discharges. Every provision was
 * read at legislation.gov.uk on 2026-09-07 and is in force on that date.
 *
 *  - Art 13(1)(a)  controller identity AND contact details
 *  - Art 13(1)(c)  purposes and legal basis, for EVERY processing operation
 *                  (server request logs were previously undisclosed entirely)
 *  - Art 13(1)(d)  the legitimate interests pursued, where Art 6(1)(f) is relied on
 *  - Art 13(1)(e)  recipients OR CATEGORIES of recipients
 *  - Art 13(1)(f)  the fact of transfer out of the UK, and how to obtain the
 *                  safeguards. Previously absent altogether
 *  - Art 13(2)(a)  retention period OR THE CRITERIA used to determine it
 *  - Art 13(2)(b)  the rights, stated accurately. Art 20 portability does NOT
 *                  arise on Art 6(1)(f) processing; the page previously granted it
 *  - Art 13(2)(ca) the right to complain to the controller under DPA 2018 s.164A
 *                  (inserted by DUAA 2025; in force 19 June 2026)
 *  - Art 13(2)(d)  the right to complain to the Commissioner under s.165
 *  - Art 13(2)(e)  whether providing the data is a statutory or contractual
 *                  requirement, and the consequences of not providing it
 *  - DPA 2018 s.164A(2)-(4)  the controller MUST facilitate complaints, acknowledge
 *                  within 30 days, respond and report the outcome
 *
 * SECOND PASS, same day. The founder then widened the instruction from "only
 * what the law compels" to full legal protection across the site, so three
 * things left alone in the first pass were completed:
 *
 *  - the COOKIE section, closed from first-hand inspection of the served site
 *    and written against the PECR regime substituted on 5 February 2026 (see
 *    the note at that section);
 *  - the "last reviewed" date, now a real date because the page really was
 *    reviewed on it;
 *  - the ICO registration section, REMOVED rather than filled (see the note
 *    where it used to sit). Publishing it is not required, and the number held
 *    internally does not resolve on the ICO register.
 *
 * Art 13(1)(b), the DPO's contact details, applies only "where applicable" and
 * no designation is recorded, so it is still not asserted either way.
 *
 * ONE PLACEHOLDER REMAINS AND IS DELIBERATE: the per-provider transfer
 * mechanism. Art 13(1)(f) is discharged as to the FACT of transfer and the means
 * of obtaining the safeguards, which is what was missing entirely. Naming the
 * mechanism requires knowing what is actually in place with the hosting
 * provider, and that is not a fact this file may guess at.
 *
 * Where a required fact is genuinely unknown, the legally permitted alternative
 * is used: CRITERIA in place of a retention period, CATEGORIES in place of named
 * recipients. Nothing is invented to fill a gap.
 */

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Privacy', path: '/privacy' },
        ])}
      />
      <LegalPage
        eyebrow="Privacy"
        title="What we collect, and what we do with it."
        intro="Short version: we use what you send us to reply to you. There is no sequence, no list, and nothing sold on."
        lastReviewed="7 September 2026"
        sections={[
          {
            heading: 'Who the controller is',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                {company.legalName}, registered in England and Wales under company number{' '}
                {company.crn}, at {company.addressLine}, is the data controller for personal data
                collected through this website. You can reach us at{' '}
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or through the{' '}
                <Link href="/contact">contact page</Link>.
              </p>
            ),
          },
          {
            heading: 'What this site collects',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  The contact form collects your name, company, work email address and the description
                  of the process you write. Nothing else is collected through it, and none of the
                  fields are optional-but-tracked.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Separately, our hosting provider records the technical detail of every request made
                  to this site: the IP address it came from, the page requested, the browser used and
                  the time. That is how the site is served and kept secure. We do not use it to build
                  a profile of you, and we do not combine it with anything else.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  This site loads no third-party fonts, trackers or advertising scripts. Typefaces are
                  served from our own domain specifically so that visiting a page does not disclose
                  your IP address to a third party.
                </p>
              </>
            ),
          },
          {
            heading: 'Why we are allowed to hold it',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  We rely on legitimate interests, Article 6(1)(f) UK GDPR, for both. For the contact
                  form, the interest is replying to a business enquiry you chose to send us. For the
                  request records, it is delivering this site and protecting it from abuse. In each
                  case we have weighed that against your interests and concluded that a reply you
                  asked for, and a site that stays up, do not override them.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  You can object to either at any time, and we will stop unless we have compelling
                  legitimate grounds to continue.
                </p>
              </>
            ),
          },
          {
            heading: 'Whether you have to give it to us',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                No. Nothing on this site is a statutory or contractual requirement, and you are not
                obliged to provide any of it. The only consequence of not completing the contact form
                is that we cannot reply to you, so you may prefer to email us instead.
              </p>
            ),
          },
          {
            heading: 'How long we keep it',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We keep an enquiry for as long as there is a live conversation with you, and after
                that for as long as we need it to show what was discussed and agreed. Once neither
                reason applies, we delete it. We do not keep enquiries indefinitely. If you want yours
                deleted sooner, ask us and we will. Request records are kept for the rolling period
                our hosting provider applies to them and are not separately retained by us.
              </p>
            ),
          },
          {
            heading: 'Who else handles it',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Your enquiry is handled by us, and by the service providers that make this website
                  and our email work: the platform that hosts and serves the site, the provider that
                  carries email to and from our address, and the service that delivers contact form
                  submissions to our inbox.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Each of them acts on our instructions and none of them may use your data for their
                  own purposes. We do not sell your data and we do not share it with anyone else. You
                  can ask us which providers are involved at any time and we will tell you.
                </p>
              </>
            ),
          },
          {
            heading: 'When it leaves the UK',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Some of those providers are established outside the United Kingdom, including in the
                  United States. Your data is therefore transferred out of the UK when it passes
                  through them.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  You can ask us which providers are involved, which country each is in, and what
                  protections apply to that transfer, by emailing{' '}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. We will give you a copy of
                  the safeguards relied on.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  <Placeholder>
                    TRANSFER MECHANISM PER PROVIDER — confirm UK adequacy regulations (Article 45A) or
                    the International Data Transfer Addendum, and name it here
                  </Placeholder>
                </p>
              </>
            ),
          },
          {
            /*
             * Closed from evidence 2026-09-07, not from assumption. The served
             * site was inspected directly: document.cookie empty, localStorage
             * and sessionStorage empty, no third-party script, stylesheet, image
             * or iframe, and every network request on the home, privacy and
             * terms pages first-party, fonts included.
             *
             * The second paragraph is written against the CURRENT rule, not the
             * old one. PECR reg. 6 was SUBSTITUTED on 5 February 2026 by the Data
             * (Use and Access) Act 2025 s.112(2) (S.I. 2026/82 reg. 2(w)), and a
             * new Schedule A1 was inserted carrying the consent gateway (para 2)
             * and the exceptions, including collection for statistical purposes
             * with a simple free means of objecting (para 5) and website
             * appearance or functionality (para 6). Anything drafted before that
             * date describes a regime that no longer exists.
             */
            heading: 'Cookies',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  This site sets no cookies. It stores nothing on your device, reads nothing from it,
                  and loads no third-party script that could. There is no consent banner because there
                  is nothing to consent to.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  If that ever changes we will say so here first. Under the rules that have applied
                  since 5 February 2026, some limited uses do not require your consent, such as
                  measuring how the site is used in order to improve it, or remembering a display
                  preference. They do still require us to tell you plainly what we are doing and to
                  give you a simple, free way of objecting. We would do both on this page before
                  setting anything.
                </p>
              </>
            ),
          },
          {
            heading: 'Your rights',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Under UK GDPR you have the right to ask us for a copy of the personal data we hold
                  about you, to have inaccurate data corrected, to have data erased, to have our use
                  of it restricted, and to object to our use of it.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Because we rely on legitimate interests rather than on your consent or on a
                  contract, the right to data portability under Article 20 does not apply to this
                  processing. We would rather tell you that than list a right you cannot use.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  To exercise any of these, email{' '}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or use the{' '}
                  <Link href="/contact">contact page</Link>. We will not charge you, and we will reply
                  within one month.
                </p>
              </>
            ),
          },
          {
            heading: 'If you want to complain to us',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  You have the right to complain to us directly if you think we have handled your
                  personal data wrongly. Tell us and we will deal with it, rather than sending you
                  elsewhere.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with &ldquo;Data
                  protection complaint&rdquo; in the subject line, or write to Data Protection
                  Complaints, {company.legalName}, {company.addressLine}. If you would rather not use
                  email or post, say so through the <Link href="/contact">contact page</Link> and we
                  will agree another route with you.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  We will acknowledge your complaint within 30 days of receiving it, look into it,
                  keep you posted on progress, and tell you the outcome. That is what section 164A of
                  the Data Protection Act 2018 requires of us, and we would do it anyway.
                </p>
              </>
            ),
          },
          {
            heading: 'If you want to complain to the regulator',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                You also have the right to complain to the Information Commissioner under section 165
                of the Data Protection Act 2018, at any time, at ico.org.uk, by telephone on 0303 123
                1113, or at Information Commissioner&rsquo;s Office, Wycliffe House, Water Lane,
                Wilmslow, Cheshire SK9 5AF. Complaining to us first is usually faster, and it does not
                affect your right to go to the Commissioner.
              </p>
            ),
          },
          /*
           * The "ICO registration" section was REMOVED on 2026-09-07 rather than
           * filled. Two reasons, in order of weight:
           *
           * 1. No provision requires a controller to publish its ICO registration
           *    number on its website. Paying the data protection fee under the
           *    Data Protection (Charges and Information) Regulations 2018 is a
           *    statutory obligation; advertising the number is not.
           *
           * 2. The number recorded internally for this company, ZB259622, DOES
           *    NOT RESOLVE on the ICO register of fee payers as at 2026-09-07.
           *    That negative is admissible: the register's reference search was
           *    first proved working against a known-good reference (ZC007349,
           *    which returned its entry), and only then did ZB259622 return no
           *    entry. Publishing a registration number that a reader cannot
           *    verify would be worse than publishing none, and is exactly the
           *    "verify link that does not resolve" defect flagged elsewhere on
           *    this site.
           *
           * The underlying registration question is a live matter for the
           * founder and is recorded outside this file. Nothing is asserted here
           * either way.
           */
        ]}
      />
    </>
  );
}
