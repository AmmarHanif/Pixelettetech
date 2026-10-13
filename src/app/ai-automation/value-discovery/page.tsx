import { ClosingCta } from '@/components/sections';
import {
  CheckList,
  Cta,
  Eyebrow,
  Faqs,
  JsonLd,
  Section,
  SectionHead,
  SourceNote,
  StatTile,
} from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Value Discovery',
  description:
    'A separately scoped, measurement-led engagement for substantial AI programmes: instrumented current-state measurement, an opportunity assessment and costed roadmap.',
  path: '/ai-automation/value-discovery',
});

const weeks = [
  {
    n: 'Week 1',
    t: 'Scope',
    d: 'Two or three candidate processes, and agreement on what would count as better before we look at any data.',
  },
  {
    n: 'Week 2',
    t: 'Instrument',
    d: 'Measurement goes in. Volume, cycle time, cost per unit, rework rate, and where the time actually goes.',
  },
  {
    n: 'Week 3',
    t: 'Analyse',
    d: 'What AI would plausibly move, what it would not, what it would cost to run, and what has to be true for it to hold.',
  },
  {
    n: 'Week 4',
    t: 'Report',
    d: 'One session with the sponsor and the CFO. A recommendation, including the recommendation not to proceed where that is the honest answer.',
  },
];

/*
 * FAQ set REPLACED 2026-10-13 on the founder's discovery-positioning brief.
 * The old set defined Value Discovery as the compulsory first step ("How long
 * does a Value Discovery take? ... No procurement cycle is required."). The
 * new set answers the brief's five required questions — compulsory (no),
 * difference from a focused workshop, when a four-week programme is
 * appropriate, how the fee is calculated, and proceeding directly to a build
 * proposal (yes) — and keeps the two deliverable questions that were already
 * accurate. The "no procurement cycle" claim is removed outright: the brief
 * names it as a claim to take out.
 */
const faqs = [
  {
    q: 'Is Value Discovery compulsory?',
    a: 'No. Many engagements begin with a conversation and move directly to technical scoping and a proposal. Value Discovery is the right route where a substantial programme needs detailed current-state measurement before an investment decision.',
  },
  {
    q: 'How is it different from a focused discovery workshop?',
    a: 'A focused workshop is a short, prepared working session — roughly two to three hours — that resolves a defined question and produces concise agreed outputs. Value Discovery is a substantial measurement-led engagement: processes are instrumented, performance is measured over time, and the output is an opportunity assessment and a costed roadmap.',
  },
  {
    q: 'When is a four-week programme appropriate?',
    a: 'For complex AI or automation programmes where the existing evidence is not sufficient to support the investment decision. Four weeks describes the programme’s typical elapsed duration — it is not four weeks of automatically billable full-time consultancy, nor a fixed number of billable days.',
  },
  {
    q: 'How is the fee calculated?',
    a: 'From the agreed scope, effort and deliverables, and quoted before work begins. The scope is agreed beforehand, so the fee reflects the actual work required.',
  },
  {
    q: 'Can we proceed directly to a build proposal?',
    a: 'Yes, where the requirement and the technical information are sufficiently defined. We will tell you if they are, and what — if anything — is still missing.',
  },
  {
    q: 'What do I get at the end of a Value Discovery?',
    a: 'Process mapping and current-state measurement; instrumentation deployed and left running, which is yours to keep; an opportunity map scored on production-conversion evidence; a business case naming the budget line it displaces; and a readout to your executive team with the deck included. All subject to the agreed scope.',
  },
  {
    q: 'What if the numbers do not justify building anything?',
    a: 'Pixelette says so in writing. You still own the measurement system whether or not you engage further.',
  },
];

