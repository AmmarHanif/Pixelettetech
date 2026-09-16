import Link from 'next/link';

import { AiSystemDiagram } from '@/components/AiSystemDiagram';
import { ClosingCta, ValueModelCards } from '@/components/sections';
import {
  CheckList,
  Cta,
  Eyebrow,
  FLink,
  Faqs,
  JsonLd,
  MediaSlot,
  Section,
  SectionHead,
  SourceNote,
} from '@/components/ui';
import { certified } from '@/content/company';
import { gapStats } from '@/content/sources';
import {
  caseStudies,
  displayKicker,
  displayName,
  publishedDetail,
  publishedImage,
} from '@/content/work';
import { breadcrumbSchema, faqSchema, serviceSchema } from '@/lib/schema';
import { pageMetadata } from '@/lib/seo';

/*
 * REBUILT 2026-09-16 on a founder instruction to simplify rather than add:
 * "focus on simplification, visual quality and positioning, not adding more
 * narrative", and "the finished page should feel shorter and stronger".
 *
 * WHAT THE DESIGN REVIEW FOUND, AND IT WAS NOT THE COPY. The page did not read
 * as service copy because of its words. It read that way because of its
 * GEOMETRY: sixteen bordered cards, nine identical 96px bands, nine hairlines,
 * and ONE heading size doing the work of eight. Uniform texture is what "flat"
 * means. So most of this rewrite REMOVES a treatment rather than adding one,
 * and the rhythm now has three tiers instead of one (globals.css, .ai-pg).
 *
 * REMOVED HERE, each for a stated reason:
 *  - Testimonials. The component takes no filter and inherits a GLOBAL featured
 *    pair, so nothing made those voices AI clients. That is the same defect the
 *    founder had removed from this page earlier the same day when the client
 *    row went. It still renders on /about and /engineering, so no voice leaves
 *    the site - checked before removing, not after.
 *  - The "Came for a build rather than for AI?" card. It linked to
 *    /engineering; the BUILD card in ValueModelCards links to /engineering
 *    about 300px away, in different words. The canonical one stayed.
 *  - The Certified dark panel, folded to one composed line.
 *  - The two "gap" paragraphs. The FIGURES stayed: the h1 is a claim about the
 *    market, and they are the only third-party citation on the page.
 *  - The audience section, replaced by "Where AI earns its place".
 *
 * WHAT LEFT WITH THE AUDIENCE SECTION and is not replaced anywhere on this
 * page: the only two links to /industries/*. That routing gap is real and is
 * the founder's to close. A sector row was deliberately NOT invented here,
 * because re-adding sector links is how "not by industry" quietly becomes "by
 * industry" again.
 */

export const metadata = pageMetadata({
  title: 'AI engineering for UK businesses',
  description:
    'We engineer AI into the systems you already run, measure what it changes and keep it working. Start with a four-week Value Discovery.',
  path: '/ai-engineering',
});

/*
 * Five capabilities as a ruled schedule rather than a card grid: the visual
 * language of a scope document, not a service shop.
 *
 * THE ICONS ARE GONE ON PURPOSE. A row in a ruled schedule is a document line,
 * not a navigational object, and the five marks did not distinguish these five
 * services to any reader - they cost 32px and a purple accent each and returned
 * nothing. The founder's earlier "keep the icons" instruction was about the
 * four PRACTICE marks on tiles elsewhere, and those are untouched.
 */
