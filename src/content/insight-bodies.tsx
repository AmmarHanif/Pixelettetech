import type { ReactNode } from 'react';

import { AgentScopeDiagram, EvaluationGateDiagram } from '@/components/InsightVisuals';
import { SOURCES } from '@/content/sources';

/**
 * Article bodies, keyed by slug.
 *
 * TWO PUBLISHED PIECES, 2026-09-24. Both are written rather than stubbed: the
 * route resolves an article only when it is `status: 'published'` AND has a body
 * here, so a slug listed in one place and missing from the other returns 404
 * instead of an empty page.
 *
 * SOURCES ARE CITED FROM content/sources.ts, NOT INVENTED. That register already
 * distinguishes figures whose attribution can be checked from figures whose
 * cannot, and the distinction bites here: the three agent statistics in it (54
 * incidents a year, 85 per cent without spend visibility, 11 per cent prepared
 * for 2027 scale) are exactly what an article about agents wants to open with,
 * and every one is `published: false` because its attribution names no
 * publisher. They are not used. What is used is the McKinsey adoption gap and
 * the HFS conversion data, both of which name a publisher, a date and a sample.
 *
 * NO URLs ARE ATTACHED TO THE CITATIONS, deliberately. The register holds
 * publisher, title, date and sample size, which is enough to find a study; it
 * does not hold a verified link, and a plausible-looking URL that resolves to
 * the wrong page is worse than an attribution line a reader can search for.
 *
 * TO PUBLISH A THIRD PIECE, three things change together and the types enforce
 * it: write the body here; set `status: 'published'` in content/insights.ts with
 * `publishedOn`, `readingMinutes` and an `attribution`; and add its sources
 * below. The Insights page needs no change to accommodate it.
 */

/** A pulled-out line. Used sparingly: it loses force if every section has one. */
function Pull({ children }: { children: ReactNode }) {
  return <p className="art-pull">{children}</p>;
}

/** An attribution under a figure, matching the pattern used across the site. */
function Cite({ children }: { children: ReactNode }) {
  return <p className="art-cite">{children}</p>;
}