export default function BaselinePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Value Discovery',
          description:
            'A separately scoped, measurement-led engagement that instruments two or three processes, measures their current cost, and produces an opportunity assessment, a costed roadmap and a board-ready business case.',
          path: '/ai-automation/value-discovery',
          serviceType: 'AI consulting',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-automation' },
          { name: 'Value Discovery', path: '/ai-automation/value-discovery' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Value Discovery</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Measure what matters before committing to a complex AI programme
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            For organisations considering substantial AI or automation programmes, Value Discovery
            provides an evidence-led understanding of current performance, practical opportunities
            and the investment required. This is a separately scoped, measurement-led engagement,
            not a compulsory first step for every customer.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            {/* The board's second CTA reads "Download a sample output". No such
                artefact exists yet, and a Download button that does not download
                is a worse promise than none. This keeps the design's function —
                a low-commitment second action for someone not ready to commit to
                a paid engagement — and becomes a real download the moment the
                sample exists. Tracked in GO-LIVE-CHECKLIST.md. */}
            <Cta href="/contact" variant="secondary">
              Request a sample output
            </Cta>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- why first */}
      {/*
        SECTION RE-TITLED 2026-10-13 on the founder's discovery-positioning
        brief: "Why this comes first, always" presented the programme as the
        universal opening move. It is now "When deeper measurement is
        worthwhile", and the copy states the condition under which the
        programme is the right route — existing evidence insufficient for a
        substantial investment decision — instead of asserting it for every
        engagement.
      */}
      <Section labelledBy="why-first-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead title="When deeper measurement is worthwhile" id="why-first-heading" />
            <p className="body" style={{ marginTop: 20 }}>
              Buyers want to pay for outcomes. Fewer than one in five organisations tracks ROI on AI
              at all, and 40% do not know whether anyone is measuring it. You cannot underwrite an
              outcome nobody has counted, and neither can we.
            </p>
            <SourceNote>Thomson Reuters, February 2026, n=1,500+</SourceNote>
            <p className="body" style={{ marginTop: 24 }}>
              Where the existing evidence is not sufficient to support a substantial investment
              decision, we sell the counting first. It is a short engagement, and at the end of it
              you own a measurement system whether or not you ever engage us again. If the numbers
              do not support going further, we say so in writing.
            </p>

            <div className="grid grid-3" style={{ marginTop: 34 }}>
              <StatTile value="4" label="weeks, typical elapsed time from start to readout" />
              <StatTile value="2–3" label="processes instrumented" />
              <StatTile value="Yours" label="the measurement system, kept either way" />
            </div>
          </div>

          <div className="card">
            <Eyebrow>The specialist option</Eyebrow>
            <h3 className="h3" style={{ marginTop: 16 }}>
              Instrumented Value Discovery
            </h3>
            <p className="small" style={{ marginTop: 12 }}>
              Typically four weeks, start to readout — elapsed time, not four weeks of full-time
              consultancy. Scoped to how many processes are in scope and how messy the data is, and
              quoted before we start, not after.
            </p>
            <hr className="rule" style={{ margin: '24px 0' }} />
            <h2 className="eyebrow">Includes</h2>
            <div style={{ marginTop: 18 }}>
              <CheckList
                items={[
                  'Process mapping and current-state measurement',
                  'Instrumentation deployed and left running',
                  'Opportunity map scored on production-conversion evidence',
                  'Business case naming the budget line it displaces',
                  'Readout to your exec team, and the deck is yours',
                ]}
              />
            </div>
            <p className="small" style={{ marginTop: 16 }}>
              All deliverables subject to the agreed scope.
            </p>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- the four weeks */}
      {/*
        The four-week sequence is RETAINED as the example delivery structure
        for the comprehensive programme, per the brief — scope, instrument,
        analyse, report — with the elapsed-time clarification the brief
        requires: four weeks describes typical duration, not automatically
        billable full-time work.
      */}
      <Section labelledBy="weeks-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          title="An example delivery structure"
          id="weeks-heading"
          lead="The comprehensive programme typically spans about four weeks of elapsed time, in four moves — scope, instrument, analyse, report."
        />
        <ol
          style={{
            listStyle: 'none',
            padding: 0,
            marginTop: 36,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: 18,
          }}
        >
          {weeks.map(w => (
            <li className="card" key={w.n}>
              <span className="step__n">{w.n}</span>
              <h3 className="h4">{w.t}</h3>
              <p className="body" style={{ marginTop: 10, fontSize: 14.5 }}>
                {w.d}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      {/*
        REPLACED 2026-10-13 on the founder's discovery-positioning brief. The
        old close ("Start with Value Discovery / No procurement cycle, no
        discovery call ladder...") made the programme the compulsory opening
        move and carried the "no procurement cycle" claim the brief removes.
        The new close routes to the same contact page and recommends only the
        level of work the requirements justify.
      */}
      <ClosingCta title="Discuss the right starting point">
        Tell us what you want to build, change or improve and we will recommend only the level of
        work your requirements justify — which may be a scoped proposal rather than this
        programme.
      </ClosingCta>
    </>
  );
}
