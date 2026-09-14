import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead } from '@/components/ui';
import { certified } from '@/content/company';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Smart Contracts & dApps',
  description:
    'Programmable workflows and decentralised applications with testing, access controls and clear upgrade and ownership decisions, structured for independent review.',
  path: '/blockchain/smart-contracts-dapps',
});

const capabilities = [
  {
    title: 'Contract design and specification',
    body: 'What the contract must do, what it must refuse to do, and what it must never allow, written down before anything is deployed. On-chain, ambiguity becomes permanent.',
  },
  {
    title: 'Testing and invariant checking',
    body: 'Unit and integration tests, property and invariant testing, and adversarial cases written by someone trying to break it. Testing is the deliverable, not the overhead.',
  },
  {
    title: 'Access control and role design',
    body: 'Who may call what, which roles exist, how they are granted and revoked, and what any single compromised key can actually do.',
  },
  {
    title: 'Upgrade and ownership decisions',
    body: 'Whether the contract can be changed after deployment, by whom, under what delay, and what the holder can do about it. A choice with real governance consequences, made explicitly.',
  },
  {
    title: 'dApp front end and indexing',
    body: 'The interface people use, the indexing layer that makes chain state readable at speed, and the transaction states that a wallet leaves you to explain.',
  },
  {
    title: 'Preparation for independent review',
    body: 'Documentation, specification, test evidence and code structured so an independent security firm can review it efficiently rather than starting from archaeology.',
  },
];

const review = [
  {
    title: 'What we do',
    body: 'Design, write, test and document contracts, including adversarial testing and invariant checks, and structure the work so that independent review is efficient.',
  },
  {
    title: 'What we do not claim',
    body: 'We do not describe our own testing as an audit. An audit is a separate, independent engagement with its own competence, scope and liability.',
  },
  {
    title: 'Who reviews it',
    body: 'An independent security firm, engaged by you. A supplier reviewing its own contracts is not assurance, whatever the report is called.',
  },
  {
    title: 'What you get from us',
    body: 'The specification, the test suite and its results, the deployment and ownership plan, and remediation of findings the reviewer raises.',
  },
];

const faqs = [
  {
    q: 'Do you audit smart contracts?',
    a: 'No, and we are careful with the word. We design, write, test and document contracts, including adversarial testing and invariant checks, and we structure the work so an independent security review can be carried out efficiently. An audit is a separate engagement by an independent firm with its own competence and scope, and a supplier reviewing its own contracts is not assurance.',
  },
  {
    q: 'Should a smart contract be upgradeable?',
    a: 'It is a governance decision rather than a technical default. Upgradeability lets defects be fixed, and also means someone can change the rules after people have committed value under them. The decision should be explicit, documented, constrained by delays or multi-party control where the stakes justify it, and visible to whoever is relying on the contract.',
  },
  {
    q: 'What does a dApp involve beyond the contracts?',
    a: 'An interface, an indexing layer that makes chain state readable at usable speed, wallet connection and transaction-state handling, off-chain services for anything that should not be on-chain, and monitoring. The contracts are typically the smallest component and the least forgiving one.',
  },
];

