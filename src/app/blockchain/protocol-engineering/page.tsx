import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Layer 1 / Layer 2 protocol engineering',
  description:
    'Specialist network and protocol engineering where a bespoke chain or scaling layer is genuinely justified, including consensus, execution and node operations.',
  path: '/blockchain/protocol-engineering',
});

const capabilities = [
  {
    title: 'Justification and requirement analysis',
    body: 'Establishing what a general-purpose chain fails to provide for your case: throughput, cost, privacy, governance, finality or control. Without a specific failure, this work should not start.',
  },
  {
    title: 'Consensus and validator design',
    body: 'Who validates, how they are selected, what they are paid, what happens when they misbehave, and how the set changes over time.',
  },
  {
    title: 'Execution and state',
    body: 'The execution environment, state model, fee mechanism and the compatibility decisions that determine whether existing tooling works or has to be rebuilt.',
  },
  {
    title: 'Scaling layers and rollups',
    body: 'Where a Layer 2 answers the requirement without the burden of a sovereign network, including data availability, settlement and exit design.',
  },
  {
    title: 'Node operations and upgrades',
    body: 'Running a network is an operational commitment: releases, coordinated upgrades, observability, incident response and the governance to agree a change.',
  },
  {
    title: 'Economic and incentive design',
    body: 'Fees, rewards, issuance and the behaviour those incentives will actually produce, including the behaviour you did not intend.',
  },
];

const tests = [
  {
    title: 'Name the failure',
    body: 'Which specific requirement does an existing chain not meet? A general dissatisfaction is not a specification.',
  },
  {
    title: 'Cost the operation',
    body: 'A network needs validators, upgrades, monitoring and a team, indefinitely. That standing cost usually decides the question.',
  },
  {
    title: 'Count the ecosystem',
    body: 'A new network starts with no wallets, no explorers, no tooling and no integrations. Everything you assumed exists must be built.',
  },
  {
    title: 'Exhaust the alternatives',
    body: 'An app-specific chain, a rollup, a permissioned network or an existing chain with a different design frequently meet the same requirement for far less.',
  },
];

const faqs = [
  {
    q: 'When is a bespoke chain or Layer 2 actually justified?',
    a: 'When a general-purpose chain demonstrably fails a specific requirement: throughput, cost per transaction, privacy, governance, finality guarantees or control over upgrades, and the alternatives have been exhausted. Absent a named failure of that kind, an existing chain, an app-specific rollup or a permissioned network will usually meet the requirement for a fraction of the standing cost.',
  },
  {
    q: 'What is the real cost of running your own network?',
    a: 'It is an operational commitment rather than a project. Validators have to be run or recruited, releases and coordinated upgrades managed, the network monitored and incidents handled, and governance maintained to agree changes. A new network also starts with no wallets, explorers, tooling or integrations, so everything a mature ecosystem provides has to be built or funded.',
  },
  {
    q: 'Do you work on Layer 2 and rollups as well as Layer 1?',
    a: 'Yes, and a scaling layer is frequently the better answer. A rollup can deliver the throughput and cost characteristics a project needs while inheriting settlement and much of the surrounding ecosystem from an established chain, which removes most of the sovereignty burden of a bespoke Layer 1.',
  },
];

export default function ProtocolEngineeringPage() {
  return (
    <div>
      <JsonLd
        data={serviceSchema({
          name: 'Layer 1 / Layer 2 & Protocol Engineering',
          description:
            'Network and protocol engineering including consensus and validator design, execution and state, scaling layers and rollups, node operations and incentive design.',
          path: '/blockchain/protocol-engineering',
          serviceType: 'Blockchain protocol engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blockchain', path: '/blockchain' },
          {
            name: 'Layer 1 / Layer 2 & Protocol Engineering',
            path: '/blockchain/protocol-engineering',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Decentralise · Protocol Engineering</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            A bespoke chain is rarely the answer. Occasionally it is the only one
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Specialist network and protocol engineering, for the cases where a general-purpose chain
            genuinely fails the requirement and a scaling layer or sovereign network is warranted.
            This is the deepest end of the practice and the smallest part of it, by design.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope blockchain</Cta>
            <Cta href="/blockchain" variant="secondary">
              The blockchain practice
            </Cta>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------ tests */}
      <Section labelledBy="pe-test-heading">
        <SectionHead
          eyebrow="Justification first"
          id="pe-test-heading"
          title="Four tests before this work is worth starting"
          lead="Most enquiries that reach this page do not pass all four, and saying so is considerably more useful than taking the engagement."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {tests.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="pe-build-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          title="What the work covers"
          id="pe-build-heading"
          lead="Where the tests are passed, the engineering spans consensus, execution, operations and the incentives that hold the whole thing together."
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

      {/* ---------------------------------------------------------- ladder */}
      <Section labelledBy="pe-ladder-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The ladder of options"
              id="pe-ladder-heading"
              title="Climb it in order, and stop at the first rung that works"
            />
            <p className="body" style={{ marginTop: 20 }}>
              An existing general-purpose chain. Then an existing chain with a different design
              profile. Then an application-specific rollup, which inherits settlement, tooling and
              much of the ecosystem. Then a permissioned network, where the participants are known
              and the trust model is different. Only then a sovereign Layer 1.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Each rung is materially cheaper to build and to operate than the one above it. The
              purpose of the ladder is to make sure the decision is made on the requirement rather
              than on ambition.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/blockchain/integration">Integration with your existing systems</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>Why this competence matters elsewhere</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Protocol work is engineering under adversarial conditions: every action is permanent,
              publicly visible, and reviewed by people trying to break it for profit. That teaches a
              discipline most software teams never have to learn, which is proving a system behaved
              correctly to somebody who assumes it did not.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              It is the same discipline an enterprise now demands of an AI system: the audit trail,
              the decision boundary, the evidence. Which is a large part of why both practices sit
              in one firm.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/ai-automation" variant="secondary">
                See AI &amp; automation
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Think you need your own network?" ctaLabel="Scope blockchain">
        Tell us the requirement an existing chain fails to meet. If a rollup or an existing network
        would do it, that is what we will recommend, and we will show our reasoning.
      </ClosingCta>
    </div>
  );
}
