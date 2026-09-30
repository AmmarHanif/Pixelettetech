import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, MediaSlot, SIZES, Section, SectionHead } from '@/components/ui';
import { company, chains } from '@/content/company';
import { caseStudies, displayKicker, displayName, publishedImage, publishedMetrics } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Claims sweep, 2026-09-08 (WP6). Preserved in full because it records what was
 * withdrawn from this page and must not come back:
 *
 *  - the four hero stat tiles ($14M tokenised, 1,200+ tokens, £500,000+ sales
 *    volume, 24 chains) and "$14M in tokenised assets". claims.ts holds
 *    blockchain volumes, values and chain counts outright. As hero tiles they
 *    also read as practice-wide totals when they are figures from two named
 *    engagements.
 *  - "Twenty-four chains and protocols in production use" from the hero, the
 *    chains heading, the FAQ and the metadata. The chain LIST stays; only the
 *    wording that turns it into a production count is held.
 *  - "delivered under ISO 9001 and ISO 27001". Both badges are HELD.
 *  - "audit" as a service word. The register's instruction is HOLD / REWORD:
 *    review and testing, unless the audit competence and scope is evidenced.
 *
 * Not removed: "audit trail", and a buyer's own audit and reporting concerns.
 * Those are properties of a system and questions a regulated buyer asks.
 *
 * ------------------------------------------------------------------------
 * RESTRUCTURED 2026-09-30 to Blockchain Estate Phase 1.
 *
 * FIVE PARALLEL PRACTICES BECAME THREE CUSTOMER ROUTES. The overview exposed
 * Tokenisation, Smart contracts & dApps, Wallets & digital assets, Protocol
 * engineering and Integration as five equal things, and then ALSO listed six
 * capability cards underneath - two taxonomies of the same practice, neither of
 * them the way a buyer arrives. Each route now leads with the question the
 * buyer is actually asking.
 *
 * THE EVIDENCE MOVED UP. Case studies sat fourth, behind two layers of
 * technical taxonomy. The narrative is now judgement, then what we build, then
 * proof we have built it.
 *
 * Consensus and cryptography was a full section with a pill row of mechanisms;
 * it is one short paragraph. "Decentralise is one of our four services" is gone
 * entirely. The auditability argument is three paragraphs shorter.
 *
 * NO SUB-PAGE, URL, REDIRECT OR NAVIGATION DESTINATION WAS TOUCHED. Every link
 * below points at a route that exists today.
 */
export const metadata = pageMetadata({
  title: 'Blockchain development',
  description:
    'Tokenisation and digital assets, smart contracts and applications, and integration and protocol engineering. A specialist blockchain practice, engineering since 2018.',
  path: '/blockchain',
});

/**
 * The three customer-facing routes.
 *
 * `question` is the device that keeps this from being another taxonomy: a buyer
 * does not arrive knowing whether they want "protocol engineering", they arrive
 * with a question. The five specialist pages beneath are linked from the route
 * that will eventually absorb them, so the overview establishes the new
 * architecture while every existing URL keeps working.
 */
const ROUTES = [
  {
    n: '01',
    title: 'Tokenisation & digital assets',
    question: 'Do you need to represent, issue or manage an asset on-chain?',
    body: 'Design and engineer digital-asset systems around the rights, ownership, issuance, custody and user experience they actually require.',
    facets: ['Rights and token design', 'Issuance and custody', 'Wallets and reporting'],
    links: [
      { href: '/blockchain/tokenisation', label: 'Tokenisation' },
      { href: '/blockchain/wallets-digital-assets', label: 'Wallets & digital assets' },
    ],
  },
  {
    n: '02',
    title: 'Smart contracts & applications',
    question: 'Do you need programmable on-chain behaviour?',
    body: 'Programmable rules and applications engineered for the places where on-chain execution, ownership or verification materially matters.',
    facets: ['Design and permissions', 'Testing and upgradeability', 'Review preparation'],
    links: [{ href: '/blockchain/smart-contracts-dapps', label: 'Smart contracts & applications' }],
  },
  {
    n: '03',
    title: 'Integration & protocol engineering',
    question: 'Does this connect to your existing estate, or genuinely need specialist network engineering?',
    body: 'Connect blockchain infrastructure to existing systems, or engineer specialist network infrastructure where an existing chain genuinely cannot meet the requirement.',
    facets: ['APIs and indexing', 'Identity and payments', 'Monitoring and interoperability'],
    links: [
      { href: '/blockchain/integration', label: 'Integration' },
      { href: '/blockchain/protocol-engineering', label: 'Protocol engineering' },
    ],
  },
];

