import Link from 'next/link';

import { ClosingCta, ValueModelCards } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  Faqs,
  JsonLd,
  MediaSlot,
  PillRow,
  Section,
  SectionHead,
} from '@/components/ui';
import {
  chains,
  company,
  consensusAndCryptography,
} from '@/content/company';
import { caseStudies, displayKicker, displayName, publishedImage, publishedMetrics } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * Claims sweep, 2026-09-08 (WP6).
 *
 * This page carried more held claims than any other on the site. Removed:
 *
 *  - the four hero stat tiles ($14M tokenised, 1,200+ tokens, £500,000+ sales
 *    volume, 24 chains) and "$14M in tokenised assets" in the tokenisation
 *    capability. claims.ts holds blockchain volumes, values and chain counts
 *    outright, pending production evidence and definitions. Presented as hero
 *    tiles these also read as practice-wide totals when they are figures from
 *    two named engagements, which is the "overall presentation" that DMCCA
 *    2024 s.226 reaches even where each individual number is true.
 *  - "Twenty-four chains and protocols in production use" from the hero, the
 *    chains section heading, the FAQ (and therefore the FAQPage JSON-LD) and
 *    the metadata description. The chain LIST stays: claims.ts is explicit
 *    that a capability list is not a production claim, and only the wording
 *    that turns it into a count "in production use" is held.
 *  - "delivered under ISO 9001 and ISO 27001" from the hero and the metadata
 *    description. Both badges are HELD; design/certificates/ is empty.
 *  - "independent audit of contracts written by someone else", and "audit" as
 *    a service word throughout. The register's instruction is HOLD / REWORD:
 *    use review and testing unless the audit competence and scope is
 *    evidenced. /blockchain/smart-contracts-dapps already says "We do not call
 *    our own testing an audit"; this hub was contradicting its own child page.
 *
 * Not removed: "audit trail", and a buyer's own audit and reporting concerns.
 * Those are properties of a system and questions a regulated buyer asks. They
 * assert no audit competence on our side.
 */
export const metadata = pageMetadata({
  title: 'Blockchain development and tokenisation',
  description:
    'Asset tokenisation, smart contract engineering and review, wallets, exchanges and dApps. A specialist blockchain practice, engineering since 2018.',
  path: '/blockchain',
});

const capabilities = [
  {
    id: 'asset-tokenisation',
    title: 'Asset tokenisation platforms',
    body: 'Fractional ownership of real assets, with the custody, compliance and reporting around it. What the token represents, who may hold it and how it reconciles to the off-chain record are designed together.',
  },
  {
    id: 'smart-contracts',
    title: 'Smart contract development and review',
    body: 'Contracts written to be read, and structured review and testing of contracts written by someone else. We do not call our own testing an audit. On chain, a mistake is permanent.',
  },
  {
    id: 'wallets',
    title: 'Crypto wallets',
    body: 'Custodial and non-custodial, including multi-party computation and key management that survives a security review.',
  },
  {
    id: 'wallets-exchanges',
    title: 'Exchange development',
    body: 'Centralised and decentralised exchange builds, matching, liquidity and the operational tooling behind them.',
  },
  {
    id: 'dapps-defi',
    title: 'dApps and DeFi',
    body: 'Decentralised applications and DeFi protocols, from front end through to the contracts and the indexing layer.',
  },
  {
    id: 'layers-daos',
    title: 'Layer 1, Layer 2 and DAOs',
    body: 'Chain and rollup work where a general-purpose chain will not do, plus DAO governance structures and token design.',
  },
];

/**
 * The five specialist pages beneath this hub. They fill the hero slot the stat
 * tiles vacated; see the hero comment below.
 */
const servicePages = [
  { href: '/blockchain/tokenisation', label: 'Tokenisation' },
  { href: '/blockchain/smart-contracts-dapps', label: 'Smart contracts & dApps' },
  { href: '/blockchain/wallets-digital-assets', label: 'Wallets & digital assets' },
  { href: '/blockchain/protocol-engineering', label: 'Protocol engineering' },
  { href: '/blockchain/integration', label: 'Integration' },
];

