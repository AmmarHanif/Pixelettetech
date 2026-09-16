import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  Faqs,
  JsonLd,
  PillRow,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { certified } from '@/content/company';
import { runStats } from '@/content/sources';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

import { OperatingDashboard } from './OperatingDashboard';

export const metadata = pageMetadata({
  title: 'AI Support & Run, from £1,500/mo',
  description:
    'A monthly contract that owns whether your AI is still accurate, safe and affordable. Evaluation, drift detection, cost control and defined severities.',
  path: '/ai-engineering/support-and-run',
});

const commitments = [
  {
    title: 'Continuous evaluation',
    body: 'Every release and a sampled share of live traffic scored against agreed acceptance thresholds, with the judge itself calibrated against human labels.',
  },
  {
    title: 'Drift, including judge drift',
    body: 'Input distribution drift, silent model version changes by your supplier, and movement in the evaluator’s own behaviour. The third is the one most people never watch.',
  },
  {
    title: 'Cost control',
    body: 'Token spend per unit of work, budget alerts, caching and batching, and a recommendation each quarter on whether a cheaper model would hold quality.',
  },
  {
    title: 'Incident response',
    body: 'Defined severities, a named responder, rollback procedure, and a written post-incident note that goes in your audit trail.',
  },
  {
    title: 'Quarterly improvement',
    body: 'One release a quarter aimed at the metric in your baseline, with the change in that metric reported rather than the work delivered.',
  },
];

const tiers = [
  {
    name: 'Watch',
    price: '£1,500',
    unit: '/mo',
    body: 'One production system. Monitoring, evaluation, monthly report, SEV-2 response.',
  },
  {
    name: 'Operate',
    price: '£3,000',
    unit: '/mo',
    body: 'Up to three systems. Adds SEV-1 response, cost optimisation and a quarterly improvement release.',
  },
  {
    name: 'Estate',
    price: null,
    unit: '',
    body: `Four or more systems, or a regulated environment needing named oversight. Audit and certification support is scoped separately with ${certified.name}.`,
  },
];

const faqs = [
  {
    q: 'How much does an AI support and run contract cost?',
    a: 'Watch is £1,500 a month for one production system, covering monitoring, evaluation, a monthly report and SEV-2 response. Operate is £3,000 a month for up to three systems, adding SEV-1 response, cost optimisation and a quarterly improvement release. Estate, for four or more systems or a regulated environment, is priced on application.',
  },
  {
    q: 'What are the response times?',
    a: 'SEV-1 within 1 hour, SEV-2 within 4 hours, SEV-3 by the next working day. Each incident gets a named responder, a rollback procedure and a written post-incident note for your audit trail.',
  },
  {
    q: 'Will Pixelette support an AI system it did not build?',
    a: 'Yes, once a baseline establishes what is being inherited. Running what somebody else wrote is the clearest proof that this is a capability rather than a warranty on our own work.',
  },
  {
    q: 'What is judge drift?',
    a: 'Movement in the behaviour of the model doing the grading, as distinct from drift in the input data or a silent model version change by a supplier. Almost nobody watches it, and it quietly invalidates your quality measurements when it happens.',
  },
];

/**
 * The attribution line under the hero figures, derived rather than indexed.
 *
 * 2026-09-08. This read used to be `runStats[0]!.source`. The three figures it
 * attributed cited "Industry incident survey, 2026" — a source naming no
 * publisher — so they were held in `runStatsRegister` and `runStats` became
 * empty. The non-null assertion told the compiler the element was there, so
 * `tsc --noEmit` stayed green while the page threw at render:
 * "TypeError: Cannot read properties of undefined (reading 'source')". A type
 * assertion over a filtered register is a promise the register cannot keep.
 *
 * Deriving the line removes the index entirely, so there is nothing left to
 * assert about: an empty register yields an empty array and no note. It also
 * fixes a smaller latent fault — if the figures return from two different
 * studies, `[0]` would have attributed all of them to whichever happened to be
 * first, whereas this names every source actually used. With one source it
 * renders exactly the string the old line did.
 */
function heroSources(): string[] {
  return Array.from(new Set(runStats.map(stat => stat.source)));
}

