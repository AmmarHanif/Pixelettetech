'use client';

import { useId, useState } from 'react';

/**
 * Four capability demonstrations, one active at a time.
 *
 * CSS 3D TRANSFORMS, NOT WEBGL, AND THAT IS A DELIBERATE ENGINEERING CHOICE
 * RATHER THAN A COMPROMISE. A real 3D library on this page would mean a new
 * dependency (R14), several hundred kilobytes of JavaScript on a marketing page,
 * a canvas that is invisible to a screen reader, and a blank rectangle for
 * anyone whose GPU is blocked. The browser's own 3D engine gives genuine
 * perspective, depth and rotation using elements that stay in the accessibility
 * tree, cost nothing to download, and degrade to flat shapes rather than to
 * nothing. The subject is immersive software; the demonstration should not need
 * a 40x payload to make a point about engineering judgement.
 *
 * EVERYTHING IS DRIVEN BY BUTTONS, RADIOS AND RANGE INPUTS. Nothing here is
 * hover-only and nothing depends on a drag, so every demonstration is fully
 * operable from the keyboard by construction rather than by adding key handlers
 * to a mouse-shaped interaction. Pointer dragging would be a nice enhancement
 * and is deliberately not the only route in.
 *
 * NOTHING AUTOPLAYS. Each demonstration renders its scene statically and moves
 * only when the visitor asks it to.
 *
 * EVERY OBJECT IS FICTIONAL. There is no real building, no branded product, no
 * client environment and no recognisable commercial design anywhere in this
 * file. They are abstract forms built from coloured planes, which is both the
 * honest answer to the permissions rule and the reason they suit the site's
 * restrained visual language.
 */

type DemoId = 'spatial' | 'ar' | 'training' | 'product';

const TABS: { id: DemoId; label: string; kicker: string }[] = [
  { id: 'spatial', label: 'Spatial', kicker: '01' },
  { id: 'ar', label: 'AR product', kicker: '02' },
  { id: 'training', label: 'Training', kicker: '03' },
  { id: 'product', label: '3D product', kicker: '04' },
];

const META: Record<DemoId, { title: string; body: string }> = {
  spatial: {
    title: 'Explore a space before it exists.',
    body: 'A fictional workspace interior. Change viewpoint to move through it and inspect the layout, the way a client would review a space that has not been built yet.',
  },
  ar: {
    title: 'See it in your world.',
    body: 'A fictional pendant light placed into a room. Place it, turn it, and change its size, which is the interaction an AR product preview has to get right before anything else.',
  },
  training: {
    title: 'Practise before it matters.',
    body: 'A fictional inspection routine on fictional equipment. Step through a guided procedure the way a trainee would, with the system confirming each action before the next.',
  },
  product: {
    title: 'Understand it from every angle.',
    body: 'A fictional engineered module. Turn it, move closer, and separate the components to see how they assemble.',
  },
};

/* ------------------------------------------------------------ 01 spatial -- */

/*
 * CAMERA ANGLES, AND THEY ARE HIGHER THAN EYE LEVEL ON PURPOSE.
 *
 * The first set used 6 to 10 degrees, which is what standing in a room actually
 * looks like. It rendered the floor almost edge-on: a grey sliver with the
 * furniture invisible on top of it, so the scene read as two bare walls. Correct
 * perspective, useless picture.
 *
 * A demonstration of a SPACE has to show the ground plane, so these sit between
 * 24 and 34 degrees - the angle an architect's walkthrough uses rather than the
 * angle a person's eyes do - with one true overhead for the layout.
 */
const VIEWPOINTS = [
  { id: 'entrance', label: 'Entrance', rx: 24, ry: 0, z: -40, y: -6 },
  { id: 'floor', label: 'Open floor', rx: 30, ry: -26, z: 20, y: 0 },
  { id: 'meeting', label: 'Meeting area', rx: 27, ry: 24, z: 24, y: 0 },
  { id: 'plan', label: 'Overview', rx: 64, ry: 0, z: -30, y: 14 },
];

