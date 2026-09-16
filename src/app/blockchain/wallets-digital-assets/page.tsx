import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Wallets & Digital-Asset Products',
  description:
    'User-facing wallet, portfolio and transaction experiences across mobile and web, designed around key management, recovery and irreversible actions.',
  path: '/blockchain/wallets-digital-assets',
});

const capabilities = [
  {
    title: 'Custody model',
    body: 'Custodial, non-custodial or multi-party. The choice determines your regulatory position, your support burden and what happens on the worst day, so it is decided first and deliberately.',
  },
  {
    title: 'Key management and recovery',
    body: 'Generation, storage, backup, rotation and the recovery route for a user who has lost a device. Recovery design is the difference between a product and a trap.',
  },
  {
    title: 'Portfolio and transaction views',
    body: 'Balances, history, valuations and statements that reconcile, presented so a person can understand their own position without a block explorer open beside it.',
  },
  {
    title: 'Transaction safety',
    body: 'Confirmation design, simulation, address verification, spending limits and approval flows. Most user losses are authorised by the user, which makes this an interface problem.',
  },
  {
    title: 'Integration points',
    body: 'On and off ramps, exchanges, price sources, identity checks and the accounting systems that eventually have to agree with what the wallet says.',
  },
  {
    title: 'Mobile and web delivery',
    body: 'Native iOS and Android and web interfaces, with secure local storage, biometrics and the device-level behaviour these products depend on.',
  },
];

const principles = [
  {
    title: 'Irreversible actions need friction',
    body: 'A transfer cannot be recalled. The interface should be hardest at exactly the moment a mistake becomes permanent.',
  },
  {
    title: 'Recovery is a product feature',
    body: 'Not a support process. Design it before launch, and design it for the least technical person who will hold the app.',
  },
  {
    title: 'Show what will happen',
    body: 'Simulate and state the outcome before signing, in ordinary language. Approval screens that nobody can read are consent in name only.',
  },
  {
    title: 'The books have to agree',
    body: 'Whatever the wallet shows must reconcile with the chain and with your finance records. Three versions of a balance is an incident waiting for an auditor.',
  },
];

const faqs = [
  {
    q: 'What is the difference between a custodial and a non-custodial wallet?',
    a: 'In a custodial model the operator holds the keys and can act on the user’s behalf, which simplifies recovery and support but places the operator in a regulated position of responsibility. In a non-custodial model the user holds the keys, which removes that responsibility and removes the safety net with it. Multi-party approaches sit between the two. The choice is a risk and operating decision and should be made before the product is designed.',
  },
  {
    q: 'What is the hardest part of building a wallet?',
    a: 'Recovery and transaction safety, not the chain interaction. A wallet is a key-management system with a product interface on it: what happens when a user loses a device, and how clearly the interface communicates an irreversible action before it is signed, determine whether the product is trustworthy.',
  },
  {
    q: 'Can a wallet be part of a wider product rather than a standalone app?',
    a: 'Yes, and frequently it should be. Wallet, portfolio and transaction functionality is often one surface of a larger financial or platform programme across mobile and web, with the digital-asset capability sitting alongside conventional account, reporting and administration features rather than in a separate application.',
  },
];

export default function WalletsDigitalAssetsPage() {
  return (
    <div>
      <JsonLd
        data={serviceSchema({
          name: 'Wallets & Digital-Asset Products',
          description:
            'User-facing wallet, portfolio and transaction products across mobile and web, covering custody model, key management, recovery and transaction safety.',
          path: '/blockchain/wallets-digital-assets',
          serviceType: 'Digital asset wallet development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blockchain', path: '/blockchain' },
          {
            name: 'Wallets & Digital-Asset Products',
            path: '/blockchain/wallets-digital-assets',
          },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Decentralise · Wallets &amp; Digital Assets</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            A wallet is a key-management problem wearing a product interface
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            User-facing wallet, portfolio and transaction experiences across mobile and web. The
            interface work is real, but the decisions that matter are custody, recovery and what the
            product does at the moment an action becomes irreversible.
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
      <Section labelledBy="wal-build-heading">
        <SectionHead title="What the work covers" id="wal-build-heading" />
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

      {/* ------------------------------------------------------- principles */}
      <Section labelledBy="wal-princ-heading" style={{ background: '#F7FAFA' }}>
        <SectionHead
          eyebrow="Four design principles"
          id="wal-princ-heading"
          title="Written from the failure modes, not from a style guide"
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {principles.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- custody */}
      <Section labelledBy="wal-custody-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The decision that shapes everything"
              id="wal-custody-heading"
              title="Custody is not a technical preference"
            />
            <p className="body" style={{ marginTop: 20 }}>
              Holding a user’s keys makes recovery straightforward and places you in a position of
              responsibility with consequences well beyond engineering. Not holding them removes that
              position and removes the safety net at the same time. Multi-party approaches sit
              between the two and bring their own operational obligations.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              None of those is right in general. The right one follows from who your users are, what
              they are holding, and what your organisation is prepared to be accountable for. Where
              the answer carries a regulatory question, that belongs with your advisers rather than
              with us.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/security-and-data">Our security and data position</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>Usually part of a larger product</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              Wallet and portfolio functionality is frequently one surface of a wider financial or
              platform programme: accounts, planning, reporting, administration and adviser tooling
              across mobile and web, with the digital-asset capability sitting alongside conventional
              features rather than in a separate application.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              That is engineering work in both practices at once, which is a large part of why they
              sit in one firm.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/engineering/mobile-applications" variant="secondary">
                Mobile applications
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Building something that holds value?" ctaLabel="Scope blockchain">
        Tell us who holds the keys, what a user does when they lose their phone, and what the product
        shows them before they sign. Those three answers set the architecture.
      </ClosingCta>
    </div>
  );
}
