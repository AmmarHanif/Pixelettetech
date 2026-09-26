/**
 * Phase 1 of the experience layer: the homepage's dimensional primitives.
 *
 * NO JAVASCRIPT, DELIBERATELY, AND IT IS NOT A SHORTCUT. Every state here is
 * carried by a radio group or by :hover / :focus-within, which buys four of the
 * brief's own requirements outright rather than by re-implementing them:
 * keyboard access is the browser's native radio behaviour (arrow keys, roving
 * focus, the focus ring this site already styles), the page works with
 * JavaScript disabled, touch works because a label is a tap target, and nothing
 * ships to the client. A tab component in React would have cost a client
 * bundle, a focus trap and an aria-activedescendant implementation to reach the
 * same place, and would have been worse at three of them.
 *
 * DEPTH IS BUILT FROM SIBLING PLANES, NEVER FROM NESTED Z-OFFSETS. A child
 * pushed along its parent's local Z sits behind that parent's own painted
 * surface, and the DOM reports it present, sized and visible the whole time -
 * the compositor simply never draws it. So the scene below is a flat list of
 * siblings inside one preserve-3d context, each with its own translateZ, and
 * no plane is ever a child of another.
 *
 * THE SYSTEM IS ONE SYSTEM IN THREE STATES, not three pictures. The base plane
 * never leaves: selecting AI adds signals travelling through the modules that
 * are already there, and selecting Blockchain adds a verification layer over
 * part of what is already running. That progression is the argument the hero's
 * three lines make, made visually instead of restated in a sentence.
 */

/* ───────────────────────────────────────────── the hero's living system ── */

/** One module on the base plane. Sized and placed as a rough architecture. */
type Module = { x: number; y: number; w: number; h: number; tone?: 'edge' };

const MODULES: Module[] = [
  { x: 4, y: 6, w: 30, h: 15, tone: 'edge' },
  { x: 38, y: 6, w: 22, h: 15 },
  { x: 64, y: 6, w: 32, h: 15 },
  { x: 4, y: 26, w: 46, h: 17 },
  { x: 54, y: 26, w: 42, h: 17 },
  { x: 4, y: 48, w: 26, h: 14 },
  { x: 34, y: 48, w: 26, h: 14 },
  { x: 64, y: 48, w: 32, h: 14, tone: 'edge' },
  { x: 4, y: 67, w: 92, h: 13 },
];

/** Signal paths, as percentages across the plane. Drawn on the middle plane. */
const SIGNALS = [
  { x1: 19, y1: 14, x2: 27, y2: 35 },
  { x1: 27, y1: 35, x2: 75, y2: 35 },
  { x1: 75, y1: 35, x2: 80, y2: 14 },
  { x1: 27, y1: 35, x2: 17, y2: 55 },
  { x1: 75, y1: 35, x2: 80, y2: 55 },
  { x1: 17, y1: 55, x2: 50, y2: 73 },
  { x1: 80, y1: 55, x2: 50, y2: 73 },
];

const STATES = [
  { id: 'software', label: 'Software' },
  { id: 'ai', label: 'AI' },
  { id: 'blockchain', label: 'Blockchain' },
];

