/**
 * "AI is more than the model" — an illustrative production AI architecture.
 *
 * WHAT THIS IS. A generic, textbook reference architecture drawn from first
 * principles: five stages in order, wrapped in a control layer. It is a teaching
 * diagram, not a system diagram. It depicts no product, no client system and no
 * internal system, and it carries that statement twice — once as a badge on the
 * artwork and once in the <figcaption> — so the claim cannot be lost if one of
 * the two is stripped during integration.
 *
 * WHY AN SVG AND NOT MARKUP. `LiveDiagram` renders its diagram as HTML on
 * purpose, and that remains the right call for a set of parallel cards. This one
 * is different: its meaning is carried by relationships — a directed flow, a
 * feedback return, and a layer that runs underneath all five stages. Boxes and a
 * substrate cannot be expressed in a grid without lying about them, so this is
 * genuine vector artwork. The trade is paid back in the accessibility work
 * below: every label is real <text>, and the whole diagram carries a written
 * equivalent in <desc>.
 *
 * TWO LAYOUTS, ONE SOURCE OF CONTENT. A five-stage horizontal flow cannot
 * survive a phone, so there are two geometries — a horizontal spine and a
 * vertical stack — switched by a container query with no JavaScript. Both are
 * rendered from the single `STAGES` array below and share the same `<desc>`
 * string, so the two layouts cannot drift apart: there is one set of words, used
 * twice. Whichever layout is not in use is `display: none`, so it is absent from
 * the accessibility tree rather than announced twice.
 *
 * NO DEPENDENCIES, NO ASSETS, NO NETWORK. One file, inline SVG, inline <style>.
 * The site's CSP allows `style-src 'self' 'unsafe-inline'` (next.config.ts), and
 * React 19 hoists a <style> carrying `href` + `precedence` into <head> and
 * de-duplicates it by `href`. If that hoisting ever changed, the failure mode is
 * benign — the element renders in place and the rules still apply.
 *
 * COLOUR. Every value is a token from globals.css, referenced as a custom
 * property with the literal as a fallback, so a themed section recolours the
 * diagram without a second copy. Note the consequence: inside `.theme-amber` the
 * flow turns crimson. That is correct site behaviour, and this diagram's home
 * page is not themed.
 */

type Callout = { chip: string; note: string };

type Stage = {
  /** Carries the running order in visible text, so order survives without the arrows. */
  n: string;
  name: string;
  /**
   * One line only. Deliberate restraint, and also a hard constraint: SVG text
   * does not wrap. The budget is the box inner width — 142px wide / 256px
   * narrow at 11.5px — so roughly 22 characters. Lengthen these and they will
   * overflow the box silently rather than wrap.
   */
  detail: string;
  /** Only the reasoning stage carries this. See the CALLOUT note in the renderer. */
  callout?: Callout;
};

const STAGES: readonly Stage[] = [
  { n: '01', name: 'Context & data', detail: 'Documents and records' },
  {
    n: '02',
    name: 'AI reasoning',
    detail: 'Prompt, policy, limits',
    callout: { chip: 'Model', note: 'one component' },
  },
  { n: '03', name: 'Tools & systems', detail: 'APIs and functions' },
  { n: '04', name: 'Action', detail: 'Write back or notify' },
  { n: '05', name: 'Verification', detail: 'Checks and evaluation' },
];

/**
 * The governing layer. These are NOT a sixth, seventh, eighth and ninth box.
 * They hang off a rail that runs under the full width of the flow, so they read
 * as the substrate every stage sits on. Their spacing is deliberately NOT
 * aligned to the stage centres, because an aligned tick would assert a
 * one-to-one mapping (security belongs to stage one, and so on) that is false.
 */
const CONTROLS = ['Security', 'Permissions', 'Human oversight', 'Monitoring'] as const;

const TITLE = 'Illustrative reference architecture for a production AI system';

/**
 * The written equivalent of the artwork, and the reason the diagram is not the
 * only carrier of its own meaning. Read as the accessible description of both
 * layouts.
 */