export const INSIGHT_BODIES: Record<string, () => ReactNode> = {
  /* ------------------------------------------------------------ article 1 */
  'where-ai-agents-should-work': () => (
    <>
      <p className="body">
        Almost every organisation now has an AI agent somewhere. Far fewer can point at a
        line in the accounts and say what it changed. That gap is not evidence that agents
        do not work. It is evidence that the question most teams asked first was
        <em> can we build one</em>, when the question that decides the outcome is
        <em> where should it run</em>.
      </p>

      <h2 className="h3">The adoption gap is real, and it is not about capability</h2>
      <p className="body">
        Individual users report that AI makes them faster, and they are almost certainly
        right. What has not followed is attributable organisational value. In the most
        recent large survey, 80 per cent of individual users reported being more
        productive, while only 37 per cent of organisations could attribute any EBIT
        impact to AI at all, a figure unchanged year on year.
      </p>
      <Cite>{SOURCES.mckinsey}</Cite>
      <p className="body">
        A year of no movement in that second number is the interesting part. If the
        constraint were model capability, the figure would have risen, because the models
        plainly improved. It did not, which points at something structural: the work
        around the model was never redesigned, the data it needed was never made
        reachable, and nobody owned whether it still worked the following quarter.
      </p>

      <h2 className="h3">What an agent actually is</h2>
      <p className="body">
        Stripped of marketing, an agent is a system that can plan a sequence of steps,
        reason about intermediate results, take actions against real systems, and produce
        something a person or another system can use. The fourth part is where value is
        created and the third is where risk is created, which is why the two have to be
        designed together.
      </p>
      <AgentScopeDiagram />
      <p className="body">
        The distinction that matters is not agent against chatbot. It is whether the
        system is permitted to <strong>act</strong>. A system that drafts a reply for a
        person to send has a failure mode of wasted time. A system that sends the reply
        has a failure mode of a sent reply. Both may be worth building. They are not the
        same engineering problem and should not be governed identically.
      </p>

      <h2 className="h3">The evidence on where agents survive contact with production</h2>
      <p className="body">
        There is a useful and slightly counterintuitive pattern in how AI use cases
        convert from proof of concept to production. Broad productivity cases start
        strongly and finish poorly. Narrow, process-specific cases start weakly and
        finish far better.
      </p>
      <div className="art-figure">
        <div className="art-figure__row">
          <span className="art-figure__label">Generic productivity cases</span>
          <span className="art-figure__value">54% proof of concept, 19% production</span>
        </div>
        <div className="art-figure__row">
          <span className="art-figure__label">Narrow process-performance cases</span>
          <span className="art-figure__value">8% proof of concept, 27% production</span>
        </div>
      </div>
      <Cite>{SOURCES.hfs}</Cite>
      <p className="body">
        Read those two rows in the right order and they describe a trap. The cases that
        are easiest to start are the ones least likely to finish, because &ldquo;make the
        team more productive&rdquo; has no owner, no threshold and no measurable before
        state. The cases that are hardest to start are the ones most likely to finish,
        because a named process already has a cost, a volume, an owner and a definition of
        correct.
      </p>
      <Pull>
        The question is not whether an agent can do the work. It is whether anyone can
        tell afterwards if it did.
      </Pull>

      <h2 className="h3">Four tests for where an agent earns its place</h2>
      <p className="body">
        Before committing engineering effort, we put a candidate process through four
        questions. A process that fails any of them is not necessarily a bad idea, but it
        is a bad <em>first</em> idea.
      </p>

      <h3 className="h4">1. Is the process bounded?</h3>
      <p className="body">
        Can you describe where it starts, where it ends and what it touches? An
        unbounded brief produces an unbounded system, and an unbounded system cannot be
        evaluated because there is no complete list of what it is supposed to do.
      </p>

      <h3 className="h4">2. Is the output checkable?</h3>
      <p className="body">
        Somebody, or something, must be able to tell a good result from a bad one without
        redoing the work. If verifying the output costs as much as producing it, the
        automation has moved effort rather than removed it.
      </p>

      <h3 className="h4">3. Is the failure tolerable and reversible?</h3>
      <p className="body">
        Ask what happens on the worst day, not the average one. A misfiled document is
        recoverable. A payment sent to the wrong counterparty, a message to a regulator,
        or a record deleted from a system of record may not be. Where failure is
        irreversible, the agent proposes and a person disposes.
      </p>

      <h3 className="h4">4. Does it have a named owner?</h3>
      <p className="body">
        Not a sponsor for the project, an owner for the running of it. Someone whose job
        it is to look at what the system did last month and say whether it is still
        acceptable. Systems without this do not fail loudly, they drift quietly.
      </p>

      <h2 className="h3">Where agents should not go first</h2>
      <p className="body">
        Three categories come up repeatedly and are usually better served by something
        simpler.
      </p>
      <ul className="art-list">
        <li>
          <strong>Work that is already deterministic.</strong> If the rule can be written
          down completely, write it down. A rules engine is cheaper, faster, auditable by
          inspection, and does not need evaluating every quarter.
        </li>
        <li>
          <strong>Work whose data is not reachable.</strong> Data readiness, not model
          quality, is the barrier organisations name most often. An agent pointed at
          inaccessible or untrustworthy data inherits every problem that data has and adds
          confident phrasing to it.
        </li>
        <li>
          <strong>Work where nobody can say what good looks like.</strong> If the team
          cannot agree on the definition of a correct outcome before the build, they will
          not agree on it afterwards, and the system will be judged on vibes.
        </li>
      </ul>
      <Cite>Data readiness: {SOURCES.kpmg}; {SOURCES.deloitte}</Cite>

      <h2 className="h3">Guardrails are architecture, not policy</h2>
      <p className="body">
        Guardrails written into a document are aspirations. Guardrails written into a
        system are constraints. The four that do most of the work in practice:
      </p>
      <ul className="art-list">
        <li>
          <strong>Permission inheritance.</strong> The agent sees exactly what the person
          it acts for is allowed to see, enforced at retrieval rather than by asking the
          model to be discreet.
        </li>
        <li>
          <strong>Evidence on every answer.</strong> A claim the system cannot cite back to
          a source is a claim it should not make.
        </li>
        <li>
          <strong>Explicit action boundaries.</strong> A short, enumerated list of what the
          system may do, with everything outside it requiring a person. The list should be
          readable by a non-engineer.
        </li>
        <li>
          <strong>Standing evaluation.</strong> Not a launch gate. A recurring check, because
          the model, the data and the process all move after go-live.
        </li>
      </ul>

      <h2 className="h3">Where this leaves you</h2>
      <p className="body">
        The organisations getting value from agents are not the ones that adopted earliest
        or bought the largest model. They are the ones that picked a process narrow enough
        to measure, decided in advance what an acceptable result was, built the checks
        before the capability, and gave somebody the job of looking at it every month.
      </p>
      <p className="body">
        That is a less exciting answer than the demonstrations suggest. It is also the one
        that shows up in the accounts.
      </p>
    </>
  ),

  /* ------------------------------------------------------------ article 2 */
  'how-we-evaluate-ai-systems': () => (
    <>
      <p className="body">
        Most AI evaluation produces a number between one and five. Almost nobody can say
        what they would do differently at 3.4 rather than 3.8. We grade pass or fail
        instead, because the purpose of an evaluation is not to describe a system. It is
        to decide something.
      </p>

      <h2 className="h3">The problem with a score out of five</h2>
      <p className="body">
        A score has three failure modes that a threshold does not. It averages away the
        cases that matter, so a system that is excellent on the common path and dangerous
        on the rare one lands comfortably in the middle. It has no decision attached, so
        the conversation after the result is about whether the number is good rather than
        whether to ship. And it moves, so a later run scoring 3.6 instead of 3.7 invites
        an argument about noise rather than a judgement about readiness.
      </p>
      <Pull>
        A grade you cannot act on is a description, not an evaluation.
      </Pull>
      <p className="body">
        A binary outcome forces the useful argument to happen before the build rather than
        after it. To say pass or fail you must first say what passing means, and that
        conversation is where most of the value is. Teams that cannot agree a threshold in
        advance almost never agree on the result afterwards.
      </p>

      <h2 className="h3">Evidence, test, measure, decide</h2>
      <p className="body">
        Our evaluations run as a pipeline, and a system has to clear every stage. Nothing
        is averaged across stages, because a failure in one is not compensated by strength
        in another.
      </p>
      <EvaluationGateDiagram />

      <h3 className="h4">Evidence</h3>
      <p className="body">
        Real tasks and real data, drawn from the process the system will actually run.
        Synthetic test sets flatter systems, because the person who wrote the test and the
        person who wrote the prompt share the same assumptions about what a question looks
        like. We build the set from work that has already happened, including the cases
        that went wrong, and we hold some of it back so it cannot be optimised against.
      </p>

      <h3 className="h4">Test</h3>
      <p className="body">
        Execution against that set under production conditions: the same retrieval, the
        same permissions, the same latency and cost budget. An evaluation run with wider
        access or a longer timeout than production is measuring a system nobody will
        operate.
      </p>

      <h3 className="h4">Measure</h3>
      <p className="body">
        We record five things, and we report them separately rather than combining them
        into an index.
      </p>
      <ul className="art-list">
        <li>
          <strong>Task success.</strong> Did it produce the right outcome, judged against
          the definition agreed before the run.
        </li>
        <li>
          <strong>Grounding.</strong> Can every material claim be traced to a source the
          system actually retrieved.
        </li>
        <li>
          <strong>Permission adherence.</strong> Did it ever surface something the
          requesting user was not entitled to see. This one is scored as any failure is a
          failure.
        </li>
        <li>
          <strong>Failure shape.</strong> Not how often it failed, but how. A system that
          declines when uncertain is operationally different from one that guesses
          confidently at the same rate.
        </li>
        <li>
          <strong>Cost and latency.</strong> Measured at the same time, because a system
          that passes on quality and fails on economics has still failed.
        </li>
      </ul>

      <h3 className="h4">Decide</h3>
      <p className="body">
        Pass or fail against the thresholds set before the run, with the failures
        enumerated. A pass with known limitations is recorded as a pass with known
        limitations, and those limitations go into the operating documentation rather than
        into a footnote nobody reads.
      </p>

      <h2 className="h3">Failure analysis beats aggregate accuracy</h2>
      <p className="body">
        The most useful output of an evaluation is not the headline rate. It is the list of
        what went wrong, grouped by cause. Twenty failures with one root cause is a
        fixable afternoon. Twenty failures with twenty causes is a system that is not ready,
        even if both produce the same accuracy figure.
      </p>
      <p className="body">
        This is also where a score out of five does the most damage: it makes those two
        situations look identical.
      </p>

      <h2 className="h3">On using a model to judge a model</h2>
      <p className="body">
        Using an LLM as a judge is practical and we use it, with two conditions. It is
        calibrated against human labels on a sample before it is trusted, and that
        calibration is rechecked, because a judge drifts exactly as the system it is
        judging does. An uncalibrated judge does not measure quality. It measures
        agreement between two models that share a great deal of training.
      </p>
      <p className="body">
        Where a judgement is contested, expensive or regulated, a person makes it.
      </p>

      <h2 className="h3">Evaluation is a standing check, not a launch gate</h2>
      <p className="body">
        The most common failure we see is an evaluation performed once, before go-live,
        and never again. Everything it depended on then moves: the model is updated
        underneath you, the data changes shape, the process is altered by the people doing
        it, and the questions users ask drift as they learn what the system is good at.
      </p>
      <p className="body">
        So the evaluation set is a maintained asset, re-run on a schedule and after any
        material change, with the results kept where somebody is accountable for reading
        them. That is the difference between a system that was working and a system that
        is working.
      </p>

      <h2 className="h3">Why we publish this</h2>
      <p className="body">
        Because it is a reasonable thing to be asked for, and because a supplier who cannot
        describe how they would know their own system had stopped working is telling you
        something. If you are commissioning AI work from anyone, this is a fair question to
        put to them before the build rather than after it.
      </p>
    </>
  ),
};

/**
 * Sources for a piece, keyed by slug.
 *
 * `href` IS OPTIONAL AND MOSTLY ABSENT, on purpose. content/sources.ts holds
 * publisher, title, date and sample size, which is enough for a reader to find a
 * study. It does not hold verified URLs, and a link that looks right and resolves
 * to the wrong page is worse than a citation line somebody can search for.
 */
export const INSIGHT_SOURCES: Record<
  string,
  { label: string; href?: string }[]
> = {
  'where-ai-agents-should-work': [
    { label: `Adoption and attributable value: ${SOURCES.mckinsey}` },
    { label: `Proof-of-concept to production conversion: ${SOURCES.hfs}` },
    { label: `Data readiness as the named barrier: ${SOURCES.kpmg}` },
    { label: `Data quality as the top obstacle: ${SOURCES.deloitte}` },
  ],
  'how-we-evaluate-ai-systems': [],
};
