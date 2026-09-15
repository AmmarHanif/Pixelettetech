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
    'Four weeks. We instrument two or three of your processes, measure what they cost today, and hand you a costed roadmap and the business case for your exec team.',
  path: '/ai-engineering/value-discovery',
});

const weeks = [
  {
    n: 'Week 1',
    t: 'Choose and scope',
    d: 'Two or three candidate processes, and agreement on what would count as better before we look at any data.',
  },
  {
    n: 'Week 2',
    t: 'Instrument',
    d: 'Measurement goes in. Volume, cycle time, cost per unit, rework rate, and where the time actually goes.',
  },
  {
    n: 'Week 3',
    t: 'Model the change',
    d: 'What AI would plausibly move, what it would not, what it would cost to run, and what has to be true for it to hold.',
  },
  {
    n: 'Week 4',
    t: 'Readout',
    d: 'One session with the sponsor and the CFO. A recommendation, including the recommendation not to proceed where that is the honest answer.',
  },
];

const faqs = [
  {
    q: 'How is Value Discovery priced?',
    a: 'It is scoped to how many processes are in scope and how messy the data is, and quoted before the work starts. The price is quoted before the work starts, not after.',
  },
  {
    q: 'How long does an Value Discovery take?',
    a: 'Four weeks from start to readout, covering two to three instrumented processes. No procurement cycle is required.',
  },
  {
    q: 'What do I get at the end of an Value Discovery?',
    a: 'Process mapping and current-state measurement; instrumentation deployed and left running, which is yours to keep; an opportunity map scored on production-conversion evidence; a business case naming the budget line it displaces; and a readout to your executive team with the deck included.',
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
            'A four-week engagement that instruments two or three processes, measures their current cost, and produces a costed roadmap and board-ready business case.',
          path: '/ai-engineering/value-discovery',
          serviceType: 'AI consulting',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
          { name: 'Value Discovery', path: '/ai-engineering/value-discovery' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Value Discovery</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Four weeks to find out where you actually are, and what is worth doing next
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            The entry engagement. We instrument two or three of your processes, measure what they
            actually cost today, and hand you a costed roadmap with the business case written for
            your exec team.
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
      <Section labelledBy="why-first-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead title="Why this comes first, always" id="why-first-heading" />
            <p className="body" style={{ marginTop: 20 }}>
              Buyers want to pay for outcomes. Fewer than one in five organisations tracks ROI on AI
              at all, and 40% do not know whether anyone is measuring it. You cannot underwrite an
              outcome nobody has counted, and neither can we.
            </p>
            <SourceNote>Thomson Reuters, February 2026, n=1,500+</SourceNote>
            <p className="body" style={{ marginTop: 24 }}>
              So we sell the counting first. It is a short engagement, and at the end of it you
              own a measurement system whether or not you ever engage us again. If the numbers do not
              support going further, we say so in writing.
            </p>

            <div className="grid grid-3" style={{ marginTop: 34 }}>
              <StatTile value="4" label="weeks, start to readout" />
              <StatTile value="2–3" label="processes instrumented" />
              <StatTile value="Yours" label="the measurement system, kept either way" />
            </div>
          </div>

          <div className="card">
            <Eyebrow>Stage one of LIVE</Eyebrow>
            <h3 className="h3" style={{ marginTop: 16 }}>
              Value Discovery
            </h3>
            <p className="small" style={{ marginTop: 12 }}>
              Four weeks, start to readout. Scoped to how many processes are in scope and how messy
              the data is, and quoted before we start, not after.
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
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- the four weeks */}
      <Section labelledBy="weeks-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead title="The four weeks" id="weeks-heading" />
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

      <ClosingCta title="Start with Value Discovery">
        No procurement cycle, no discovery call ladder. Tell us the process you want to change and
        we will tell you whether it is measurable.
      </ClosingCta>
    </>
  );
}
