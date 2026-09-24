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
  { n: '01', t: 'Concept', b: 'Define the user, environment, interaction and outcome before choosing the technology.' },
  { n: '02', t: 'Storyboard & prototype', b: 'Test the experience and interaction before committing to the complete build.' },
  { n: '03', t: '3D / spatial design', b: 'Create the environments, objects, interfaces and spatial assets the application needs.' },
  { n: '04', t: 'Engineering', b: 'Build the software and the immersive functionality.' },
  { n: '05', t: 'Integration', b: 'Connect APIs, data, cloud infrastructure and existing systems where required.' },
  { n: '06', t: 'Test in context', b: 'Evaluate usability, performance and behaviour on the intended devices, in the intended environment.' },
  { n: '07', t: 'Deploy', b: 'Release the application with documentation and technical handover.' },
];

/**
 * The build sequence as a receding stack rather than seven cards.
 *
 * EACH STEP SITS SLIGHTLY FURTHER FORWARD than the one before it, so the
 * sequence reads as something being assembled toward the viewer instead of as a
 * list laid flat. The offset is small and the text is never rotated: the brief
 * asks for a spatial progression and also for it to stay understandable, and
 * tilted body copy fails the second test immediately.
 */
export function BuildProgression() {
  return (
    <ol className="bstack">
      {BUILD_STEPS.map((s, i) => (
        <li className="bstack__step" key={s.n} style={{ '--i': i } as React.CSSProperties}>
          <div className="bstack__card">
            <span className="bstack__n">{s.n}</span>
            <h3 className="h4 bstack__t">{s.t}</h3>
            <p className="body bstack__b">{s.b}</p>
          </div>
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

/** The experience at the centre, with the engineering it actually rests on. */
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
