/**
 * The homepage hero: a rendered scene with the words as real text over it.
 *
 * WHY THE IMAGE CARRIES NO WORDING. The render was generated with deliberately
 * BLANK panels. Every title, line, supporting item and icon here is ordinary
 * markup positioned over them, which keeps the whole argument readable by a
 * search engine and a screen reader, translatable, selectable, and editable
 * without paying for a new render. Text baked into a picture is none of those,
 * and a single misspelling in it costs a full regeneration.
 *
 * SO THE COPY IS IMPORTED, NOT RETYPED. It comes from
 * `src/content/hero-capabilities.ts`, the single source of truth for this
 * wording, so there is exactly one place to change it.
 *
 * THE IMAGE IS DECORATIVE, AND THAT IS NOT A DODGE. Its entire meaning is in
 * the DOM on top of it, so repeating that in an alt attribute would make a
 * screen reader read the hero twice. It is `alt=""` and aria-hidden for that
 * reason, not to avoid writing one.
 *
 * NO JAVASCRIPT AT ALL. A server component: an image, three links and some
 * text. It works with scripting disabled, needs no hydration, and the labels
 * cannot fall out of register with the scene because nothing moves them.
 *
 * POSITIONS ARE PERCENTAGES OF THE FIGURE, so the labels track the image at
 * every width rather than being pinned to one breakpoint.
 *
 * THE LABELS ARE FLAT. An earlier version skewed each one with a perspective
 * transform to match the plane of its tile. Against the current render that
 * read as wonky rather than as printed-on, and the approved reference has flat
 * text throughout, so the transform was removed rather than retuned.
 */

import Link from 'next/link';

import { CENTRE, SERVICES } from '@/content/hero-capabilities';

/* THE PANELS' REAL BOXES, measured off the render itself rather than estimated:
   centre x/y and width/height, each as a percentage of the figure. The first
   attempt guessed these and produced labels WIDER THAN THE GLASS THEY SAT ON,
   with the copy spilling onto the background. A label can only be fitted to a
   panel whose dimensions are actually known.
   `fill` is how much of the panel's width the label may occupy - the remainder
   is the margin that keeps the text off the bevelled edge.
   `yaw`/`pitch` match the plane of that panel; flat text on an angled panel
   reads as a sticker. */
type Panel = {
  x: number;
  y: number;
  w: number;
  h: number;
  aside: 'left' | 'right';
};

/* How much of a panel's width the label may occupy. 0.88, not 0.82: at 0.82 the
   AI panel gave the label 105px and "AI & Automation" needs about 105px at this
   size, so the title broke onto two lines where the reference has it on one.
   The insets were 9px, so there was room to give it. */
const FILL = 0.88;

/* MEASURED OFF THE RENDER, 2026-09-28, not carried over from the previous
   artwork. The scene was re-rendered to the founder's reference and its tiles
   do not sit where the old ones did, so these were read from a percentage grid
   laid over the artwork at the artwork's own aspect - the same percentages the
   browser will use. Reusing the old numbers would have put every label off its
   glass. */
const PLACEMENT: Record<string, Panel> = {
  engineering: { x: 18.5, y: 31, w: 25, h: 38, aside: 'left' },
  ai: { x: 70, y: 21, w: 21, h: 35, aside: 'right' },
  blockchain: { x: 86.5, y: 50, w: 20, h: 36, aside: 'right' },
};

/* THE CENTRE BLOCK SITS ON THE PLINTH, NOT ON THE CUBE, AND THAT IS A
   LEGIBILITY DECISION RATHER THAN A LAYOUT PREFERENCE. Measured against the
   delivered pixels: on the cube the title cleared AA at 5.93:1 but the
   supporting line came to 2.47:1, well under the 4.5 it needs, and white was no
   escape at 3.01:1 - this render's cube is saturated where the reference's was
   pale. On the marble the same two measure 11.14:1 and 4.63:1. The marble is
   also FLAT, where the cube is full of bright sparkles that a contrast ratio
   does not capture but an eye does. The label still reads as the cube's, since
   it sits directly beneath it and the ribbons converge there. */
const CENTRE_POS = { x: 50, y: 84, w: 34 };

