import type { ReactNode } from 'react';
import Link from 'next/link';

import { DecisionFlow, TwoOutcomes } from '@/components/AgentArticleVisuals';
import { ReleaseDecision } from '@/components/EvaluationArticleVisuals';

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

/*
 * The evaluation piece's references. Each was confirmed to resolve at the exact
 * address below before it was linked.
 *
 * NONE OF THESE IS A PASS MARK, and the article has to keep saying so. NIST's
 * framework is voluntary and structural, the NCSC guidelines cover the secure
 * development lifecycle, and the OWASP list enumerates risks. They inform the
 * criteria for a particular use; none of them certifies a system, and Pixelette
 * holds no certification against any of them.
 *
 * THE OWASP LINK IS THE 2025 EDITION, which is the one supplied with this copy
 * and which resolves. A 2026 edition now exists at
 * genai.owasp.org/resource/owasp-genai-llm-top-10-2026/ and is flagged rather
 * than swapped in, because changing a cited source is the author's call.
 */
const NIST = 'https://www.nist.gov/itl/ai-risk-management-framework';
const NCSC =
  'https://www.ncsc.gov.uk/collection/guidelines-secure-ai-system-development';
const OWASP = 'https://genai.owasp.org/resource/owasp-top-10-for-llm-applications-2025/';
const ANTHROPIC_EVALS =
  'https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents';
