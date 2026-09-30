import { ClosingCta } from '@/components/sections';
import { SupportLifecycle } from '@/components/SupportLifecycle';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Support & Continuous Improvement.
 *
 * REBUILT 2026-09-30. The page read as a catalogue of maintenance activities -
 * cards, then more cards, then AI cards, then a four-service grid, then a long
 * FAQ - which made a commercially important service feel passive and generic.
 * It is now organised around one proposition: a product does not stop changing
 * when it goes live.
 *
 * EVERY SECTION ANSWERS A DIFFERENT QUESTION, which is the constraint that
 * stops the rebuild restating itself three times:
 *
 *   the lifecycle visual .... what the cycle IS
 *   what changes after launch ... WHY it is necessary
 *   what we take responsibility for ... WHAT we actually do
 *   built by us or already live ... HOW a customer enters
 *   how support is scoped ... what the RELATIONSHIP has to define
 *
 * REMOVED: the six-card "What support covers" grid, the four-card AI section,
 * and "Run is one of our four services" with its four-card cross-sell.
 *
 * NO SLA, UPTIME, RESPONSE TIME, COVERAGE HOUR OR CUSTOMER RESULT IS STATED
 * ANYWHERE, including inside the visual. The approved reference carries
 * illustrative dashboard figures - 99.99% uptime, 24,593 users, 1.2M
 * transactions, 120ms - and those are placeholders in a mock. Publishing them
 * would put an availability commitment and a response-time promise on a page
 * that offers neither. See SupportLifecycle.tsx.
 */

export const metadata = pageMetadata({
  title: 'Support & Continuous Improvement',
  description:
    'Monitoring, maintenance and continuous improvement for live software products, whether we built them or inherited them from another team.',
  path: '/support-continuous-improvement',
});

/** §8. Why a live product keeps changing. Five steps, one rail, light. */
const AFTER_LAUNCH = [
  { t: 'Real users', b: 'New usage patterns and unexpected behaviour appear.' },
  { t: 'Change', b: 'Dependencies, APIs and operating environments move.' },
  { t: 'Load', b: 'Usage and data grow over time.' },
  { t: 'New opportunities', b: 'Ideas, requirements and improvements emerge.' },
  { t: 'A better product', b: 'Improvement keeps it relevant rather than legacy.' },
];

/** §7. Three responsibilities, replacing a six-card grid of activities. */
const RESPONSIBILITIES = [
  {
    t: 'Keep it running',
    items: ['Monitoring', 'Incident response', 'Bug fixing', 'Dependency maintenance', 'Security maintenance', 'Recovery where in scope'],
  },
  {
    t: 'Keep it healthy',
    items: ['Performance', 'Reliability', 'Observability', 'Technical debt', 'Release and change management', 'Operational resilience'],
  },
  {
    t: 'Keep it improving',
    items: ['Small enhancements', 'UX improvements', 'Automation', 'Modernisation', 'Product iteration', 'Technical improvements'],
  },
];

/** §10. What the arrangement has to define. No pricing, no managed-services jargon. */
const SCOPE = [
  { t: 'Coverage', b: 'Which systems, environments and responsibilities are in scope.' },
  { t: 'Response', b: 'How incidents, defects and urgent production issues are handled.' },
  { t: 'Improvement', b: 'How planned engineering work enters the service.' },
  { t: 'Review', b: 'How priorities, performance and future work are reviewed.' },
];

/** §9. What we establish before taking responsibility for someone else's system. */
const INHERIT = [
  'Architecture',
  'Codebase',
  'Infrastructure',
  'Dependencies',
  'Deployment',
  'Monitoring',
  'Known issues',
];

/**
 * §13. Four questions, and each answers something the page above does not.
 *
 * NOTHING HERE STATES A RESPONSE TIME OR A COVERAGE WINDOW. "How do you handle
 * urgent production issues" is the question a reader most wants a number
 * against, and the honest answer is that the number is agreed per engagement -
 * inventing one here would be the exact claim the brief forbids.
 */
const faqs = [
  {
    q: 'Can you support software you did not build?',
    a: 'Yes. We start by establishing what we would be taking on - architecture, codebase, infrastructure, dependencies, deployment, monitoring and known issues - and support begins once that is understood. We do not take open-ended responsibility for a system nobody has looked at yet.',
  },
  {
    q: 'What does ongoing support include?',
    a: 'Keeping the product running, keeping it healthy and keeping it improving: monitoring and incident response, maintenance and security updates, performance and reliability work, and the planned engineering that adds to the product. The balance between those is agreed rather than fixed.',
  },
  {
    q: 'How do you handle urgent production issues?',
    a: 'Through an agreed route into the team, with severity, risk and impact deciding what is worked on first. Response expectations, coverage and escalation are set per engagement against the product and the responsibility you need us to hold, rather than sold as a standard tier.',
  },
  {
    q: 'Can support include continuous product improvement?',
    a: 'Yes, and for most products that is the larger part of it. Enhancements, usability work, automation and modernisation enter the same cycle as fixes, prioritised on severity, risk and value rather than on whether something is technically broken.',
  },
];

