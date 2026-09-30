/**
 * "One action, whole system responds" — the Web Platforms explanatory visual.
 *
 * BUILT NATIVELY, for the same reasons as its Custom Software counterpart and
 * one of its own: in the supplied film a line of generated gibberish sits above
 * every system label - "hepresentativerelampplaces" and similar - baked into the
 * frame. Every label here is HTML instead (§15).
 *
 * THE SHAPE IS A ROUND TRIP, NOT A CONVERGENCE. The platform sits in the middle
 * and never leaves; the systems stand either side of it; a single action leaves
 * the platform, reaches each system in turn, and comes back as a completed
 * outcome. Custom Software's visual is the opposite motion - six separate things
 * collapsing downward into one. They share the palette and the materials and
 * nothing else, which is what §10 requires: same family, different animation.
 *
 * WHY THE PLATFORM IS CENTRE AND STAYS CENTRE. The proposition is "I did one
 * thing here, and several systems had to work together behind it" (§8). If the
 * platform moved or the systems led, the sentence would read the other way
 * round. On a narrow screen the systems restack above and below it and the
 * platform holds the middle (§16).
 *
 * NO JAVASCRIPT AND NO ANIMATION LIBRARY (§18). Server component, CSS keyframes,
 * CSS :hover for the §14 emphasis. Motion is layered on only under
 * `prefers-reduced-motion: no-preference`, so the still composition is the
 * finished outcome rather than a degraded one (§17).
 */

/** Left and right are separate lists so each side can animate outward in turn. */
const LEFT = [
  { t: 'Authentication', d: 'Who is this' },
  { t: 'Workflow', d: 'What happens next' },
  { t: 'Payment', d: 'Money moves' },
];

const RIGHT = [
  { t: 'CRM', d: 'The record updates' },
  { t: 'APIs', d: 'Other systems told' },
  { t: 'Data', d: 'Written down' },
];

function Systems({ items, side }: { items: typeof LEFT; side: 'l' | 'r' }) {
  return (
    <ul className={`pr__systems pr__systems--${side}`}>
      {items.map((s, i) => (
        <li className="pr__system" key={s.t} style={{ '--i': i } as React.CSSProperties}>
          <span className="pr__system-t">{s.t}</span>
          <span className="pr__system-d">{s.d}</span>
          <span aria-hidden className="pr__wire" />
        </li>
      ))}
    </ul>
  );
}

export function PlatformResponds() {
  return (
    <figure className="pr">
      <p className="visually-hidden">
        A user action enters a web platform and triggers authentication, workflow, payments, CRM,
        APIs and data services before returning a completed outcome.
      </p>

      <Systems items={LEFT} side="l" />

      <div className="pr__platform">
        <span aria-hidden className="pr__chrome">
          <i />
          <i />
          <i />
        </span>
        <span className="pr__stage">
          {/* The action and the outcome occupy the same spot, one handing over to
              the other, so the eye reads a single journey rather than two icons. */}
          <span aria-hidden className="pr__actor" />
          <span aria-hidden className="pr__tick" />
        </span>
        <span className="pr__platform-t">The platform</span>
        <span className="pr__platform-d">One action in, one outcome back</span>
      </div>

      <Systems items={RIGHT} side="r" />
    </figure>
  );
}

export default PlatformResponds;