/**
 * When a chain earns its place. Properties, not products.
 *
 * This REPLACED a prominent section of consensus mechanisms - Proof of Work,
 * Proof of Stake, delegated PoS, PBFT and the rest. Those are implementation
 * choices a project makes after it has decided it needs a chain at all, and
 * they were standing where the commercial question should be.
 */
const EARNS = [
  { label: 'Independently verifiable ownership', line: 'Outsiders can check who holds what.' },
  { label: 'Shared state between parties', line: 'One record nobody controls alone.' },
  { label: 'Programmable rules', line: 'The same rule executes for everyone.' },
  { label: 'Distributed verification', line: 'Checked by more than the beneficiary.' },
  { label: 'Auditable state transitions', line: 'Changes cannot be quietly revised.' },
];

const chainSentence = `${chains.slice(0, -1).join(', ')} and ${chains[chains.length - 1]}`;

/**
 * Three questions, unchanged. They already matched the themes Phase 1 names -
 * which chains, will you say no, and how this connects to the wider practice -
 * so reviewing them after the restructure changed nothing.
 */
const faqs = [
  {
    /*
     * KEPT WITH ITS LIST, on founder instruction 2026-09-16: "I want you to
     * keep this and the associated list so people know what we can work with."
     *
     * The wording makes the capability/delivery distinction explicit rather
     * than leaving a reader to infer a delivery record from a list.
     */
    q: 'Which chains and protocols does Pixelette Technologies work with?',
    a: `The practice builds on ${chainSentence}. That is the range it works across rather than a record of past delivery: the chain used on a given engagement is named in that engagement's case study. Where a project needs a chain the firm has not used, it says so and prices the learning curve rather than hiding it in the estimate.`,
  },
  {
    q: 'Will Pixelette tell me if I do not need a blockchain?',
    a: 'Yes. The firm assesses whether a chain genuinely earns its place in a proposed mechanism, including when the honest answer is that a conventional database would do the job.',
  },
  {
    q: 'What connects blockchain work to AI engineering?',
    a: 'Both are the same problem: proving a system behaved correctly to somebody who assumes it did not. Building where every action is permanent, publicly verifiable and reviewed by adversaries teaches the audit trail, decision boundary and evidence discipline that enterprises now demand of AI systems.',
  },
];