const faqs = [
  {
    q: 'Which chains and protocols does Pixelette Technologies work with?',
    a: 'The practice works with Ethereum, Binance Smart Chain, Polygon, Solana, Avalanche, Cardano, Polkadot, Hyperledger Fabric, Corda, Stellar, Hedera Hashgraph, Algorand, Cosmos, Arbitrum, Optimism, zkSync, Near, Aptos and Sui, among others. Where a project needs a chain the firm has not used, it says so and prices the learning curve rather than hiding it in the estimate.',
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
    ['blockguard', 'chysler', 'diamond-nxt'].includes(
      c.slug,
    ),
  );

  return (
    <div>
      <JsonLd
        data={serviceSchema({
          name: 'Blockchain development',
          description:
            'Asset tokenisation, smart contract development, review and testing, wallets, exchanges, dApps and DeFi, Layer 1 and Layer 2 engineering.',
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

          {/* The five specialist pages stand where the four stat tiles stood.
              Removing an unevidenced number should not leave a hollow hero, and
              this hub had no links to its own children at all — so the space
              goes to navigation that is true by construction. */}
          <div style={{ marginTop: 44 }}>
            <Eyebrow>The practice</Eyebrow>
            <div className="pill-row" style={{ marginTop: 16 }}>
              {servicePages.map(page => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="pill"
                  style={{ color: 'var(--brand)' }}
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- what we build */}
      <Section labelledBy="bc-build-heading">
        <SectionHead
          title="What we build"
          id="bc-build-heading"
          lead="From the consulting engagement that decides whether a chain is the right answer, through to the review and testing that let you ship."
        />
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {capabilities.map(cap => (
            <div key={cap.id} id={cap.id} className="card" style={{ scrollMarginTop: 100 }}>
              <h3 className="h4">{cap.title}</h3>
              <p className="body" style={{ marginTop: 12, fontSize: 15 }}>
                {cap.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- chains */}
      <Section labelledBy="chains-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Chains and protocols"
          id="chains-heading"
          title="The networks we work with, not a league table"
          lead="This is the list the practice works across. We do not add a chain to it because it is fashionable, and where a project needs one we have not used, we say so and price the learning curve honestly rather than hiding it in the estimate."
        />
        <PillRow items={chains} style={{ marginTop: 34 }} />

        <h3 className="eyebrow" style={{ marginTop: 44 }}>
          Consensus and cryptography
        </h3>
        <PillRow items={consensusAndCryptography} style={{ marginTop: 18 }} />
      </Section>

      {/* -------------------------------------------------------- delivered */}
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
            `cs.client`, `cs.kicker`, `cs.image` or `cs.metrics` directly was
            safe here only because every slug in the list above happens to be
            CONFIRMED; adding one PENDING slug would have published a client's
            name and their own product screenshot. */}
        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {featured.map(cs => {
            const metrics = publishedMetrics(cs).slice(0, 2);
            return (
              <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
                <MediaSlot
                  label={cs.imageLabel}
                  src={publishedImage(cs)}
                  alt={`${displayName(cs)} — ${cs.title}`}
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

      {/* -------------------------------------------------- where this sits */}
      {/*
        Build • Automate • Decentralise • Run, reintroduced (2026-09-11); see
        the note on /engineering for why the model now reaches the hubs at all.

        This hub needs it more than the other two. A visitor who lands here from
        a tokenisation search has no way of knowing that blockchain is one
        specialism inside an engineering company rather than the whole of it,
        and the handoff is explicit that blockchain must read as specialist
        depth and not as a third equal division. Four cards with Decentralise
        marked, immediately before the section that argues the same point in
        prose, is the cheapest way to say so.

        The tint is `#F7FAFA`, the same one the chains section above uses, not
        a new colour; the brand border on the current card resolves through
        `var(--brand)`.

        BOTH CHANGED 2026-09-16 when the crimson practice theme was deleted. The
        tint was `#FBF8F4`, a warm cream chosen to sit under crimson - left in
        place under purple it would have read as a cast mismatch, so it moved
        with the accent rather than being left behind.
      */}
      <Section labelledBy="bc-model-heading" style={{ background: '#F7FAFA' }}>
        {/*
            NOT the homepage's h2, which this used to repeat verbatim. That line
            is a POSITIONING statement and it is right on the page that
            introduces the company; on a hub the reader has already chosen, so
            they need to know where they are in the set, not what the company is.
            The same string was on all four pages until 2026-09-15.

            The homepage instance is deliberately unchanged.

            PAGE-SPECIFIC SINCE 2026-09-16, deliberately. Until then the h2 read
            "This is one of four services" -- one string on all three hubs, kept
            identical so it could not drift. It bought that too dearly.
            SectionHead renders `title` as the h2 whose id the wrapping Section
            points at, so this string IS the accessible name of the whole
            region, and "This is" has no referent read cold: in a heading list
            it announced a position without saying which one. Naming the
            practice here also lets the lead stop re-answering it, which removes
            one of the three places this section stated the reader's position
            (h2, lead, card marker). Two remain and both earn it.

            "our" is not decoration. `groupBlurb` renders in the footer of this
            very page and says "Pixelette Technologies is one of four companies
            in Pixelette Group", so an unqualified "one of four" would appear
            twice on one page against two different sets of four.

            The h2 and `current` below must always name the same practice.
            Nothing enforces that. Change one, change the other.
        */}
        <SectionHead
          eyebrow="Where this sits"
          id="bc-model-heading"
          title="Decentralise is one of our four services"
          lead="Build, Automate and Run are the other three."
        />
        <div style={{ marginTop: 36 }}>
          <ValueModelCards current="DECENTRALISE" />
        </div>
      </Section>

      {/* ------------------------------------------------------ why it maps */}
      <Section labelledBy="why-bc-heading">
        {/*
          THE SECTOR PILL ROW WAS REMOVED HERE 2026-09-16, and this is a claims
          matter rather than a design one.

          It published "Sectors we have delivered into" over twelve names:
          financial services, insurance, healthcare, retail, logistics, energy,
          manufacturing, public sector, telecom, hospitality, food and beverage,
          entertainment. Checked against every case study in src/content/work.ts,
          TEN OF THE TWELVE have no supporting engagement in this repository at
          all, and the two that are arguable - financial services and healthcare
          - are arguable as ENGINEERING work, not as blockchain delivery, which
          is what this page's heading asserts.

          IT WAS NEVER IN THE CLAIMS REGISTER. src/content/claims.ts holds no
          sector row, so the gate that exists to stop exactly this never saw it:
          the register catches figures, and a list of twelve nouns carries no
          digit. Same blind spot as a market claim sitting in a heading.

          The founder raised it himself and offered the remedy - "if that can't
          be verified, is it better we just take this section out?" It cannot be
          verified from anything here, so it is out. If the engagements did
          happen, the route back is evidence per sector, not a shorter list.

          The regulated-buyer paragraph SURVIVED and moved into the column
          below; it was the only load-bearing content in the block, and it says
          something about who asks rather than about where we have worked. The
          two-column grid went with the pills: a `grid grid-2` left holding one
          child renders at half width with an empty track beside it, which is a
          defect this repository has already shipped once.
        */}
        <div style={{ maxWidth: '72ch' }}>
          <SectionHead
            eyebrow="Why this matters beyond crypto"
            id="why-bc-heading"
            title="Auditable systems are the same problem twice"
          />
          <p className="body" style={{ marginTop: 20 }}>
            Building where every action is permanent, publicly verifiable and reviewed by
            adversaries teaches a discipline that most software teams never have to learn: prove it
            behaved correctly, to somebody who assumes it did not.
          </p>
          <p className="body" style={{ marginTop: 16 }}>
            That is now exactly what an enterprise asks about an AI system. The audit trail, the
            decision boundary, the evidence. Our AI engineering work is that same competence pointed
            at a newer problem, which is why the two sit in one firm. Where a programme needs
            formal governance or a route to independent assessment at the end of it, that is
            Pixelette Certified’s work to scope and coordinate, not ours.
          </p>
          <p className="body" style={{ marginTop: 16 }}>
            Tokenisation questions increasingly come from regulated buyers rather than from
            crypto-native ones. Those conversations tend to start with custody, reporting and audit
            rather than with the chain, and we are set up for that.
          </p>
          <div style={{ marginTop: 28 }}>
            <Cta href="/ai-engineering" variant="secondary">
              See AI engineering
            </Cta>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta
        title="Have a tokenisation or contract project?"
        ctaLabel="Scope a blockchain build"
      >
        Bring us the mechanism you have in mind. We will tell you whether a chain genuinely earns its
        place in it, including when the honest answer is that a database would do.
      </ClosingCta>
    </div>
  );
}