function Icon({ id }: { id: string }) {
  return (
    <svg aria-hidden className="hv-icon" viewBox="0 0 24 24">
      {id === 'engineering' ? (
        <>
          <path d="M9 6 4 12l5 6" />
          <path d="M15 6l5 6-5 6" />
          <circle cx="12" cy="12" r="1.4" />
        </>
      ) : null}
      {id === 'ai' ? (
        <>
          <path d="M4 7h6M4 12h9M4 17h6" />
          <path d="M13 12h4.6" />
          <circle cx="19.2" cy="12" r="1.5" />
        </>
      ) : null}
      {id === 'blockchain' ? (
        <>
          <rect height="5.6" rx="1.3" width="5.6" x="3" y="9.2" />
          <rect height="5.6" rx="1.3" width="5.6" x="15.4" y="4.2" />
          <rect height="5.6" rx="1.3" width="5.6" x="15.4" y="14.2" />
          <path d="M8.9 11.4l6.4-3.8M8.9 12.8l6.4 3.6" />
        </>
      ) : null}
      {id === 'centre' ? (
        <>
          <circle cx="8.6" cy="8.4" r="2.7" />
          <circle cx="16.3" cy="9.5" r="2.1" />
          <path d="M3.5 18.3c0-2.9 2.3-4.7 5.1-4.7 2.9 0 5.2 1.8 5.2 4.7" />
          <path d="M15.1 13.7c2.6.1 4.4 1.8 4.4 4.6" />
        </>
      ) : null}
    </svg>
  );
}

export function HeroVisual() {
  return (
    <figure className="hv">
      <img
        alt=""
        aria-hidden
        className="hv__img"
        height={992}
        sizes="(max-width: 900px) 92vw, 620px"
        src="/hero/experience-layer-1240.webp"
        srcSet="/hero/experience-layer-820.webp 820w, /hero/experience-layer-1240.webp 1240w, /hero/experience-layer-1860.webp 1860w"
        width={1240}
      />

      {/* the three capabilities */}
      {SERVICES.map(s => {
        const p = PLACEMENT[s.id];
        return (
          <div
            className={`hv__panel hv__panel--${p.aside}`}
            /* Published so the fit can be asserted against the panel it sits
               on, not merely looked at. */
            data-box={`${p.x},${p.y},${p.w},${p.h}`}
            key={s.id}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w * FILL}%` }}
          >
            {/* NO 3D TRANSFORM ON THE LABEL, DELIBERATELY. It used to carry a
                perspective rotateX/rotateY matching the plane of its tile, on
                the theory that flat text on an angled panel reads as a sticker.
                Against this render it simply read as WONKY, and the founder's
                own reference settles it: the text in that reference is dead
                flat. Skewed type also costs legibility at the size this
                actually renders, which the scene can least afford. */}
            <Link className="hv__hit" href={s.href}>
              <Icon id={s.id} />
              <span className="hv__title">{s.title}</span>
              <span className="hv__line">{s.description}</span>
            </Link>

            {/* The supporting list, on a leader line, as in the reference.
                Decorative: every one of these words is a heading on the service
                page the panel links to, so a screen reader that follows the
                link gets them in context rather than as a loose list here. */}
            <ul aria-hidden className="hv__aside">
              {s.supporting.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        );
      })}
      {/* The centre comes LAST in the DOM, and that is deliberate. On a small
          screen the labels leave the picture and stack in document order, and
          "Experience" reads as what the three capabilities add up to - so it
          belongs after them, for a screen reader as much as for the eye. On
          desktop it is absolutely positioned, so its place here changes
          nothing visually. */}
      <div
        className="hv__centre"
        data-box={`${CENTRE_POS.x},${CENTRE_POS.y},${CENTRE_POS.w},${CENTRE_POS.w}`}
        style={{
          left: `${CENTRE_POS.x}%`,
          top: `${CENTRE_POS.y}%`,
          width: `${CENTRE_POS.w * 0.86}%`,
        }}
      >
        <Icon id="centre" />
        <span className="hv__title hv__title--centre">{CENTRE.title}</span>
        <span className="hv__line">{CENTRE.description}</span>
      </div>
    </figure>
  );
}

export default HeroVisual;
