import { ClosingCta, ValueModelCards } from '@/components/sections';
import {
  CheckList,
  Cta,
  Eyebrow,
  FLink,
  Faqs,
  FeatureCard,
  JsonLd,
  Section,
  SectionHead,
} from '@/components/ui';
import { Database, Gauge, Layers, Measure, Shield, TrendChart } from '@/components/Icons';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Renamed from "Managed Engineering" on founder instruction, 2026-09-22, then
 * PROMOTED OUT OF /engineering to the top level on 2026-09-23, also on founder
 * instruction: the live URL is now /support-continuous-improvement. Both older
 * paths (/engineering/managed-engineering and /engineering/support-continuous-
 * improvement) are 308s in next.config.ts straight to this one; they must not
 * 404 and must not stay indexable. The breadcrumb still names Engineering as the
 * category, because the service belongs to that practice even though its URL no
 * longer nests under it.
 *
 * REBUILT 2026-09-23 to the founder's Support & Continuous Improvement brief.
 * The load-bearing distinction, kept throughout the page rather than restated:
 * Pixelette delivers the commissioned product to spec, and RUN is OPTIONAL. If
 * the client wants ongoing involvement, the arrangement ranges from maintaining
 * the product at its agreed level through to active improvement. Nothing here
 * may imply the product needs Pixelette after launch, or that improvement is
 * compulsory, or vendor lock-in.
 *
 * TITLE IS THE BARE SERVICE NAME, not "... | Pixelette Technologies" as the
 * brief suggested. The root layout already applies a "%s — Pixelette
 * Technologies" template, so spelling the company name here would print it
 * twice. The rendered title carries it either way, which is what was asked for.
 */
export const metadata = pageMetadata({
  title: 'Support & Continuous Improvement',
  description:
    'Optional ongoing software support, maintenance, monitoring, optimisation and continuous improvement for products built by Pixelette or existing systems.',
  path: '/support-continuous-improvement',
});

/*
 * SECTION 2 cards. Six capabilities that CAN form part of an arrangement, not a
 * mandatory bundle. Concise by design: one line each, an icon for scanning.
 */
const takeCareOf = [
  {
    icon: <Gauge size={26} />,
    title: 'Monitoring & support',
    body: 'Detect, investigate and resolve issues before they become bigger problems.',
  },
  {
    icon: <Shield size={26} />,
    title: 'Security & maintenance',
    body: 'Keep dependencies, patches and technical components current.',
  },
  {
    icon: <TrendChart size={26} />,
    title: 'Performance & optimisation',
    body: 'Maintain and improve speed, reliability, infrastructure efficiency and cost where required.',
  },
  {
    icon: <Layers size={26} />,
    title: 'Releases & change',
    body: 'Test and deploy agreed fixes, updates and improvements through controlled releases.',
  },
  {
    icon: <Measure size={26} />,
    title: 'Continuous improvement',
    body: 'Where required, turn feedback, operational data and priorities into an ongoing improvement backlog.',
  },
  {
    icon: <Database size={26} />,
    title: 'Technical ownership',
    body: 'Maintain product knowledge, documentation and clear engineering accountability for the areas entrusted to us.',
  },
];

/* SECTION 3 sequence: coverage -> service levels -> engineering capacity -> visibility. */
const fitSteps = [
  {
    n: '01',
    title: 'Support coverage',
    body: 'Agree which products, systems and environments you want us to support.',
  },
  {
    n: '02',
    title: 'Service levels',
    body: 'Set appropriate support hours, priorities and response expectations.',
  },
  {
    n: '03',
    title: 'Engineering capacity',
    body: 'Choose the level of ongoing engineering needed for maintenance, fixes, optimisation or improvements.',
  },
  {
    n: '04',
    title: 'Review & reporting',
    body: 'Maintain visibility over incidents, releases, performance and agreed improvement work.',
  },
];

/* SECTION 5: compressed AI operations. Present only where a product includes AI. */
const aiIndicators = [
  { title: 'Model health', body: 'Monitor availability, latency, failures and operational behaviour.' },
  {
    title: 'Evaluations',
    body: 'Track agreed quality measures as models, prompts and workflows change.',
  },
  { title: 'Guardrails', body: 'Maintain the controls and checks surrounding AI behaviour.' },
  { title: 'Cost & performance', body: 'Monitor usage, latency and model-related operating costs.' },
];

const builtPoints = [
  'Smooth transition from delivery to ongoing support',
  'Existing technical knowledge retained',
  'Maintenance, optimisation and improvements as required',
];

const livePoints = [
  'Initial technical and operational assessment',
  'Review of codebase, infrastructure and documentation',
  'Clear onboarding and responsibility boundaries',
];

const faqs = [
  {
    q: 'What does support and continuous improvement include?',
    a: 'The scope is agreed around the product and what you need from us. It can include monitoring, incident support, maintenance, security updates, performance optimisation, releases and ongoing engineering improvements.',
  },
  {
    q: 'Is ongoing support required after Pixelette delivers a product?',
    a: 'No. We deliver the commissioned product to the agreed specification. Ongoing support is an optional service if you want Pixelette to remain involved after delivery.',
  },
  {
    q: 'Can you support software that Pixelette did not build?',
    a: 'Yes. We can take responsibility for an existing product following an initial technical assessment of the application, infrastructure, documentation and current operating position.',
  },
  {
    q: 'Is this just maintenance and bug fixing?',
    a: 'It can be focused on maintaining reliability, security and performance, or it can extend to optimisation, controlled releases and ongoing improvements. The scope depends on what you need.',
  },
  {
    q: 'Do you offer service levels and response times?',
    a: 'Yes. Appropriate support hours, priorities and response expectations can be agreed as part of the support arrangement.',
  },
  {
    q: 'Can you support AI-enabled products?',
    a: 'Yes. Where relevant, the arrangement can include additional monitoring and operational controls for AI components, including model health, evaluations, guardrails, performance and cost.',
  },
  {
    q: 'Do we need to commit to a large engineering team?',
    a: 'No. The level of engineering capacity is agreed around the product and the amount of ongoing support, maintenance or improvement required.',
  },
];

