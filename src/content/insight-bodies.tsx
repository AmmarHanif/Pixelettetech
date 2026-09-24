import type { ReactNode } from 'react';

import { DecisionFlow, TwoOutcomes } from '@/components/AgentArticleVisuals';
import { EvaluationGateDiagram } from '@/components/InsightVisuals';

/**
 * Article bodies, keyed by slug.
 *
 * TWO PUBLISHED PIECES. The route resolves an article only when it is
 * `status: 'published'` AND has a body here, so a slug listed in one place and
 * missing from the other returns 404 rather than an empty page.
 *
 * THE AGENTS PIECE WAS REWRITTEN 2026-09-24 to the founder's revised copy, and
 * the change is not only editorial. The earlier version opened by asserting that
 * almost every organisation now has an AI agent, which the cited survey does not
 * support: it reports AI USE, not agent deployment. The revision says what the
 * survey says and no more.
 *
 * CITATIONS ARE NOW LINKS TO PRIMARY SOURCES, which is a change from the note
 * that used to sit here. This file previously attached no URLs, because
 * content/sources.ts holds publisher, title and date but no verified links, and
 * a plausible link to the wrong page is worse than an attribution a reader can
 * search for. The founder supplied three checked URLs with this copy, so the
 * claims now carry them inline and again in a short sources list.
 *
 * THE TWO SETTINGS ARE ILLUSTRATIVE AND NEITHER IS A CLIENT. The customer
 * enquiry is a scenario; the game companion is Ubisoft's published experiment,
 * described as theirs and as an experiment rather than a shipped feature.
 * Nothing in either is a Pixelette result.
 */

/** A pulled-out line. Used sparingly: it loses force if every section has one. */
function Pull({ children }: { children: ReactNode }) {
  return <p className="art-pull">{children}</p>;
}

/** An outbound citation. Always new-tab, always rel-protected. */
function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  );
}

const MCKINSEY =
  'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai';
const ANTHROPIC = 'https://www.anthropic.com/engineering/building-effective-agents';
const UBISOFT =
  'https://news.ubisoft.com/en-us/article/3mWlITIuWuu0MoVuR6o8ps/ubisoft-reveals-teammates-an-ai-experiment-to-change-the-game';

