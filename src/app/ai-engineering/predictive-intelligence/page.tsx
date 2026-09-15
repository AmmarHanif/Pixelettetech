import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Predictive Intelligence',
  description:
    'Forecasting, scoring, recommendation and decision-support systems built around business data, with thresholds, monitoring and a decision they actually change.',
  path: '/ai-engineering/predictive-intelligence',
});

const capabilities = [
  {
    title: 'Forecasting',
    body: 'Demand, revenue, capacity, cash and workload, at the horizon and granularity a decision is actually taken at rather than the one that produces the prettiest chart.',
  },
  {
    title: 'Scoring and propensity',
    body: 'Risk, churn, conversion likelihood, credit and priority, expressed as a score with a defined meaning and a defined action at each band.',
  },
  {
    title: 'Recommendation and personalisation',
    body: 'Next best action, product and content ranking, and the guardrails that stop a recommender optimising itself into a corner.',
  },
  {
    title: 'Anomaly detection',
    body: 'Finding the transaction, reading or record that does not belong, tuned to the alert volume a human team can genuinely investigate.',
  },
  {
    title: 'Decision support',
    body: 'The prediction placed inside the workflow where the decision happens, with the reasoning shown and the person still making the call.',
  },
  {
    title: 'Monitoring for decay',
    body: 'Models age as the world moves. Input drift, changing distributions and falling accuracy are watched continuously rather than noticed in a quarterly review.',
  },
];

const conditions = [
  {
    title: 'A decision that would change',
    body: 'If the same action follows every prediction, the prediction is decoration. We ask this question first and it disqualifies a fair number of ideas.',
  },
  {
    title: 'History with the outcome in it',
    body: 'You cannot learn to predict something your records never recorded. What is missing is often the outcome, not the inputs.',
  },
  {
    title: 'A threshold somebody owns',
    body: 'A score becomes useful at the point where a person agrees what happens above and below a line, and accepts the cost of being wrong in each direction.',
  },
  {
    title: 'An honest accuracy target',
    body: 'Set against the current human baseline, not against zero. Beating nothing is not a result worth funding.',
  },
];

const faqs = [
  {
    q: 'What is predictive intelligence used for?',
    a: 'Forecasting demand, revenue, capacity or workload; scoring risk, churn, conversion or priority; recommendation and personalisation; anomaly detection; and decision support that puts the prediction inside the workflow where the decision is actually taken.',
  },
  {
    q: 'What does a predictive project need before it can start?',
    a: 'Four things: a decision that would genuinely change as a result, historical data that recorded the outcome and not only the inputs, a threshold somebody is willing to own, and an accuracy target set against the current human baseline rather than against zero. Where any of those is missing, we say so before scoping a build.',
  },
  {
    q: 'How do you keep a model accurate after it goes live?',
    a: 'By monitoring for decay as a standing commitment: input drift, changing distributions and falling accuracy against held-out outcomes, with an agreed threshold below which the model is retrained or withdrawn. A predictive system that nobody is watching becomes confidently wrong rather than obviously broken.',
  },
];

export default function PredictiveIntelligencePage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Predictive Intelligence',
          description:
            'Forecasting, scoring, recommendation, anomaly detection and decision-support systems built around business data and monitored for decay.',
          path: '/ai-engineering/predictive-intelligence',
          serviceType: 'Predictive analytics and decision support',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI & Automation', path: '/ai-engineering' },
          { name: 'Predictive Intelligence', path: '/ai-engineering/predictive-intelligence' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Automate · Predictive Intelligence</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Forecasts and scores that a decision can actually rest on
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Forecasting, scoring, recommendation and decision-support systems built around your
            business data. Built backwards from the decision they are meant to change, because a
            prediction that alters nothing is an expensive chart.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            <Cta href="/ai-engineering" variant="secondary">
              All AI &amp; automation
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="pi-build-heading">
        <SectionHead title="What we build" id="pi-build-heading" />
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

      {/* ------------------------------------------------------ conditions */}
      <Section labelledBy="pi-cond-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Before we agree to build one"
          id="pi-cond-heading"
          title="Four conditions, checked in that order"
          lead="They take an afternoon to establish and they are the difference between a model in production and a notebook nobody opens."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {conditions.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------- the score */}
      <Section labelledBy="pi-use-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Getting it used"
              id="pi-use-heading"
              title="The hard part is not the model. It is the Tuesday."
            />
            <p className="body" style={{ marginTop: 20 }}>
              A score only creates value when it appears in front of the person making the decision,
              at the moment they make it, with enough explanation for them to act on it or overrule
              it. That is product and workflow engineering, and it is where predictive projects
              usually fail rather than in the modelling.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              We build the prediction and the place it lands. Overrides are recorded, because
              disagreement between the model and the people using it is the most valuable signal
              you will get in the first year.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/production-ai-systems">
                How we put systems into a process
              </FLink>
            </p>
          </div>

          <div>
            <Eyebrow>What we will not do</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              We will not present a model that has only ever been evaluated on the data it was
              trained on, quote an accuracy figure without saying what it is measured against, or
              build a scoring system that makes a material decision about a person without a defined
              human review route.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Where a prediction feeds a regulated decision, the governance and assurance route
              around it is a separate discipline and sits with Pixelette Certified rather than with
              the team that built the model.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/assurance" variant="secondary">
                Who does what
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a decision that is currently a guess?">
        Tell us what the decision is, how often it is taken and what happens when it is wrong. That
        is enough to say whether a predictive system is worth building.
      </ClosingCta>
    </>
  );
}