export default function BlockchainPage() {
  const featured = caseStudies.filter(c =>
    ['blockguard', 'chysler', 'diamond-nxt'].includes(c.slug),
  );

  return (
    <div>
      <JsonLd
        data={serviceSchema({
          name: 'Blockchain development',
          description:
            'Tokenisation and digital assets, smart contracts and applications, integration and protocol engineering.',
          path: '/blockchain',
          serviceType: 'Blockchain development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blockchain', path: '/blockchain' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      {/* PRESERVED: the headline, the proposition and the principle sentence,
          which is the central positioning statement for this practice. The
          five-pill "practice" row below it was REMOVED - the three routes now
          carry links to all five specialist pages, so it was a second
          navigation of the same set. */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Blockchain</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '20ch' }}>
            Tokenisation and decentralised systems, since {company.incorporated}
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Pixelette began as a blockchain studio and it remains our deepest specialism:
            tokenisation, smart contracts, wallets, exchanges and the infrastructure underneath
            them. We use a chain where ownership, programmability or distributed verification
            genuinely creates an advantage, and we say so when it does not.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a blockchain build</Cta>
            <Cta href="/case-studies" variant="secondary">
              See blockchain work
            </Cta>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------- 01 three routes */}
      <Section labelledBy="bc-routes-heading">
        <SectionHead
          eyebrow="What we build"
          id="bc-routes-heading"
          title="Three ways blockchain work arrives"
        />
        <div className="bc-routes">
          {ROUTES.map(r => (
            <div className="bc-route" key={r.n}>
              <span className="bc-route__n">{r.n}</span>
              <h3 className="h4 bc-route__t">{r.title}</h3>
              <p className="bc-route__q">{r.question}</p>
              <p className="body bc-route__b">{r.body}</p>
              <ul className="bc-route__facets">
                {r.facets.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="bc-route__links">
                {r.links.map(l => (
                  <FLink href={l.href} key={l.href}>
                    {l.label}
                  </FLink>
                ))}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------- 02 when it earns its place */}
      <Section labelledBy="bc-earns-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Judgement first"
          id="bc-earns-heading"
          title="When does blockchain earn its place?"
          lead="When one of these properties materially improves the system."
        />
        <div className="bc-earns">
          {EARNS.map(e => (
            <div className="bc-earn" key={e.label}>
              <b>{e.label}</b>
              <span>{e.line}</span>
            </div>
          ))}
        </div>
        <p className="body bc-rule">
          A blockchain is not the default answer. Where a conventional database is the better
          architecture, we say so. That judgement is part of the work.
        </p>
      </Section>

      {/* ------------------------------------------------- 03 the evidence */}
      {/* MOVED UP. It sat fourth, behind two layers of technical taxonomy.
          Judgement, then what we build, then proof we have built it. */}
      <Section labelledBy="delivered-heading">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <SectionHead
            eyebrow="Delivered"
            id="delivered-heading"
            title="Named platforms, measured results"
          />
          <FLink href="/case-studies">Read the full case studies</FLink>
        </div>

        {/* Through the work.ts publication gate, not around it. Reading
            `cs.client`, `cs.kicker`, `cs.image` or `cs.metrics` directly is
            safe here only because every slug above is CONFIRMED; adding one
            PENDING slug would publish a client's name and their own image. */}
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {featured.map(cs => {
            const metrics = publishedMetrics(cs).slice(0, 2);
            return (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
                <MediaSlot
                  label={cs.imageLabel}
                  src={publishedImage(cs)}
                  alt={`${displayName(cs)}: ${cs.title}`}
                  sizes={SIZES.grid3}
                />
                <span className="mono work-card__kicker">{displayKicker(cs)}</span>
                <h3 className="h4" style={{ marginTop: 10 }}>
                  {cs.title}
                </h3>
                {metrics.length > 0 ? (
                  <div className="work-card__metrics">
                    {metrics.map(m => (
                      <span key={m.label}>
                        <b>{m.value}</b>
                        <span>{m.shortLabel ?? m.label}</span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </Link>
            );
          })}
        </div>
      </Section>

      {/* -------------------------------------------- 04 under the hood */}
      {/*
        WAS A FULL SECTION WITH A PILL ROW of consensus mechanisms - Proof of
        Work, Proof of Stake, delegated PoS, PBFT and the rest. That is
        implementation taxonomy, and it was standing at the same weight as the
        commercial argument. The depth is not denied, it is just no longer the
        second thing a buyer reads.
      */}
      <Section labelledBy="bc-hood-heading" tight style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Under the hood"
          id="bc-hood-heading"
          title="The mechanism follows the requirement"
          level={3}
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '72ch' }}>
          Network, consensus and cryptographic choices follow the requirement. Where they materially
          affect security, finality, cost or governance, we make them explicit.
        </p>
      </Section>

      {/* ------------------------------------- 05 engineering + reviewability */}
      {/*
        CONDENSED from three paragraphs and a secondary CTA. The argument that
        survives is the one that is specific to this practice: building where
        mistakes are permanent teaches a reviewability discipline. The
        Certified boundary stays as one clause, because Phase 1 is explicit that
        assurance must not come to dominate the blockchain proposition.
      */}
      <Section labelledBy="why-bc-heading">
        <div style={{ maxWidth: '72ch' }}>
          <SectionHead
            eyebrow="Why this matters beyond crypto"
            id="why-bc-heading"
            title="Auditable systems are the same problem twice"
          />
          <p className="body" style={{ marginTop: 20 }}>
            Building where every action is permanent and reviewed by adversaries teaches one
            discipline: prove it behaved correctly, to somebody who assumes it did not. That is what
            an enterprise now asks about an AI system, and what regulated buyers ask about custody
            and reporting before they ask about the chain.
          </p>
          <p className="body" style={{ marginTop: 16 }}>
            Where a programme needs a route to independent assessment, that is{' '}
            <FLink href="/assurance">Pixelette Certified</FLink> to coordinate, not us: the firm
            that builds a system is not the firm that assesses it. Alongside this practice sit{' '}
            <FLink href="/engineering">Engineering</FLink> and{' '}
            <FLink href="/ai-automation">AI &amp; Automation</FLink>.
          </p>
        </div>
      </Section>

      <Section labelledBy="faq-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a blockchain requirement?" ctaLabel="Scope a blockchain build">
        Bring us the problem, asset, workflow or system. We will tell you whether a chain genuinely
        earns its place and what the architecture should be, including when the answer is that a
        database would do.
      </ClosingCta>
    </div>
  );
}
