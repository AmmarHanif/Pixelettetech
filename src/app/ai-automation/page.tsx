import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { certified } from '@/content/company';
import { gapStats } from '@/content/sources';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * AI & Automation overview.
 *
 * RESTRUCTURED 2026-09-30 to the AI & Automation Estate Phase 1 brief. The page
 * had ten separate arguments and nine full sections; it now answers five
 * questions once each. Nothing here is a visual redesign - that was explicitly
 * deferred to a later phase - so the work is structure, hierarchy and deletion.
 *
 * THE ARCHITECTURE IS NOW THREE CUSTOMER ROUTES, NOT FIVE SERVICE ROWS:
 *
 *   01 AI Systems               understand, predict, recommend, support decisions
 *   02 AI Agents & Automation   deterministic -> assisted -> controlled agentic
 *   03 Evaluation & Observability  does it still work, and how would you know
 *
 * with Data & Integration deliberately SECONDARY beneath them - an enabling
 * engineering capability, not a fourth competing service. The old schedule put
 * all five on one level, which is what made the offer hard to read.
 *
 * WHAT WAS MERGED OR CUT, and why the page is shorter rather than rearranged:
 *   - "AI is more than the model" + "How we approach AI engineering" are one
 *     section, "How production AI works". They were the same argument told twice.
 *   - "Automate is one of our four services" is gone as a section. Global nav,
 *     the footer and one contextual line already do that job.
 *   - The case-study block is gone from the overview. The study still exists and
 *     is still linked; it was standing as the page's proof mechanism, which the
 *     brief is explicit this page cannot yet support.
 *   - Value Discovery stopped being a service and became the entry methodology.
 *   - Private AI development is a short paragraph, not a section with a register.
 *
 * NO SUB-PAGE WAS TOUCHED, no route created, no redirect written and no
 * navigation destination changed. Every link below points at a page that already
 * exists today.
 */

export const metadata = pageMetadata({
  title: 'AI & Automation',
  description:
    'AI systems, AI agents and automation, and the evaluation and observability that shows whether they still work. Engineered into the systems an organisation already runs.',
  path: '/ai-automation',
});

/**
 * The three customer routes, and one enabling capability held below them.
 *
 * `enabling` is what keeps Data & Integration off the same level. The brief is
 * explicit that it must not read as a fourth AI service, so it renders in a
 * different treatment entirely rather than as a fourth item with a quieter tag.
 *
 * LINKS GO WHERE CONTENT ALREADY LIVES. AI Systems will eventually be its own
 * page at /ai-automation/ai-systems, and AI Agents & Automation likewise, but
 * neither route exists yet and Phase 1 forbids inventing them. Each route
 * therefore points into the live pages it will one day consolidate.
 */
const ROUTES = [
  {
    n: '01',
    title: 'AI systems',
    body: 'AI systems that can understand information, identify patterns, predict outcomes, recommend actions and support decisions.',
    facets: ['Understand', 'Predict', 'Recommend', 'Support decisions'],
    links: [
      { href: '/ai-automation/predictive-intelligence', label: 'Prediction and patterns' },
      { href: '/ai-automation/language-speech-vision', label: 'Language, speech and vision' },
    ],
  },
  {
    n: '02',
    title: 'AI agents & automation',
    body: 'Automation and AI systems that can carry out controlled work across workflows, tools and connected systems. That ranges from deterministic automation, through AI-assisted workflows, to controlled agentic operation.',
    facets: ['Deterministic', 'AI-assisted', 'Controlled agentic'],
    links: [
      { href: '/ai-automation/workflow-automation', label: 'Workflow automation' },
      { href: '/ai-automation/agentic-ai-multi-agent', label: 'Agentic and multi agent' },
    ],
  },
  {
    n: '03',
    title: 'Evaluation & observability',
    body: 'Testing and monitoring that shows whether an AI system performs as intended, continues to do so after release, and changes when its inputs, models or environment change.',
    facets: ['Evaluation', 'Regression', 'Drift', 'Monitoring'],
    links: [{ href: '/ai-automation/evaluation-and-observability', label: 'How we measure' }],
  },
];

/** §12, tightened. Four situations, not four audiences and not four services. */
const EARNS = [
  { label: 'Fragmented knowledge', line: 'Information spread across people, documents and systems.' },
  { label: 'Complex verification', line: 'Checking work is slow, manual, and easy to get wrong.' },
  {
    label: 'Automation that stops too early',
    line: 'Existing automation handles the routine steps but not context, judgement or exceptions.',
  },
  {
    label: 'New AI opportunities',
    line: 'Products or capabilities that cannot simply be bought off the shelf.',
  },
];

