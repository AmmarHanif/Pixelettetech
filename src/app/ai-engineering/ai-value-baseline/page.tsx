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
  title: 'AI Value Baseline',
  description:
    'Four weeks, fixed price, £6,000 to £12,000. We instrument two or three processes, measure what they cost today, and write the business case for finance.',
  path: '/ai-engineering/ai-value-baseline',
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
    q: 'How much does an AI Value Baseline cost?',
    a: '£6,000 to £12,000, fixed, depending on how many processes are in scope and how messy the data is. The price is quoted before the work starts, not after.',
  },
  {
    q: 'How long does an AI Value Baseline take?',
    a: 'Four weeks from start to readout, covering two to three instrumented processes. No procurement cycle is required.',
  },
  {
    q: 'What do I get at the end of an AI Value Baseline?',
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
          name: 'AI Value Baseline',
          description:
            'A four-week fixed-price engagement that instruments two or three processes, measures their current cost, and produces a costed roadmap and board-ready business case.',
          path: '/ai-engineering/ai-value-baseline',
          price: { low: 6000, high: 12000, currency: 'GBP' },
          serviceType: 'AI consulting',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
          { name: 'AI Value Baseline', path: '/ai-engineering/ai-value-baseline' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>AI Value Baseline</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Four weeks. Fixed price. A number your exec team can sign off.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            The entry engagement. We instrument two or three of your processes, measure what they
            actually cost today, and hand you a costed roadmap with the business case written for
            finance.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a value baseline</Cta>
            {/* The board's second CTA reads "Download a sample output". No such
                artefact exists yet, and a Download button that does not download
                is a worse promise than none. This keeps the design's function —
                a low-commitment second action for someone not ready to commit to
                a £6,000 engagement — and becomes a real download the moment the
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
              So we sell the counting first. It is cheap, it is fixed price, and at the end of it you
              own a measurement system whether or not you ever engage us again. If the numbers do not
              support going further, we say so in writing.
            </p>

            <div className="grid grid-3" style={{ marginTop: 34 }}>
              <StatTile value="4" label="weeks, start to readout" />
              <StatTile value="2–3" label="processes instrumented" />
              <StatTile value="Fixed" label="price, quoted before we start" />
            </div>
          </div>

          <div className="card">
            <Eyebrow>Fixed price</Eyebrow>
            <p style={{ marginTop: 16 }}>
              <b
                className="mono"
                style={{
                  fontSize: 46,
                  color: 'var(--brand)',
                  fontWeight: 500,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                £6,000
              </b>
            </p>
            <p className="small" style={{ marginTop: 12 }}>
              to £12,000 depending on how many processes and how messy the data is. Quoted before we
              start, not after.
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

      <ClosingCta title="Book the baseline">
        No procurement cycle, no discovery call ladder. Tell us the process that annoys you most and
        we will tell you whether it is measurable.
      </ClosingCta>
    </>
  );
}