export default function SupportAndRunPage() {
  const sources = heroSources();

  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'AI Support & Run',
          description:
            'A monthly contract covering continuous evaluation, drift detection, inference cost control, incident response against defined severities, and a quarterly improvement release.',
          path: '/ai-engineering/support-and-run',
          price: { low: 1500, currency: 'GBP', unit: 'MON' },
          serviceType: 'Managed AI operations',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
          { name: 'Support & Run', path: '/ai-engineering/support-and-run' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Support & Run</Eyebrow>
          {/*
            REWRITTEN 2026-09-16. The founder could not tell what this page was
            for, and the cause was NOT the order: the dashboard was already the
            first thing after the hero. THE PAGE NEVER NAMED ITS OBJECT. "whether
            IT still works", "what YOU SEE", "THE CONTRACT" all pointed at a
            thing the page never stated, which is a named production system we
            monitor and report on monthly.

            The old h1 "Somebody has to own whether it still works" is not
            deleted; it moves to the commitments section below, where it finally
            has an antecedent. It is the strongest sentence on the page and it
            was spending itself before the reader knew what it referred to.
          */}
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            The monthly report that says whether your AI still works
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            You built it, you bought it, or a platform vendor deployed it. A support and run
            contract puts each named production system under continuous evaluation and sends you one
            report a month: whether output quality has held, what it is costing, and what broke. The
            panel below is that report, in the format you receive it.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            {/*
              WAS "See a sample report" pointing at #dashboard, which is now the
              very next thing on the page and about 200px below this button. With
              /ai-engineering's door carrying that label instead, a reader arrives
              here having just clicked those words, so repeating them to scroll
              one section was noise. This moves them to the next question a
              reader actually has once they have seen the report.
            */}
            <Cta href="#pricing" variant="secondary">
              See what it costs
            </Cta>
          </div>

          {/* The figures and their attribution are one unit: the grid, the
              note and the 48px of space above them all appear together or not
              at all. An empty `.grid.grid-3` is not a neutral no-op — it is a
              48px band of nothing under the CTAs — and the handoff's DEVELOPER
              RULE is that the absence of a claim must not leave a broken
              layout. Today `runStats` is empty and the hero ends on its CTA
              row, which reads as finished because the prose above never
              promises a number. */}
          {runStats.length > 0 ? (
            <>
              <div className="grid grid-3" style={{ marginTop: 48 }}>
                {runStats.map(stat => (
                  <div className="tile" key={stat.value}>
                    <b>{stat.value}</b>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
              {sources.length > 0 ? <SourceNote>{sources.join(' · ')}</SourceNote> : null}
            </>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------- dashboard */}
      {/*
        "every day" was a contradiction, not a style choice: every other
        statement on this page says the report is MONTHLY. And nothing above
        this panel said what a reader was looking at, which is why the founder
        asked what the dashboard was relating to. The lead is that missing
        sentence.
      */}
      <Section labelledBy="dash-heading" id="dashboard" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="The monthly report"
          id="dash-heading"
          title="What the report tells you before you have to ask"
          lead="A mock of our own reporting format, filled with sample data, for one AI system over one month. Pass rate is the share of sampled cases that met the agreed definition of correct. Cost per case is inference spend divided by the work done. The dip is a supplier changing model version without saying so, which is the kind of event this contract exists to catch."
        />
        <div style={{ marginTop: 36 }}>
          <OperatingDashboard />
        </div>
        <p className="small" style={{ marginTop: 16, fontStyle: 'italic' }}>
          Interface mock. Figures are illustrative sample data, not a client system.
        </p>
      </Section>

      {/* ----------------------------------------------------- commitments */}
      <Section labelledBy="commit-heading">
        <SectionHead
          title="Somebody has to own whether it still works"
          id="commit-heading"
          lead="That is what the contract is. No vague retainer: a severity model, response times, and a metric we report against whether it flatters us or not."
        />
        <PillRow
          items={['SEV-1 · 1 hr', 'SEV-2 · 4 hrs', 'SEV-3 · next working day']}
          style={{ marginTop: 26 }}
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {commitments.map(c => (
            <div className="card" key={c.title}>
              <h3 className="h4">{c.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------------------- pricing */}
      {/* `id` so the hero's "See what it costs" has somewhere to land. The
          dashboard Section above carries one for the same reason; targeting the
          heading id instead would scroll past the eyebrow. */}
      <Section labelledBy="pricing-heading" id="pricing" style={{ background: '#F7FAFA' }}>
        <SectionHead
          title="Pricing"
          id="pricing-heading"
          lead="Priced against the cost of the incidents and the wasted spend, not against a headcount."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {tiers.map(tier => (
            <div className="card" key={tier.name}>
              <span className="step__n">{tier.name}</span>
              <p style={{ marginTop: 4 }}>
                {tier.price ? (
                  <>
                    <b
                      className="mono"
                      style={{
                        fontSize: 34,
                        color: 'var(--brand)',
                        fontWeight: 500,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {tier.price}
                    </b>
                    <span className="small" style={{ marginLeft: 6 }}>
                      {tier.unit}
                    </span>
                  </>
                ) : (
                  <Placeholder>ON APPLICATION</Placeholder>
                )}
              </p>
              <p className="body" style={{ marginTop: 16, fontSize: 15 }}>
                {tier.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/*
        LIFTED OUT OF PRICING 2026-09-16. This paragraph answers "will you run
        something you did not build", which is not a question about price, and
        it was stranded at the foot of the tiers where nobody arriving from the
        nav or a sibling page would look for it.

        Its second sentence is NOT reproduced here. "Running what somebody else
        wrote is the clearest proof that this is a capability rather than a
        warranty on our own work" is published verbatim in the FAQ below, and
        was appearing twice on one page.
      */}
      <Section labelledBy="takeon-heading">
        <SectionHead
          eyebrow="How it starts"
          id="takeon-heading"
          title="It does not have to be something we built"
          lead="We will take on systems we did not build, once a baseline tells us what we are inheriting."
        />
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Already have something in production?">
        The baseline works just as well on a system that exists as on one that does not. We measure
        what it is doing now and tell you what it would cost to keep it honest.
      </ClosingCta>
    </>
  );
}
