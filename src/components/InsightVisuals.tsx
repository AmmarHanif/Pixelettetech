/**
 * Bespoke diagrams for the Insights page and its two articles.
 *
 * DRAWN, NOT PHOTOGRAPHED, and drawn in the site's own language: one brand
 * colour, the existing line and ink tokens, square corners softened to the same
 * radius the cards use. The brief rules out stock photography, AI-generated
 * people and glowing brains, and the positive version of that instruction is
 * more useful than the prohibition: these are architectural diagrams of an idea,
 * of the kind an engineer would draw on a whiteboard to explain a decision.
 *
 * INLINE SVG RATHER THAN IMAGE FILES. They carry text that must scale with the
 * page, inherit the palette through CSS custom properties so light and dark
 * treatment stay consistent, cost no extra request, and can be read by a screen
 * reader. A PNG of a diagram is an accessibility problem with a caption bolted
 * on afterwards.
 *
 * EACH ONE CARRIES A REAL TEXT ALTERNATIVE. `role="img"` with an `aria-label`
 * describing the relationships, not the shapes: a reader who cannot see this
 * needs "an agent that plans, reasons, acts and delivers", not "four rectangles
 * around a square".
 */

/* ------------------------------------------------------------------ agent */

const AGENT_NODES = [
  { label: 'Plan', x: 205, y: 30 },
  { label: 'Reason', x: 400, y: 164 },
  { label: 'Take action', x: 205, y: 300 },
  { label: 'Deliver value', x: 10, y: 164 },
];

/**
 * The agent at the centre of four capabilities.
 *
 * RADIAL BECAUSE THE RELATIONSHIP IS RADIAL. The four capabilities are not a
 * sequence, they are things one system does, and drawing them as a pipeline
 * would assert an order the article explicitly argues against.
 */
export function AgentScopeDiagram({ note }: { note?: string }) {
  return (
    <figure className="viz">
      <svg
        aria-label="An AI agent at the centre, connected to four capabilities: plan, reason, take action, and deliver value."
        className="viz__svg"
        role="img"
        viewBox="0 0 560 382"
      >
        {/* connectors first, so the nodes sit over them */}
        <g className="viz__line">
          <line x1="280" y1="82" x2="280" y2="155" />
          <line x1="280" y1="225" x2="280" y2="300" />
          <line x1="160" y1="190" x2="230" y2="190" />
          <line x1="330" y1="190" x2="400" y2="190" />
        </g>

        {/* the centre: the agent itself, the one filled shape in the diagram */}
        <rect className="viz__hub" x="230" y="155" width="100" height="70" rx="10" />
        <text className="viz__hub-text" x="280" y="195">
          Agent
        </text>

        {AGENT_NODES.map(n => (
          <g key={n.label}>
            <rect className="viz__node" x={n.x} y={n.y} width="150" height="52" rx="8" />
            <text className="viz__node-text" x={n.x + 75} y={n.y + 31}>
              {n.label}
            </text>
          </g>
        ))}
      </svg>
      {note ? <figcaption className="viz__note">{note}</figcaption> : null}
    </figure>
  );
}

/* ------------------------------------------------------------ evaluation */

const GATES = [
  { label: 'Evidence', caption: 'Real tasks, real data' },
  { label: 'Test', caption: 'Measure performance' },
  { label: 'Measure', caption: 'Analyse results' },
  { label: 'Decide', caption: 'Pass or fail for production' },
];

const GATE_W = 148;
const GATE_GAP = 36;

/**
 * The same four gates, standing up and narrowing.
 *
 * WHY A SECOND ORIENTATION EXISTS. The horizontal version is 108 units tall. Set
 * beside a 480px column of copy in the feature split it rendered as an 83px
 * strip: technically a diagram, visually a rule. The feature needed something
 * with height.
 *
 * AND IT STOPPED THE PAGE REPEATING ITSELF. The second feature and the
 * methodology section both show this pipeline, and in one orientation they were
 * the same picture twice on one page, which reads as a template rather than as
 * two deliberate sections.
 *
 * THE NARROWING IS THE ARGUMENT, not decoration. Each gate is drawn shorter than
 * the one above it because that is what the article says happens: work is
 * filtered out at every stage, and what reaches `Decide` is what survived. A
 * constant-width stack would have said the opposite.
 */
