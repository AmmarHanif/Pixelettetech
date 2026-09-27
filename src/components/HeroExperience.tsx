/**
 * The homepage hero's Experience system.
 *
 * THE ARGUMENT THE PICTURE MAKES. Engineering, AI & Automation and Blockchain
 * are three capabilities that converge on one outcome, and Experience is that
 * outcome rather than a fourth capability. So the three sit around the edge at
 * the same weight as each other, the centre sits lower and forward on a plinth
 * where things arrive, and every conduit runs INWARD. Nothing orbits, nothing
 * is arranged in a ring, and the centre is never given a service label, an icon
 * of its own kind or a list of deliverables - all of which would quietly make
 * it a fourth pillar.
 *
 * CSS AND SVG, NOT A 3D ENGINE. The reference is a rendered glass composition,
 * and the parts of it that carry the look are all things CSS does natively:
 * translucent surfaces over a blurred backdrop, a hairline top-light on each
 * pane, soft contact shadows, real perspective, and separation in Z. A WebGL
 * build would add a dependency and a runtime for a scene with eight surfaces in
 * it. The conduits are one SVG drawn in the scene's own plane, because a curve
 * that has to meet two projected points is easier to place accurately in 2D
 * than to model in 3D and hope it lands.
 *
 * STATE IS A RADIO GROUP WITH NOTHING CHECKED AT REST. That gives a calm
 * default, hover on a pointer, tap on a phone and arrow-key navigation from the
 * keyboard, with no JavaScript. The detail lists are in the markup at all times
 * so a screen reader reaches them; only their visibility is conditional, and
 * nothing essential depends on a pointer.
 */

type Pillar = {
  id: string;
  label: string;
  line: string;
  details: string[];
};

/*
 * The supporting lines are written here WITHOUT terminal full stops, though the
 * brief supplies them with. They are short display labels inside a diagram, and
 * the standing house rule - given repeatedly, and enforced for headings by
 * scripts/check-headings.mjs - is that short display labels do not take one.
 * The lead paragraph in the hero keeps its full stops, because that is body
 * copy and a real sentence. Flagged in the hand-back rather than done silently.
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

/** A restrained mark per pillar. Abstract, and none of them is a brain, a coin
 *  or a chain - the brief rules out all three by name. */
function Mark({ id }: { id: string }) {
  if (id === 'engineering') {
    /* two brackets closing on a solved centre */
    return (
      <svg aria-hidden className="hx__mark" viewBox="0 0 24 24">
        <path d="M9 6 L4 12 L9 18" />
        <path d="M15 6 L20 12 L15 18" />
        <circle cx="12" cy="12" r="1.6" />
      </svg>
    );
  }
  if (id === 'ai') {
    /* signals resolving from many inputs into one decided output */
    return (
      <svg aria-hidden className="hx__mark" viewBox="0 0 24 24">
        <path d="M4 7 H10" />
        <path d="M4 12 H13" />
        <path d="M4 17 H10" />
        <path d="M13 12 L18 12" />
        <circle cx="19.4" cy="12" r="1.6" />
      </svg>
    );
  }
  /* blockchain: shared state agreed across separate holders */
  return (
    <svg aria-hidden className="hx__mark" viewBox="0 0 24 24">
      <rect height="6" rx="1.4" width="6" x="3" y="9" />
      <rect height="6" rx="1.4" width="6" x="15" y="4" />
      <rect height="6" rx="1.4" width="6" x="15" y="14" />
      <path d="M9 11.4 L15 7.4" />
      <path d="M9 12.6 L15 16.6" />
    </svg>
  );
}

/** The centre. People, because the outcome is theirs - not a product mark. */
function ExperienceMark() {
  return (
    <svg aria-hidden className="hx__mark hx__mark--centre" viewBox="0 0 24 24">
      <circle cx="8.6" cy="8.6" r="2.8" />
      <circle cx="16.2" cy="9.6" r="2.2" />
      <path d="M3.4 18.4 c0 -3 2.3 -4.8 5.2 -4.8 c2.9 0 5.2 1.8 5.2 4.8" />
      <path d="M15 13.8 c2.6 0.1 4.4 1.8 4.4 4.6" />
    </svg>
  );
}