const DESC =
  'An illustrative reference architecture for a production AI system. It is not a depiction of any ' +
  'specific system. Five stages run in order. One, context and data: the documents and records ' +
  'assembled for the task. Two, AI reasoning: a model sits here as one component, alongside the ' +
  'prompt, the policy and the limits placed on it. Three, tools and systems: the APIs and functions ' +
  'the system is allowed to call. Four, action: writing back to a system of record, or notifying a ' +
  'person. Five, verification: checks and evaluation of what was produced. Evaluation and outcomes ' +
  'return to the first stage as a feedback loop. Beneath all five stages runs a control layer that ' +
  'applies throughout rather than at the end: security, permissions, human oversight and monitoring.';

const BADGE = 'ILLUSTRATIVE';
const CONTROL_LABEL = 'CONTROL LAYER';
const LOOP_WIDE = 'Evaluation and outcomes return as context';
const LOOP_NARROW = 'Evaluation returns as context';
const CAPTION = 'Illustrative reference architecture · the control layer applies at every stage.';

/* -------------------------------------------------------------------- geometry */

/** Horizontal layout. Used at container widths of 920px and above. */
const W = {
  vb: { w: 1060, h: 292 },
  frame: { x: 0.5, y: 16.5, w: 1059, h: 259.5 },
  box: { y: 52, w: 174, h: 92 },
  x0: 41,
  pitch: 201,
  /** Vertical centre of a stage box — where the arrows sit. */
  mid: 98,
  railY: 230,
  /** Control tick positions. Chosen to fall BETWEEN stage centres. */
  ticks: [185, 420, 655, 890],
  ctlBaseline: 256,
  right: 1019,
} as const;

/** Vertical layout. The default, and the fallback where @container is unsupported. */
const N = {
  vb: { w: 340, h: 730 },
  frame: { x: 0.5, y: 16.5, w: 339, h: 697.5 },
  box: { x: 26, w: 288, h: 74 },
  y0: 48,
  gap: 20,
  /** Extra vertical room a stage needs when it carries a callout. */
  calloutH: 36,
  cx: 170,
  railY: 588,
  right: 314,
} as const;

/**
 * The purple cap on the top edge of a stage box. Drawn as a stroked arc rather
 * than a clipped rect so it needs no <clipPath> and therefore no extra ids —
 * which matters because this component renders twice in the DOM.
 */
function accentPath(x: number, y: number, w: number, r = 8) {
  return (
    `M ${x + 0.8} ${y + r + 1} A ${r + 0.2} ${r + 0.2} 0 0 1 ${x + r + 1} ${y + 0.8} ` +
    `H ${x + w - r - 1} A ${r + 0.2} ${r + 0.2} 0 0 1 ${x + w - 0.8} ${y + r + 1}`
  );
}

/* ------------------------------------------------------------------- fragments */

/** The "ILLUSTRATIVE" tag, set into the top edge of the frame like a fieldset legend. */
function Badge() {
  return (
    <g aria-hidden="true">
      <rect className="aisys__badge" x={20} y={10} width={112} height={17} rx={8.5} />
      <text className="aisys__eyebrow" x={30} y={22.5}>
        {BADGE}
      </text>
    </g>
  );
}

/**
 * One stage. `inline` puts the number beside the name instead of above it, which
 * is the vertical layout's economy: it removes 24px per box, and five boxes of
 * saving is the difference between a tall diagram and an unreasonable one.
 */
function StageBox({
  stage,
  x,
  y,
  w,
  h,
  inline,
}: {
  stage: Stage;
  x: number;
  y: number;
  w: number;
  h: number;
  inline: boolean;
}) {
  return (
    <g>
      <rect className="aisys__box" x={x} y={y} width={w} height={h} rx={8} />
      <path className="aisys__accent" d={accentPath(x, y, w)} aria-hidden="true" />
      {inline ? (
        <>
          <text className="aisys__n" x={x + 16} y={y + 28}>
            {stage.n}
          </text>
          <text className="aisys__name" x={x + 40} y={y + 28}>
            {stage.name}
          </text>
          <text className="aisys__detail" x={x + 16} y={y + 52}>
            {stage.detail}
          </text>
        </>
      ) : (
        <>
          <text className="aisys__n" x={x + 16} y={y + 26}>
            {stage.n}
          </text>
          <text className="aisys__name" x={x + 16} y={y + 50}>
            {stage.name}
          </text>
          <text className="aisys__detail" x={x + 16} y={y + 74}>
            {stage.detail}
          </text>
        </>
      )}
    </g>
  );
}

