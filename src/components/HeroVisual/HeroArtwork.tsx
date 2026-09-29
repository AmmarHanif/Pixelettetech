/**
 * The homepage hero visual, as the founder's supplied artwork.
 *
 * HOW THIS DIFFERS FROM HeroVisual, WHICH IS STILL IN THE REPO. That one renders
 * a BLANK scene and puts every word over it as live markup. This one uses
 * artwork that already CARRIES its wording as pixels, so the words here exist
 * only for machines - and that difference has a measured cost, recorded below
 * rather than discovered later.
 *
 * THE COST, MEASURED RATHER THAN ASSERTED. The artwork is 1774px wide and its
 * supporting lines are set at about 23px. On screen the text scales with the
 * figure: at a 773px figure it reaches 10px, at the current 62.5% column it is
 * 9.4px, and in a 50/50 split it is 7.5px. Pixels cannot resize, so this is a
 * property of the artwork and the column width, not something CSS can fix.
 *
 * THE WORDING IS STILL HERE, FOR SCREEN READERS AND SEARCH ENGINES. A picture
 * of text is not text: it is not read aloud, not indexed, not translated, not
 * selectable and not searchable. The block below carries the same eleven strings
 * from the same single source of truth the other component uses, positioned off
 * screen with the clip-rect pattern rather than `display: none`, which would
 * remove it from the accessibility tree and defeat the point.
 *
 * THE THREE SERVICE LINKS SURVIVE. Their boxes were measured off the artwork and
 * they sit over the tiles a visitor can see, so clicking the Engineering tile
 * still reaches the Engineering page. Losing them would have quietly cost the
 * homepage three internal links.
 *
 * THE ARTWORK IS CUT OUT, NOT PASTED ON WHITE. The hero band is a radial
 * gradient that measures rgb(248,243,251) behind the figure, so the supplied
 * opaque white version would have shown as a visible white rectangle against it.
 */

import Link from 'next/link';

import { CENTRE, SERVICES } from '@/content/hero-capabilities';

/* MEASURED OFF THE SUPPLIED ARTWORK with a percentage grid laid over it at its
   own aspect, so these are the same percentages the browser applies. Centre
   x/y and width/height of each tile's glass face, as a percentage of the
   figure. */
const HITS: Record<string, { x: number; y: number; w: number; h: number }> = {
  engineering: { x: 24.5, y: 30, w: 17, h: 40 },
  ai: { x: 69.5, y: 17, w: 19, h: 30 },
  blockchain: { x: 76.5, y: 59, w: 19, h: 34 },
};

export function HeroArtwork() {
  return (
    <figure className="ha">
      <img
        alt=""
        aria-hidden
        className="ha__img"
        height={887}
        sizes="(max-width: 900px) 92vw, 50vw"
        src="/hero/hero-artwork-1240.webp"
        srcSet="/hero/hero-artwork-820.webp 820w, /hero/hero-artwork-1240.webp 1240w, /hero/hero-artwork-1774.webp 1774w"
        width={1774}
      />

      {/* Real links over the tiles a visitor can see. They carry no visible text
          of their own - the artwork supplies that - so each needs an accessible
          name, which is what the span provides. */}
      {SERVICES.map(s => {
        const h = HITS[s.id];
        return (
          <Link
            className="ha__hit"
            href={s.href}
            key={s.id}
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
          >
            <span className="ha__sr">{s.title}</span>
          </Link>
        );
      })}

      {/* The hero's argument, for anything that cannot see the picture. Ordered
          as the eye reads it: the three capabilities, then what they add up to. */}
      <div className="ha__sr">
        {SERVICES.map(s => (
          <p key={s.id}>
            {s.title}. {s.description} {s.supporting.join('. ')}.
          </p>
        ))}
        <p>
          {CENTRE.title}. {CENTRE.description}
        </p>
      </div>
    </figure>
  );
}

export default HeroArtwork;
