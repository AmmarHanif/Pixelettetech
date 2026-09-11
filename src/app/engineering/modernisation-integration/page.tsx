import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { SOURCES } from '@/content/sources';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Modernisation & Integration',
  description:
    'Architecture and code review, incremental legacy replacement, API and integration layers, data migration and independent assessment of stalled builds.',
  path: '/engineering/modernisation-integration',
});

const capabilities = [
  {
    title: 'Independent technical assessment',
    body: 'A written view of what you have: architecture, code health, security posture, dependency age, delivery risk and what it would cost to continue. Bought on its own, before anyone commits to a direction.',
  },
  {
    title: 'Architecture and code review',
    body: 'Where the system is actually failing, as distinct from where it is merely unfashionable. Those are different lists and only one of them is worth funding.',
  },
  {
    title: 'Incremental replacement',
    body: 'Route by route and capability by capability, with the old system live throughout. Slower on paper than a rewrite, and considerably more likely to arrive.',
  },
  {
    title: 'API and integration layers',
    body: 'A deliberate seam between the systems you keep and the ones you replace, so the next change does not require the same excavation.',
  },
  {
    title: 'Data migration',
    body: 'Mapping, cleansing, reconciliation and the cutover plan, including how you prove afterwards that nothing was lost.',
  },
  {
    title: 'Cloud migration and re-platforming',
    body: 'Moving the estate without treating the move as a rewrite, then addressing the parts that genuinely need rebuilding once it is stable.',
  },
];

const truths = [
  {
    title: 'The rewrite is the risky option',
    body: 'A full rewrite spends its first year rebuilding functionality you already have, against a moving target, with no route back.',
  },
  {
    title: 'Legacy is where AI helps least',
    body: 'Published evidence puts coding-assistant gains far lower on complex existing code than on greenfield work, which is precisely why this stays careful human engineering.',
  },
  {
    title: 'The seams carry the risk',
    body: 'Most modernisation failures happen at the boundary between old and new, not inside either one.',
  },
  {
    title: 'Reversibility is the feature',
    body: 'Every step should be one you can stop at without leaving the business half-migrated.',
  },
];

const faqs = [
  {
    q: 'Can you take over an existing or stalled build?',
    a: 'Yes. The usual starting point is an independent technical assessment covering architecture, code health, security posture and delivery risk, together with a recovery plan and a cost of continuing, before anyone commits to further development.',
  },
  {
    q: 'Should a legacy system be rewritten or modernised in place?',
    a: 'Modernised in place, in most cases. A full rewrite spends its first year rebuilding functionality that already exists, against a moving target, with no route back. Incremental replacement keeps the current system live while capabilities move across one at a time, and every step is one you can stop at.',
  },
  {
    q: 'Does AI make legacy modernisation cheaper?',
    a: 'Much less than it makes greenfield work cheaper. Published evidence puts coding-assistant gains substantially lower on complex existing code, so a modernisation programme should not be priced as though a tool will absorb the difficulty. We quote on what the estate actually is.',
  },
];

export default function ModernisationIntegrationPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Modernisation & Integration',
          description:
            'Independent technical assessment, architecture and code review, incremental legacy replacement, integration layers, data migration and re-platforming.',
          path: '/engineering/modernisation-integration',
          serviceType: 'Legacy modernisation and systems integration',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          {
            name: 'Modernisation & Integration',
            path: '/engineering/modernisation-integration',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Build · Modernisation &amp; Integration</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Inherited systems, stalled builds and the estate nobody wants to touch.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Architecture, APIs, cloud, data migration and legacy replacement. The work usually starts
            with an independent assessment of what you have, because the most expensive decision in
            modernisation is the one taken before anybody looked properly.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Modernise a system</Cta>
            <Cta href="/engineering" variant="secondary">
              All engineering
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="mod-build-heading">
        <SectionHead
          title="What we do"
          id="mod-build-heading"
          lead="From an assessment you can buy on its own, through to a replacement programme that keeps the business running while it happens."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {capabilities.map(cap => (
            <div className="card" key={cap.title}>
              <h3 className="h4">{cap.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------- straight talk */}
      <Section labelledBy="mod-truth-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Straight talk"
          id="mod-truth-heading"
          title="Four things suppliers rarely volunteer."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {truths.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
        <SourceNote>{SOURCES.doraMetr}</SourceNote>
        <p className="body" style={{ marginTop: 24, maxWidth: '76ch' }}>
          None of that means never rebuild. It means the decision should follow evidence about your
          specific estate, and the evidence should be produced by someone who is willing to lose the
          larger piece of work by telling you the truth.
        </p>
      </Section>

      {/* ------------------------------------------------------- assessment */}
      <Section labelledBy="mod-assess-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Rescue and modernise"
              id="mod-assess-heading"
              title="Assessment before further investment."
            />
            <p className="body" style={{ marginTop: 20 }}>
              Stalled builds, inherited codebases and projects where confidence in the current
              supplier has gone all share a problem: the next decision has to be made without
              trustworthy information. An independent assessment produces that information, and it is
              deliberately available as its own engagement so you are not buying a recovery
              programme in order to find out whether you need one.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              If the finding is that the existing team should continue, that is the finding.
            </p>
          </div>

          <div>
            <Eyebrow>What an assessment covers</Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 14 }}>
              {[
                ['01', 'Architecture and data model', 'What was built, and what it implies about change cost'],
                ['02', 'Code health and test coverage', 'How safely anything can be altered today'],
                ['03', 'Security and dependency posture', 'What is unsupported, exposed or out of date'],
                ['04', 'Delivery and options', 'Recovery, incremental replacement or rebuild, with costs'],
              ].map(([n, t, d]) => (
                <li key={n} className="tile" style={{ padding: '18px 22px' }}>
                  <span className="step__n">{n}</span>
                  <b style={{ fontSize: 15.5 }}>{t}</b>
                  <p className="small" style={{ marginTop: 6 }}>
                    {d}
                  </p>
                </li>
              ))}
            </ol>
            <p style={{ marginTop: 26 }}>
              <FLink href="/method/live">How we deliver</FLink>
            </p>
          </div>
        </div>
      </Section>

      <ClosingCta title="Inherited something difficult?" ctaLabel="Modernise a system">
        Bring us the system and the decision you are trying to make about it. An assessment is a
        small piece of work and it is the one that stops a large one going wrong.
      </ClosingCta>
    </>
  );
}