/**
 * §15. The chain, as a restrained structural representation only.
 *
 * The elaborate treatment is explicitly a later phase, so this is an ordered
 * progression in real text and nothing more. It replaced a drawn architecture
 * diagram, which was the right artefact for a section that no longer exists in
 * that form and would have pre-empted a decision this phase is not allowed to
 * make.
 */
const CHAIN = [
  { n: '01', t: 'Context and data', b: 'What the system is allowed to see.' },
  { n: '02', t: 'Model', b: 'The part that reasons over it.' },
  { n: '03', t: 'Tools and systems', b: 'What it can actually reach.' },
  { n: '04', t: 'Action', b: 'What it is permitted to do.' },
  { n: '05', t: 'Verification', b: 'Whether the output was right.' },
  { n: '06', t: 'Monitoring', b: 'Whether it still is, months later.' },
];

/** §14. Six principles, stated once, replacing prose repeated across the page. */
const PRINCIPLES = [
  { n: '01', label: 'Start with the problem', line: 'AI is a means, not the proposition.' },
  { n: '02', label: 'Measure before building', line: 'Establish what better actually means.' },
  {
    n: '03',
    label: 'Use the simplest system that works',
    line: 'Rules before models; models before agents where appropriate.',
  },
  {
    n: '04',
    label: 'Keep people where judgement matters',
    line: 'Autonomy is designed, not assumed.',
  },
  {
    n: '05',
    label: 'Connect AI to the real environment',
    line: 'Data, systems, permissions and tools matter as much as the model.',
  },
  { n: '06', label: 'Test what runs in production', line: 'Evaluation continues after release.' },
];

/** §13. Value Discovery as the entry methodology, not a fifth service. */
const DISCOVERY = [
  { n: '01', t: 'Understand the workflow', b: 'What happens now?' },
  { n: '02', t: 'Establish the baseline', b: 'What does current performance look like?' },
  {
    n: '03',
    t: 'Decide whether AI earns a role',
    b: 'Would rules, automation or AI materially improve it?',
  },
  { n: '04', t: 'Define success', b: 'How will we know whether the change worked?' },
];

/**
 * §20. Three questions, each answering something the page above does not.
 *
 * "What is a Value Discovery?" was CUT: the methodology section now explains it
 * in full, and an FAQ restating the section above it is the duplication this
 * phase exists to remove.
 *
 * The certification question is NOT cuttable. It is the machine-readable home of
 * an accreditation boundary - the firm that builds a system is not the firm that
 * assesses it - and it feeds the FAQPage JSON-LD.
 */
const faqs = [
  {
    q: 'Why can so few organisations show a return on AI?',
    a: 'Because the work around the model was never redesigned, the data it needs was never made reachable, and nobody owns whether it still works next quarter. In McKinsey’s 2026 survey 80% of respondents said AI had improved their individual productivity, while 37% reported it contributing to their organisation’s EBIT (McKinsey State of AI, August 2026, n=1,719).',
  },
  {
    /*
     * RESTORED, TIGHTENED, 2026-09-30. Cutting this FAQ outright took the only
     * statement of the engagement's LENGTH out of the corpus, and `pix:test`
     * failed on it: "when is a value discovery ready" went from a timeline-
     * guarded reply to no answer at all. The methodology section above explains
     * the four steps but deliberately gives no duration, so this is not the
     * repetition the phase removes - it is the part the section does not carry.
     *
     * It also REPLACED an added question, "Which AI models do you use?", which
     * read well and quietly broke routing: it intercepted that query on this
     * page instead of letting it reach the LLM and RAG page that answers it
     * properly. Model-agnosticism is stated in principle 03 either way.
     */
    q: 'What is a Value Discovery?',
    a: 'A four-week engagement. Two or three processes are instrumented and measured, the measurement is left running and is yours to keep, and you receive a prioritised opportunity map, a costed roadmap and a board-ready business case naming the budget line it displaces. If the numbers do not support going further, Pixelette says so in writing.',
  },
  {
    /*
     * Do not cut this one. Since the Certified dark panel was folded to a single
     * line, this answer is the machine-readable home of a boundary that is
     * accreditation-sensitive: the firm that builds a system is not the firm
     * that assesses it.
     */
    q: 'Does Pixelette Technologies audit or certify the AI it builds?',
    a: 'No, and it does not offer to. Where a programme needs formal governance, certification readiness, privacy or security-assurance support, Pixelette Certified, a separate practice in the same group, can scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment. Independent assurance stays independent: the firm that builds a system is not the firm that assesses it.',
  },
];

