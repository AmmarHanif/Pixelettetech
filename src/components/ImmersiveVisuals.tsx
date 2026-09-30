'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * The spatial hero, and the diagrams for the sections that would otherwise be
 * another grid of cards.
 *
 * DEPTH WITHOUT SCIENCE FICTION. The brief asks the page to convey depth, space,
 * layers and interaction while staying inside a restrained design system, and
 * those two pull against each other the moment anything glows. What is used here
 * is perspective and overlap only: the same brand colour, the same line tokens,
 * a few planes at different Z. Nothing is neon, nothing is dark, nothing floats
 * in a void.
 *
 * IT MUST LOOK FINISHED WHEN STILL. The parallax is an enhancement over a
 * composition that is already correct at rest, which is the test the brief sets
 * and also what a visitor on a touch screen or with reduced motion actually
 * gets.
 */

/* ---------------------------------------------------------------- the hero */

/**
 * Layered planes that lean very slightly toward the pointer.
 *
 * THE MOTION IS DELIBERATELY SMALL - about six degrees across the whole hero.
 * A hero that swings with the cursor reads as a demo of a parallax library
 * rather than as a company that builds things, and at this size it also competes
 * with the headline, which the brief rules out.
 *
 * REDUCED MOTION IS HONOURED IN JAVASCRIPT, NOT ONLY IN CSS. A media query can
 * stop a transition but cannot stop a transform being written on every pointer
 * move, so the listener itself is never attached when the preference is set.
 * The result is not a degraded version: it is the static composition.
 */
export function SpatialHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [motionOk, setMotionOk] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)');
    const fine = window.matchMedia('(pointer: fine)');
    const update = () => setMotionOk(mq.matches && fine.matches);
    update();
    mq.addEventListener('change', update);
    fine.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      fine.removeEventListener('change', update);
    };
  }, []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!motionOk) return;
      const el = ref.current;
      if (!el) return;
      const b = el.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5;
      const py = (e.clientY - b.top) / b.height - 0.5;
      setTilt({ x: -py * 6, y: px * 6 });
    },
    [motionOk],
  );

  return (
    <div
      aria-hidden
      className="sph"
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      onPointerMove={onMove}
      ref={ref}
    >
      <div
        className="sph__scene"
        style={{ transform: `rotateX(${8 + tilt.x}deg) rotateY(${-16 + tilt.y}deg)` }}
      >
        {/* Back to front. Each plane is a layer of an application being
            assembled: ground, structure, content, interface, focus. */}
        <div className="sph__plane sph__plane--ground" />
        <div className="sph__plane sph__plane--grid" />
        <div className="sph__plane sph__plane--mid">
          <span className="sph__bar" style={{ width: '58%' }} />
          <span className="sph__bar" style={{ width: '34%' }} />
          <span className="sph__bar" style={{ width: '44%' }} />
        </div>
        <div className="sph__plane sph__plane--front">
          <span className="sph__chip" />
          <span className="sph__chip sph__chip--wide" />
        </div>
        <div className="sph__solid sph__solid--a" />
        <div className="sph__solid sph__solid--b" />
        <div className="sph__marker" />
      </div>
    </div>
  );
}

/* ------------------------------------------------- how we build it (step 11) */

const BUILD_STEPS = [
  { n: '01', t: 'Concept', b: 'User, environment, interaction and outcome.' },
  { n: '02', t: 'Prototype', b: 'Test the experience before the full build.' },
  { n: '03', t: 'Spatial design', b: 'Environments, objects and interfaces.' },
  { n: '04', t: 'Engineering', b: 'The software and the immersive functionality.' },
  { n: '05', t: 'Integration', b: 'APIs, data, cloud and existing systems.' },
  { n: '06', t: 'Test', b: 'On the intended devices, in the intended environment.' },
  { n: '07', t: 'Deploy', b: 'Release, documentation and technical handover.' },
];

/**
 * The build sequence as ONE continuous progression.
 *
 * REBUILT 2026-09-30 on the founder's structural brief, which asked for these
 * "as ONE continuous progression rather than seven disconnected content cards".
 * They were seven bordered cards in a four-column grid, so they always rendered
 * as two rows - four then an orphan three - and a sequence broken across two
 * rows of boxes does not read as a sequence at all. A single rule now runs
 * through all seven markers, and the card chrome is gone: the connection between
 * the steps IS the visual, which is what the section is about.
 *
 * THE STEP DESCRIPTIONS WERE CUT TO ONE SHORT LINE EACH. Seven columns is narrow
 * by construction, and the brief shortened the step NAMES itself (Storyboard &
 * prototype became Prototype, Test in context became Test), so terseness here is
 * the instruction rather than a liberty. Every stage is still present and still
 * in order, which is the substance the brief asked to preserve.
 *
 * NO NEW IMAGERY, which the brief forbids: the rail is a two-pixel rule and the
 * markers are dots, both on existing tokens.
 */
export function BuildProgression() {
  return (
    <ol className="bflow">
      {BUILD_STEPS.map(s => (
        <li className="bflow__step" key={s.n}>
          <span aria-hidden className="bflow__dot" />
          <span className="bflow__n">{s.n}</span>
          <h3 className="h4 bflow__t">{s.t}</h3>
          <p className="body bflow__b">{s.b}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------ why it sits under engineering -- */

const CONNECTED = [
  'Software engineering',
  'AI & Automation',
  'Cloud & data',
  'Integrations',
  'Support',
];

/**
 * The experience at the centre, with the engineering it actually rests on.
 *
 * NOT RENDERED ANYWHERE SINCE 2026-09-30. It illustrated "Immersive is part of
 * the product, not a separate technology island", which the structural brief
 * deleted as a standalone section, absorbing its engineering message into the
 * copy under the build progression instead. The diagram is kept rather than
 * deleted because it is finished, self-contained and could carry that point
 * again if the founder wants it back; it costs nothing while unused, since an
 * unimported export is dropped from the bundle at build time. Its `.conn*`
 * styles are kept with it for the same reason.
 */
export function ConnectedEngineering() {
  return (
    <div className="conn">
      <div className="conn__hub">
        <span>Immersive experience</span>
      </div>
      <ul className="conn__ring">
        {CONNECTED.map(c => (
          <li className="conn__node" key={c}>
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
