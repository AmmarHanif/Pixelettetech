import { LegalPage } from '@/components/LegalPage';
import { JsonLd } from '@/components/ui';
import { contactEmail } from '@/content/company';
import { breadcrumbSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Accessibility',
  description:
    'How this website is built for accessibility, what we have tested, what we know is not perfect, and how to tell us when something does not work.',
  path: '/accessibility',
});

/*
 * Added 2026-09-07.
 *
 * NOT legally mandatory, and the page says so rather than implying otherwise.
 * The Public Sector Bodies (Websites and Mobile Applications) Accessibility
 * Regulations 2018 bind public sector bodies; Pixelette Technologies is not one.
 *
 * What DOES apply is the Equality Act 2010: section 29 (services to the public)
 * with section 20 (the anticipatory duty to make reasonable adjustments). That
 * duty is anticipatory, meaning it does not wait for a disabled person to be
 * turned away first.
 *
 * The commercial reason is just as real: the site pursues AI DPS RM6200, and
 * public sector buyers ask for WCAG 2.2 AA as routine. Pixelette Holdings already
 * publishes an /accessibility page, so the group was inconsistent with itself.
 *
 * DRAFTING RULE FOR THIS PAGE, and it is the important one: commitments may be
 * stated, completed audits may NOT be invented. No conformance claim appears
 * below, because no audit has been run and evidenced. A false WCAG conformance
 * statement is itself a misleading claim under DMCCA 2024 s.226, so an honest
 * "not yet formally audited" is both truthful AND safer than the confident
 * wording most firms publish here.
 */

export default function AccessibilityPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Accessibility', path: '/accessibility' },
        ])}
      />
      <LegalPage
        eyebrow="Accessibility"
        title="Who can use this site, and what to do when it fails you"
        intro="We would rather tell you what we have actually checked than publish a conformance badge we have not earned."
        lastReviewed="7 September 2026"
        sections={[
          {
            heading: 'What we aim for',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                We build this site to meet the Web Content Accessibility Guidelines 2.2 at level AA.
                That is the standard UK public sector buyers ask for, and it is the one we hold our
                own client work to, so it would be strange to hold this site to less.
              </p>
            ),
          },
          {
            heading: 'What we have actually done',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  The site is built as plain semantic HTML with headings in order, landmarks on every
                  region, text alternatives on images, and visible focus on everything you can reach
                  by keyboard. It carries no third-party script, no advertising, no pop-up and no
                  cookie banner, which removes most of what usually breaks a page for screen reader
                  and keyboard users. Typefaces are self-hosted and text resizes with your browser
                  settings.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  We have not yet commissioned an independent accessibility audit of this site, so we
                  are not claiming formal WCAG 2.2 AA conformance. When that audit is done we will
                  publish what it found here, including anything it found against us.
                </p>
              </>
            ),
          },
          {
            heading: 'Telling us when something does not work',
            body: (
              <>
                <p className="body" style={{ marginTop: 12 }}>
                  If any part of this site stops you doing what you came to do, email{' '}
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a> and tell us the page and what
                  happened. You do not need to know the technical reason or name a guideline.
                </p>
                <p className="body" style={{ marginTop: 12 }}>
                  We will reply within one working day, and if the fix is not quick we will tell you
                  what we are doing and give you the information another way in the meantime. If you
                  need anything on this site in a different format, ask and we will provide it.
                </p>
              </>
            ),
          },
          {
            heading: 'Reasonable adjustments',
            body: (
              <p className="body" style={{ marginTop: 12 }}>
                Under the Equality Act 2010 we have a duty to make reasonable adjustments for disabled
                people using our services, and that duty is anticipatory: it does not wait until
                someone has been turned away. This page, and the route above, are part of how we meet
                it. If you would rather deal with us by telephone or in writing than through this
                website at any point in an engagement, that is fine and it changes nothing about how
                we work with you.
              </p>
            ),
          },
        ]}
      />
    </>
  );
}
