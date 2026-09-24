/**
 * The release-decision visual for "How we evaluate AI systems".
 *
 * THE SCENARIO IS HYPOTHETICAL AND THE VISUAL HAS TO CARRY THAT ITSELF. A reader
 * who looks at the picture and skips the prose must not come away thinking this
 * is a delivered Pixelette project, so the figure is captioned as an illustration
 * and names no customer, product or result. There are no figures in it at all:
 * an invented percentage would be the fastest way to turn an illustration into a
 * claim.
 *
 * IT IS HTML AND CSS RATHER THAN ONE WIDE SVG. The labels are the content, and
 * real text reflows on a phone, scales with the reader's type size and is read
 * in document order by a screen reader. The other diagram on this subject,
 * EvaluationGateDiagram, is a fixed-width SVG with its text baked in; that shape
 * is right for the short strip it occupies on /insights and wrong for a
 * paragraph-length label.
 *
 * WHY THE LAST BAND IS SEPARATED RATHER THAN APPENDED. The point it makes is
 * that a pass is bounded by the job it was granted for. Drawn as a fourth stage
 * it would read as "and then you may send messages", which is the opposite. So
 * it sits outside the numbered path, introduced as one possible outcome, and the
 * boundary is stated rather than implied.
 */

const STAGES = [
  {
    n: '01',
    kicker: 'The proposed job',
    body: 'Draft answers using authorised customer records, with a person approving the response',
  },
  {
    n: '02',
    kicker: 'The critical test',
    body: 'An enquiry could lead the system to retrieve another customer’s information',
  },
];

/** The three steps inside the release decision, in the order they happen. */
const DECISION = [
  { label: 'Fail for this version', critical: true },
  { label: 'Fix the permission boundary', critical: false },
  { label: 'Retest', critical: false },
];

export function ReleaseDecision() {
  return (
    <figure className="ev">
      <ol className="ev__path">
        {STAGES.map(s => (
          <li className={`ev__stage${s.n === '02' ? ' ev__stage--critical' : ''}`} key={s.n}>
            <span className="ev__n">{s.n}</span>
            <span className="ev__kicker">{s.kicker}</span>
            <span className="ev__body">{s.body}</span>
          </li>
        ))}

        <li className="ev__stage">
          <span className="ev__n">03</span>
          <span className="ev__kicker">The release decision</span>
          <ol className="ev__steps">
            {DECISION.map(d => (
              <li
                className={`ev__step${d.critical ? ' ev__step--critical' : ''}`}
                key={d.label}
              >
                {d.label}
              </li>
            ))}
          </ol>
        </li>
      </ol>

      {/*
        Introduced as its own thing, not numbered, and deliberately outside the
        <ol> above so a screen reader does not announce it as a fourth step.
      */}
      <div className="ev__outcome">
        <p className="ev__outcomeLead">One possible outcome, and its boundary</p>
        <p className="ev__outcomeBody">
          Pass for reviewed drafts{' '}
          <span aria-hidden className="ev__ne">
            &ne;
          </span>
          <span className="visually-hidden-heading">is not</span> approval to send messages
          or issue refunds automatically
        </p>
      </div>

      <figcaption className="ev__caption">
        An illustrative example, not a client project. A pass applies to the job, the
        conditions and the actions it was granted for
      </figcaption>

      {/*
        The labels above are real text and are already read in order, so this
        adds only what the LAYOUT says and the words do not: that stage two tests
        stage one, and that the final band is a possible result rather than the
        next step.
      */}
      <p className="visually-hidden-heading">
        Stages one and two describe the proposed job and the test that matters most for
        it. Stage three is the decision taken when that test fails, and leads back into
        retesting rather than forward to release. The statement that follows is one
        possible outcome of a later version, not a further stage.
      </p>
    </figure>
  );
}