export default function SupportContinuousImprovementPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Support & Continuous Improvement',
          description:
            'Optional ongoing software support, monitoring, maintenance, security, optimisation, controlled releases and continuous improvement for products built by Pixelette or existing systems, shaped around what the client needs.',
          path: '/support-continuous-improvement',
          serviceType: 'Software support and continuous improvement',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Engineering', path: '/engineering' },
          {
            name: 'Support & Continuous Improvement',
            path: '/support-continuous-improvement',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          {/* Run is the lifecycle stage; Support & Continuous Improvement is the
              service inside it. The brief is explicit that the two are not
              interchangeable, so the eyebrow names both. */}
          <Eyebrow>Run · Support &amp; Continuous Improvement</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            Reliable, secure and performing as intended
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            When you need ongoing support, we can keep your software reliable, secure and performing
            as intended, with optimisation and continuous improvement where you want it. Whether we
            built the product or are taking responsibility for an existing system, the arrangement is
            shaped around what you need.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Discuss ongoing support</Cta>
            <Cta href="/engineering" variant="secondary">
              All engineering
            </Cta>
          </div>
          {/* Optional-service signals, kept visually secondary. Not buttons. */}
          <p className="small" style={{ marginTop: 22, color: 'var(--muted)' }}>
            Optional ongoing support · Flexible service levels · Products built by us or others
          </p>
        </div>
      </div>

      {/* -------------------------------------------- what we take care of */}
      <Section labelledBy="care-heading">
        <SectionHead
          title="What we take care of"
          id="care-heading"
          lead="Ongoing support can be as focused or as comprehensive as the product requires. We agree what you want us to take responsibility for and shape the service around it."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {takeCareOf.map(item => (
            <FeatureCard key={item.title} icon={item.icon} title={item.title}>
              {item.body}
            </FeatureCard>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------- support that fits */}
      <Section labelledBy="fits-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Flexible by design"
          id="fits-heading"
          title="Support that fits the product"
          lead="Every product and business needs a different level of ongoing support. We agree what you want us to take responsibility for, from maintaining the product at its agreed level through to optimisation and continued improvement."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {fitSteps.map(step => (
            <div className="tile" key={step.n}>
              <span className="step__n">{step.n}</span>
              <b style={{ fontSize: 15.5 }}>{step.title}</b>
              <p className="small" style={{ marginTop: 8 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------- built by us or already live */}
      <Section labelledBy="responsibility-heading">
        <SectionHead
          eyebrow="Taking responsibility"
          id="responsibility-heading"
          title="Built by Pixelette or already live, we can support it"
          lead="Ongoing support does not have to begin with a Pixelette build. We can continue supporting products we have delivered or take responsibility for an existing product following an initial technical assessment."
        />
        <div className="grid grid-2" style={{ marginTop: 36, gap: 28 }}>
          <div className="card">
            <h3 className="h3">Built by Pixelette</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              If you want us to remain involved after delivery, we can continue supporting the
              product without losing the technical knowledge built up during development.
            </p>
            <div style={{ marginTop: 18 }}>
              <CheckList items={builtPoints} />
            </div>
          </div>
          <div className="card">
            <h3 className="h3">Already live</h3>
            <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
              If another team built the product, we begin by understanding what we are being asked to
              support.
            </p>
            <div style={{ marginTop: 18 }}>
              <CheckList items={livePoints} />
            </div>
          </div>
        </div>
        <p className="small" style={{ marginTop: 24, color: 'var(--muted)' }}>
          Existing systems are subject to technical assessment before support responsibility is
          agreed.
        </p>
      </Section>

      {/* ------------------------------------------------ AI operations */}
      <Section labelledBy="ai-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="AI operations"
          id="ai-heading"
          title="AI-enabled products need additional operational care"
          lead="Where a product includes AI, the support arrangement can extend beyond conventional software operations to help monitor how AI components behave, perform and evolve in production."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {aiIndicators.map(item => (
            <div className="tile" key={item.title}>
              <b style={{ fontSize: 15.5 }}>{item.title}</b>
              <p className="small" style={{ marginTop: 8 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 26 }}>
          <FLink href="/ai-automation/support-and-run">See AI operations and run</FLink>
        </p>
      </Section>

      {/* --------------------------------------------- where this sits */}
      <Section labelledBy="sits-heading" tight>
        <SectionHead
          eyebrow="How we help"
          id="sits-heading"
          title="Run is one of our four services"
          lead="Build, automate, decentralise or keep your existing product performing."
        />
        <div style={{ marginTop: 32 }}>
          <ValueModelCards current="RUN" />
        </div>
      </Section>

      {/* ------------------------------------------------------------- FAQ */}
      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Keep your product performing" ctaLabel="Discuss ongoing support">
        Whether you need dependable support for something already live or an engineering partner to
        maintain and improve it over time, we can shape the right ongoing arrangement around your
        product.
      </ClosingCta>
    </>
  );
}