function SpatialDemo() {
  const [vp, setVp] = useState(VIEWPOINTS[1]!);
  return (
    <div className="demo">
      <div
        aria-label={`Fictional workspace interior, viewed from: ${vp.label}`}
        className="demo__stage demo__stage--room"
        role="img"
      >
        <div
          className="room"
          style={{
            transform: `translateZ(${vp.z}px) translateY(${vp.y}px) rotateX(${vp.rx}deg) rotateY(${vp.ry}deg)`,
          }}
        >
          <div className="room__face room__back" />
          <div className="room__face room__left" />
          <div className="room__face room__right" />

          {/*
            THE LAYOUT IS PAINTED INTO THE FLOOR AS ONE COPLANAR SVG, and that
            is the third attempt at this. Positioning the furniture in the room's
            space put each block in the wrong place. Making them children of the
            floor with a small translateZ fixed the placement and then failed to
            paint: measured, the blocks had real dimensions and were simply never
            visible, because offsetting a child along a rotated plane's local Z
            puts it on the wrong side of that plane's own opaque background.
            Chasing the sign of that offset is a fight with the browser's 3D
            sorting that this demonstration does not need to have.

            One SVG, coplanar with the floor, no Z offset, DOM order decides. It
            cannot Z-fight, it scales with the floor, and it is a single element
            to reason about. The two STANDING objects below stay as real 3D
            children of the room, because their whole job is to have height.
          */}
          <div className="room__face room__floor">
            <svg aria-hidden className="room__plan" viewBox="0 0 340 270">
              {/* meeting zone */}
              <rect className="room__zone" x="222" y="30" width="96" height="104" rx="8" />
              {/* four desk blocks */}
              <rect className="room__desk" x="24" y="44" width="84" height="34" rx="4" />
              <rect className="room__desk" x="24" y="100" width="84" height="34" rx="4" />
              <rect className="room__desk" x="124" y="44" width="84" height="34" rx="4" />
              <rect className="room__desk" x="124" y="100" width="84" height="34" rx="4" />
              {/* meeting table */}
              <circle className="room__table" cx="270" cy="82" r="30" />
              {/* counter run along the near edge */}
              <rect className="room__counter" x="24" y="200" width="190" height="24" rx="5" />
            </svg>
          </div>

          {/* The two vertical elements, which is what stops the space reading
              as a floor plan rather than as a room. */}
          <div className="room__stand room__partition" />
          <div className="room__stand room__pillar" />
        </div>
      </div>

      <div className="demo__controls">
        <span className="demo__controls-label" id="vp-label">
          Viewpoint
        </span>
        <div aria-labelledby="vp-label" className="demo__btns" role="group">
          {VIEWPOINTS.map(v => (
            <button
              aria-pressed={v.id === vp.id}
              className="demo__btn"
              key={v.id}
              onClick={() => setVp(v)}
              type="button"
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- 02 AR product -- */

function ArDemo() {
  const [placed, setPlaced] = useState(false);
  const [spin, setSpin] = useState(24);
  const [scale, setScale] = useState(100);
  const rangeId = useId();

  return (
    <div className="demo">
      <div
        aria-label={
          placed
            ? `Fictional pendant light placed in a room, turned ${spin} degrees, at ${scale} per cent size`
            : 'An empty room with a placement marker on the floor'
        }
        className="demo__stage demo__stage--ar"
        role="img"
      >
        <div className="ar__room">
          <div className="ar__wall" />
          <div className="ar__floor" />
          {/* The reticle: what an AR app shows before you commit to a position. */}
          <div className={`ar__reticle${placed ? ' is-placed' : ''}`} />
          {placed ? (
            <div
              className="ar__object"
              style={{ transform: `rotateY(${spin}deg) scale(${scale / 100})` }}
            >
              <div className="ar__shade" />
              <div className="ar__cord" />
              <div className="ar__pool" />
            </div>
          ) : null}
        </div>
        {!placed ? <p className="demo__hint">Tap place to put the object in the room.</p> : null}
      </div>

      <div className="demo__controls">
        <div className="demo__btns">
          <button
            aria-pressed={placed}
            className="demo__btn demo__btn--primary"
            onClick={() => setPlaced(p => !p)}
            type="button"
          >
            {placed ? 'Remove' : 'Place'}
          </button>
          <button
            className="demo__btn"
            disabled={!placed}
            onClick={() => setSpin(s => s - 30)}
            type="button"
          >
            Turn left
          </button>
          <button
            className="demo__btn"
            disabled={!placed}
            onClick={() => setSpin(s => s + 30)}
            type="button"
          >
            Turn right
          </button>
        </div>
        <div className="demo__slider">
          <label htmlFor={rangeId}>Size</label>
          <input
            disabled={!placed}
            id={rangeId}
            max={140}
            min={60}
            onChange={e => setScale(Number(e.target.value))}
            step={5}
            type="range"
            value={scale}
          />
          <span className="demo__value">{scale}%</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 03 training -- */

const STEPS = [
  {
    n: '01',
    title: 'Identify',
    body: 'Locate the isolation valve on the fictional regulator assembly. In a real programme this is where a trainee learns the layout before touching anything.',
    part: 'valve',
  },
  {
    n: '02',
    title: 'Inspect',
    body: 'Check the pressure gauge reading against the permitted range. The system confirms what was observed rather than assuming it.',
    part: 'gauge',
  },
  {
    n: '03',
    title: 'Select',
    body: 'Choose the correct tool for the fitting. Selecting the wrong one is allowed, and is corrected in the moment rather than at the end.',
    part: 'tool',
  },
  {
    n: '04',
    title: 'Complete',
    body: 'Confirm the assembly is secure and log the check. The record is what makes the training auditable afterwards.',
    part: 'seal',
  },
];

function TrainingDemo() {
  const [i, setI] = useState(0);
  const step = STEPS[i]!;
  const done = i === STEPS.length - 1;

  return (
    <div className="demo">
      <div
        aria-label={`Fictional regulator assembly. Current step: ${step.n} ${step.title}`}
        className="demo__stage demo__stage--rig"
        role="img"
      >
        <div className="rig">
          <div className="rig__body" />
          <div className={`rig__part rig__valve${step.part === 'valve' ? ' is-active' : ''}`} />
          <div className={`rig__part rig__gauge${step.part === 'gauge' ? ' is-active' : ''}`}>
            <span className="rig__needle" />
          </div>
          <div className={`rig__part rig__tool${step.part === 'tool' ? ' is-active' : ''}`} />
          <div className={`rig__part rig__seal${step.part === 'seal' ? ' is-active' : ''}`} />
          <div className="rig__pipe rig__pipe--in" />
          <div className="rig__pipe rig__pipe--out" />
        </div>
      </div>

      <div className="demo__steps">
        <ol className="demo__steplist">
          {STEPS.map((s, n) => (
            <li className={n === i ? 'is-current' : n < i ? 'is-done' : ''} key={s.n}>
              <span className="demo__stepn">{s.n}</span>
              {s.title}
            </li>
          ))}
        </ol>
        <div aria-live="polite" className="demo__stepbody">
          <p className="body">
            <strong>
              {step.n} {step.title}.
            </strong>{' '}
            {step.body}
          </p>
        </div>
        <div className="demo__btns">
          <button
            className="demo__btn"
            disabled={i === 0}
            onClick={() => setI(n => n - 1)}
            type="button"
          >
            Back
          </button>
          <button
            className="demo__btn demo__btn--primary"
            onClick={() => setI(n => (done ? 0 : n + 1))}
            type="button"
          >
            {done ? 'Start again' : 'Next step'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------- 04 3D product -- */

const LAYERS = [
  { id: 'housing', label: 'Housing', y: -78, tone: 'a' },
  { id: 'board', label: 'Control board', y: -26, tone: 'b' },
  { id: 'core', label: 'Power core', y: 26, tone: 'c' },
  { id: 'base', label: 'Mounting base', y: 78, tone: 'd' },
];

function ProductDemo() {
  const [spin, setSpin] = useState(-28);
  const [tilt, setTilt] = useState(14);
  const [zoom, setZoom] = useState(100);
  const [exploded, setExploded] = useState(false);
  const zoomId = useId();

  return (
    <div className="demo">
      <div
        aria-label={`Fictional engineered module, turned ${spin} degrees, ${exploded ? 'components separated' : 'assembled'}`}
        className="demo__stage demo__stage--prod"
        role="img"
      >
        <div
          className="prod"
          style={{
            transform: `scale(${zoom / 100}) rotateX(${tilt}deg) rotateY(${spin}deg)`,
          }}
        >
          {LAYERS.map((l, n) => (
            <div
              className={`prod__layer prod__layer--${l.tone}`}
              key={l.id}
              style={{
                transform: `translateY(${exploded ? l.y : 0}px) translateZ(${exploded ? 0 : (n - 1.5) * 14}px)`,
              }}
            >
              <span className={`prod__label${exploded ? ' is-shown' : ''}`}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="demo__controls">
        <div className="demo__btns">
          <button className="demo__btn" onClick={() => setSpin(s => s - 30)} type="button">
            Turn left
          </button>
          <button className="demo__btn" onClick={() => setSpin(s => s + 30)} type="button">
            Turn right
          </button>
          <button className="demo__btn" onClick={() => setTilt(t => (t === 14 ? 52 : 14))} type="button">
            {tilt === 14 ? 'Look down' : 'Level'}
          </button>
          <button
            aria-pressed={exploded}
            className="demo__btn demo__btn--primary"
            onClick={() => setExploded(e => !e)}
            type="button"
          >
            {exploded ? 'Assemble' : 'Separate parts'}
          </button>
        </div>
        <div className="demo__slider">
          <label htmlFor={zoomId}>Zoom</label>
          <input
            id={zoomId}
            max={130}
            min={70}
            onChange={e => setZoom(Number(e.target.value))}
            step={5}
            type="range"
            value={zoom}
          />
          <span className="demo__value">{zoom}%</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ shell -- */

const PANELS: Record<DemoId, () => React.ReactElement> = {
  spatial: SpatialDemo,
  ar: ArDemo,
  training: TrainingDemo,
  product: ProductDemo,
};

export function ImmersiveShowcase() {
  const [active, setActive] = useState<DemoId>('spatial');
  const Panel = PANELS[active];
  const meta = META[active];

  return (
    <div className="showcase">
      {/*
        A real tablist: roving selection, aria-selected, and each panel labelled
        by its tab. Arrow-key movement is the browser's own within a radio-style
        group, so the tabs are reachable and operable without a pointer.
      */}
      <div aria-label="Capability demonstrations" className="showcase__tabs" role="tablist">
        {TABS.map(t => (
          <button
            aria-controls={`demo-panel-${t.id}`}
            aria-selected={t.id === active}
            className={`showcase__tab${t.id === active ? ' is-active' : ''}`}
            id={`demo-tab-${t.id}`}
            key={t.id}
            onClick={() => setActive(t.id)}
            role="tab"
            type="button"
          >
            <span className="showcase__tabn">{t.kicker}</span>
            <span className="showcase__tablabel">{t.label}</span>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`demo-tab-${active}`}
        className="showcase__panel"
        id={`demo-panel-${active}`}
        role="tabpanel"
        tabIndex={0}
      >
        <div className="showcase__head">
          {/* Said on every panel, not once at the top of the section: this is the
              label that stops a demonstration being read as client work. */}
          <p className="showcase__label">Capability demonstration</p>
          <h3 className="h4 showcase__title">{meta.title}</h3>
          <p className="body showcase__body">{meta.body}</p>
        </div>
        <Panel />
      </div>
    </div>
  );
}