export default function SmartContractsDappsPage() {
  return (
    <div className="theme-amber">
      <JsonLd
        data={serviceSchema({
          name: 'Smart Contracts & dApps',
          description:
            'Programmable on-chain workflows and decentralised applications, with specification, testing, access control, upgrade and ownership design, and preparation for independent security review.',
          path: '/blockchain/smart-contracts-dapps',
          serviceType: 'Smart contract and decentralised application development',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Blockchain', path: '/blockchain' },
          { name: 'Smart Contracts & dApps', path: '/blockchain/smart-contracts-dapps' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>Decentralise · Smart Contracts &amp; dApps</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Contracts written to be read by a reviewer
          </h1>
          <p className="lead" style={{ marginTop: 24 }}>
            Programmable workflows and decentralised applications, with testing, access controls and
            clear upgrade and ownership decisions. Deployed code is difficult to change and
            impossible to un-publish, which sets the standard for everything before deployment.
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
      <Section labelledBy="sc-build-heading">
        <SectionHead title="What the work covers" id="sc-build-heading" />
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

      {/* ----------------------------------------------------- review words */}
      <Section labelledBy="sc-review-heading" style={{ background: '#FBF8F4' }}>
        <SectionHead
          eyebrow="Review and testing, stated precisely"
          id="sc-review-heading"
          title="We do not call our own testing an audit"
          lead="The word carries a specific meaning in this market and it is routinely misused. Here is exactly where the boundary sits on our engagements."
        />
        <div className="grid grid-4" style={{ marginTop: 36 }}>
          {review.map(item => (
            <div className="tile" key={item.title} style={{ padding: '24px 26px' }}>
              <h3 className="h4">{item.title}</h3>
              <span>{item.body}</span>
            </div>
          ))}
        </div>
        {/*
          Reworded 2026-09-11 under the handoff's ACCREDITATION-SAFE RULE
          (section 12), which checklist item 14 requires applied to ALL current
          Certified wording.

          What was here: "The same principle runs through the group: the firm
          that builds a system is not the firm that certifies it." Read alone it
          names no Pixelette company, which is the argument for leaving it. Read
          in place it names one by two separate routes. Its own opening clause
          scopes it to the group, and the only other firm in the reader's head at
          that point is Pixelette Certified, which the very next sentence supplies
          by name in the certifying role. A sentence that sets up builder-versus-
          certifier and then names the certifier is an accreditation claim
          however carefully the noun is avoided.

          Three things settled it. The repository already removed a weaker
          version of the same sentence from the group blurb for exactly this
          reason (`src/content/nav.ts`, the note above `groupBlurb`), and a
          precedent that only binds where the wording is identical is not a
          precedent. The site already has an accreditation-safe form of the same
          separation-of-duties point in published copy — "the firm that builds a
          system is not the firm that assesses it", in the /ai-engineering FAQ —
          so nothing commercial is lost by dropping this variant. And checklist
          item 14 says "all", which is a word with no residual in it.

          The replacement is imported from `src/content/company.ts` rather than
          retyped, so it cannot drift from the approved wording the way this
          sentence drifted from it. The assembly is the one `CertifiedHandoff`
          already uses for the same two fields.
        */}
        <p className="body" style={{ marginTop: 30, maxWidth: '76ch' }}>
          The same principle runs through the group. {certified.positioningLine}
        </p>
        <p className="body" style={{ marginTop: 16, maxWidth: '76ch' }}>
          {certified.name} is{' '}
          {certified.blurb.charAt(0).toLowerCase() + certified.blurb.slice(1)}
        </p>
        <p style={{ marginTop: 22 }}>
          <FLink href="/assurance">Who does what</FLink>
        </p>
      </Section>

      {/* -------------------------------------------------------- upgrade */}
      <Section labelledBy="sc-upgrade-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="The decision people skip"
              id="sc-upgrade-heading"
              title="Upgradeable or immutable is a governance choice"
            />
            <p className="body" style={{ marginTop: 20 }}>
              An upgradeable contract can be fixed when a defect is found. It can also be changed
              after people have committed value under the original rules, by whoever holds the key.
              Both properties are true at once, and pretending otherwise is how projects end up with
              a governance crisis they never designed for.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              We make the choice explicitly with you, document it, constrain it with delays or
              multi-party control where the stakes justify it, and state it plainly to whoever is
              relying on the contract.
            </p>
          </div>

          <div>
            <Eyebrow>The dApp around it</Eyebrow>
            <p className="body" style={{ marginTop: 20 }}>
              A decentralised application is mostly conventional engineering: an interface, an
              indexing layer so chain state can be read at usable speed, wallet connection,
              transaction-state handling, off-chain services for everything that should not be
              on-chain, and monitoring.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Users experience the parts that are not on the chain. Those parts deserve the same
              engineering attention as the contracts, and rarely receive it.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Cta href="/blockchain/wallets-digital-assets" variant="secondary">
                Wallets &amp; digital assets
              </Cta>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta title="Have a mechanism you want on-chain?" ctaLabel="Scope blockchain">
        Bring us the rules you want enforced and who has to trust them. We will tell you what belongs
        in a contract, what belongs off-chain, and what should not be built at all.
      </ClosingCta>
    </div>
  );
}