/**
 * The attribution line under the gap figures, derived rather than indexed.
 *
 * This read used to be gapStats[0]!.source. The non-null assertion is invisible
 * to `tsc --noEmit` - an empty array type-checks perfectly against it - so the
 * compiler stayed green while the page threw the moment the register behind it
 * emptied. Deriving the line removes the index, so there is no assertion left
 * for a future edit to falsify.
 */
function gapSources(): string[] {
  return Array.from(new Set(gapStats.map(stat => stat.source)));
}

export default function AiAutomationPage() {
  return (
    <div className="ai-pg">
      <JsonLd
        data={serviceSchema({
          name: 'AI & Automation',
          description:
            'AI systems, AI agents and automation, and evaluation and observability for AI running in production.',
          path: '/ai-automation',
          serviceType: 'Artificial intelligence engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI & Automation', path: '/ai-automation' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      {/* PRESERVED. The proposition and the sentence under it are the approved
          editorial anchor and are unchanged. */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>AI engineering · part of Automate</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Most companies have adopted AI. Far fewer can show what it changed
          </h1>
          <p className="lead" style={{ marginTop: 24, maxWidth: '46ch' }}>
            We engineer AI into the systems an organisation already runs, measure what it changes,
            and keep it working in production.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Start with what needs to change</Cta>
            <Cta href="/ai-automation/evaluation-and-observability" variant="secondary">
              How we measure it
            </Cta>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- evidence band (folded) */}
      {/*
        THE POPULATION ON BOTH FIGURES WAS CORRECTED 2026-09-30. They are
        measured over SURVEY RESPONDENTS and were labelled "of individual AI
        users" and "of organisations" - two populations, neither of them the one
        the survey reports. The figures themselves were never in doubt. The fix
        is in sources.ts so it reaches every page that renders them.
      */}
      {gapStats.length > 0 && (
        <Section flush tight className="sec--tint">
          <div className="ev-band">
            {gapStats.map(stat => (
              <div className="ev-fig" key={stat.label}>
                <b>{stat.value}</b> <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24 }}>
            {gapSources().map(source => (
              <SourceNote key={source}>{source}</SourceNote>
            ))}
          </div>
        </Section>
      )}

      {/* --------------------------------------------- 01 the three routes */}
      <Section labelledBy="routes-heading">
        <SectionHead
          eyebrow="What we build"
          id="routes-heading"
          title="Three ways AI is built into a business"
          lead="They overlap in practice, and a programme often needs two of them."
        />
        <div className="ai-routes">
          {ROUTES.map(r => (
            <div className="ai-route" key={r.n}>
              <span className="ai-route__n">{r.n}</span>
              <h3 className="h4 ai-route__t">{r.title}</h3>
              <p className="body ai-route__b">{r.body}</p>
              <ul className="ai-route__facets">
                {r.facets.map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <p className="ai-route__links">
                {r.links.map(l => (
                  <FLink href={l.href} key={l.href}>
                    {l.label}
                  </FLink>
                ))}
              </p>
            </div>
          ))}
        </div>

        {/*
          DELIBERATELY NOT A FOURTH ROUTE. Data & Integration is the engineering
          that makes the three above possible, so it sits below them in a
          different treatment entirely - one line, one rule, two links out. Given
          a fourth card it would read as a fourth thing to buy, which is the
          confusion this restructure removes.
        */}
        <div className="ai-enabling">
          <h3 className="h4">Data & integration</h3>
          <p className="body">
            AI can only work with the information and systems it can reliably reach. Access, APIs,
            permissions and retrieval are the foundation underneath all three, not a service
            alongside them.
          </p>
          <p className="ai-enabling__links">
            <FLink href="/ai-automation/data-and-integration">What this covers</FLink>
            <FLink href="/engineering/cloud-data-engineering">Cloud &amp; data engineering</FLink>
          </p>
        </div>

        {/*
          COMPOSED, NEVER RETYPED. certified.positioningLine is accreditation-safe
          wording with exactly one home; it already replaced a stronger claim
          once, and a hand-typed second copy is how that displaced claim returns.
        */}
        <p className="small" style={{ marginTop: 40 }}>
          {certified.positioningLine} <FLink href="/assurance">Who does what</FLink>
        </p>
      </Section>

      {/* ----------------------------------------- 02 where AI earns its place */}
      <Section labelledBy="fit-heading" flush className="sec--tint sec--t1">
        <SectionHead
          eyebrow="Fit, not sector"
          id="fit-heading"
          title="Where AI earns its place"
          lead="Not by industry or company size, but by whether better context, reasoning, coordination or automation would materially change the outcome."
        />
        <div className="concepts">
          {EARNS.map(c => (
            <div className="concept" key={c.label}>
              <b>{c.label}</b>
              <span>{c.line}</span>
            </div>
          ))}
        </div>
        <p className="body ai-rule">
          If rules solve the problem reliably, use rules. If AI materially improves the outcome,
          introduce AI.
        </p>
      </Section>

      {/* --------------------------------------- 03 how production AI works */}
      {/*
        THE MERGE. "AI is more than the model" and "How we approach AI
        engineering" were one argument told twice - the first said a model is not
        enough, the second listed the things that make it enough. One section,
        one chain, and the principles that used to sit in the second one now live
        in their own consolidated section below.

        Restrained by instruction: the elaborate visual treatment is a later
        phase, so this is an ordered progression in real text.
      */}
      <Section labelledBy="how-heading">
        <SectionHead
          eyebrow="Anatomy"
          id="how-heading"
          title="How production AI works"
          lead="A model answers questions. A production system has to reach the right information, act inside its permissions, and still be right in six months."
        />
        <ol className="bflow bflow--6" style={{ marginTop: 40 }}>
          {CHAIN.map(s => (
            <li className="bflow__step" key={s.n}>
              <span aria-hidden className="bflow__dot" />
              <span className="bflow__n">{s.n}</span>
              <h3 className="h4 bflow__t">{s.t}</h3>
              <p className="body bflow__b">{s.b}</p>
            </li>
          ))}
        </ol>
        <p className="body ai-rule">
          Permissions, evaluation, observability and human controls are where most of the
          engineering actually goes.
        </p>
      </Section>

      {/* ------------------------------------------------- 04 the principles */}
      <Section labelledBy="principles-heading" flush tight className="sec--tint">
        <SectionHead
          eyebrow="How we work"
          id="principles-heading"
          title="Our AI engineering principles"
        />
        <div className="principles principles--6">
          {PRINCIPLES.map(p => (
            <div className="principle" key={p.n}>
              <i>{p.n}</i>
              <b style={{ marginTop: 6 }}>{p.label}</b>
              <span>{p.line}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------- 05 value discovery */}
      <Section labelledBy="discovery-heading">
        <SectionHead
          eyebrow="How an engagement starts"
          id="discovery-heading"
          title="Start with the problem, not the model"
          lead="We establish what the work costs today and whether AI would improve it. Sometimes the answer is that it would not."
        />
        <div className="ai-steps">
          {DISCOVERY.map(s => (
            <div className="ai-step" key={s.n}>
              <i>{s.n}</i>
              <b>{s.t}</b>
              <span>{s.b}</span>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 34 }}>
          <FLink href="/ai-automation/value-discovery">What a Value Discovery covers</FLink>
        </p>
      </Section>

      {/* ---------------------------------- 06 deployment and private AI */}
      {/*
        REDUCED FROM A SECTION TO A PARAGRAPH, on instruction. It was carrying a
        ruled register of four development areas and the largest interval of
        white on the page, which made a supporting capability read as a major
        part of the offer. The capability is not deleted, and the wording still
        refuses to treat "private" as a synonym for secure.
      */}
      <Section labelledBy="deploy-heading" tight>
        <SectionHead
          eyebrow="Deployment"
          id="deploy-heading"
          title="Where the system runs is a design decision"
          level={3}
        />
        <p className="body" style={{ marginTop: 18, maxWidth: '70ch' }}>
          Where requirements justify it, systems can be designed around specific deployment
          boundaries, data controls and model access - an architectural choice against a stated
          requirement, not a security guarantee in itself. Proprietary AI systems are also developed
          privately.
        </p>
        <p style={{ marginTop: 26 }}>
          <FLink href="/contact">Discuss a strategic AI opportunity</FLink>
        </p>
      </Section>

      {/* ------------------------------------------------------------- FAQs */}
      <Section labelledBy="faq-heading" flush className="sec--tint">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
        {/*
          THE FOUR-SERVICE GRID IS GONE, replaced by this line. It was a
          full-width section with four cards restating the global service
          architecture, which the navigation and footer already carry.
        */}
        <p className="small" style={{ marginTop: 40 }}>
          Automate is one of four services, alongside{' '}
          <FLink href="/engineering">Engineering</FLink>,{' '}
          <FLink href="/blockchain">Blockchain</FLink> and{' '}
          <FLink href="/support-continuous-improvement">Support</FLink>, which is where production
          AI is monitored and improved after release.
        </p>
      </Section>

      <ClosingCta eyebrow="Start here" title="Start with what needs to change">
        Tell us what is slow, manual, inconsistent or impossible to see. We will work out whether
        the answer is software, automation, AI or integration, and say so before anything is
        built.
      </ClosingCta>
    </div>
  );
}
