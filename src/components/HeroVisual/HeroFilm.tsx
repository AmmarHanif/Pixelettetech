/**
 * The homepage hero visual as the founder's supplied concept film, 2026-10-02.
 *
 * SAME CONTRACT AS HeroArtwork, WHICH IT REPLACES ON THE PAGE. The film carries
 * its wording as pixels, exactly as the still did, so everything HeroArtwork
 * records about that holds here too: the words below exist for screen readers
 * and search engines, and the three tile links sit over the blocks a visitor
 * can see so the homepage keeps its three internal links. HeroArtwork stays in
 * the repo; swapping back is one line in app/page.tsx.
 *
 * PLAYBACK IS HeroVideo's, unchanged: muted, looped, inline, no audio stream,
 * and a reduced-motion preference gets the poster and never fetches the film.
 * The `wide` variant multiplies the film into the hero tint, which only works
 * on a white ground - so the supplied encode, rendered on an uneven grey-blue
 * (about rgb(213,221,230) to rgb(238,242,246)), was re-encoded with a
 * highlights-only curve that takes that ground to pure white and leaves the
 * darks and mid-tones where they were. The audio track was dropped at the same
 * time. 1.6 MB supplied, 0.58 MB served.
 *
 * THE TILE BOXES WERE MEASURED OFF THE FILM, at its own 1280x720 frame, across
 * its first and last frames: the composition drifts by about 50px over the six
 * seconds, so each box covers the block's whole travel rather than one frame.
 */

import Link from 'next/link';

import { HeroVideo } from '@/components/HeroVideo';
import { CENTRE, SERVICES } from '@/content/hero-capabilities';

/* Centre x/y and width/height of each block, as a percentage of the frame. */
const HITS: Record<string, { x: number; y: number; w: number; h: number }> = {
  engineering: { x: 13.5, y: 47, w: 22, h: 50 },
  ai: { x: 83.5, y: 27, w: 24, h: 35 },
  blockchain: { x: 84.5, y: 74.5, w: 24, h: 37 },
};

export function HeroFilm() {
  return (
    <figure className="ha ha--film">
      <HeroVideo
        height={720}
        poster="/video/home-hero-poster.webp"
        src="/video/home-hero.mp4"
        variant="wide"
        width={1280}
      />

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

export default HeroFilm;