const services = [
  {
    tag: 'Build',
    title: 'Production AI Systems',
    href: '/ai-engineering/production-ai-systems',
    linkLabel: 'See how we build',
    body: 'AI inside a named workflow, with the workflow redesigned around it. Human in the loop by default.',
  },
  {
    tag: 'Ready',
    title: 'Data & Integration',
    href: '/ai-engineering/data-and-integration',
    linkLabel: 'What we build',
    body: 'Entitlement-aware access to your systems of record, and the context layer that makes them usable by a model.',
  },
  {
    tag: 'Measure',
    title: 'Value Discovery',
    href: '/ai-engineering/value-discovery',
    linkLabel: 'What the four weeks covers',
    body: 'Four weeks. We instrument the process, measure what it costs today, and write the business case.',
  },
  {
    tag: 'Prove',
    title: 'Evaluation & Observability',
    href: '/ai-engineering/evaluation-and-observability',
    linkLabel: 'How we measure',
    body: 'Test sets, regression checks and monitoring, so you see output quality move before your users do.',
  },
  {
    /*
     * THE ONLY PRICE STRING LEFT ON THIS SITE, retained EXACTLY as it stood.
     * The 6,000-12,000 band was removed sitewide on founder instruction; this
     * one he is still actively deciding about, so it is not mine to remove,
     * re-word or quietly relocate. If he does remove it, this row needs a
     * replacement link label and nothing else changes.
     */
    tag: 'Run',
    title: 'Support & Run',
    href: '/ai-engineering/support-and-run',
    linkLabel: 'From £1,500 / month',
    body: 'We keep it running, AI included, under contract, with a monthly report showing what changed.',
  },
];

/*
 * Four problem shapes, not four audiences. The founder's wording, verbatim.
 *
 * These REPLACE a section that defined the reader by two named sectors, a
 * revenue band, a country and three job titles - four filters that stacked
 * multiplicatively, so a reader had to pass all four. Those were IDENTITY
 * filters (who you are) where these are SITUATION filters (what is true of you
 * now), and identity filters turn away people who would fit.
 */
const concepts = [
  {
    label: 'Fragmented knowledge',
    line: 'Information spread across people, documents and systems.',
  },
  {
    label: 'Complex workflows',
    line: 'Work slowed by hand-offs, manual coordination and repeated actions.',
  },
  {
    label: 'Automation that stops too early',
    line: 'Existing automation handles routine steps but not context, judgement or exceptions.',
  },
  {
    label: 'New AI opportunities',
    line: 'Products, workflows or capabilities that cannot simply be bought off the shelf.',
  },
];

const principles = [
  { n: '01', label: 'Problem first', line: 'Start with the outcome, not the model.' },
  {
    n: '02',
    label: 'Model agnostic',
    line: 'Use the right large language model (LLM), model or combination of models for the task.',
  },
  {
    n: '03',
    label: 'Controlled autonomy',
    line: 'Define clearly what AI can recommend, execute or escalate to a person.',
  },
  {
    n: '04',
    label: 'Measure what matters',
    line: 'Evaluate usefulness, reliability and operational improvement before increasing autonomy.',
  },
];

/*
 * Development AREAS, not products. Deliberately generic, and that is the point.
 *
 * NOTHING IN THIS LIST MAY EVER BECOME SPECIFIC. No codename, no screenshot, no
 * architecture, no feature list, no price, no date, no roadmap, no per-row link
 * and no per-row call to action - not here, not in an alt attribute, not in an
 * aria-label, not in a CSS class name, not in metadata. A leak check enforces
 * this against the BUILT output, because a codename can reach a reader through
 * a meta description or a JSON-LD blob without ever appearing in visible copy.
 * That check lives in the vault beside this repo rather than inside it, so the
 * control against publishing those names is not itself what puts them into a
 * repository whose purpose is public output.
 *
 * The status mark is IDENTICAL on all four rows on purpose. Four different
 * statuses would invite ranking, and ranking is the beginning of a launch
 * narrative.
 */
const developmentAreas = [
  'Commercial intelligence',
  'Marketing intelligence',
  'Organisational intelligence',
  'Professional workflow intelligence',
];