export function HeroExperience() {
  return (
    <div className="hx">
      <div className="hx__scene">
        {/*
          The conduits sit UNDER the panes and OVER the plinth, so a pane
          occludes the end of its own conduit and the line reads as arriving
          behind it rather than stopping on top of it.
        */}
        <svg aria-hidden className="hx__conduits" viewBox="0 0 560 520">
          <defs>
            <linearGradient id="hxFlow" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.62" />
            </linearGradient>
          </defs>
          {/*
            EVERY PATH RUNS FROM ITS PANE'S MIDDLE TO THE CENTRE'S MIDDLE, and
            both ends are hidden underneath the surfaces they belong to, so what
            is visible is the span between them. The coordinates are the slot
            percentages converted into this viewBox (x = pct/100 x 560,
            y = pct/100 x 520) rather than hand-placed, which is why they moved
            when the panes did: the first set was authored against the old
            positions and the lines missed their panes entirely.

            All three arrive at the same point and none of them curves around
            the centre, because convergence is the whole argument - an orbit
            would say the opposite.
          */}
          {/* engineering: pane middle (19,24)% -> centre (43,53)% */}
          <path className="hx__wire" d="M106 125 C123 198 168 239 241 276" />
          <path className="hx__flow hx__flow--engineering" d="M106 125 C123 198 168 239 241 276" />
          {/* ai: pane middle (80,18)% -> centre (43,50)% */}
          <path className="hx__wire" d="M448 94 C403 177 326 229 241 260" />
          <path className="hx__flow hx__flow--ai" d="M448 94 C403 177 326 229 241 260" />
          {/* blockchain: pane middle (81,64)% -> centre (43,56)% */}
          <path className="hx__wire" d="M454 333 C392 322 314 302 241 291" />
          <path className="hx__flow hx__flow--blockchain" d="M454 333 C392 322 314 302 241 291" />
        </svg>

        {/* the plinth: where the three arrive and become one thing */}
        {/* A ground shadow, not a plinth. The brief prefers a clean base and
            permits none; three stacked slabs rendered as a smudge. */}
        <div aria-hidden className="hx__plinth" />

        <fieldset className="hx__group">
          <legend className="visually-hidden-heading">
            Explore how each capability contributes to the experience
          </legend>

          {/* ---- the centre ---- */}
          <span className="hx__slot hx__slot--centre">
            <input className="hx__radio" id="hx-experience" name="hx" type="radio" />
            <label className="hx__centre" htmlFor="hx-experience">
              <span className="hx__glow" aria-hidden />
              <ExperienceMark />
              <span className="hx__centreLabel">Experience</span>
              <span className="hx__centreLine">Built around the people who use it</span>
            </label>
          </span>

          {/* ---- the three capabilities ---- */}
          {PILLARS.map(p => (
            <span className={`hx__slot hx__slot--${p.id}`} key={p.id}>
              <input className="hx__radio" id={`hx-${p.id}`} name="hx" type="radio" />
              <label className="hx__pane" htmlFor={`hx-${p.id}`}>
                <Mark id={p.id} />
                <span className="hx__paneLabel">{p.label}</span>
                <span className="hx__paneLine">{p.line}</span>
                {/*
                  Always in the markup, so a screen reader and a no-CSS reader
                  get it; revealed visually on hover, focus or tap. Nothing here
                  is essential to the diagram's meaning.
                */}
                <span className="hx__details">
                  {p.details.map(d => (
                    <span className="hx__detail" key={d}>
                      {d}
                    </span>
                  ))}
                </span>
              </label>
            </span>
          ))}
        </fieldset>
      </div>

      <p className="visually-hidden-heading">
        Engineering, AI &amp; Automation and Blockchain combine around the experience of the
        people using what Pixelette builds.
      </p>
    </div>
  );
}
