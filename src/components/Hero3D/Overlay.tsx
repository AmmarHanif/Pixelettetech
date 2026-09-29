'use client';

/**
 * The DOM layer: every word in the scene, and every interactive target.
 *
 * WHY THE TEXT IS NOT IN WEBGL. Rendered into a canvas, these labels would be
 * blurry at this size, unselectable, invisible to a screen reader and to a
 * translator, absent from the page source, and gone entirely if the context
 * fails. As DOM they are none of those things. The brief asks for HTML overlays
 * over heavy 3D text and says not to put essential copy exclusively inside
 * WebGL; this is both.
 *
 * AND WHY THE LINKS ARE THE HOVER TARGET. Making the anchor the thing you point
 * at buys keyboard focus, a real destination, middle-click, and screen-reader
 * navigation for nothing. Hover on a mesh would have needed all four rebuilt.
 *
 * POSITIONS ARE WRITTEN, NOT RENDERED. Each frame the scene projects its
 * objects and leaves the screen coordinates in a shared ref; this reads them
 * and writes transforms straight onto the elements. React renders this tree
 * when the active card changes and at no other time - not sixty times a second
 * while the scene breathes.
 *
 * IT SURVIVES WITHOUT THE CANVAS. Nothing here depends on the 3D scene
 * existing. With no WebGL the same markup renders in a plain stacked layout,
 * which is the fallback rather than a second implementation of it.
 */

import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { CENTRE, SERVICES } from '@/content/hero-capabilities';
import type { AnchorMap } from './useHeroInteraction';

export function Overlay({
  anchors,
  active,
  setActive,
  live,
}: {
  anchors: AnchorMap;
  active: string | null;
  setActive: (id: string | null) => void;
  /** False when there is no canvas behind this, so it lays itself out. */
  live: boolean;
}) {
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!live) return undefined;
    let raf = 0;
    const tick = () => {
      for (const [id, el] of Object.entries(refs.current)) {
        if (!el) continue;
        const a = anchors.current[id];
        if (!a) continue;
        el.style.transform = `translate3d(${a.x}px, ${a.y}px, 0) translate(-50%, -50%)`;
        el.style.opacity = a.visible ? '1' : '0';
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [anchors, live]);

  return (
    <div className={`h3-overlay${live ? ' h3-overlay--live' : ''}`}>
      {/* the centre */}
      <div
        className="h3-centre"
        ref={el => {
          refs.current.centre = el;
        }}
      >
        <svg aria-hidden className="h3-icon h3-icon--centre" viewBox="0 0 24 24">
          <circle cx="8.6" cy="8.4" r="2.7" />
          <circle cx="16.3" cy="9.5" r="2.1" />
          <path d="M3.5 18.3c0-2.9 2.3-4.7 5.1-4.7 2.9 0 5.2 1.8 5.2 4.7" />
          <path d="M15.1 13.7c2.6.1 4.4 1.8 4.4 4.6" />
        </svg>
        <span className="h3-centre__title">{CENTRE.title}</span>
        <span className="h3-centre__line">{CENTRE.description}</span>
      </div>

      {/* the three capabilities */}
      {SERVICES.map(s => (
        <div
          className={`h3-card h3-card--${s.side}${active === s.id ? ' is-active' : ''}`}
          key={s.id}
          ref={el => {
            refs.current[s.id] = el;
          }}
        >
          <Link
            className="h3-card__hit"
            href={s.href}
            onBlur={() => setActive(null)}
            onFocus={() => setActive(s.id)}
            onPointerEnter={() => setActive(s.id)}
            onPointerLeave={() => setActive(null)}
          >
            <svg aria-hidden className="h3-icon" viewBox="0 0 24 24">
              {s.id === 'engineering' ? (
                <>
                  <path d="M9 6 4 12l5 6" />
                  <path d="M15 6l5 6-5 6" />
                  <circle cx="12" cy="12" r="1.4" />
                </>
              ) : null}
              {s.id === 'ai' ? (
                <>
                  <path d="M4 7h6M4 12h9M4 17h6" />
                  <path d="M13 12h4.6" />
                  <circle cx="19.2" cy="12" r="1.5" />
                </>
              ) : null}
              {s.id === 'blockchain' ? (
                <>
                  <rect height="5.6" rx="1.3" width="5.6" x="3" y="9.2" />
                  <rect height="5.6" rx="1.3" width="5.6" x="15.4" y="4.2" />
                  <rect height="5.6" rx="1.3" width="5.6" x="15.4" y="14.2" />
                  <path d="M8.9 11.4l6.4-3.8M8.9 12.8l6.4 3.6" />
                </>
              ) : null}
            </svg>
            <span className="h3-card__title">{s.title}</span>
            <span className="h3-card__line">{s.description}</span>
          </Link>

          {/* The supporting list, as in the reference: a thin leader and a
              short column. Hidden on small screens, where it would crowd. */}
          <ul aria-hidden className="h3-card__aside">
            {s.supporting.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
