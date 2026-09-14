import Link from 'next/link';

import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Terms',
  description: 'Terms governing use of the Pixelette Technologies website.',
  path: '/terms',
});

/*
 * Liability and governing law completed 2026-09-07 on the founder's express
 * instruction ("ten out of ten legal protection on the whole website"), which
 * lifts the C6 restriction on an agent publishing this class of wording.
 *
 * Drafting notes, so the reasoning survives without the conversation:
 *
 *  - The heads of loss are NAMED, and the reasoning behind that was CORRECTED
 *    2026-09-07 after the authorities were actually opened.
 *
 *    The earlier note here said English law construes "consequential loss"
 *    narrowly, as the second limb of Hadley v Baxendale only, and cited Star
 *    Polaris for it. That is NOT what Star Polaris holds. Read at source
 *    (bailii.org, [2016] EWHC 2941 (Comm), 17 November 2016), the court held
 *    that "consequential" was used in that contract "in its cause-and-effect
 *    sense, as meaning following as a result or consequence" — a WIDER reading
 *    than the second-limb orthodoxy, not a narrower one. The case was cited here
 *    for close to the opposite of its actual effect.
 *
 *    The corrected proposition is better for us, not worse. The conventional
 *    line (Croudace Construction v Cawoods (1978) 8 BLR 20) reads the phrase
 *    narrowly; Star Polaris shows a court will construe it on the contract's own
 *    wording and may give it a much wider meaning. So the meaning of
 *    "consequential loss" is CONTESTED AND CONTEXT-DEPENDENT, which is a
 *    stronger reason to name the heads of loss expressly than the tidy version
 *    was. A clause resting on the word alone is a clause whose scope is decided
 *    later by someone else.
 *
 *    "Incidental" is dropped; it is not an English term of art.
 *
 *    Source status of the authorities in this file, per OS Section 7 and C75:
 *      Star Polaris v HHIC-Phil [2016] EWHC 2941 (Comm)  — VERIFIED at bailii.org
 *      HIH Casualty v Chase Manhattan [2003] UKHL 6      — VERIFIED at bailii.org
 *      Croudace Construction v Cawoods (1978) 8 BLR 20   — NOT VERIFIED, reported
 *                                                          in BLR, not on BAILII
 *      Hadley v Baxendale (1854) 9 Exch 341              — NOT VERIFIED at source
 *
 *  - The unexcludable liabilities are named rather than gestured at. CITATION
 *    CORRECTED 2026-09-07 after verification at source: the route depends on WHO
 *    is reading.
 *
 *      Business reader:  UCTA 1977 s.2(1). A person cannot exclude or restrict
 *                        liability for death or personal injury resulting from
 *                        negligence.
 *      Consumer reader:  CRA 2015 s.65(1). A trader cannot, by a term of a
 *                        consumer contract OR BY A CONSUMER NOTICE, exclude or
 *                        restrict that liability.
 *
 *    UCTA s.2(4), inserted by CRA 2015 Sch. 4 para. 4 (in force 1.10.2015 /
 *    1.10.2016), expressly DISAPPLIES s.2 to a consumer contract or consumer
 *    notice and redirects to CRA ss.62 and 65. A terms-of-use page shown to a
 *    visitor who is not buying anything is very likely a "consumer notice", so
 *    for much of this site's audience s.65 is the operative provision and UCTA
 *    s.2(1) is NOT. The earlier version of this comment cited only UCTA s.2(1)
 *    and was therefore incomplete for consumers.
 *
 *    The published wording below is unaffected and was correct either way: it
 *    says the liability is not excluded, which satisfies both routes. Only this
 *    reasoning note was wrong, and it is corrected because an auditable comment
 *    that misstates the provision is worse than no comment.
 *
 *  - Consumers and businesses are separated. A public website is read by both.
 *    Consumer terms face the fairness test in CRA 2015 s.62 (verified at source:
 *    an unfair term is not binding, s.62(1)); business standard terms face UCTA
 *    s.3 and the reasonableness test in s.11.
 *
 *    Note for any future engagement wording, NOT engaged by this page: CRA 2015
 *    s.57(1) makes a term excluding liability under s.49, service performed with
 *    reasonable care and skill, not binding on a consumer. This page routes
 *    engagement liability to the contract for the work, so s.57 does not bite
 *    here, but it will bite on anything that does set engagement terms.
 *
 *  - The jurisdiction clause carries a consumer carve-out. An exclusive
 *    jurisdiction clause imposed on a consumer invites the Schedule 2 grey list.
 *
 *  - "The law of England and Wales", never "the laws of the United Kingdom".
 *    The UK has three legal systems and is not itself a governing law.
 *
 * The case law above was asserted from knowledge, not opened at source in the
 * session that wrote this. The propositions are settled and uncontroversial, but
 * they are not Tier-1 verified here and should not be presented as if they were.
 */

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Terms', path: '/terms' },
        ])}
      />
      <LegalPage
        eyebrow="Terms"
        title="Terms of use for this website"
        intro="These terms cover the website only. Engagement terms are set out in the contract for the work and are not varied by anything on this page."
        lastReviewed="7 September 2026"
        sections={[
          {
            heading: 'Who these terms are with',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                This website is operated by {company.legalName}, registered in England and Wales at
                Companies House under company number {company.crn}, with its registered office at{' '}
                {company.addressLine}. Our VAT registration number is {company.vat}. You can reach us
                at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. By using this site you
                accept these terms.
              </p>
            ),
          },
          {
            heading: 'The status of what is published here',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  This website is published for general information. It is not advice, it is not an
                  offer capable of acceptance, and nothing on it forms part of any contract between
                  us. Where we are engaged to do work for you, what we owe you is set out in the
                  contract for that work, and nothing on this page varies it.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Prices shown on this site, including the AI Value Baseline band and the Support
                  &amp; Run tiers, are indicative published ranges. The price for a specific
                  engagement is the one in your proposal.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Statistics attributed to third-party research are reproduced with their source
                  named. Those sources are not ours. We cite them so that you can check them, and we
                  do not adopt or warrant their findings.
                </p>
              </>
            ),
          },
          {
            heading: 'Intellectual property',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Content on this site is owned by {company.legalName} or used with permission, and is
                  protected by copyright and other intellectual property rights. Client names and
                  logos appear with the client&rsquo;s permission and remain the property of their
                  respective owners.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  You may read, print and share pages for your own business purposes. You may not
                  republish, sell, systematically copy or otherwise exploit our content commercially
                  without our written permission, and you may not remove any attribution from it.
                </p>
              </>
            ),
          },
          {
            heading: 'Using this site properly',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Please do not misuse this site: no attempting to gain unauthorised access to it or to
                any system behind it, no introducing malicious code, no automated scraping or bulk
                extraction of content, no interfering with its availability, and no use of it for any
                unlawful purpose. We may withdraw access where any of that happens.
              </p>
            ),
          },
          {
            heading: 'Limitation of liability',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  Nothing in these terms limits or excludes our liability for death or personal injury
                  caused by our negligence, for fraud or fraudulent misrepresentation, or for anything
                  else that cannot lawfully be limited or excluded. If you are a consumer, nothing
                  here affects your statutory rights.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  Subject to that, we do not accept liability for loss or damage arising from your use
                  of, or reliance on, this website, and in particular for loss of profit, revenue,
                  business, contracts or anticipated savings; loss of goodwill or reputation; loss or
                  corruption of data; wasted expenditure; or any indirect or consequential loss,
                  however caused.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  If you are a business, we exclude all warranties, conditions and other terms implied
                  by statute or common law to the fullest extent the law allows.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  We do not warrant that this site will be available uninterrupted or free from error,
                  and we may change or withdraw any part of it at any time. Where we link to another
                  organisation&rsquo;s website we do not control it and we are not responsible for
                  what it says or does.
                </p>
              </>
            ),
          },
          {
            heading: 'Governing law and jurisdiction',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  These terms, and any dispute or claim arising out of or in connection with them or
                  with your use of this website, including any non-contractual dispute or claim, are
                  governed by the law of England and Wales.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  The courts of England and Wales have exclusive jurisdiction over any such dispute or
                  claim. If you are a consumer living in Scotland or Northern Ireland, you may also
                  bring proceedings in the courts of the part of the United Kingdom where you live,
                  and nothing in these terms takes away the protection the law of that part gives you.
                </p>
              </>
            ),
          },
          {
            heading: 'Privacy and changes to these terms',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                How we handle personal data collected through this site is set out in our{' '}
                <Link href="/privacy">privacy notice</Link>. We may update these terms from time to
                time, and the version on this page is the one that applies to your use of the site.
                The date at the top is the date it was last reviewed.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
