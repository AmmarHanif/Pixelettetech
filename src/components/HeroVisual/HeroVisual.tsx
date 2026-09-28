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
 * SO THE COPY IS IMPORTED, NOT RETYPED. It comes from the same `services.ts`
 * the previous WebGL hero used, so the wording cannot drift between the two and
 * there is exactly one place to change it.
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
 * every width rather than being pinned to one breakpoint. Each label carries a
 * small 3D transform matching the plane of the panel it sits on - flat text on
 * an angled panel reads as a sticker, and this is most of what sells it.
 */

import Link from 'next/link';

import { CENTRE, SERVICES } from '@/components/Hero3D/services';

/* Where each label sits, as a percentage of the rendered scene, measured off
   the image. `tilt` matches the panel's own plane. */
const PLACEMENT: Record<
  string,
  { x: number; y: number; tilt: number; aside: 'left' | 'right' }
> = {
  engineering: { x: 20.5, y: 27.5, tilt: 17, aside: 'left' },
  ai: { x: 65.4, y: 20.5, tilt: -15, aside: 'right' },
  blockchain: { x: 77.4, y: 50, tilt: -13, aside: 'right' },
};

const CENTRE_POS = { x: 46.4, y: 44.5 };

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

      {/* the centre */}
      <div
        className="hv__centre"
        style={{ left: `${CENTRE_POS.x}%`, top: `${CENTRE_POS.y}%` }}
      >
        <Icon id="centre" />
        <span className="hv__title hv__title--centre">{CENTRE.title}</span>
        <span className="hv__line">{CENTRE.description}</span>
      </div>

      {/* the three capabilities */}
      {SERVICES.map(s => {
        const p = PLACEMENT[s.id];
        return (
          <div
            className={`hv__panel hv__panel--${p.aside}`}
            key={s.id}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <Link
              className="hv__hit"
              href={s.href}
              style={{ transform: `perspective(700px) rotateY(${p.tilt}deg)` }}
            >
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
    </figure>
  );
}

export default HeroVisual;
