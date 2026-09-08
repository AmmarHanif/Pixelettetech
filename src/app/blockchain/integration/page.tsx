import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Blockchain Integration',
  description:
    'Connect blockchain components to existing applications, data and off-chain systems, including indexing, identity mapping, settlement and reconciliation.',
  path: '/blockchain/integration',
});

const capabilities = [
  {
    title: 'On-chain and off-chain boundary',
    body: 'Deciding what genuinely belongs on a chain and what belongs in a database. Almost every workable design puts far less on-chain than the first proposal did.',
  },
  {
    title: 'Indexing and read models',
    body: 'Chain data is expensive and slow to query directly. An indexing layer turns it into something an application can read at product speed and a report can be built on.',
  },
  {
    title: 'Identity and access mapping',
    body: 'Connecting an address to a customer record, a permission set and an audit trail, so on-chain activity is attributable inside your own systems.',
  },
  {
    title: 'Payments and settlement',
    body: 'Where value moves between chain and conventional rails, with the states, retries, timeouts and failure paths designed rather than assumed.',
  },
  {
    title: 'Reconciliation and reporting',
    body: 'Making chain state, application state and finance records agree, and producing the evidence when they do not. Nobody enjoys this and everybody eventually needs it.',
  },
  {
    title: 'Operational monitoring',
    body: 'Node and provider health, confirmation depth, fee conditions, stuck transactions and reorganisations, alerting to people who can act on them.',
  },
];

const risks = [
  {
    title: 'Finality is not instant',
    body: 'A transaction that looks confirmed is a probability, not a fact. Applications that treat it as a fact eventually reverse a customer’s balance.',
  },
  {
    title: 'Fees are a runtime condition',
    body: 'Cost and confirmation time move with network conditions. A design that ignores this works beautifully until the week it does not.',
  },
  {
    title: 'Bridges concentrate risk',
    body: 'Cross-chain movement has been one of the most heavily exploited areas in the field. We treat a bridging requirement as a reason to re-examine the design.',
  },
  {
    title: 'Providers are a dependency',
    body: 'Node providers, indexers and price feeds are third parties with outages. They belong in your resilience plan alongside every other supplier.',
  },
];

const faqs = [
  {
    q: 'What does blockchain integration involve?',
    a: 'Connecting on-chain components to the applications, data and off-chain systems a business already runs: deciding the boundary between chain and database, building the indexing layer that makes chain state readable at product speed, mapping addresses to customer records and permissions, handling settlement between chain and conventional rails, and reconciling chain state with application and finance records.',
  },
  {
    q: 'Why do you need an indexing layer?',
    a: 'Because querying a chain directly is slow and expensive, and applications and reports need data at product speed. An indexing layer reads chain events into a queryable read model, which is also what makes reconciliation, reporting and customer support practical.',
  },
  {
    q: 'What are the main operational risks in integrating a chain?',
    a: 'Treating apparent confirmation as final when it is probabilistic; designs that assume stable fees and confirmation times; cross-chain bridges, which have been among the most heavily exploited components in the field; and dependence on third-party node providers, indexers and price feeds that have outages like any other supplier.',
  },
];

export default function BlockchainIntegrationPage() {
  return (
    <div className="theme-amber">
      <JsonLd
        data={serviceSchema({
          name: 'Blockchain Integration',
          description:
            'Interoperability and integration between blockchain components and existing applications, data and off-chain systems, including indexing, settlement and reconciliation.',
          path: '/blockchain/integration',
          serviceType: 'Blockchain systems integration',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blockchain', path: '/blockchain' },
          { name: 'Blockchain Integration', path: '/blockchain/integration' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Decentralise · Integration</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            The chain is one system among several. It has to talk to the rest.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Connect blockchain components to existing applications, data and off-chain systems.
            Indexing, identity mapping, settlement, reconciliation and the operational monitoring
            that keeps the whole arrangement honest.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope blockchain</Cta>
            <Cta href="/blockchain" variant="secondary">
              The blockchain practice
            </Cta>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="bi-build-heading">
        <SectionHead
          title="What the work covers"
          id="bi-build-heading"
          lead="Integration is where a blockchain project stops being a proof of concept and starts being something a business can operate."
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

      {/* ------------------------------------------------------------ risks */}
      <Section labelledBy="bi-risk-heading" style={{ background: '#FBF8F4' }}>
        <SectionHead
          eyebrow="Four things a demonstration never shows you"
          id="bi-risk-heading"
          title="They all appear in the second month of production."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {risks.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 30, maxWidth: '76ch' }}>
          Each of these is manageable with ordinary engineering discipline: designed states, retries,
          idempotency, monitoring and a reconciliation process. What is not manageable is discovering
          them after real value is moving.
        </p>
      </Section>

      {/* --------------------------------------------------------- boundary */}
      <Section labelledBy="bi-boundary-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The design question"
              id="bi-boundary-heading"
              title="Put on-chain only what has to be there."
            />
            <p className="body" style={{ marginTop: 20 }}>
              A chain is good at a specific set of things: shared state that no single party
              controls, ownership that can be independently verified, and rules that execute the same
              way for everyone. It is a poor and expensive substitute for a database in every other
              respect.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              So the boundary is the architecture. We push everything else off-chain, where it is
              cheaper, faster, private by default and possible to correct — and we are explicit about
              which properties you give up when something moves in either direction.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/blockchain/smart-contracts-dapps">Smart contracts &amp; dApps</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>Where it fits an existing business</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Most of the integration work we are asked for is not a crypto product. It is an
              established business with existing systems that wants a specific verifiable or
              programmable property, and needs it to coexist with the CRM, the finance system and the
              reporting everyone already relies on.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              That is a conventional integration problem with an unforgiving component in the middle,
              which is precisely the combination this practice exists for.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/engineering/cloud-data-engineering" variant="secondary">
                Cloud &amp; data engineering
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <ClosingCta title="Need a chain to coexist with your estate?" ctaLabel="Scope blockchain">
        Tell us what is on-chain, what is in your systems, and where the two currently disagree.
        Reconciliation is usually the fastest way to find the real design problem.
      </ClosingCta>
    </div>
  );
}
