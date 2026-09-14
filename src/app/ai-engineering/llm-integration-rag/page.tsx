import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'LLM Integration & RAG',
  description:
    'Add model intelligence to existing products and knowledge environments with retrieval, permissions and grounded context, rather than a chat box bolted to the side.',
  path: '/ai-engineering/llm-integration-rag',
});

const capabilities = [
  {
    title: 'Retrieval over your own content',
    body: 'Documents, records, tickets, policies and the knowledge that currently lives in three systems and one person’s head. Chunking, indexing and ranking designed around how the content is actually written.',
  },
  {
    title: 'Permissions and entitlements',
    body: 'Retrieval that respects who is allowed to see what. Permissions are modelled first and the index is built second, because a model that can reach everything is a data-protection incident waiting for a prompt.',
  },
  {
    title: 'Grounded answers with citations',
    body: 'Output tied to the source passages it came from, so a reader can check it. Ungrounded fluency is the single most expensive failure mode in this category.',
  },
  {
    title: 'Context and prompt engineering',
    body: 'What goes into the window, in what order, at what cost, with the assembly written as code that can be tested rather than a string somebody edits in production.',
  },
  {
    title: 'Model selection, routing and fallback',
    body: 'Which model handles which class of request, what happens when a provider degrades, and how you move between them without rewriting the product.',
  },
  {
    title: 'Cost and latency budgets',
    body: 'Tokens per unit of work, caching, batching and an agreed response-time target, so the feature is affordable at the volume you actually expect.',
  },
];

const failures = [
  {
    title: 'It answers confidently from nothing',
    body: 'No grounding, no citation, no refusal path. The fix is retrieval design and an explicit “I do not know”, not a sterner prompt.',
  },
  {
    title: 'It answers from documents the user may not see',
    body: 'Entitlements were applied to the application and not to the index. This is the failure that stops enterprise rollouts.',
  },
  {
    title: 'It was right in the demonstration',
    body: 'A handful of questions is not a test set. Without a graded golden set you have an anecdote with a launch date.',
  },
  {
    title: 'It cost four times the estimate',
    body: 'Context assembled without a budget, no caching, and a model chosen for the hardest request and used for all of them.',
  },
];

const faqs = [
  {
    q: 'What is RAG and when is it the right approach?',
    a: 'Retrieval-augmented generation means the model answers from passages retrieved out of your own content at the time of the question, rather than from what it absorbed in training. It is the right approach when answers must reflect current, organisation-specific material and must be checkable against a source, which covers most enterprise knowledge use cases.',
  },
  {
    q: 'Can you add AI to a product we already have?',
    a: 'Yes, and it is one of the most common engagements. Model or agent capability is integrated into an existing application, knowledge base or workflow while preserving the systems, permissions and controls already in place, rather than requiring the product to be rebuilt around the feature.',
  },
  {
    q: 'How do you stop a model answering from documents a user is not allowed to see?',
    a: 'By modelling permissions before the index is built, so entitlements are enforced at retrieval rather than applied afterwards in the application layer. Retrieval that respects who is allowed to see what is the part of enterprise RAG that most often decides whether a rollout goes ahead.',
  },
];

export default function LlmIntegrationRagPage() {
  return (
    <>
      <JsonLd
        data={serviceSchema({
          name: 'LLM Integration & RAG',
          description:
            'Model intelligence added to existing products and knowledge environments with retrieval, entitlement-aware permissions, grounded context and citations.',
          path: '/ai-engineering/llm-integration-rag',
          serviceType: 'LLM integration and retrieval-augmented generation',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI & Automation', path: '/ai-engineering' },
          { name: 'LLM Integration & RAG', path: '/ai-engineering/llm-integration-rag' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Automate · LLM Integration &amp; RAG</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Model intelligence inside the product you already run.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Add model capability to existing products and knowledge environments with retrieval,
            permissions and grounded context. The systems and controls you already have stay in
            place; the intelligence goes where the work is, not into a chat box bolted to the side.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Add AI to a product</Cta>
            <Cta href="/ai-engineering" variant="secondary">
              All AI &amp; automation
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="rag-build-heading">
        <SectionHead
          title="What the integration involves"
          id="rag-build-heading"
          lead="The model is the smallest decision in this list. Everything else is what determines whether the feature is trustworthy, affordable and defensible."
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

      {/* --------------------------------------------------------- failures */}
      <Section labelledBy="rag-fail-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Four ways this goes wrong"
          id="rag-fail-heading"
          title="All of them are design problems, not model problems."
          lead="Every one of these is recoverable, and every one is considerably cheaper to prevent than to discover in front of a customer."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {failures.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ what it needs */}
      <Section labelledBy="rag-needs-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Grounding is the product"
              id="rag-needs-heading"
              title="An answer nobody can check is an opinion with a citation style."
            />
            <p className="body" style={{ marginTop: 20 }}>
              The purpose of retrieval is not to make the model sound informed. It is to make the
              answer traceable: this passage, from this document, at this version, at this time. That
              is what lets a professional rely on the output, and it is what lets you explain the
              output later to somebody who is unhappy about it.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              It also makes the system measurable. Grounded answers can be graded pass or fail
              against an agreed definition of correct, which is what turns a feature into something
              you can hold to a threshold.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/ai-engineering/evaluation-and-observability">
                How we grade output quality
              </FLink>
            </p>
          </div>

          <div>
            <Eyebrow>What has to be true first</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Most of the difficulty in an LLM integration is upstream of the model: the content has
              to be reachable, the permissions have to be modelled, and there has to be a stable
              vocabulary between your systems and the retrieval layer so an answer does not change
              because somebody renamed a field.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Where that layer does not exist yet, we build it, and we are explicit that it is the
              larger part of the work rather than presenting it as a preliminary.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering/data-and-integration" variant="secondary">
                Data &amp; integration
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering." />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a product that should be answering questions?">
        Tell us what it holds, who is allowed to see which parts of it, and what a good answer looks
        like. Those three answers decide the architecture.
      </ClosingCta>
    </>
  );
}
