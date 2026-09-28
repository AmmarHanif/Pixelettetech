/**
 * The homepage hero: the founder's approved render, with the machine-readable
 * layer kept alive over it.
 *
 * THE WORDING IS NOW INSIDE THE PICTURE. The founder supplied this artwork with
 * every title, line, icon, leader line and supporting list already rendered
 * into it, and chose it over the version that drew those in HTML. That is his
 * call and this component does not second-guess it - but pixels are invisible
 * to a search engine, silent to a screen reader, and untranslatable, so the
 * things that can still be saved are saved here:
 *
 *   - THE THREE PANELS ARE REAL LINKS. Transparent anchors are positioned over
 *     them, so /engineering, /ai-automation and /blockchain are reachable by
 *     mouse, by keyboard and by a screen reader, and each has a visible focus
 *     ring. Without these the panels would be decoration that merely looks
 *     clickable.
 *   - THE COPY IS STILL IN THE DOCUMENT, visually hidden. Google indexes it,
 *     a screen reader reads it, and it is the same text the picture shows.
 *
 * WHAT IS GENUINELY LOST, and is not recoverable this way: the visible words
 * cannot be translated, and changing one means a new render. Recorded in
 * ADR-0053 rather than left to be discovered.
 *
 * THE IMAGE IS aria-hidden AND alt="", which is correct rather than lazy: the
 * hidden text below carries its meaning in full, so describing it again would
 * make a screen reader announce the hero twice.
 *
 * NO JAVASCRIPT. A server component - an image, three links and some text.
 */

import Link from 'next/link';

import { CENTRE, SERVICES } from '@/content/hero-capabilities';

/* Where each panel sits in the artwork, as a percentage of the image: centre
   x/y and width/height. Measured off the render, and used only to place the
   invisible hit areas - so they cover the glass a visitor is aiming at rather
   than a rectangle guessed around it. */
const HITS: Record<string, { x: number; y: number; w: number; h: number }> = {
  engineering: { x: 25.2, y: 30.4, w: 18.5, h: 31 },
  ai: { x: 65.5, y: 16.6, w: 21, h: 31 },
  blockchain: { x: 76.1, y: 58.1, w: 20, h: 32.5 },
};

export function HeroVisual() {
  return (
    <figure className="hv">
      <img
        alt=""
        aria-hidden
        className="hv__img"
        height={887}
        sizes="(max-width: 900px) 94vw, 720px"
        src="/hero/experience-layer-1240.webp"
        srcSet="/hero/experience-layer-820.webp 820w, /hero/experience-layer-1240.webp 1240w, /hero/experience-layer-1860.webp 1774w"
        width={1774}
      />

      {/* The same words the picture shows, kept in the document for search
          engines and screen readers. Visually hidden, never display:none -
          display:none would remove it from the accessibility tree too, which
          would defeat the entire point of having it. */}
      <div className="hv__sr">
        <p>
          {CENTRE.title}: {CENTRE.description}.
        </p>
        <ul>
          {SERVICES.map(s => (
            <li key={s.id}>
              {s.title}: {s.description}. {s.supporting.join(', ')}.
            </li>
          ))}
        </ul>
      </div>

      {/* Transparent hit areas over the three panels. The label is on the link
          itself, because the link has no visible text of its own. */}
      {SERVICES.map(s => {
        const h = HITS[s.id];
        return (
          <Link
            aria-label={`${s.title} — ${s.description}`}
            className="hv__hit"
            href={s.href}
            key={s.id}
            style={{
              left: `${h.x}%`,
              top: `${h.y}%`,
              width: `${h.w}%`,
              height: `${h.h}%`,
            }}
          />
        );
      })}
    </figure>
  );
}

export default HeroVisual;
