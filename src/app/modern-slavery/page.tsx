import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company, contactEmail } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Modern slavery statement',
  description:
    'Pixelette Technologies’ voluntary statement on modern slavery and human trafficking in its business and supply chain.',
  path: '/modern-slavery',
});

/*
 * Modern slavery statement — amendment history.
 *
 * 2026-09-01  Reframed as a VOLUNTARY statement by founder decision.
 *
 * 2026-09-14  REVIEWED AND REWRITTEN BY THE FOUNDER. The statement below is his
 *             wording, published as written. `lastReviewed` moved to
 *             14 September 2026 because he READ the statement that day — the
 *             date tracks his review, not this edit. An unread review date was
 *             the blocker on this page; his review cleared it. Do not advance
 *             that date again for a code change: it means someone read it.
 *
 * What he changed, substantively:
 *   - Headings. "Why this statement is voluntary" became "Why this is
 *     voluntary"; "Our business and supply chain" became "Where our risk sits".
 *   - Intro and body shortened throughout. The voluntary basis, the
 *     £36 million threshold and the "buyers ask" reason are unchanged in
 *     substance.
 *
 * TWO ADDITIONS ARE STRONGER UNDERTAKINGS than the previous text, made
 * deliberately and in public. A future reader should not mistake either for
 * incidental tidying, and neither should be weakened without the founder:
 *
 *   1. WHERE THE WORK IS DONE. The statement now discloses that engineering and
 *      support work is done by our own employed and contracted staff "in the UK
 *      and overseas". No previous version said where. The earlier text claimed
 *      the business contains "no labour supply chains of the kinds where modern
 *      slavery risk concentrates" — too wide a denial for a business that
 *      engages overseas staff. Disclosure replaced denial. If the About page is
 *      ever reconciled with this, the two should agree.
 *
 *   2. SPECIFIC LABOUR COMMITMENTS. The statement now commits, by name, that we
 *      do not require or retain anyone's identity documents; that we never use
 *      withheld pay, debt or immigration status to keep someone working; and
 *      that we do not retaliate against anyone who raises a concern. These are
 *      undertakings about our conduct, not descriptions of an audited process,
 *      and they bind us publicly.
 *
 * The rule for this page: commitments may be stated, existing processes may not
 * be invented. Two lines were corrected against that rule before his review,
 * and his text keeps both corrections:
 *
 *   - "is paid what was agreed" became "is paid under it". The first asserts a
 *     settled outcome about every past engagement. There are live disputes in
 *     the legal estate about sums said to be due to people who worked on
 *     engagements, and an anticipated counterclaim for unpaid dues, notice and
 *     gratuity. A commitment to pay under the agreement is true, and is what a
 *     buyer is actually asking.
 *
 *   - "We hold no one's identity documents" became "We do not require or retain
 *     anyone's identity documents". The first is an audited fact about an
 *     eight-year operation, and nobody has audited it. The second is a policy
 *     this company controls.
 *
 * Basis for the voluntary framing, as recorded by the lane that prepared this
 * page. NOT re-verified during publication (no network access in that lane) and
 * not corroborated anywhere else in this repo — treat it as that lane's
 * record, not as independently proven here:
 *   - S.I. 2015/1833 reg. 2: the total turnover prescribed for the purposes of
 *     section 54(2)(b) of the 2015 Act is £36 million.
 *   - Companies House 11716825: last accounts made up to 31 December 2024,
 *     filed under the small-companies regime; accounts for YE 2025 due
 *     30 September 2026.
 *   - Companies House officers, 11716825: ONE current officer, a single
 *     director. That is what "our director" refers to and why it is singular.
 *   - SIC codes 62012, 62030, 63110, 63120 — all software and IT, which is
 *     what supports "no manufacturing, no raw materials".
 *
 * NOT verified, and the statement is written so it does not depend on it: no
 * turnover figure exists anywhere in the estate. The £36m position rests on the
 * accounts filing CATEGORY, not on a number anyone has read. Re-check it when
 * the YE 2025 accounts are filed (State/DEADLINES carries the row).
 *
 * The company name and the contact address render from `company.legalName` and
 * `contactEmail` so they cannot drift from the canonical record. Both were
 * checked on 2026-09-14 against the founder's literals and match exactly:
 * "Pixelette Technologies Ltd" and sales@pixelettetech.com.
 *
 * ACTION OWED BEFORE THE STATEMENT IS TRUE — SATISFIED 2026-09-14, and this
 * entry is corrected rather than deleted so the sequence stays legible.
 *
 * It read: "'it goes to our director' requires the sales@ inbox to actually
 * reach the director. It is a mail rule, not a process, but until it is set up
 * the line is unevidenced. Reported at publication; his text stands as
 * written." That was correct when written. The founder confirmed on
 * 2026-09-14 that the forward is live, and the route is:
 *
 *   sales@pixelettetech.com -> SiteGround (filtering and mailbox)
 *     -> forwarded to rana@pixelette.tech (Google Workspace)
 *
 * The recipient is the company's sole current officer on Companies House
 * 11716825, which is what makes "our director" both singular and accurate. The
 * sentence is now evidenced, on the founder's confirmation of his own mail
 * configuration rather than on a routing test run from here.
 *
 * TWO CONSEQUENCES FOR OTHER PAGES, recorded here because they were found
 * through this line and belong to whoever closes those gaps:
 *
 *  1. That forward puts every enquiry in three places, not one — the database
 *     row, the SiteGround mailbox and the Google Workspace copy. A retention
 *     statement that promises deletion after a period is false unless it says
 *     which of the three it governs. /security-and-data's retention entry is
 *     still a placeholder; it must be written by data class for that reason.
 *  2. SiteGround and Google LLC are both subprocessors for enquiry data and
 *     belong in the subprocessor register, which is also still a placeholder.
 *     The register drafted elsewhere named only Vercel, Supabase and Resend.
 *
 * OPEN QUESTION PUT TO THE FOUNDER AT PUBLICATION, deliberately NOT actioned —
 * his wording is published as written: "We do not require or retain anyone's
 * identity documents" is plainly intended as the anti-confiscation commitment,
 * which is the recognised forced-labour indicator. Read literally it is wider
 * than that, because a UK employer running statutory right-to-work checks does
 * examine identity documents and retain copies in order to hold the statutory
 * excuse. The narrower reading — we do not retain originals, and never hold
 * documents to control someone — is what is meant. This was NOT verified at
 * primary source in the publishing lane; put it to counsel at the next annual
 * review rather than editing a reviewed legal statement in passing.
 *
 * The statutory-machinery sections (board approval, a named signatory, the
 * financial year) belong to s.54 statements and stay out until the threshold is
 * crossed. His text is deliberate that a named signatory comes only then.
 */

