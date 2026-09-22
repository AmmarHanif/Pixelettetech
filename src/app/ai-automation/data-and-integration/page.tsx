import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, Faqs, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { dataBarrierStats } from '@/content/sources';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

import { ReferenceArchitecture } from './ReferenceArchitecture';

export const metadata = pageMetadata({
  title: 'Data & Integration for AI',
  description:
    'Entitlement-aware retrieval, context and semantic layers, MCP integration to systems of record, lineage and provenance, and legacy enablement.',
  path: '/ai-automation/data-and-integration',
});

const capabilities = [
  {
    title: 'Entitlement-aware retrieval',
    body: 'The hard part of enterprise AI is not retrieval, it is retrieval that respects who is allowed to see what. We model permissions first and index second.',
  },
  {
    title: 'Context and semantic layers',
    body: 'A stable vocabulary between your systems and the model, so the answer does not change because someone renamed a column.',
  },
  {
    title: 'MCP integration to systems of record',
    body: 'CRM, ERP, case management, document stores and internal APIs. MCP has won as a connector standard; the unsolved parts are identity, audit and gateway policy, which is where the work is.',
  },
  {
    title: 'Evaluation and observability',
    body: 'Instrumented from day one on open standards, so you are never locked into whoever is monitoring you. This is also what makes the run contract possible.',
  },
  {
    title: 'Lineage and provenance',
    body: 'Where an answer came from, which documents, which version, at what time. Your auditor will ask, and so will your customer.',
  },
  {
    title: 'Legacy enablement',
    body: 'The estate nobody wants to touch. AI coding gains are large on greenfield and close to nothing on complex legacy, which is precisely why this stays human work.',
  },
];

const faqs = [
  {
    q: 'What is the biggest barrier to getting value from enterprise AI?',
    a: 'Data readiness and access, not model capability. 58% name data readiness and access as their number one barrier (KPMG 2026), 72% cite data quality as the top obstacle (Deloitte Private 2026), and three in four UK professional services firms are unready on data, orchestration and monitoring (GOV.UK 2026).',
  },
  {
    q: 'What is entitlement-aware retrieval?',
    a: 'Retrieval that respects who is allowed to see what. Permissions are modelled first and the index is built second, so a model can reach the information it needs and nothing it should not. It is the part of enterprise RAG that most often stops a rollout.',
  },
  {
    q: 'Do you use MCP to connect to systems of record?',
    a: 'Yes. MCP has effectively won as a connector standard for CRM, ERP, case management, document stores and internal APIs. The unsolved parts are identity, audit and gateway policy, which is where the engineering work actually sits.',
  },
];

export default function DataIntegrationPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'Data & Integration for AI',
          description:
            'Entitlement-aware retrieval, context and semantic layers, MCP integration to systems of record, lineage and provenance, and legacy enablement.',
          path: '/ai-automation/data-and-integration',
          serviceType: 'Data integration',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-automation' },
          { name: 'Data & Integration', path: '/ai-automation/data-and-integration' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Data & Integration</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            The AI cannot see your data. That is the real problem
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Independent survey after independent survey names the same blocker. Not model capability,
            not skills, not budget: whether the system can reach the right information, with the right
            permissions, in a form it can use.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            <Cta href="/contact" variant="secondary">
              Talk to an engineer
            </Cta>
          </div>

          <div className="grid grid-3" style={{ marginTop: 48 }}>
            {dataBarrierStats.map(stat => (
              <div className="tile" key={stat.value}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
                <span className="src" style={{ marginTop: 10, display: 'block' }}>
                  {stat.source}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Section labelledBy="di-build-heading">
        <SectionHead title="What we actually build" id="di-build-heading" />
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

      <Section labelledBy="arch-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Reference architecture"
          id="arch-heading"
          title="A shape we can defend in a technical review"
        />
        <div style={{ marginTop: 40 }}>
          <ReferenceArchitecture />
        </div>
        <SourceNote>
          Illustrative reference shape. Every engagement produces an architecture specific to your
          estate.
        </SourceNote>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Start with what is actually blocking you">
        The baseline usually finds that the problem is not the model. It is the four systems that will
        not talk to each other.
      </ClosingCta>
    </>
  );
}