const faqs = [
  {
    q: 'Why can so few organisations show a return on AI?',
    a: 'Because the work around the model was never redesigned, the data it needs was never made reachable, and nobody owns whether it still works next quarter. Around 80% of individual AI users report they are more productive, while only 37% of organisations can attribute any EBIT impact to it — a figure unchanged year on year (McKinsey State of AI, August 2026, n=1,719).',
  },
  {
    q: 'What is a Value Discovery?',
    a: 'A four-week engagement. Two or three processes are instrumented and measured, the measurement is left running and is yours to keep, and you receive a prioritised opportunity map, a costed roadmap and a board-ready business case naming the budget line it displaces. If the numbers do not support going further, Pixelette says so in writing.',
  },
  {
    /*
     * PROFILE REMOVED 2026-09-16. This answer used to end with the same
     * revenue-band, COO, CFO and CISO profile as the deleted audience section,
     * so the page published the constraint twice and the FAQPage JSON-LD
     * published it a third time to machines. The qualifying half - what this is
     * not - is real, and is kept.
     */
    q: 'Who is Pixelette Technologies AI engineering not for?',
    a: 'Organisations looking for developers by the day, a first AI experiment with no budget line behind it, or a supplier who will build something and leave. We sell the running of it, and that only works when someone owns the outcome.',
  },
  {
    /*
     * Do not cut this one. Since the Certified dark panel was folded to a single
     * line, this answer is the machine-readable home of a boundary that is
     * accreditation-sensitive: the firm that builds a system is not the firm
     * that assesses it.
     */
    q: 'Does Pixelette Technologies audit or certify the AI it builds?',
    a: 'No, and it does not offer to. Where a programme needs formal governance, certification readiness, privacy or security-assurance support, Pixelette Certified — a separate practice in the same group — can scope the requirement, coordinate appropriately credentialed specialists and support the route to independent assessment. Independent assurance stays independent: the firm that builds a system is not the firm that assesses it.',
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

export default function AiEngineeringPage() {
  /*
   * LYTICS ONLY. The other study here was blockchain work, not AI, and it was
   * standing as the proof on an AI page. Lytics IS AI: a production
   * sentiment-classification system that analysts stopped overriding.
   *
   * The founder's read was that NEITHER belonged. One did, and saying so was
   * the point: cutting both would have stripped this page of its only
   * first-party evidence.
   */
  const lytics = caseStudies.find(c => c.slug === 'lytics');
  const detail = lytics ? publishedDetail(lytics) : undefined;

  return (
    <div className="ai-pg">
      <JsonLd
        data={serviceSchema({
          name: 'AI engineering',
          description:
            'Production AI systems, data and integration, evaluation and observability, and support and run for AI in production.',
          path: '/ai-engineering',
          serviceType: 'Artificial intelligence engineering',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'AI engineering', path: '/ai-engineering' },
        ])}
      />
      <JsonLd data={faqSchema(faqs)} />

      {/* ------------------------------------------------------------ hero */}
      <div className="hero-glow" style={{ padding: '80px 0 64px' }}>
        <div className="wrap">
          {/*
            WAS "part of Build", corrected 2026-09-16. ValueModelCards
            current="AUTOMATE" further down THIS PAGE marks it as Automate, and
            that same section lists Build as one of the OTHER three. The page
            contradicted itself; this was the stale half.
          */}
          <Eyebrow>AI engineering · part of Automate</Eyebrow>
          <h1 className="h1" style={{ marginTop: 24, maxWidth: '21ch' }}>
            Most companies have bought AI. Very few are getting paid for it.
          </h1>
          {/*
            Shortened from a three-clause sentence that ended on the Certified
            governance hand-off - necessary wording, but inert, and sitting in
            the second most valuable line on the page directly under a 64px
            headline. It now appears once, at the foot of the capabilities
            section, composed from its single source.

            "UK mid-market businesses" also went: that is audience by geography
            and size, and it contradicts the instruction that this page must
            read for a broad range of organisations.
          */}
          <p className="lead" style={{ marginTop: 24, maxWidth: '46ch' }}>
            We engineer AI into the systems an organisation already runs, measure what it changes,
            and keep it working in production.
          </p>
          <div className="btn-row" style={{ marginTop: 34 }}>
            <Cta href="/contact">Book a conversation</Cta>
            {/*
              "Sample" is load-bearing: the panel this points at is a captioned
              MOCK, and a label promising "the report" would be the strongest
              wording on the site sitting over its weakest evidence.
            */}
            <Cta href="/ai-engineering/support-and-run" variant="secondary">
              See a sample report
            </Cta>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- evidence band (folded) */}
      {/*
        All that survives of the old "gap" section. The two paragraphs went: one
        restated the h1 in longer form, the other pre-empted "Where AI earns its
        place" below. The FIGURES stayed, because the h1 is a claim about the
        market and these are the only third-party citation on the page - cutting
        them would leave the site's boldest sentence as its least supported one.
        They also appear in FAQ 1, which feeds the FAQPage JSON-LD, so the
        visible page and the machine-readable answer stay in agreement.

        No card treatment: bordered, shadowed boxes would make two statistics
        look like a product grid and re-import the weight this fold removed.
      */}
      {gapStats.length > 0 && (
        <Section flush tight className="sec--tint">
          <div className="ev-band">
            {gapStats.map(stat => (
              <div className="ev-fig" key={stat.label}>
                <b>{stat.value}</b>
                <span>{stat.label}</span>
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

      {/* ---------------------------------------------------- capabilities */}
      <Section labelledBy="what-heading" flush>
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
            eyebrow="What we do"
            id="what-heading"
            title="Five things we engineer. One we deliberately do not."
          />
          <FLink href="/ai-engineering/services">All AI services</FLink>
        </div>

        <div className="sched">
          {services.map(s => (
            <div className="sched-row" key={s.href}>
              <span className="tag">{s.tag}</span>
              <div>
                <h3 className="h4">{s.title}</h3>
                <p>{s.body}</p>
              </div>
              <FLink href={s.href}>{s.linkLabel}</FLink>
            </div>
          ))}
        </div>

        {/*
          The "one we deliberately do not", as a single line rather than the dark
          panel that used to carry it.

          COMPOSED, NEVER RETYPED. certified.positioningLine is
          accreditation-safe wording with exactly one home; it already replaced a
          stronger claim once, and a hand-typed second copy is precisely how that
          displaced claim comes back. FAQ 4 keeps the machine-readable version,
          and the footer group band keeps the outbound link.
        */}
        <p className="small" style={{ marginTop: 40 }}>
          {certified.positioningLine} <FLink href="/assurance">Who does what</FLink>
        </p>
      </Section>

      {/* ----------------------------------------- where AI earns its place */}
      <Section labelledBy="fit-heading">
        {/*
          The eyebrow does real work: it tells the reader before they read a word
          that this is not an industry list, which is the whole point of the
          replacement.
        */}
        <SectionHead
          eyebrow="Fit, not sector"
          id="fit-heading"
          title="Where AI earns its place"
          lead="We do not define a good AI opportunity by industry or company size. We look for work where better context, reasoning, coordination or automation can materially change the outcome."
        />
        {/*
          Four items, NOT four cards. Four bordered boxes here would reinstate,
          two sections later, exactly the treatment the schedule above removed -
          and on the lightest content on the page. A rule and a measure carry it.
        */}
        <div className="concepts">
          {concepts.map(c => (
            <div className="concept" key={c.label}>
              <b>{c.label}</b>
              <span>{c.line}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------- AI is more than the model */}
      <Section labelledBy="anatomy-heading" flush className="sec--tint sec--t1">
        <SectionHead
          eyebrow="Anatomy"
          id="anatomy-heading"
          title="AI is more than the model"
          lead="Production AI depends on the systems around the model — context, data, tools, permissions, evaluation and human control."
        />
        {/*
          An ILLUSTRATIVE architecture, drawn from first principles and labelled
          as illustrative twice inside the artwork itself. It depicts no system
          that exists, and it must never be allowed to drift towards one.

          Every label is real selectable text rather than a path, so it is
          indexable, reflowable and readable by a screen reader, and the spine
          reflows from horizontal to vertical by container query rather than
          forcing the page to scroll sideways.
        */}
        <div style={{ marginTop: 64 }}>
          <AiSystemDiagram />
        </div>
      </Section>

      {/* ------------------------------------------------------- principles */}
      <Section labelledBy="approach-heading" flush tight>
        <SectionHead
          eyebrow="How we work"
          id="approach-heading"
          title="How we approach AI engineering"
        />
        {/*
          2x2, not four across: four columns gives roughly 260px tracks and four
          ragged lines. One sentence each, and no introductory paragraph - a
          paragraph introducing four one-line principles is the padding the brief
          bans.
        */}
        <div className="principles">
          {principles.map(p => (
            <div className="principle" key={p.n}>
              <i>{p.n}</i>
              <b style={{ marginTop: 6 }}>{p.label}</b>
              <span>{p.line}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ proof */}
      {lytics && detail && (
        <Section labelledBy="proof-heading" flush className="sec--t1-close">
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
              eyebrow="Proof"
              id="proof-heading"
              title="One AI system, named, in production"
            />
            <FLink href="/case-studies">Read the full case studies</FLink>
          </div>

          {/*
            THE SENTENCE THAT MAKES ONE STUDY READ AS CHOSEN RATHER THAN SOLE. A
            single case study given a full-width set-piece reads as "the only one
            we have" unless something says why it was selected, and that is the
            one thing a layout cannot fix by itself.

            It also replaced an h2 reading "Named clients. Named processes." -
            plural clients standing over a single study.
          */}
          <p className="small" style={{ marginTop: 16, maxWidth: '72ch' }}>
            We have other case studies. This is the one where the subject is AI, the system is in
            production, and the client is named.
          </p>

          {/*
            Everything below resolves through the work.ts publication gate, so a
            study whose permission changes renders anonymised rather than leaking
            a name and a logo-bearing image.

            NO METRIC SLOT, deliberately. All four Lytics figures are HELD
            against the claims register, so publishedMetrics returns nothing and
            any layout reserving space for a number would render a hole.
            Prominence comes from scale and composition instead - which is the
            honest way round, because inventing a figure to fill that hole is the
            exact failure the register exists to prevent.
          */}
          <div style={{ marginTop: 40 }}>
            <span className="mono work-card__kicker">{displayKicker(lytics)}</span>
            <h3 className="h3" style={{ marginTop: 12, maxWidth: '24ch' }}>
              {lytics.title}
            </h3>
          </div>

          <Link
            href={`/case-studies/${lytics.slug}`}
            className="work-card"
            style={{ display: 'block', marginTop: 28 }}
          >
            <MediaSlot
              label={lytics.imageLabel}
              src={publishedImage(lytics)}
              alt={`${displayName(lytics)} — ${lytics.title}`}
            />
          </Link>

          {/*
            Three steps left to right, which is what the arrows in the
            instruction meant. The previous two-column split ran the image about
            280px shorter than the text beside it and left the left half of the
            block empty - found by reading the render, not the markup.
          */}
          <div className="cs-cols">
            {[
              { label: 'Challenge', body: detail.problem },
              { label: 'What we engineered', body: detail.built },
              { label: 'Outcome', body: detail.measured },
            ].map(col => (
              <div key={col.label}>
                <span className="tag">{col.label}</span>
                <p>{col.body}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: 36 }}>
            <FLink href={`/case-studies/${lytics.slug}`}>Read the full case study</FLink>
          </p>
        </Section>
      )}

      {/* ------------------------------------------- private AI development */}
      {/*
        A REGISTER, NOT A TEASER, and that distinction is the whole design.

        Teaser marketing has a fixed set of CONCEALMENT devices - blur, locks,
        redaction, "coming soon", a waitlist - and every one of them promises a
        reveal. These are DOCUMENTARY devices instead: a ruled register, one
        repeated status mark, no dates, no counts, no per-row link. A register
        records things that EXIST; a teaser announces things that are COMING.

        The section is therefore the quietest on the page, not the loudest: the
        heading is under-scaled, and there is no card, no tint and no dark band.
        It is distinct by RESTRAINT rather than by contrast, because a dramatic
        full-bleed treatment here would be the visual grammar of a launch, which
        is the one thing this section must not be.

        The large interval of white above it is the biggest on the page and is
        doing narrative work: it is the pause between "here is our proof" and
        "here is what we are not going to show you". Do not close it up.
      */}
      <Section labelledBy="private-heading" flush className="sec--register">
        <SectionHead
          eyebrow="Beyond client delivery"
          id="private-heading"
          title="Private AI development"
          level={3}
          lead="Alongside client work, Pixelette Technologies is developing proprietary AI systems designed to coordinate increasingly complex business workflows and functions. Selected programmes remain under private development and are discussed only where there is a genuine strategic, validation or commercial fit."
        />
        <div className="register">
          {developmentAreas.map(area => (
            <div className="reg-row" key={area}>
              <b>{area}</b>
              <i>Under development</i>
            </div>
          ))}
        </div>
        {/*
          A TEXT LINK, NOT A BUTTON. A filled button here is the visual grammar
          of a product launch, and this section exists to say the opposite. The
          label is the founder's own and routes to the ordinary contact path.
        */}
        <p style={{ marginTop: 40 }}>
          <FLink href="/contact">Discuss a strategic AI opportunity</FLink>
        </p>
      </Section>

      {/* -------------------------------------------------- where this sits */}
      {/*
        Moved to the foot 2026-09-16. It is an orientation and exit device, not
        an argument: at position four it interrupted the page mid-case and
        invited the reader to leave before they had a reason to stay. At the foot
        it is an exit ramp for a reader who has decided this is not their
        practice, which is what it is for.

        The h2 and `current` below must always name the same practice. Nothing
        enforces that. Change one, change the other.

        The old comment here said this section was deliberately left untinted
        because "The method" below it was tinted. That constraint is stale - the
        method section was removed on 2026-09-16.
      */}
      <Section labelledBy="sits-heading" tight>
        <SectionHead
          eyebrow="Where this sits"
          id="sits-heading"
          title="Automate is one of our four services"
          lead="Build, Decentralise and Run are the other three."
        />
        <div style={{ marginTop: 32 }}>
          <ValueModelCards current="AUTOMATE" />
        </div>
      </Section>

      {/* ------------------------------------------------------------- FAQs */}
      <Section labelledBy="faq-heading">
        <SectionHead eyebrow="FAQs" id="faq-heading" title="Questions worth answering" />
        <Faqs items={faqs} />
      </Section>

      <ClosingCta
        eyebrow="Start here"
        title="First we find out where you are, then we agree what is worth doing"
        aside={
          <div className="card">
            <Eyebrow>What it includes</Eyebrow>
            <h3 className="h3" style={{ marginTop: 16 }}>
              Value Discovery
            </h3>
            <p className="small" style={{ marginTop: 14 }}>
              Four weeks, start to readout.
            </p>
            <div style={{ marginTop: 22 }}>
              <CheckList
                items={[
                  'Two to three processes instrumented and measured',
                  'Measurement left running, and yours to keep',
                  'Prioritised opportunity map with a costed roadmap',
                  'Board-ready business case naming what it displaces',
                ]}
              />
            </div>
            <hr className="rule" style={{ margin: '24px 0 18px' }} />
            <p className="small">Four weeks · No procurement cycle required</p>
          </div>
        }
      >
        We instrument two or three of your processes, measure what they cost today, and write the
        business case. If the numbers do not support going further, we say so.
      </ClosingCta>
    </div>
  );
}
