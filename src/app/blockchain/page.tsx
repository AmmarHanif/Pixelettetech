import Link from 'next/link';

import { ClosingCta } from '@/components/sections';
import {
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  MediaSlot,
  PillRow,
  Section,
  SectionHead,
  StatTile,
} from '@/components/ui';
import {
  blockchainSectors,
  chains,
  company,
  consensusAndCryptography,
} from '@/content/company';
import { caseStudies } from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Blockchain development and tokenisation',
  description:
    'Asset tokenisation, smart contracts and audit, wallets, exchanges and dApps. Twenty-four chains in production use, delivered under ISO 27001 since 2018.',
  path: '/blockchain',
});

const capabilities = [
  {
    id: 'asset-tokenisation',
    title: 'Asset tokenisation platforms',
    body: 'Fractional ownership of real assets, with the custody, compliance and reporting around it. Our largest delivered platform holds $14M in tokenised assets.',
  },
  {
    id: 'smart-contracts',
    title: 'Smart contract development and audit',
    body: 'Contracts written to be read by an auditor, and independent audit of contracts written by someone else. On chain, a mistake is permanent.',
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

const faqs = [
  {
    q: 'How many blockchains has Pixelette Technologies shipped on?',
    a: 'Twenty-four chains and protocols are in production use, including Ethereum, Binance Smart Chain, Polygon, Solana, Avalanche, Cardano, Polkadot, Hyperledger Fabric, Corda, Stellar, Hedera Hashgraph, Algorand, Cosmos, Arbitrum, Optimism, zkSync, Near, Aptos and Sui. Where a project needs a chain the firm has not used, it says so and prices the learning curve rather than hiding it in the estimate.',
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
    <div className="theme-amber">
      <JsonLd
        data={serviceSchema({
          name: 'Blockchain development',
          description:
            'Asset tokenisation, smart contract development and audit, wallets, exchanges, dApps and DeFi, Layer 1 and Layer 2 engineering.',
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
            Tokenisation and decentralised systems, since {company.incorporated}.
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Pixelette began as a blockchain studio and it remains our deepest specialism.
            Twenty-four chains and protocols in production use, delivered under ISO 9001 and ISO
            27001, with results we can name.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Scope a blockchain build</Cta>
            <Cta href="/case-studies" variant="secondary">
              See blockchain work
            </Cta>
          </div>

          <div className="grid grid-4" style={{ marginTop: 48 }}>
            <StatTile value="$14M" label="in assets tokenised, averaging 25 fractional owners per asset" />
            <StatTile value="1,200+" label="tokens sold within the first six months" />
            <StatTile value="£500,000+" label="total marketplace sales volume" />
            <StatTile value="24" label="chains and protocols in production use" />
          </div>
        </div>
      </div>

      {/* --------------------------------------------------- what we build */}
      <Section labelledBy="bc-build-heading">
        <SectionHead
          title="What we build"
          id="bc-build-heading"
          lead="End-to-end delivery, from the consulting engagement that decides whether a chain is the right answer through to the audit that lets you ship."
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
      <Section labelledBy="chains-heading" style={{ background: '#FBF8F4' }}>
        <SectionHead
          eyebrow="Chains and protocols"
          id="chains-heading"
          title="Twenty-four, in production, not on a slide."
          lead="We do not claim a chain we have not shipped on. Where a project needs one we have not used, we say so and price the learning curve honestly rather than hiding it in the estimate."
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
            title="Named platforms, measured results."
          />
          <FLink href="/case-studies">All work</FLink>
        </div>

        <div className="grid grid-3" style={{ marginTop: 36 }}>
          {featured.map(cs => (
            <Link key={cs.slug} href={`/case-studies/${cs.slug}`} className="work-card">
              <MediaSlot label={cs.imageLabel} src={cs.image} alt={`${cs.client} — ${cs.title}`} />
              <span className="mono work-card__kicker">{cs.kicker}</span>
              <h3 className="h4" style={{ marginTop: 10 }}>
                {cs.title}
              </h3>
              <div className="work-card__metrics">
                {cs.metrics.slice(0, 2).map(m => (
                  <span key={m.label}>
                    <b>{m.value}</b>
                    <span>{m.shortLabel ?? m.label}</span>
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------ why it maps */}
      <Section labelledBy="why-bc-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Why this matters beyond crypto"
              id="why-bc-heading"
              title="Auditable systems are the same problem twice."
            />
            <p className="body" style={{ marginTop: 20 }}>
              Building where every action is permanent, publicly verifiable and reviewed by
              adversaries teaches a discipline that most software teams never have to learn: prove it
              behaved correctly, to somebody who assumes it did not.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              That is now exactly what an enterprise asks about an AI system. The audit trail, the
              decision boundary, the evidence. Our AI engineering work is that same competence pointed
              at a newer problem, which is why the two sit in one firm. The certificate at the end of
              it is Pixelette Certified’s work, not ours.
            </p>
            <div style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering" variant="secondary">
                See AI engineering
              </Cta>
            </div>
          </div>

          <div>
            <Eyebrow>Sectors we have delivered into</Eyebrow>
            <PillRow items={blockchainSectors} style={{ marginTop: 20 }} />
            <p className="body" style={{ marginTop: 28, fontSize: 15 }}>
              Tokenisation questions increasingly come from regulated buyers rather than from
              crypto-native ones. Those conversations tend to start with custody, reporting and audit
              rather than with the chain, and we are set up for that.
            </p>
          </div>
        </div>
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