const OPENAI_EVALS =
  'https://developers.openai.com/api/docs/guides/evaluation-best-practices';

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
        A client does not commission an AI system simply to receive a promising
        demonstration or a score out of five. They need to know what the system is allowed
        to do, how it behaves on the tasks it will actually encounter and what happens
        when it gets something wrong.
      </p>
      <p className="body">
        That question cannot be answered with one number. An average may be useful for
        comparing versions, but it can conceal a failure that matters far more than
        several successful routine tasks. At some point, the client and delivery team need
        a decision: does this version meet the agreed requirements for the job and level
        of autonomy proposed, or does it need more work?
      </p>
      <p className="body">
        That is what pass or fail means in our approach. The decision is simple to
        understand. The evaluation behind it is detailed.
      </p>

      <h2 className="h3">Define the job before setting the test</h2>
      <p className="body">
        Evaluation begins when we establish what the system is meant to do. We need to
        understand its users, the information it may access, the actions it may take, the
        conditions in which it will operate and the circumstances in which it must stop or
        ask a person.
      </p>
      <p className="body">
        We then agree what success and unacceptable failure mean for that particular use.
        Response quality, speed and cost may matter. So may factual support, permissions,
        reliability and the ability to recognise uncertainty. The criteria should reflect
        the consequences of getting something wrong, not just what is easy to measure.
      </p>
      <p className="body">
        This follows the problem first approach set out on our{' '}
        <Link href="/ai-automation">AI and Automation page</Link>. The task and the
        evaluation method should be understood before choosing a model or deciding how
        much autonomy to give the system.
      </p>

      <h2 className="h3">An illustrative client decision</h2>
      <p className="body">
        Imagine a client asking us to develop an AI assistant for its customer service
        team. It should use authorised order records and approved policies to draft
        answers about deliveries and returns. An employee will review each draft before it
        is sent.
      </p>
      <p className="body">
        Together, we would define the proposed job and its boundaries. A useful answer
        must address the customer&rsquo;s question and rely on the correct records. The
        assistant must ask for clarification when essential details are missing. It must
        not reveal another customer&rsquo;s information, invent a returns policy or issue
        a refund.
      </p>
      <p className="body">
        The test set would include ordinary enquiries alongside incomplete messages,
        conflicting records, unusual requests and attempts to make the assistant act
        outside its permissions. We would look at the answer and the steps used to produce
        it.
      </p>
      <p className="body">
        Suppose the assistant produces strong drafts for most enquiries but, in one test,
        includes details from the wrong customer&rsquo;s order. Its average quality score
        might still look impressive. That version fails the agreed criteria for the
        proposed use because it crossed a critical permission boundary.
      </p>
      <p className="body">
        The next step is to investigate the failure, correct the system and run the
        relevant tests again. A later version might pass for producing drafts that an
        employee reviews. That would not mean it had passed for sending replies or issuing
        refunds without approval. Those are different jobs and require different controls
        and evidence.
      </p>

      <ReleaseDecision />

      <h2 className="h3">What we measure beneath the decision</h2>
      <p className="body">
        A pass or fail decision should be supported by results the client can inspect.
        Depending on the system, we would examine:
      </p>
      <ul className="art-list">
        <li>
          <strong>Task results.</strong> Did it complete the job defined for each test?
        </li>
        <li>
          <strong>Evidence.</strong> Are important claims supported by the information it
          was permitted to retrieve?
        </li>
        <li>
          <strong>Permissions and actions.</strong> Did it respect access limits and
          approval points?
        </li>
        <li>
          <strong>Failure behaviour.</strong> Did it ask for help, decline or stop
          appropriately when information was missing or the request was outside its scope?
        </li>
        <li>
          <strong>Performance.</strong> Were response time, reliability and operating cost
          acceptable for the intended use?
        </li>
      </ul>
      <p className="body">
        We would report these separately. A strong result in one area should not silently
        cancel a serious failure in another. The client should be able to see what passed,
        what failed and why the decision was reached.
      </p>

      <h2 className="h3">How external guidance informs the criteria</h2>
      <p className="body">
        The criteria come from the client&rsquo;s intended use, agreed requirements,
        applicable law and assessed risks. External guidance helps us structure the work;
        it does not provide a universal score that makes every AI system ready for
        release.
      </p>
      <p className="body">
        Depending on the project, relevant references include the{' '}
        <Ext href={NIST}>NIST AI Risk Management Framework</Ext>, the{' '}
        <Ext href={NCSC}>
          UK National Cyber Security Centre&rsquo;s guidelines for secure AI system
          development
        </Ext>{' '}
        and the <Ext href={OWASP}>OWASP Top 10 for LLM applications</Ext>. Data
        protection, sector requirements and the client&rsquo;s own policies may add
        further criteria.
      </p>
      <p className="body">
        This matters because an assistant drafting low risk internal text, an agent acting
        on customer accounts and an AI system supporting a consequential decision should
        not all face an identical release test.
      </p>

      <h2 className="h3">Why a score alone is not the decision</h2>
      <p className="body">
        Scores remain useful. We may use them to compare versions, detect regressions or
        see whether changes improve a particular measure. Some outputs also require
        informed human judgement rather than a mechanical check. Automated assessment can
        help at scale, provided its conclusions are checked against suitable human review.
      </p>
      <p className="body">
        The release decision has a different purpose. It asks whether the system has met
        the agreed requirements for its defined job. A high average cannot authorise an
        action that the system was never approved to take. Nor should several successful
        routine answers excuse a critical failure involving the wrong customer&rsquo;s
        data.
      </p>
      <p className="body">
        A pass means the evidence supports the specified use under the stated conditions.
        It does not mean the system will never make a mistake. A fail identifies what
        needs to change before that use can proceed.
      </p>

      <h2 className="h3">Evaluation continues after launch</h2>
      <p className="body">
        Prelaunch testing is essential, but real usage can reveal cases that the original
        tests missed. Once a system is operating, its owners need a way to review errors,
        user feedback, changes in data and changes to the underlying model or workflow.
      </p>
      <p className="body">
        The test set should evolve as those cases emerge. A material change to the system
        or its permitted actions may require the release decision to be revisited.
        Monitoring and improvement are part of operating the system, consistent with the
        approach described on our{' '}
        <Link href="/ai-automation">AI and Automation page</Link>.
      </p>

      <h2 className="h3">What a client should be able to ask us</h2>
      <p className="body">
        A client should be able to ask what the system was tested against, which failures
        would block release, what a pass permits it to do and who is responsible when it
        needs attention. We should be able to give clear answers backed by the evaluation
        results.
      </p>
      <p className="body">
        That is the value of pass or fail. It turns detailed testing into an
        understandable decision about a specific use, while keeping the evidence and
        limitations visible.
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
        'McKinsey, The state of AI in 2026: on the road to ROI: AI adoption, reported operating-profit impact, workflow redesign and measurement',
      href: MCKINSEY,
    },
    {
      label:
        'Anthropic, Building effective agents: fixed workflows, agents and appropriate complexity',
      href: ANTHROPIC,
    },
    {
      label:
        'Ubisoft, Ubisoft reveals Teammates: an AI experiment to change the game: the playable experiment and its creative boundaries',
      href: UBISOFT,
    },
  ],
  'how-we-evaluate-ai-systems': [
    {
      label:
        'NIST, AI Risk Management Framework: a voluntary framework for building trustworthiness into AI design, development and evaluation',
      href: NIST,
    },
    {
      label:
        'UK National Cyber Security Centre, Guidelines for secure AI system development: secure design, development, deployment, and operation and maintenance',
      href: NCSC,
    },
    {
      label:
        'OWASP, Top 10 for LLM applications (2025): the risk classes to design criteria against, including sensitive information disclosure and excessive agency',
      href: OWASP,
    },
    {
      label:
        'Anthropic, Demystifying evals for AI agents: tasks with defined inputs and success criteria, transcript review and failure analysis',
      href: ANTHROPIC_EVALS,
    },
    {
      label:
        'OpenAI, Evaluation best practices: evaluations designed for the specific task, automated scoring and calibration against human judgement',
      href: OPENAI_EVALS,
    },
  ],
};