export default function SupportPage() {
  return (
    <div>
      <JsonLd
        data={serviceSchema({
          name: 'Support & Continuous Improvement',
          description:
            'Monitoring, maintenance, performance and continuous improvement for live software products.',
          path: '/support-continuous-improvement',
          serviceType: 'Application support and continuous improvement',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Support & Continuous Improvement', path: '/support-continuous-improvement' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 56px' }}>
        <div className="wrap">
          {/* Run is the lifecycle stage; Support & Continuous Improvement is the
              service inside it. The two are not interchangeable. */}
          <Eyebrow>Run · Support &amp; Continuous Improvement</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '18ch' }}>
            Keep your product performing
          </h1>
          <p className="lead" style={{ marginTop: 24, maxWidth: '60ch' }}>
            Software changes after launch because the world around it changes. We monitor, maintain
            and improve live products so they remain reliable, secure, performant and useful as
            users, systems and priorities evolve.
          </p>
          <p className="body" style={{ marginTop: 14 }}>
            Built by Pixelette or inherited from another team.
          </p>
          <div className="btn-row" style={{ marginTop: 32 }}>
            <Cta href="/contact">Discuss ongoing support</Cta>
            <Cta href="/contact" variant="secondary">
              Bring us an existing product
            </Cta>
          </div>

          {/* The principal visual explanation of the service. Recreated in HTML,
              CSS and one SVG rather than embedded as the reference render, so
              every stage name is real text. */}
          <div style={{ marginTop: 56 }}>
            <SupportLifecycle />
          </div>
        </div>
      </div>

      {/* ------------------------------------------ why support is necessary */}
      <Section labelledBy="sp-after-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="After launch"
          id="sp-after-heading"
          title="What changes after launch?"
          lead="A product in production meets real users, moving environments and new opportunities. Support is how it stays a product rather than becoming a legacy system."
        />
        <ol className="sp-flow">
          {AFTER_LAUNCH.map(s => (
            <li key={s.t}>
              <i aria-hidden />
              <b>{s.t}</b>
              <span>{s.b}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------ what we actually do */}
      <Section labelledBy="sp-resp-heading">
        <SectionHead
          eyebrow="Responsibility"
          id="sp-resp-heading"
          title="What we take responsibility for"
        />
        <div className="sp-cols">
          {RESPONSIBILITIES.map(r => (
            <div className="sp-col" key={r.t}>
              <h3 className="h4">{r.t}</h3>
              <ul>
                {r.items.map(i => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/*
          §15 is explicit that if the hero visual already carries the cycle, it
          must not be drawn a second time. So the operating rhythm is one
          sentence here rather than a repeat of the six stages above it.
        */}
        <p className="body" style={{ marginTop: 40, maxWidth: '70ch' }}>
          That work runs on the cycle at the top of this page rather than on a ticket queue:
          observe, prioritise, improve, release, verify, and feed what was learned into the next
          round.
        </p>
      </Section>

      {/* --------------------------------------------- how a customer enters */}
      <Section labelledBy="sp-fork-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Two ways in"
          id="sp-fork-heading"
          title="Built by Pixelette, or already live"
        />
        <div className="sp-fork">
          <div className="sp-fork__route">
            <h3 className="h4">Built by Pixelette</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              We already understand the architecture, delivery history and decisions behind the
              product, so development transitions naturally into ongoing support and improvement.
            </p>
          </div>
          <div className="sp-fork__route">
            <h3 className="h4">Already live</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              We can take responsibility for an existing product after first understanding what we
              are inheriting.
            </p>
            <ul className="sp-seq">
              {INHERIT.map(i => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            {/* The boundary that matters commercially: responsibility starts
                after the assessment, not at signature. */}
            <p className="body" style={{ marginTop: 16, fontSize: 15 }}>
              Support begins once we understand what we are taking responsibility for.
            </p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------ what it has to define */}
      <Section labelledBy="sp-scope-heading">
        <SectionHead
          eyebrow="Scoping"
          id="sp-scope-heading"
          title="How support is scoped"
          lead="Support is scoped around the product and the level of responsibility you need us to take."
        />
        <div className="sp-scope">
          {SCOPE.map(s => (
            <div key={s.t}>
              <b>{s.t}</b>
              <span>{s.b}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------ the AI callout */}
      {/* WAS A FOUR-CARD SECTION. Reduced to a specialist note with one link:
          the detail belongs on the AI page, and reproducing it here is the
          duplication this rebuild removes. */}
      <Section labelledBy="sp-ai-heading" tight style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="AI operations"
          id="sp-ai-heading"
          title="AI changes after release too"
          level={3}
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '72ch' }}>
          AI-enabled systems can require additional monitoring, because model behaviour, data and
          operating conditions can change after release. Evaluation, drift and data change are
          watched alongside the rest of the product.{' '}
          <FLink href="/ai-automation/evaluation-and-observability">
            AI evaluation &amp; observability
          </FLink>
        </p>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Keep your product performing" ctaLabel="Discuss ongoing support">
        Whether we built it or you already have it, start with the product, its current condition
        and the level of responsibility you need us to take.
      </ClosingCta>
    </div>
  );
}