export function EvaluationGateStack() {
  const W = 420;
  const widths = [330, 294, 258, 222];
  const top = 14;
  const boxH = 62;
  const gap = 42;
  return (
    <figure className="viz">
      <svg
        aria-label="Four evaluation gates in sequence, each narrower than the last: evidence, then test, then measure, then decide. Work is filtered out at every stage."
        className="viz__svg"
        role="img"
        viewBox={`0 0 ${W} ${top * 2 + GATES.length * boxH + (GATES.length - 1) * gap}`}
      >
        {GATES.map((g, i) => {
          const w = widths[i]!;
          const x = (W - w) / 2;
          const y = top + i * (boxH + gap);
          return (
            <g key={g.label}>
              <rect className="viz__node" x={x} y={y} width={w} height={boxH} rx="8" />
              <text className="viz__node-text" x={W / 2} y={y + boxH / 2}>
                {g.label}
              </text>
              {i < GATES.length - 1 ? (
                <g className="viz__line">
                  <line x1={W / 2} y1={y + boxH + 6} x2={W / 2} y2={y + boxH + gap - 8} />
                  <polyline
                    className="viz__chev"
                    points={`${W / 2 - 8},${y + boxH + gap - 16} ${W / 2},${y + boxH + gap - 8} ${W / 2 + 8},${y + boxH + gap - 16}`}
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/**
 * Information passing through successive validation gates, laid out horizontally.
 *
 * Used in the methodology section and inside the article, where the surrounding
 * measure is wide and a horizontal process reads as a sequence of steps.
 */
export function EvaluationGateDiagram({ captions = false }: { captions?: boolean }) {
  const height = captions ? 150 : 108;
  return (
    <figure className="viz">
      <svg
        aria-label="A four-stage evaluation pipeline: evidence, then test, then measure, then decide. Each stage is a gate the work must pass before the next."
        className="viz__svg"
        role="img"
        viewBox={`0 0 ${GATES.length * GATE_W + (GATES.length - 1) * GATE_GAP} ${height}`}
      >
        {GATES.map((g, i) => {
          const x = i * (GATE_W + GATE_GAP);
          return (
            <g key={g.label}>
              <rect className="viz__node" x={x} y="28" width={GATE_W} height="52" rx="8" />
              <text className="viz__node-text" x={x + GATE_W / 2} y="59">
                {g.label}
              </text>
              {captions ? (
                <text className="viz__caption" x={x + GATE_W / 2} y="108">
                  {g.caption}
                </text>
              ) : null}
              {/* the gate between this stage and the next */}
              {i < GATES.length - 1 ? (
                <g className="viz__line">
                  <line x1={x + GATE_W + 6} y1="54" x2={x + GATE_W + GATE_GAP - 6} y2="54" />
                  <polyline
                    className="viz__chev"
                    points={`${x + GATE_W + GATE_GAP - 14},46 ${x + GATE_W + GATE_GAP - 6},54 ${x + GATE_W + GATE_GAP - 14},62`}
                  />
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/* ------------------------------------------------------- thematic marks --
   Four restrained marks for the "what we're thinking about" cards. Abstract
   rather than iconographic: a spanner and a padlock would be the generic
   treatment the brief rules out, and these read as diagrams of the idea. */

export function ThemeMark({ kind }: { kind: 'engineering' | 'ai' | 'security' | 'emerging' }) {
  return (
    <svg aria-hidden className="mark" viewBox="0 0 48 48">
      {kind === 'engineering' ? (
        /* load-bearing structure: layers resting on supports */
        <g className="mark__g">
          <line x1="6" y1="14" x2="42" y2="14" />
          <line x1="6" y1="34" x2="42" y2="34" />
          <line x1="14" y1="14" x2="14" y2="34" />
          <line x1="24" y1="14" x2="24" y2="34" />
          <line x1="34" y1="14" x2="34" y2="34" />
        </g>
      ) : null}
      {kind === 'ai' ? (
        /* a decision point: one input, two possible paths, only one taken */
        <g className="mark__g">
          <line x1="6" y1="24" x2="22" y2="24" />
          <line x1="22" y1="24" x2="38" y2="12" />
          <line x1="22" y1="24" x2="38" y2="36" className="mark__faint" />
          <circle cx="22" cy="24" r="3.5" className="mark__dot" />
        </g>
      ) : null}
      {kind === 'security' ? (
        /* a boundary with one controlled crossing */
        <g className="mark__g">
          <line x1="24" y1="6" x2="24" y2="42" />
          <line x1="8" y1="24" x2="20" y2="24" />
          <line x1="28" y1="24" x2="40" y2="24" className="mark__faint" />
          <rect x="20" y="19" width="8" height="10" rx="2" className="mark__dot" />
        </g>
      ) : null}
      {kind === 'emerging' ? (
        /* something resolving: dashed becoming solid */
        <g className="mark__g">
          <line x1="6" y1="34" x2="18" y2="34" className="mark__faint" />
          <line x1="18" y1="34" x2="30" y2="22" />
          <line x1="30" y1="22" x2="42" y2="14" className="mark__faint" />
          <circle cx="30" cy="22" r="3.5" className="mark__dot" />
        </g>
      ) : null}
    </svg>
  );
}