export function LivingSystem() {
  return (
    <div className="ls">
      {/*
        A radio group, not a button row. The three states are mutually
        exclusive and one is always chosen, which is exactly what a radio group
        means - and it arrives with arrow-key navigation already working.
      */}
      <fieldset className="ls__controls">
        <legend className="visually-hidden-heading">
          Show the system as software, with AI, or with blockchain verification
        </legend>
        {STATES.map((s, i) => (
          <span className="ls__control" key={s.id}>
            <input
              className="ls__radio"
              defaultChecked={i === 0}
              id={`ls-${s.id}`}
              name="ls-state"
              type="radio"
            />
            <label className="ls__label" htmlFor={`ls-${s.id}`}>
              {s.label}
            </label>
          </span>
        ))}
      </fieldset>

      {/*
        Decorative: every word a reader needs is in the controls above and the
        description below, so the scene itself is hidden from assistive
        technology rather than narrated shape by shape.
      */}
      <div className="ls__stage" aria-hidden>
        <div className="ls__scene">
          {/* base plane - the software. Present in all three states. */}
          <div className="ls__plane ls__plane--base">
            {MODULES.map(m => (
              <span
                className={`ls__module${m.tone === 'edge' ? ' ls__module--edge' : ''}`}
                key={`${m.x}-${m.y}`}
                style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }}
              />
            ))}
          </div>

          {/* signal plane - AI moving through the modules already built. */}
          <div className="ls__plane ls__plane--signal">
            <svg className="ls__signals" preserveAspectRatio="none" viewBox="0 0 100 100">
              {/*
                The travelling signal is a dash animated along the stroke, not a
                circle moved along an offset-path. Same read, and it survives on
                anything that can draw an SVG line: no offset-path support, no
                extra node per signal, and one property to freeze under
                reduced motion.
              */}
              {/*
                Two strokes per signal, and the faint one is the load-bearing
                half. A travelling dash alone means the connections only exist
                while the dash is passing over them, so most of the network is
                invisible at any instant and the state reads as a few stray
                marks. The wire states that the route exists; the dash states
                that something is moving along it. Under reduced motion the
                dash stops and the wire is what remains.
              */}
              {SIGNALS.map(s => (
                <line
                  className="ls__wire"
                  key={`w-${s.x1}-${s.y1}-${s.x2}-${s.y2}`}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                />
              ))}
              {SIGNALS.map((s, i) => (
                <line
                  className="ls__path"
                  key={`${s.x1}-${s.y1}-${s.x2}-${s.y2}`}
                  style={{ animationDelay: `${i * 0.38}s` }}
                  x1={s.x1}
                  y1={s.y1}
                  x2={s.x2}
                  y2={s.y2}
                />
              ))}
            </svg>
          </div>

          {/* trust plane - verification over PART of the system, not all of it. */}
          <div className="ls__plane ls__plane--trust">
            <span className="ls__trust" />
            <svg className="ls__seal" viewBox="0 0 24 24">
              <circle className="ls__sealRing" cx="12" cy="12" r="9" />
              <path className="ls__sealTick" d="M7.8 12.2 l2.8 2.8 l5.6 -6" />
            </svg>
          </div>
        </div>
      </div>

      <p className="visually-hidden-heading">
        A layered diagram of one system in three states. The base layer is the software:
        modules, services and data assembled together. Selecting AI adds signals travelling
        between those same modules, so the system becomes active rather than being replaced.
        Selecting blockchain adds a verification layer over part of the system, not all of
        it.
      </p>
    </div>
  );
}

/* ──────────────────────────────────────── the four routes, as sequences ── */

/**
 * The four service routes' internal sequence, and the behaviour each one gets.
 *
 * THE BEHAVIOURS ARE NOT DECORATION AND ARE NOT INTERCHANGEABLE. Each is the
 * shape of the work the route describes, which is why the four cards no longer
 * animate identically: Build stacks because a platform is assembled in layers,
 * Automate flows because a workflow carries something from one end to the
 * other, Decentralise spreads because verification is distributed rather than
 * central, and Run cycles because operating a product returns to its own start.
 * A reader who never reads the card copy still learns the difference.
 */
const SEQUENCES: Record<string, { steps: string[]; motion: 'stack' | 'flow' | 'spread' | 'cycle' }> = {
  BUILD: { steps: ['Product', 'Platform', 'Integration', 'Cloud'], motion: 'stack' },
  AUTOMATE: { steps: ['Workflow', 'Agent', 'Decision', 'Action'], motion: 'flow' },
  DECENTRALISE: { steps: ['Asset', 'Contract', 'Network', 'Verification'], motion: 'spread' },
  RUN: { steps: ['Monitor', 'Maintain', 'Improve', 'Release'], motion: 'cycle' },
};

export function RouteSequence({ routeKey }: { routeKey: string }) {
  const seq = SEQUENCES[routeKey];
  if (!seq) return null;
  return (
    <div className={`rs rs--${seq.motion}`}>
      <ol className="rs__steps">
        {seq.steps.map(step => (
          <li className="rs__step" key={step}>
            <span className="rs__dot" aria-hidden />
            <span className="rs__label">{step}</span>
          </li>
        ))}
      </ol>
      {/* Run returns to its own start, so it is the one sequence that closes. */}
      {seq.motion === 'cycle' ? <span className="rs__return" aria-hidden /> : null}
    </div>
  );
}
