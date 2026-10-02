import { ClosingCta } from '@/components/sections';
import { Cta, Eyebrow, FLink, Faqs, JsonLd, Section, SectionHead, SourceNote } from '@/components/ui';
import { certified } from '@/content/company';
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
 *
 * POSITIONING AMENDMENT, 2026-10-02 (founder brief "AI & Automation hero +
 * positioning refinement, final amendment"). The page used to open on the
 * adoption gap - "Most companies have adopted AI. Far fewer can show what it
 * changed" - with two survey figures under it, which made proving AI's impact
 * the whole offer. It now opens on opportunity and runs:
 *
 *   possibility (hero, then Assist / Understand / Act / Discover)
 *   -> what we engineer (the three routes, Data & Integration beneath)
 *   -> where AI earns its place -> how we approach it
 *   -> evidence ("How do we know it actually works?")
 *   -> Value Discovery and the closing CTA.
 *
 * Measurement is not gone; it moved down. The hero's last words are "outcomes
 * that can be measured", and the evidence section explains how. The adoption
 * figures (gapStats) left this page with the old headline, and the FAQ that
 * restated them was replaced: they argued the old proposition and do nothing
 * for the new one. They still render on the home page, which this brief does
 * not cover. The overview visual is under separate review and is NOT built
 * here: the Assist / Understand / Act / Discover section is text only.
 */

export const metadata = pageMetadata({
  title: 'AI & Automation',
  description:
    'What could AI make possible for you? AI systems, AI agents and automation, engineered around real problems, real systems and outcomes that can be measured.',
  path: '/ai-automation',
});

/**
 * Assist -> Understand -> Act -> Discover: the spectrum the forthcoming overview
 * visual is built on. Text only until that visual is approved.
 *
 * Kept deliberately broad - a product, a customer, an engineer, a forecast -
 * because the brief is explicit that the page must not read as office
 * automation. No sector list. DISCOVER is worded so it does not promise that
 * AI finds opportunities on its own: it points, people decide.
 */
const SPECTRUM = [
  {
    n: '01',
    t: 'Assist',
    b: 'Help with what you are already doing, from guiding a customer to the right product to taking an engineer through a diagnosis.',
  },
  {
    n: '02',
    t: 'Understand',
    b: 'Make sense of complex information and context: text, speech, images and data that are difficult to process by hand.',
  },
  {
    n: '03',
    t: 'Act',
    b: 'Connect intelligence to products, systems and real-world workflows, and take permitted action where appropriate.',
  },
  {
    n: '04',
    t: 'Discover',
    b: 'Reveal patterns, anticipate change and point to potential opportunities that were hard to see. People decide which are worth pursuing.',
  },
];

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
    body: 'AI systems that can read, see and hear, understand information and context, identify patterns, predict outcomes and recommend actions.',
    facets: ['Read, see, hear', 'Understand', 'Predict', 'Recommend'],
    links: [
      { href: '/ai-automation/predictive-intelligence', label: 'Prediction and patterns' },
      { href: '/ai-automation/language-speech-vision', label: 'Language, speech and vision' },
    ],
  },
  {
    n: '02',
    title: 'AI agents & automation',
    body: 'Automation follows a process. An AI agent pursues an objective: it plans the work, uses approved tools and systems, takes permitted actions and involves people at defined control points.',
    facets: ['Deterministic', 'AI-assisted', 'Controlled agentic'],
    links: [
      { href: '/ai-automation/workflow-automation', label: 'Workflow automation' },
      { href: '/ai-automation/agentic-ai-multi-agent', label: 'Agentic and multi agent' },
    ],
  },
  {
    n: '03',
    title: 'Evaluation & observability',
    body: 'Testing against defined acceptance criteria, regression checks when anything changes, and monitoring of production behaviour, with the system re-verified after each improvement.',
    facets: ['Acceptance criteria', 'Regression', 'Drift', 'Monitoring'],
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

/**
 * §13. Value Discovery as the entry methodology, not a fifth service.
 *
 * Re-sequenced 2026-10-02 to the amendment's seven questions, carried in the
 * existing four steps rather than seven: goal and opportunity; rules or AI;
 * whether it needs to act; success, baseline and measurement.
 */
const DISCOVERY = [
  {
    n: '01',
    t: 'Set the goal',
    b: 'What are you trying to achieve, and what problem or opportunity stands in the way?',
  },
  {
    n: '02',
    t: 'Choose the simplest tool',
    b: 'Would conventional software or rules solve it, or does AI add useful capability?',
  },
  {
    n: '03',
    t: 'Decide how far it goes',
    b: 'Does the system need to act, and where do people stay in control?',
  },
  {
    n: '04',
    t: 'Define success',
    b: 'What would success look like, where is the baseline today, and how will we measure it?',
  },
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
    /*
     * REPLACED 2026-10-02. This was "Why can so few organisations show a return
     * on AI?", answered with the two McKinsey figures that sat under the old
     * hero. It restated the adoption-failure argument the amendment retires, so
     * it went with the headline. Its replacement carries the breadth the
     * amendment asks for, with no figures.
     */
    q: 'What could AI do for my organisation?',
    a: 'More than office administration. AI can assist with work already being done, understand text, speech, images and data that are slow to process by hand, act inside products and systems within defined permissions, and surface patterns, forecasts and anomalies that were hard to see. That applies to software products, customer and retail experiences, personal and wellbeing apps, operations and industrial settings as much as to back-office work. Whether AI is the right tool for a particular problem is the first thing a Value Discovery establishes.',
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
      {/* REPLACED 2026-10-02. Headline and supporting line are the founder's
          approved wording, verbatim: do not rewrite either, and the headline
          takes no full stop. The CTA architecture is unchanged; the secondary
          label moved from "How we measure it", whose "it" pointed at the old
          supporting line, to the brief's own "See how we evaluate AI". */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          <Eyebrow>AI &amp; Automation</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            What could AI make possible for you?
          </h1>
          <p className="lead" style={{ marginTop: 24, maxWidth: '52ch' }}>
            From intelligent products and automation to AI agents, prediction and new ways of
            understanding information, we design and engineer AI around real problems, real systems
            and outcomes that can be measured.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Start with what needs to change</Cta>
            <Cta href="/ai-automation/evaluation-and-observability" variant="secondary">
              See how we evaluate AI
            </Cta>
          </div>
        </div>
      </div>

      {/* ----------------------------- 00 assist, understand, act, discover */}
      {/*
        IN THE PLACE OF THE EVIDENCE BAND, removed 2026-10-02 with the headline
        it supported. The amendment says whitespace is preferable to irrelevant
        evidence and forbids replacing the figures with others, so this is not a
        new statistic strip: it is the first step of the new narrative, what AI
        could make possible, before what we engineer.
      */}
      <Section labelledBy="spectrum-heading" flush className="sec--tint">
        <SectionHead
          eyebrow="What AI can make possible"
          id="spectrum-heading"
          title="Assist, understand, act, discover"
          lead="AI is not only for email, meetings and documents. It can sit inside a product, a customer experience, an operation or a forecast, and what it does there tends to take one of four forms."
        />
        <div className="ai-steps">
          {SPECTRUM.map(s => (
            <div className="ai-step" key={s.n}>
              <i>{s.n}</i>
              <b>{s.t}</b>
              <span>{s.b}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* --------------------------------------------- 01 the three routes */}
      <Section labelledBy="routes-heading">
        <SectionHead
          eyebrow="What we build"
          id="routes-heading"
          title="Three ways AI is built into a business"
          lead="AI systems are how a product understands. Agents and automation are how it acts. Evaluation and observability is how you know it works. They overlap in practice, and a programme often needs two of them."
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

      {/* ---------------------------------------------- 05 evidence */}
      {/*
        THE PROOF ARGUMENT, MOVED HERE 2026-10-02 from the hero. By this point
        the reader knows what AI could do and what we engineer; only now does the
        page ask how anyone would know it works. Kept to one paragraph so it does
        not become a second hero or make the whole offer subordinate to
        evaluation.
      */}
      <Section labelledBy="evidence-heading">
        <SectionHead
          eyebrow="Evaluation & observability"
          id="evidence-heading"
          title="How do we know it actually works?"
          lead="Building it is only part of the job. You also need to know whether it works."
        />
        <p className="body" style={{ marginTop: 24, maxWidth: '70ch' }}>
          So success is defined before anything is built, as acceptance criteria that can be
          measured, with a pass or fail where the task allows one. The system is tested against
          them, regression checks catch what a change breaks, and its behaviour in production is
          monitored so that drift is noticed rather than discovered. Where it is appropriate,
          evaluation carries on after release, and each improvement is verified against the same
          criteria.
        </p>
        <p style={{ marginTop: 26 }}>
          <FLink href="/ai-automation/evaluation-and-observability">
            How evaluation and observability works
          </FLink>
        </p>
      </Section>

      {/* ------------------------------------------------- 06 value discovery */}
      <Section labelledBy="discovery-heading" flush className="sec--tint">
        <SectionHead
          eyebrow="How an engagement starts"
          id="discovery-heading"
          title="Start with the problem, not the model"
          lead="We start with what you are trying to achieve, then work out whether AI is the right tool and how its success will be measured. Sometimes the answer is that it is not."
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

      {/* ---------------------------------- 07 deployment and private AI */}
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
        Tell us what you want to make possible, or what is slow, manual, inconsistent or
        impossible to see. We will work out whether the answer is software, automation, AI or
        integration, and say so before anything is built.
      </ClosingCta>
    </div>
  );
}