/**
 * CALLOUT — the point of the whole section, in one small shape.
 *
 * The model is drawn as a chip hanging BELOW the reasoning stage, tinted rather
 * than filled, smaller than every other element on the canvas and labelled "one
 * component". A reader who takes nothing else from the diagram should take this:
 * the model is a part of one of five stages, not the system. It hangs outside
 * the box rather than sitting inside it so that all five stage boxes stay
 * exactly the same height — a taller stage two would have made the model look
 * like the important one, which is the opposite of the argument.
 *
 * Takes its content as a prop rather than reaching into `STAGES[1]`, so moving
 * the callout to a different stage is a one-line data change.
 */
function ModelCallout({ callout, x, y }: { callout: Callout; x: number; y: number }) {
  return (
    <g>
      <line className="aisys__tick" x1={x + 31} y1={y} x2={x + 31} y2={y + 14} aria-hidden="true" />
      <rect className="aisys__chip" x={x + 16} y={y + 14} width={62} height={22} rx={4} />
      <text className="aisys__chip-label" x={x + 47} y={y + 29} textAnchor="middle">
        {callout.chip}
      </text>
      <text className="aisys__note" x={x + 88} y={y + 29}>
        {callout.note}
      </text>
    </g>
  );
}

/** A flow arrow. Decorative: the running order is carried by the 01-05 numbers. */
function Arrow({ x, y, vertical = false }: { x: number; y: number; vertical?: boolean }) {
  const d = vertical
    ? `M ${x} ${y} V ${y + 10} M ${x - 4} ${y + 8} L ${x} ${y + 13.5} L ${x + 4} ${y + 8}`
    : `M ${x} ${y} H ${x + 10} M ${x + 8} ${y - 4} L ${x + 13.5} ${y} L ${x + 8} ${y + 4}`;
  return <path className="aisys__flow" d={d} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ component */

export function AiSystemDiagram({
  /**
   * Only needed if two instances share a page — the ids below must stay unique.
   * There is deliberately no `useId()`: this is a Server Component and should
   * stay one.
   */
  id = 'ai-system-diagram',
}: {
  id?: string;
}) {
  return (
    <figure className="aisys">
      <style href="pxl-aisys" precedence="default">
        {CSS}
      </style>

      {/* ----------------------------------------------------- horizontal spine */}
      <svg
        className="aisys__svg aisys__wide"
        viewBox={`0 0 ${W.vb.w} ${W.vb.h}`}
        role="img"
        focusable="false"
        aria-labelledby={`${id}-w-title`}
        aria-describedby={`${id}-w-desc`}
      >
        <title id={`${id}-w-title`}>{TITLE}</title>
        <desc id={`${id}-w-desc`}>{DESC}</desc>

        <rect
          className="aisys__frame"
          x={W.frame.x}
          y={W.frame.y}
          width={W.frame.w}
          height={W.frame.h}
          rx={12}
          aria-hidden="true"
        />
        <Badge />

        {STAGES.map((stage, i) => {
          const x = W.x0 + i * W.pitch;
          return (
            <g key={stage.n}>
              <StageBox stage={stage} x={x} y={W.box.y} w={W.box.w} h={W.box.h} inline={false} />
              {i < STAGES.length - 1 ? <Arrow x={x + W.box.w + 7} y={W.mid} /> : null}
              {stage.callout ? (
                <ModelCallout callout={stage.callout} x={x} y={W.box.y + W.box.h} />
              ) : null}
            </g>
          );
        })}

        {/* FEEDBACK LOOP. Not in the founder's five-stage line — see the handover
            note. Delete this one <g> to get the pure linear flow back; nothing
            else depends on it. */}
        <g className="aisys__feedback" aria-hidden="true">
          <path className="aisys__loop" d="M 932 144 V 206 H 25 V 98 H 36" />
          <path className="aisys__loop-head" d="M 32 94 L 37.5 98 L 32 102" />
          <text className="aisys__loop-label" x={490} y={200} textAnchor="middle">
            {LOOP_WIDE}
          </text>
        </g>

        {/* CONTROL LAYER. The rail spans the full inner width under all five
            stages; that span is the argument, so it is load-bearing. */}
        <g>
          <line
            className="aisys__rail"
            x1={W.x0}
            y1={W.railY}
            x2={W.right}
            y2={W.railY}
            aria-hidden="true"
          />
          <text className="aisys__ctl-label" x={W.x0} y={W.ctlBaseline}>
            {CONTROL_LABEL}
          </text>
          {CONTROLS.map((c, i) => (
            <g key={c}>
              <line
                className="aisys__tick"
                x1={W.ticks[i]}
                y1={W.railY + 1}
                x2={W.ticks[i]}
                y2={W.railY + 14}
                aria-hidden="true"
              />
              <text className="aisys__ctl" x={W.ticks[i]} y={W.ctlBaseline}>
                {c}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* ------------------------------------------------------ vertical stack */}
      <svg
        className="aisys__svg aisys__narrow"
        viewBox={`0 0 ${N.vb.w} ${N.vb.h}`}
        role="img"
        focusable="false"
        aria-labelledby={`${id}-n-title`}
        aria-describedby={`${id}-n-desc`}
      >
        <title id={`${id}-n-title`}>{TITLE}</title>
        <desc id={`${id}-n-desc`}>{DESC}</desc>

        <rect
          className="aisys__frame"
          x={N.frame.x}
          y={N.frame.y}
          width={N.frame.w}
          height={N.frame.h}
          rx={12}
          aria-hidden="true"
        />
        <Badge />

        {/* Cursor-style layout: each stage advances `y` by its own height, so the
            taller callout stage needs no special case anywhere else. */}
        {(() => {
          let y = N.y0;
          return STAGES.map((stage, i) => {
            const top = y;
            let next = top + N.box.h;
            const calloutY = stage.callout ? next : null;
            if (calloutY !== null) next += N.calloutH;
            const arrowY = next;
            y = next + N.gap;
            return (
              <g key={stage.n}>
                <StageBox stage={stage} x={N.box.x} y={top} w={N.box.w} h={N.box.h} inline />
                {stage.callout && calloutY !== null ? (
                  <ModelCallout callout={stage.callout} x={N.box.x + 18} y={calloutY} />
                ) : null}
                {i < STAGES.length - 1 ? <Arrow x={N.cx} y={arrowY + 4} vertical /> : null}
              </g>
            );
          });
        })()}

        {/* Same feedback loop, routed up the left margin. Same deletable unit. */}
        <g className="aisys__feedback" aria-hidden="true">
          <path className="aisys__loop" d="M 170 534 V 554 H 13 V 85 H 24" />
          <path className="aisys__loop-head" d="M 20 81 L 25.5 85 L 20 89" />
          <text className="aisys__loop-label" x={30} y={572}>
            {LOOP_NARROW}
          </text>
        </g>

        <g>
          <line
            className="aisys__rail"
            x1={N.box.x}
            y1={N.railY}
            x2={N.right}
            y2={N.railY}
            aria-hidden="true"
          />
          <text className="aisys__ctl-label" x={N.box.x} y={N.railY + 22}>
            {CONTROL_LABEL}
          </text>
          {/* Four across will not fit at 340 units, so the rail turns vertical
              and the controls hang off its side. Same relationship, rotated. */}
          <line
            className="aisys__tick"
            x1={30}
            y1={N.railY + 32}
            x2={30}
            y2={N.railY + 106}
            aria-hidden="true"
          />
          {CONTROLS.map((c, i) => (
            <text className="aisys__ctl" key={c} x={42} y={N.railY + 44 + i * 20}>
              {c}
            </text>
          ))}
        </g>
      </svg>

      <figcaption className="aisys__cap">{CAPTION}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------------ css */

/**
 * Container queries, not viewport media queries, and that is load-bearing. This
 * section may be dropped into a `.split` column, where the viewport is wide but
 * the column is not; a viewport query would keep the five-across spine and crush
 * it. Where `@container` is unsupported the rules never match and the vertical
 * stack is what renders — the safe direction to fail.
 *
 * Nothing animates. See the handover note: an entrance animation on a diagram
 * below the fold fires unseen, and a loop pulls the eye off the labels. There is
 * accordingly nothing for `prefers-reduced-motion` to disable, and globals.css
 * already carries a global clamp for everything on the site that does move.
 */
const CSS = `
.aisys { container-type: inline-size; margin: 0; }

.aisys__svg { display: block; width: 100%; height: auto; margin-inline: auto; }
.aisys__svg text { font-family: var(--sans, sans-serif); }

.aisys__wide { display: none; }
.aisys__narrow { max-width: 420px; }

@container (min-width: 920px) {
  .aisys__wide { display: block; max-width: 1120px; }
  .aisys__narrow { display: none; }
}

/* Surfaces. 1px lines stay 1px at every scale rather than thinning out. */
.aisys__frame  { fill: #f6f8fa; stroke: var(--line-2, #dfe6ee); stroke-width: 1; vector-effect: non-scaling-stroke; }
.aisys__badge  { fill: var(--paper, #ffffff); stroke: var(--line-2, #dfe6ee); stroke-width: 1; vector-effect: non-scaling-stroke; }
.aisys__box    { fill: var(--paper, #ffffff); stroke: var(--line-4, #c3d1de); stroke-width: 1; vector-effect: non-scaling-stroke; }
.aisys__chip   { fill: var(--brand-tint, #eadcf2); }

/* The flow. Brand colour is spent here and nowhere else of any weight. */
.aisys__accent { fill: none; stroke: var(--brand, #661a8f); stroke-width: 2.5; stroke-linecap: butt; vector-effect: non-scaling-stroke; }
.aisys__flow   { fill: none; stroke: var(--brand, #661a8f); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }

/* Quiet structure: the loop and the control rail must not compete with the flow. */
.aisys__loop      { fill: none; stroke: var(--line-4, #c3d1de); stroke-width: 1.2; stroke-dasharray: 4 4; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.aisys__loop-head { fill: none; stroke: var(--line-4, #c3d1de); stroke-width: 1.2; stroke-linecap: round; stroke-linejoin: round; vector-effect: non-scaling-stroke; }
.aisys__rail      { stroke: var(--line-2, #dfe6ee); stroke-width: 1; vector-effect: non-scaling-stroke; }
.aisys__tick      { stroke: var(--line-4, #c3d1de); stroke-width: 1; vector-effect: non-scaling-stroke; }

/* Type. Sizes are user units; see the handover for the rendered range. */
.aisys__eyebrow    { font-family: var(--mono, monospace); font-size: 10.5px; letter-spacing: 0.12em; fill: var(--muted, #5d6b7d); }
.aisys__n          { font-family: var(--mono, monospace); font-size: 10.5px; letter-spacing: 0.12em; fill: var(--brand, #661a8f); }
.aisys__name       { font-size: 15.5px; font-weight: 600; fill: var(--ink, #0a0a0a); }
.aisys__detail     { font-size: 11.5px; fill: var(--muted, #5d6b7d); }
.aisys__chip-label { font-size: 11.5px; font-weight: 500; fill: var(--brand, #661a8f); }
.aisys__note       { font-size: 11.5px; fill: var(--muted, #5d6b7d); }
.aisys__loop-label { font-family: var(--mono, monospace); font-size: 10.5px; letter-spacing: 0.06em; fill: var(--muted-2, #62707f); }
.aisys__ctl-label  { font-family: var(--mono, monospace); font-size: 10.5px; letter-spacing: 0.14em; fill: var(--muted, #5d6b7d); }
.aisys__ctl        { font-size: 12px; fill: var(--muted, #5d6b7d); }

.aisys__cap { font-family: var(--mono, monospace); font-size: 11.5px; line-height: 1.5; letter-spacing: 0.02em; color: var(--muted-2, #62707f); margin-top: 16px; }
`;