export default function ModernSlaveryPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Modern slavery', path: '/modern-slavery' },
        ])}
      />
      <LegalPage
        eyebrow="Modern slavery"
        title="Modern slavery and human trafficking"
        intro="Our position on modern slavery in our business and supply chain."
        lastReviewed="14 September 2026"
        sections={[
          {
            heading: 'Why this is voluntary',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Section 54 of the Modern Slavery Act 2015 applies at £36 million turnover.{' '}
                {company.legalName} is below it, so no statutory statement is required of us. We
                publish one because buyers ask, and we would rather answer in public than on
                request.
              </p>
            ),
          },
          {
            heading: 'Where our risk sits',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We are a UK software engineering firm. What we buy in is cloud infrastructure,
                software licences and professional services — no manufacturing, no raw materials.
                Our exposure is in people, not goods: engineering and support work is done by our
                own employed and contracted staff, in the UK and overseas.
              </p>
            ),
          },
          {
            heading: 'What we commit to',
            body: (
              <ul className="body" style={{ marginTop: 12, paddingLeft: 20 }}>
                <li>
                  No forced, bonded or involuntary labour, and we do not knowingly work with anyone
                  who uses it.
                </li>
                <li>
                  Everyone on our engagements, employed or contracted, works under a lawful
                  agreement, is paid under it, and is free to end it on its terms. We do not require
                  or retain anyone’s identity documents, and we never use withheld pay, debt or
                  immigration status to keep someone working.
                </li>
                <li>
                  We expect our suppliers to comply with the Act. Our principal suppliers are large
                  technology vendors who publish their own statements under it.
                </li>
                <li>
                  Raise a concern at <a href={`mailto:${contactEmail}`}>{contactEmail}</a>. It goes
                  to our director, who is accountable for this statement, and we do not retaliate.
                </li>
              </ul>
            ),
          },
          {
            heading: 'Review',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Reviewed annually. If we pass the threshold, we will publish a full section 54
                statement with board approval and a named signatory.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
