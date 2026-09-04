import Link from 'next/link';

import {
  ArrowRight,
  BuildMark,
  ChainMark,
  AiMark,
  Cpu,
  Database,
  Measure,
  TrendChart,
} from '@/components/Icons';
import { CertifiedHandoff, ClientLogos, TrustStrip } from '@/components/sections';
import {
  CheckList,
  Cta,
  Eyebrow,
  FLink,
  JsonLd,
  Section,
  SectionHead,
} from '@/components/ui';
import { certified, company } from '@/content/company';
import { faqSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'UK software engineering, blockchain and production AI',
  description:
    'Web, mobile and custom software and blockchain systems, with AI engineered into both. Two practices, one firm, ISO 9001 and ISO 27001 certified since 2018.',
  path: '/',
});

/**
 * Answer-engine questions. These are the questions a buyer actually types, and
 * each answer is self-contained enough to be quoted without the surrounding
 * page — which is the unit an answer engine lifts.
 */
const faqs = [
  {
    q: 'What does Pixelette Technologies do?',
    a: 'Pixelette Technologies is a UK software engineering firm operating two practices: Build (web platforms, mobile applications, custom software and integration) and Blockchain (asset tokenisation, smart contracts, wallets, exchanges and dApps). AI is engineered into both rather than sold as a separate service. The firm has delivered since 2018 across 13 countries under ISO 9001 and ISO 27001 certified management systems.',
  },
  {
    q: 'Does Pixelette Technologies certify the AI systems it builds?',
    a: 'No. Assurance, AI governance and certification are delivered by Pixelette Certified, a separate practice inside the same group with its own lead auditors. Pixelette Technologies builds and runs the system; Pixelette Certified takes it through ISO/IEC 42001 and security review. A build team grading its own homework is not assurance.',
  },
  {
    q: 'How does an engagement with Pixelette Technologies start?',
    a: 'Most start with an AI Value Baseline: four weeks, fixed price at £6,000 to £12,000, in which two or three processes are instrumented and measured, and a costed roadmap and board-ready business case are produced. If the numbers do not support going further, Pixelette says so in writing.',
  },
  {
    q: 'Which certifications does Pixelette Technologies hold?',
    a: 'Pixelette Technologies holds ISO 9001:2015 for quality management, ISO 27001:2022 for information security, and Cyber Essentials Plus. ISO/IEC 42001 for AI management systems is a group capability delivered by Pixelette Certified and is not held by Pixelette Technologies.',
  },
  {
    q: 'Does Pixelette Technologies supply developers by the day?',
    a: 'No. The firm sells fixed-scope builds, standing product teams against a roadmap, and monthly support-and-run contracts. It does not sell developers on a timesheet and will say so on the first call.',
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '88px 0 56px' }}>
        <div className="wrap center">
          <Eyebrow>UK software engineering since {company.incorporated}</Eyebrow>
          <h1 className="h1" style={{ marginTop: 26, fontSize: 'clamp(36px, 4.6vw, 54px)' }}>
            <span style={{ display: 'block' }}>Engineering that ships.</span>
            <span style={{ display: 'block' }}>Chains that hold.</span>
            <span style={{ display: 'block' }}>AI built into both.</span>
          </h1>
          <p className="lead" style={{ margin: '24px auto 0', maxWidth: '60ch' }}>
            Two practices, one firm, the same engineers under the same certified management systems.
            AI runs through both of them rather than sitting beside them.
          </p>
          <div style={{ marginTop: 38 }}>
            <TrustStrip />
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------- doors */}
      {/* The section is labelled rather than carrying a hidden heading, so the
          two door titles sit at h2 exactly as the design has them. */}
      <section style={{ padding: '0 0 88px' }} aria-label="The two practices">
        <div className="wrap">
          <div className="grid grid-2">
            <Link href="/engineering" className="door door--build">
              <div className="door__top">
                <span className="mono door__kicker">01 · Build</span>
                <BuildMark size={30} />
              </div>
              <h2 className="h3" style={{ fontSize: 27, color: 'var(--ink)' }}>
                Software built, shipped and kept working
              </h2>
              <p className="body" style={{ fontSize: 14.5, marginTop: 14 }}>
                Web platforms, mobile applications, custom software and integration. The larger half
                of the business and the one we have been doing longest.
              </p>
              <div style={{ marginTop: 22 }}>
                <CheckList
                  items={[
                    'Web platforms and portals',
                    'Mobile applications, iOS and Android',
                    'Custom software and integration',
                    'Product design, cloud and modernisation',
                  ]}
                />
              </div>
              <div style={{ flexGrow: 1 }} />
              <hr className="rule" style={{ margin: '26px 0 22px' }} />
              <p className="small" style={{ fontSize: 12.5, marginBottom: 18 }}>
                Fixed-scope build · product team · support and run
              </p>
              <span className="door__cta">
                Scope a build
                <ArrowRight size={16} />
              </span>
            </Link>

            <Link href="/blockchain" className="door door--chain theme-amber">
              <div className="door__top">
                <span className="mono door__kicker">02 · Blockchain</span>
                <ChainMark size={30} />
              </div>
              <h2 className="h3" style={{ fontSize: 27, color: 'var(--ink)' }}>
                Tokenisation and decentralised systems
              </h2>
              <p className="body" style={{ fontSize: 14.5, marginTop: 14 }}>
                Where the firm started in 2018, and still the deepest specialism we hold. Twenty-four
                chains and protocols in production use.
              </p>
              <div style={{ marginTop: 22 }}>
                <CheckList
                  items={[
                    'Asset tokenisation platforms',
                    'Smart contract development and audit',
                    'Wallets, exchanges and dApps',
                    'Layer 1 and Layer 2, DeFi and DAOs',
                  ]}
                />
              </div>
              <div style={{ flexGrow: 1 }} />
              <hr className="rule" style={{ margin: '26px 0 22px' }} />
              <p className="small" style={{ fontSize: 12.5, marginBottom: 18 }}>
                $14M tokenised · 1,200+ tokens in 6 months
              </p>
              <span className="door__cta">
                Scope a blockchain build
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>

          {/* Neither door fits everyone. This is the third route in. */}
          <div
            className="card"
            style={{
              marginTop: 18,
              display: 'flex',
              gap: 28,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 460px' }}>
              <h3 className="h4">Not sure which one you need?</h3>
              <p className="body" style={{ marginTop: 10, fontSize: 15 }}>
                Most engagements start as one and become two. Tell us the problem rather than the
                product and we will point you at the right door, including when the answer is none of
                them.
              </p>
            </div>
            <Cta href="/contact" variant="secondary">
              Start a conversation
            </Cta>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- AI band */}
      <Section labelledBy="ai-heading" style={{ background: '#F7FAFA' }}>
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <Eyebrow>AI, in practice</Eyebrow>
            <h2 className="h2" id="ai-heading" style={{ marginTop: 18 }}>
              AI is not a third door. It is inside the first two.
            </h2>
            <p className="body" style={{ marginTop: 20 }}>
              We do not sell AI as a department you buy separately. We build it into the software and
              the chains we are already building for you: retrieval over your own data, agents inside
              a named workflow, model integration that survives production, and the evaluation to know
              it still works next quarter.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Same engineers, same certified management systems, and no separate AI team you have
              never met.
            </p>
            <div style={{ marginTop: 28 }}>
              <Cta href="/ai-engineering">See how we build AI</Cta>
            </div>
            <p className="small" style={{ marginTop: 24, maxWidth: '52ch' }}>
              Governance, certification and audit of AI systems sit with{' '}
              <a href={certified.url} target="_blank" rel="noopener noreferrer">
                {certified.name}
              </a>
              , not here. We build it; they certify it.
            </p>
          </div>

          <div className="grid" style={{ gap: 14 }}>
            {[
              {
                icon: <AiMark size={32} />,
                title: 'Production AI systems',
                href: '/ai-engineering/production-ai-systems',
                body: 'AI embedded in a named workflow, with the workflow redesigned around it. Human in the loop by default, agentic only where it earns it.',
              },
              {
                icon: <Database size={32} />,
                title: 'Data & integration',
                href: '/ai-engineering/data-and-integration',
                body: 'Entitlement-aware access, context layers and integration into your systems of record, so a model can reach what it needs and nothing it should not.',
              },
              {
                icon: <TrendChart size={32} />,
                title: 'Evaluation & observability',
                href: '/ai-engineering/evaluation-and-observability',
                body: 'Measurement that tells you when output quality moves, before your users do. Built in at the start, not bolted on after an incident.',
              },
              {
                icon: <Measure size={32} />,
                title: 'AI Value Baseline',
                href: '/ai-engineering/ai-value-baseline',
                body: 'Four weeks, fixed price. What two or three processes cost you today, and the business case for changing them. The one packaged way in.',
              },
            ].map(item => (
              <Link key={item.href} href={item.href} className="mini-card">
                <span className="icon-slot" aria-hidden>
                  {item.icon}
                </span>
                <span>
                  <b style={{ display: 'block', fontSize: 16, color: 'var(--ink)' }}>{item.title}</b>
                  <span className="small" style={{ display: 'block', marginTop: 7 }}>
                    {item.body}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <CertifiedHandoff />

      <ClientLogos tight />

      {/* -------------------------------------------------------- why both */}
      <Section labelledBy="why-heading">
        <div className="grid grid-2" style={{ gap: 56, alignItems: 'start' }}>
          <div>
            <SectionHead
              eyebrow="Why one firm does both"
              id="why-heading"
              title="The second practice grew out of the first."
            />
            <p className="body" style={{ marginTop: 20 }}>
              We started in 2018 as a blockchain studio. Building systems where a mistake is permanent
              and every action has to be auditable taught us a discipline that most software teams
              never need. That became the engineering practice.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Then AI started appearing inside the systems we had built, and clients asked the same
              question they had always asked about a smart contract: how do you know it is doing the
              right thing, and who is watching? We answer the engineering half of that here. The
              certificate and the audit sit with {certified.name}.
            </p>
            <p className="body" style={{ marginTop: 16 }}>
              Build is the larger of the two and we have no intention of changing that. An AI practice
              with no engineering underneath it is a slide deck, and the market has enough of those.
            </p>
            <p style={{ marginTop: 26 }}>
              <FLink href="/about">More about the firm</FLink>
            </p>
          </div>

          <div>
            <Eyebrow>How clients usually arrive</Eyebrow>
            <ol style={{ listStyle: 'none', padding: 0, marginTop: 24, display: 'grid', gap: 20 }}>
              {[
                {
                  n: '01',
                  t: 'They need something built',
                  d: 'A platform, an app, an integration, or a token and its contracts. We build it and, usually, keep running it.',
                },
                {
                  n: '02',
                  t: 'AI turns up inside it',
                  d: 'In the product, or in a process around it. Someone has to make it measurable.',
                },
                {
                  n: '03',
                  t: 'Their client asks how it is governed',
                  d: 'That question is now on most enterprise security reviews, and it stops deals.',
                },
                {
                  n: '04',
                  t: 'We build it, Certified proves it',
                  d: `We engineer and run the system. ${certified.name} takes it through ISO 42001 and the security review. One group, two disciplines, neither pretending to be the other.`,
                },
              ].map(step => (
                <li key={step.n} className="tile" style={{ padding: '20px 22px' }}>
                  <span className="step__n">{step.n}</span>
                  <b style={{ fontSize: 16 }}>{step.t}</b>
                  <p className="small" style={{ marginTop: 8 }}>
                    {step.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- faq */}
      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="Common questions" id="faq-heading" title="Asked before every engagement." />
        <div style={{ marginTop: 34, maxWidth: '80ch' }}>
          {faqs.map(faq => (
            <details key={faq.q} className="faq">
              <summary>{faq.q}</summary>
              <p className="body" style={{ marginTop: 12 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </Section>
    </>
  );
}