export const INSIGHT_BODIES: Record<string, () => ReactNode> = {
  /* ------------------------------------------------------------ article 1 */
  'where-ai-agents-should-work': () => (
    <>
      <p className="body">
        AI is in use across many organisations. That does not mean every organisation has
        an AI agent, or that every deployment is improving the outcome it was meant to
        address. In{' '}
        <Ext href={MCKINSEY}>McKinsey&rsquo;s 2026 global survey</Ext>, nearly nine in ten
        respondents reported regular AI use in at least one business function. Yet 37 per
        cent attributed a positive impact on operating profit to AI, and 6 per cent met the
        survey&rsquo;s definition of an AI high performer.
      </p>
      <p className="body">
        Those figures do not tell us that the remaining organisations have failed. Benefits
        may take time to appear and can be difficult to measure. They do, however, show why
        adoption alone is a poor answer to the question that matters: what is changing for
        the people using the product or doing the work?
      </p>
      <p className="body">
        Before asking whether we can build an agent, we should ask what needs to improve,
        what outcome we want and what is preventing that outcome today.
      </p>

      <h2 className="h3">Start with the problem</h2>
      <p className="body">
        Consider a company that receives customer enquiries through its website and a
        shared inbox. Before responding, an employee may need to identify the customer,
        find previous correspondence, check an order record, work out who owns the request
        and gather the information needed for a useful reply.
      </p>
      <p className="body">
        The problem is not that the company lacks an AI agent. The problem is that
        enquiries take too long to reach the right person with the right context. Some are
        passed between teams; others require the same information to be entered twice.
      </p>
      <p className="body">
        A sensible first step is to measure what happens now. How long does it take to
        provide a useful first response? How many handoffs are involved? How often must
        someone correct or repeat the work? The company can then define the improvement it
        wants, such as faster responses without an increase in incorrect answers or
        avoidable handoffs.
      </p>
      <p className="body">
        That gives the project an outcome to work towards and a baseline against which to
        judge it.
      </p>

      <TwoOutcomes />

      <h2 className="h3">Map the work before choosing the technology</h2>
      <p className="body">
        Following several real enquiries from arrival to resolution may reveal different
        kinds of work hidden inside what first looked like one process.
      </p>
      <p className="body">
        A fixed rule could route billing enquiries to the accounts team. A software
        integration could remove the need to copy customer information between systems.
        Neither step necessarily needs an AI agent.
      </p>
      <p className="body">
        Other steps require more interpretation. A customer might describe a delivery
        problem without an order number, or combine a technical question with a request to
        change their account. A system may need to gather information from approved
        sources, recognise what is missing and propose a suitable next step.
      </p>
      <p className="body">
        That is where an agent becomes worth considering. It has a defined role in a
        workflow, rather than being added simply because it can be built.{' '}
        <Ext href={ANTHROPIC}>Anthropic&rsquo;s guidance on building effective agents</Ext>{' '}
        distinguishes predetermined workflows from agents that dynamically choose their
        next steps, and advises teams to use the simplest approach that can do the job.
      </p>

      <DecisionFlow />

      <h2 className="h3">The outcome does not have to be productivity</h2>
      <p className="body">
        The same reasoning applies outside an office. A game studio might want a companion
        character to respond to a player&rsquo;s choices and surroundings, rather than
        repeat a fixed set of lines. Its desired outcome is a more engaging player
        experience, not a reduction in administrative work.
      </p>
      <p className="body">
        Ubisoft has explored this in <Ext href={UBISOFT}>Teammates</Ext>, a playable
        experiment featuring an AI companion and other characters that respond to player
        voice commands and events in the game. Ubisoft says its writers define the
        characters, their motivations and the boundaries of the game world, while the AI
        allows responses within those boundaries. It is an experiment, rather than evidence
        that the approach has become a standard feature of released games.
      </p>
      <p className="body">
        The design questions are specific to the experience. What should a character
        remember? What can it say or do without breaking the story? How quickly must it
        respond? Do players enjoy interacting with it more than they would with scripted
        alternatives?
      </p>
      <p className="body">
        In either setting, an agent earns its place by improving an outcome that matters to
        its users. The measures differ, but the need to define and test them does not.
      </p>

      <h2 className="h3">Give the agent a job and a boundary</h2>
      <p className="body">
        For the customer enquiry example, an initial agent might read an incoming request,
        retrieve relevant information the employee is authorised to see, identify missing
        details and prepare a suggested response or routing decision. An employee would
        review the suggestion before anything was sent or changed in the customer&rsquo;s
        account.
      </p>
      <p className="body">
        Suggesting a response carries a different level of risk from issuing a refund,
        changing an address or making a contractual commitment. Each action needs
        appropriate permissions and approval rules.
      </p>
      <p className="body">
        The gaming example also needs boundaries, though for different reasons. A character
        might improvise dialogue while remaining faithful to its role, the game&rsquo;s
        story and the player&rsquo;s experience. More freedom is valuable only if the
        experience still works as intended.
      </p>
      <Pull>
        The appropriate level of autonomy follows from the task, its consequences and the
        evidence gathered through testing. It should not be decided by how autonomous the
        technology can appear in a demonstration.
      </Pull>

      <h2 className="h3">Decide what must be proven before launch</h2>
      <p className="body">
        Evaluation should be planned before selecting a model or building an agent. For the
        enquiry workflow, that means recording the current response time, handoffs and
        correction rate, then agreeing what results a redesigned process must achieve.
      </p>
      <p className="body">
        The proposed system should be tested on routine and difficult cases: missing
        customer details, conflicting records, requests outside its permissions and
        situations where a person must decide. The team should examine response quality,
        the information used, compliance with approval boundaries, time taken and operating
        cost.
      </p>
      <p className="body">
        A game studio would test different things. It could observe whether players
        understand and enjoy the interaction, whether the character remains consistent,
        whether responses arrive quickly enough and whether unexpected dialogue damages the
        experience.
      </p>
      <p className="body">
        If a system meets the requirements agreed for its use, it can be launched with
        monitoring and clear ownership. If it does not, the team changes the design and
        tests again. After launch, real use provides further evidence for improving the
        experience or adjusting the agent&rsquo;s responsibilities.
      </p>
      <p className="body">
        <Ext href={MCKINSEY}>McKinsey&rsquo;s survey</Ext> found that organisations
        reporting the strongest AI outcomes were more likely to redesign workflows and have
        defined processes for measuring impact. That is a useful lesson for business
        deployments, although it does not guarantee that any individual agent will deliver
        a financial return.
      </p>

      <h2 className="h3">The question worth asking first</h2>
      <p className="body">
        An agent may be the right answer for part of a customer enquiry process or for a
        new kind of interaction in a game. Fixed automation, conventional software or
        carefully written scripts may be better for other parts.
      </p>
      <p className="body">
        Start by understanding the problem and defining the outcome. Then choose the
        technology, boundaries and evaluation method that fit. The point is to build
        something people can recognise as better, whether they are customers, employees or
        players.
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
      <Pull>A grade you cannot act on is a description, not an evaluation.</Pull>
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
 * THESE NOW CARRY URLs, which they previously did not. content/sources.ts holds
 * publisher, title and date but no verified links, and this file used to render
 * attribution as plain text on the grounds that a plausible link to the wrong
 * page is worse than a line a reader can search for. The founder supplied three
 * checked URLs with the revised copy, so the reasoning no longer applies to
 * these three: each is linked inline beside the claim it supports and again
 * here.
 */
export const INSIGHT_SOURCES: Record<
  string,
  { label: string; href?: string }[]
> = {
  'where-ai-agents-should-work': [
    {
      label:
        'McKinsey, The state of AI in 2026: on the road to ROI — AI adoption, reported operating-profit impact, workflow redesign and measurement',
      href: MCKINSEY,
    },
    {
      label:
        'Anthropic, Building effective agents — fixed workflows, agents and appropriate complexity',
      href: ANTHROPIC,
    },
    {
      label:
        'Ubisoft, Ubisoft reveals Teammates: an AI experiment to change the game — the playable experiment and its creative boundaries',
      href: UBISOFT,
    },
  ],
  'how-we-evaluate-ai-systems': [],
};
