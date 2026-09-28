/**
 * The homepage hero's Experience system.
 *
 * REBUILT 2026-09-28 AS GEOMETRY RATHER THAN PLANES. The first version drew
 * four rounded rectangles at slight angles with hairline connectors, and the
 * founder's verdict was correct: it read as floating cards, not as objects in a
 * space. The reference's dimensionality comes from things the earlier version
 * simply did not have - a central object with real faces and inner structure, a
 * panel that has THICKNESS and therefore a visible edge, a pedestal under each
 * panel so it stands rather than hovers, a stepped plinth giving the whole
 * composition a floor, and conduits thick enough to read as illuminated
 * channels instead of pen strokes.
 *
 * SO EVERY OBJECT HERE IS BUILT FROM MULTIPLE FACES. The centre is a real cube:
 * five faces at translateZ and rotateY/rotateX, translucent, with an inner
 * lattice and a light source inside it. Each capability is a front face plus a
 * side face plus a pedestal. That is what makes the silhouette change as the
 * eye moves across it, which a single plane cannot do however it is shadowed.
 *
 * THE CAMERA IS NEAR EYE LEVEL, not isometric. In the reference you look
 * slightly DOWN at a floor and straight AT the upright objects standing on it,
 * which is why its panels are readable and its plinth is a shallow parallelogram.
 * Horizontal surfaces here take rotateX(74deg); upright ones take none.
 *
 * STILL NO 3D ENGINE AND STILL NO JAVASCRIPT. Faces are elements, the light is
 * a gradient, and state is a radio group: calm at rest, hover on a pointer, tap
 * on a phone, arrow keys from the keyboard.
 */

type Pillar = {
  id: string;
  label: string;
  line: string;
  details: string[];
};

/*
 * Supporting lines carry no terminal full stop, though the brief supplies them
 * with one: they are short display labels inside a diagram, and the standing
 * house rule removes the stop there. Flagged in the hand-back, not done quietly.
 */
const PILLARS: Pillar[] = [
  {
    id: 'engineering',
    label: 'Engineering',
    line: 'From complex problems to reliable products',
    details: [
      'Custom software',
      'Web and mobile',
      'Modernisation',
      'Integration',
      'Immersive applications',
    ],
  },
  {
    id: 'ai',
    label: 'AI & Automation',
    line: 'From insight to real-world action',
    details: ['AI systems', 'Agentic AI', 'Workflow automation', 'Data and evaluation'],
  },
  {
    id: 'blockchain',
    label: 'Blockchain',
    line: 'Where decentralisation creates real value',
    details: [
      'Tokenisation',
      'Smart contracts',
      'Distributed systems',
      'Verification',
      'Real-world applications',
    ],
  },
];

/** A restrained mark per pillar: no brain, no coin, no chain. */
function Mark({ id }: { id: string }) {
  if (id === 'engineering') {
    return (
      <svg aria-hidden className="hx__mark" viewBox="0 0 24 24">
        <path d="M9 6 L4 12 L9 18" />
        <path d="M15 6 L20 12 L15 18" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    );
  }
  if (id === 'ai') {
    return (
      <svg aria-hidden className="hx__mark" viewBox="0 0 24 24">
        <path d="M4 7 H10" />
        <path d="M4 12 H13" />
        <path d="M4 17 H10" />
        <path d="M13 12 H17.6" />
        <circle cx="19.2" cy="12" r="1.6" />
      </svg>
    );
  }
  return (
    <svg aria-hidden className="hx__mark" viewBox="0 0 24 24">
      <rect height="5.6" rx="1.3" width="5.6" x="3" y="9.2" />
      <rect height="5.6" rx="1.3" width="5.6" x="15.4" y="4.2" />
      <rect height="5.6" rx="1.3" width="5.6" x="15.4" y="14.2" />
      <path d="M8.9 11.4 L15.3 7.6" />
      <path d="M8.9 12.8 L15.3 16.4" />
    </svg>
  );
}

function ExperienceMark() {
  return (
    <svg aria-hidden className="hx__mark hx__mark--centre" viewBox="0 0 24 24">
      <circle cx="8.6" cy="8.4" r="2.7" />
      <circle cx="16.3" cy="9.5" r="2.1" />
      <path d="M3.5 18.3 c0 -2.9 2.3 -4.7 5.1 -4.7 c2.9 0 5.2 1.8 5.2 4.7" />
      <path d="M15.1 13.7 c2.6 0.1 4.4 1.8 4.4 4.6" />
    </svg>
  );
}

