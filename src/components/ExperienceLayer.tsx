/**
 * The homepage's route sequences.
 *
 * WAS ALSO THE HOME OF THE HERO'S LivingSystem, which is gone: the hero brief
 * of 2026-09-27 replaced that visual with the Experience system in
 * HeroExperience.tsx, and nothing else rendered it. Removed rather than left
 * exported and unused.
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
