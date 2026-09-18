import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  Faqs,
  JsonLd,
  MediaSlot,
  Placeholder,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'AI for insurance and financial services',
  description:
    'Nearly half of regulated firms only partly understand the AI they already run. We make it explainable, monitored and defensible for a supervisor.',
  path: '/industries/insurance-financial-services',
});

const opportunities = [
  {
    title: 'Claims intake and triage',
    body: 'Intake, triage, evidence gathering and a drafted decision with the reasoning attached. Human sign-off retained, every time.',
  },
  {
    title: 'Underwriting support',
    body: 'Assembling the pack and flagging the anomalies. The system never makes the decision, and the boundary is designed rather than assumed.',
  },
  {
    title: 'Back-office exceptions',
    body: 'Mismatches, missing data and anything that fell out of the happy path: the queue that quietly consumes an operations team.',
  },
  {
    title: 'Regulated correspondence',
    body: 'Structured documents where the template is known and the content is not, with every figure traceable to its source.',
  },
];

const defensibility = [
  {
    title: 'Explainable',
    body: 'Lineage and provenance on every answer: which documents, which version, at what time. Your supervisor will ask, and so will your customer.',
  },
  {
    title: 'Monitored',
    body: 'Continuous evaluation against agreed acceptance thresholds, with drift detection covering input drift, silent supplier model changes and judge drift.',
  },
  {
    title: 'Defensible',
    body: 'Defined incident severities, a named responder, a rollback procedure and a written post-incident note that goes into your audit trail.',
  },
];

const faqs = [
  {
    q: 'How well do regulated firms understand the AI they already run?',
    a: 'Nearly half of regulated firms report only partial understanding of the AI systems already in use across their business, according to the Bank of England and FCA AI survey. The exposure is rarely the model itself. It is the absence of lineage, monitoring and a defined escalation boundary around it.',
  },
  /*
   * Was: "... Formal AI governance, ISO/IEC 42001 and audit are delivered by
   * Pixelette Certified, a separate practice in the same group with its own
   * lead auditors."
   *
   * Two breaches of the handoff's ACCREDITATION-SAFE RULE in one sentence — an
   * independent-audit claim and a named certified-practice status — and this
   * array is fed to `faqSchema`, so both were being published as structured
   * data as well as prose (claims.ts `certified-cross-sell`). Rewritten
   * 2026-09-08 to the section 12 wording. The answer to the question asked is
   * unchanged and is still "no", which is the commercially useful part.
   */
  {
    q: 'Does Pixelette Technologies provide regulatory sign-off for AI in financial services?',
    a: 'No. Pixelette Technologies engineers the system and provides the technical evidence: lineage, evaluation results, drift monitoring and incident records. Sign-off is not ours to give. Where a programme needs formal governance, certification readiness or assurance support, Pixelette Certified, a separate company in the same group, can help scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment.',
  },
  {
    q: 'Will an AI system in a regulated process make decisions automatically?',
    a: 'Not by default. Human review is the default posture and agentic patterns are used only where the path genuinely varies, the system must choose among tools, and a wrong step is recoverable and reviewable. Where output is regulated, a deterministic workflow with one model call is usually the correct design.',
  },
];

export default function InsuranceFsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          /* Was '/industries/professional-services' - this page was naming its
             SIBLING as its parent. /industries now exists. */
          { name: 'Industries', path: '/industries' },
          {
            name: 'Insurance & specialist financial services',
            path: '/industries/insurance-financial-services',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Industries · Insurance & specialist financial services</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            You are already running AI you cannot fully explain
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Nearly half of regulated firms report only partial understanding of the AI systems they
            already run. We make them explainable, monitored and defensible, and leave the
            assurance route to Pixelette Certified rather than grading our own work.
          </p>
          <SourceNote>Bank of England / FCA AI survey</SourceNote>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            <Cta href="/industries/professional-services" variant="secondary">
              Professional & business services
            </Cta>
          </div>
        </div>
      </div>

      <Section labelledBy="fs-def-heading">
        <SectionHead
          title="Explainable, monitored, defensible"
          id="fs-def-heading"
          lead="Three properties a supervisor actually tests for, and the engineering that produces each one."
        />
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {defensibility.map(d => (
            <div className="card" key={d.title}>
              <h3 className="h3">{d.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="fs-opps-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Where it usually starts"
          id="fs-opps-heading"
          title="Processes we would baseline first"
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {opportunities.map(o => (
            <div className="card" key={o.title}>
              <h3 className="h4">{o.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 14.5 }}>
                {o.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/*
        THE "Sector work / Published as it is measured" SECTION WAS DELETED HERE
        2026-09-16. It mapped three empty work cards whose only content was
        placeholders, plus the line "Placeholders stay visible until a real
        engagement fills them. We do not use stock case studies."

        Once placeholders began rendering nothing, what shipped was a live
        heading over three dashed grey image boxes with nothing beneath them, and
        a sentence referring to placeholders that were no longer there - a
        section that read as having failed to load, and a self-contradiction
        underneath it.

        It went rather than being repaired because there is nothing to repair
        with: no sector case study exists to put in it. The route back is a
        published case study, not a boarded section.
      */}

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Need to explain a system you inherited?">
        The baseline measures a system that already exists just as readily as one that does not, and
        tells you what it would cost to make it defensible.
      </ClosingCta>
    </>
  );
}