/** One capability: a front face with thickness, standing on its own pedestal. */
function Panel({ pillar }: { pillar: Pillar }) {
  return (
    <span className={`hx__obj hx__obj--${pillar.id}`}>
      <input className="hx__radio" id={`hx-${pillar.id}`} name="hx" type="radio" />
      <label className="hx__panel" htmlFor={`hx-${pillar.id}`}>
        {/* A face and an edge behind it, which is what gives the panel depth.
            NO PEDESTAL: one was tried and could not work. A pedestal inside the
            panel rotates in the PANEL's space, and the panel is floating, so the
            stand appeared at the panel's own height jutting forward - pale slabs
            scattered through the composition rather than legs reaching a floor.
            Reaching the floor needs a stem whose length depends on how high that
            panel happens to sit, which is a modelling problem, not a styling one.
            The brief permits a clean base, so the floor is one plinth under the
            centre and the panels are held aloft by the ribbons instead. */}
        <span aria-hidden className="hx__edge" />
        <span className="hx__face">
          <Mark id={pillar.id} />
          <span className="hx__label">{pillar.label}</span>
          <span className="hx__line">{pillar.line}</span>
          <span className="hx__details">
            {pillar.details.map(d => (
              <span className="hx__detail" key={d}>
                {d}
              </span>
            ))}
          </span>
        </span>
      </label>
    </span>
  );
}

export function HeroExperience() {
  return (
    <div className="hx">
      <div className="hx__stage">
        <div className="hx__scene">
          {/* ---------- the conduits, behind the objects they join ---------- */}
          <svg aria-hidden className="hx__conduits" viewBox="0 0 560 520">
            <defs>
              <linearGradient id="hxRibbon" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#b98fd6" stopOpacity="0.15" />
                <stop offset="55%" stopColor="#8a3fbe" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6d1f9c" stopOpacity="0.8" />
              </linearGradient>
              <filter id="hxBloom" x="-45%" y="-45%" width="190%" height="190%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>
            {/*
              Three strokes per route and each does a different job: a wide
              blurred pass for the bloom the reference's channels throw onto
              everything near them, a solid body, and a bright travelling dash.
              One stroke cannot be both a glow and a signal.
            */}
            {/*
              THESE COORDINATES ARE MEASURED, NOT AUTHORED. Twice the ribbons
              were written by hand against where the panels were expected to be,
              and twice they missed, because a panel's painted position is the
              product of a translate3d, a perspective divide and the stage's own
              box - none of which can be read off the CSS. They are now derived
              from the rendered rectangles by scratchpad/derive_paths.py, which
              converts each panel's inner edge and the cube's centre into this
              viewBox. Move an object and re-run it rather than nudging numbers.
            */}
            {[
              ['engineering', 'M199 214 C233 230 258 301 280 335'],
              ['ai', 'M435 192 C369 212 320 294 280 335'],
              /* Blockchain's straight run was 138px of near-horizontal line
                 with the cube and the panel covering most of it, so it read as
                 a stub. Arced below the cube it stays visible for its whole
                 length and still arrives at the same point as the other two. */
              ['blockchain', 'M418 336 C398 392 330 396 282 352'],
            ].map(([id, d]) => (
              <g className={`hx__ribbon hx__ribbon--${id}`} key={id}>
                <path className="hx__bloom" d={d} filter="url(#hxBloom)" />
                <path className="hx__body" d={d} />
                <path className="hx__pulse" d={d} />
              </g>
            ))}
          </svg>

          {/* ---------- the centre: a real cube with light inside ---------- */}
          <span className="hx__obj hx__obj--centre">
            <input className="hx__radio" id="hx-experience" name="hx" type="radio" />
            {/* The floor, carried by the centre so it is positioned from the
                cube's own base rather than from the stage. Two tiers, each a top
                face hinged at its front edge and a front face rising from that
                same edge - hinged anywhere else and a slab comes apart into two
                floating bars, which is what the first attempt produced. */}
            <span aria-hidden className="hx__plinth">
              <span className="hx__tier hx__tier--upper">
                <span className="hx__tierTop" />
                <span className="hx__tierFront" />
              </span>
              <span className="hx__tier hx__tier--lower">
                <span className="hx__tierTop" />
                <span className="hx__tierFront" />
              </span>
            </span>
            <label className="hx__cube" htmlFor="hx-experience">
              <span aria-hidden className="hx__cubeGlow" />
              <span aria-hidden className="hx__cubeFace hx__cubeFace--left" />
              <span aria-hidden className="hx__cubeFace hx__cubeFace--right" />
              <span aria-hidden className="hx__cubeFace hx__cubeFace--top" />
              <span className="hx__cubeFace hx__cubeFace--front">
                <ExperienceMark />
                <span className="hx__label hx__label--centre">Experience</span>
                <span className="hx__line hx__line--centre">
                  Built around the people who use it
                </span>
              </span>
            </label>
          </span>

          {/* ---------- the three capabilities ---------- */}
          <fieldset className="hx__group">
            <legend className="visually-hidden-heading">
              Explore how each capability contributes to the experience
            </legend>
            {PILLARS.map(p => (
              <Panel key={p.id} pillar={p} />
            ))}
          </fieldset>
        </div>
      </div>

      <p className="visually-hidden-heading">
        Engineering, AI &amp; Automation and Blockchain combine around the experience of the
        people using what Pixelette builds.
      </p>
    </div>
  );
}
