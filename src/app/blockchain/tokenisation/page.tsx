import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Tokenisation',
  description:
    'Architecture and implementation for representing and managing real-world or digital assets on-chain, where the commercial and legal model genuinely supports it.',
  path: '/blockchain/tokenisation',
});

const capabilities = [
  {
    title: 'Asset and rights modelling',
    body: 'What the token actually represents: ownership, a claim, a right to a distribution, access, or a unit of account. Everything downstream is determined by this and it is a commercial and legal question before it is a technical one.',
  },
  {
    title: 'Token standard and chain selection',
    body: 'Fungible or non-fungible, transferable or restricted, and on which network. Chosen against the operating requirement rather than against whichever ecosystem is currently loudest.',
  },
  {
    title: 'Issuance and lifecycle',
    body: 'Minting, allocation, vesting, transfer restrictions, redemption and retirement. The end of a token’s life is designed at the beginning or it is not designed at all.',
  },
  {
    title: 'Custody and key management',
    body: 'Who holds the keys, under what controls, and what happens when a key is lost or a person leaves. The most common single point of failure in this category.',
  },
  {
    title: 'Holder and investor interfaces',
    body: 'The dashboards, statements, transaction views and administrative tooling through which people actually experience the thing. Usually the larger part of the build.',
  },
  {
    title: 'Treasury and reporting visibility',
    body: 'What the operator, the holder and the auditor can each see, and how an on-chain position reconciles to the off-chain records it is meant to correspond to.',
  },
];

const questions = [
  {
    title: 'Who is the counterparty?',
    body: 'A token represents a relationship with someone. If nobody is obliged to honour what it represents, the chain does not create the obligation.',
  },
  {
    title: 'What is the legal wrapper?',
    body: 'The commercial and legal structure comes first. Architecture built ahead of it usually has to be rebuilt around it.',
  },
  {
    title: 'Who may hold it?',
    body: 'Transfer restrictions, identity checks and jurisdiction shape the token design directly, and retrofitting them is expensive.',
  },
  {
    title: 'Would a database do?',
    body: 'If there is no distributed trust problem, no independent verification requirement and no genuine need for programmable ownership, the honest answer is often yes.',
  },
];

const faqs = [
  {
    q: 'What does Pixelette Technologies mean by tokenisation?',
    a: 'Architecture and implementation for representing and managing real-world or digital assets on-chain, where the commercial and legal model supports it. That covers rights modelling, token standard and chain selection, issuance and lifecycle, custody, holder interfaces, and the reconciliation between on-chain positions and off-chain records.',
  },
  {
    q: 'What has to be settled before a tokenisation build starts?',
    a: 'What the token represents and who is obliged to honour it, the legal and commercial wrapper around it, who is permitted to hold and transfer it, and whether a conventional database would meet the requirement. Those four answers determine the architecture, and building ahead of them normally means rebuilding afterwards.',
  },
  {
    q: 'Will you tell us if we do not need a blockchain?',
    a: 'Yes. Blockchain is treated as a specialist tool rather than a default answer, and is used where ownership, programmability, verification, tokenisation or distributed trust creates a genuine advantage. Where a conventional system would do the job, that is the recommendation, including when it is the smaller piece of work.',
  },
];

export default function TokenisationPage() {
  return (
    <div>
      <JsonLd
        data={serviceSchema({
          name: 'Tokenisation',
          description:
            'Architecture and implementation for representing and managing real-world or digital assets on-chain, including rights modelling, issuance, custody and holder interfaces.',
          path: '/blockchain/tokenisation',
          serviceType: 'Asset tokenisation',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blockchain', path: '/blockchain' },
          { name: 'Tokenisation', path: '/blockchain/tokenisation' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Decentralise · Tokenisation</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '22ch' }}>
            A tokenisation problem is a legal and commercial design problem first
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Architecture and implementation for representing and managing real-world or digital
            assets on-chain, where the commercial and legal model supports it. The engineering is
            the straightforward half; deciding what the token actually represents is not.
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
      <Section labelledBy="tok-build-heading">
        <SectionHead
          title="What the work covers"
          id="tok-build-heading"
          lead="From the rights model through to the interfaces holders and operators actually use, and the reporting that reconciles the two."
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

      {/* -------------------------------------------------------- questions */}
      <Section labelledBy="tok-q-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Before any architecture"
          id="tok-q-heading"
          title="Four questions we ask before quoting"
          lead="They are cheap to answer at the start and extremely expensive to answer after a token has been issued to real holders."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {questions.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
        <p className="body" style={{ marginTop: 30, maxWidth: '76ch' }}>
          We are not the right people to give you legal advice on the wrapper, and we will not
          pretend otherwise. What we will do is refuse to build architecture that assumes an answer
          nobody has actually given.
        </p>
      </Section>

      {/* --------------------------------------------------------- off-chain */}
      <Section labelledBy="tok-off-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The part that is not on-chain"
              id="tok-off-heading"
              title="Most of a tokenisation platform is ordinary software"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Onboarding, identity checks, permissions, statements, support tooling, administration,
              reporting and reconciliation are conventional engineering, and they are where the
              majority of the effort and the majority of the risk sits. The contracts are a small,
              extremely unforgiving component in a much larger system.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Treating a tokenisation project as a smart-contract project is the most reliable way to
              be surprised by its cost.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/blockchain/smart-contracts-dapps">Smart contracts &amp; dApps</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>Where it is genuinely a good fit</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Fractional participation in an asset that is otherwise indivisible. Programmable
              distributions that would otherwise be a monthly spreadsheet. Positions that need to be
              independently verifiable by parties who do not trust a single operator’s database.
              Transfer rules enforced by the asset itself rather than by a process.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Where one of those is the actual requirement, tokenisation is a genuinely strong
              answer. Where none of them is, it is an expensive way to store a spreadsheet.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/blockchain/integration" variant="secondary">
                Connecting it to your systems
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a tokenisation idea?" ctaLabel="Scope blockchain">
        Bring us the asset and the mechanism you have in mind. We will tell you whether a chain
        genuinely earns its place in it, including when the honest answer is that it does not.
      </ClosingCta>
    </div>
  );
}
