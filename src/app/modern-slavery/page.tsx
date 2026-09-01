import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { company } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Modern slavery statement',
  description:
    'Pixelette Technologies’ voluntary statement on modern slavery and human trafficking in its business and supply chain.',
  path: '/modern-slavery',
});

/*
 * Reframed as a VOLUNTARY statement by founder decision, 2026-09-01.
 *
 * Basis, verified against primary sources that day: section 54 of the Modern
 * Slavery Act 2015 applies at £36m+ annual turnover (gov.uk guidance), and
 * Pixelette Technologies Ltd files total-exemption-full accounts — the
 * small-companies regime (Companies House, 11716825). A statutory statement is
 * therefore not required; this page is published because procurement teams ask.
 *
 * The rule for this page: commitments may be stated, existing processes may
 * not be invented. The statutory-machinery sections (board approval,
 * signatory, financial year) belong to s.54 statements and were removed with
 * the reframe rather than left as unfillable placeholders.
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
        title="Modern slavery and human trafficking."
        intro="A voluntary statement of our position on modern slavery in our business and our supply chain."
        lastReviewed="1 September 2026"
        sections={[
          {
            heading: 'Why this statement is voluntary',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Section 54 of the Modern Slavery Act 2015 requires an annual statement from
                commercial organisations with a turnover of £36 million or more.{' '}
                {company.legalName} is below that threshold, so no statutory statement is required
                of us. We publish this one anyway, because the buyers we work with ask their
                suppliers where they stand, and we would rather answer in public than on request.
              </p>
            ),
          },
          {
            heading: 'Our business and supply chain',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We are a UK software engineering firm delivering web, mobile, custom software,
                blockchain and AI engineering work. Our supply chain consists principally of cloud
                infrastructure providers, software licences and professional services, alongside our
                own employed and contracted engineering staff. It contains no manufacturing, no raw
                materials and no labour supply chains of the kinds where modern slavery risk
                concentrates — which lowers our exposure, and does not remove our responsibility.
              </p>
            ),
          },
          {
            heading: 'What we commit to',
            body: (
              <ul className="body" style={{ marginTop: 12, paddingLeft: 20 }}>
                <li>
                  We do not use forced, bonded or involuntary labour, and we do not work with
                  anyone we believe does.
                </li>
                <li>
                  Everyone who works on our engagements — employed or contracted — is engaged
                  lawfully, paid what was agreed, and free to leave.
                </li>
                <li>
                  We expect the suppliers we buy from to comply with the Modern Slavery Act 2015,
                  and our principal suppliers are large technology vendors who publish their own
                  statements under it.
                </li>
                <li>
                  Anyone with a concern about modern slavery in our business or supply chain can
                  raise it through our published contact routes, and it will reach a director.
                </li>
              </ul>
            ),
          },
          {
            heading: 'Review',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We review this statement annually. If the business grows past the statutory
                threshold, we will publish a full statement under section 54, with board approval
                and a named signatory, as the Act requires.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
