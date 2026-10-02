import type { CSSProperties } from 'react';

/**
 * Pix T's "Signal" ball: the launcher, and the small mark in the panel header.
 *
 * THE DIRECTION IS THE FOUNDER'S, 2026-10-02: the Signal concept from the
 * "Pix T - four visual directions" board (a focused intelligence core), with
 * small pixels flowing inside it, and the interaction table that goes with it:
 *
 *   idle        a very subtle breathing glow                      .sig__glow
 *   approach    one light trace moves around the edge             .sig__trace
 *   hover       the core gently shifts and awakens                .sig__core
 *   click       the core expands into the chat (in globals.css)   .asst-panel
 *   thinking    small points travel around the perimeter          .sig__orbit
 *   responding  a soft pulse through the centre                   .sig__core
 *   finished    one tiny flash, then it settles                   .sig__flash
 *
 * REVISED THE SAME DAY on the founder's review of the first build: "Remove tree
 * inside. Background make it more lighter #661A8E so the pixels are more clear
 * and distinct. Color of the pixels white and Dark purple." So:
 *   - there is no symbol in the ball. The pixels ARE the mark. Hover and the
 *     responding pulse, which the table attaches to "the Pix T symbol", act on
 *     a soft light at the centre of the current instead (`.sig__core`).
 *   - the sphere is #661A8E, his value, lit a little lighter at the top left
 *     and only a little darker at the rim, so it stays a light purple rather
 *     than fading to the dark band.
 *   - the pixels are white and the site's dark purple (--dark, #27033b) and
 *     nothing else: one reads light on the sphere, the other dark, so every
 *     square is distinct from the ground it moves over.
 *
 * PURELY DECORATIVE. It is aria-hidden; the button that holds it carries the
 * accessible name, and thinking is also exposed as aria-busy on the chat log.
 * Under prefers-reduced-motion every animation is removed and the pixels rest
 * where they are drawn (see pixsignal.css).
 */

export type PixPhase = 'idle' | 'thinking' | 'responding' | 'finished';

const WHITE = '#ffffff';
const DARK = 'var(--dark)';

/* Each pixel: start angle (deg), orbit radius and size as fractions of the
   ball, loop length (s), offset into the loop (s, negative so they are already
   moving on first paint), and colour. With no symbol in the middle the current
   can use the whole ball, so radii run from near the centre out to 0.38, which
   keeps every square clear of the rim where it would be clipped. White and
   dark alternate round the ball so neither colour clumps. */
const PIXELS: { a: number; r: number; s: number; d: number; o: number; c: string }[] = [
  { a: 0, r: 0.34, s: 0.075, d: 9.5, o: -1.2, c: WHITE },
  { a: 24, r: 0.12, s: 0.06, d: 6.1, o: -3.0, c: DARK },
  { a: 52, r: 0.27, s: 0.08, d: 11.8, o: -7.4, c: WHITE },
  { a: 80, r: 0.37, s: 0.06, d: 12.9, o: -2.2, c: DARK },
  { a: 108, r: 0.19, s: 0.065, d: 7.4, o: -5.1, c: WHITE },
  { a: 136, r: 0.31, s: 0.07, d: 10.2, o: -9.6, c: DARK },
  { a: 164, r: 0.06, s: 0.055, d: 5.4, o: -1.9, c: WHITE },
  { a: 192, r: 0.24, s: 0.075, d: 8.8, o: -6.3, c: DARK },
  { a: 220, r: 0.36, s: 0.065, d: 13.4, o: -11.1, c: WHITE },
  { a: 248, r: 0.15, s: 0.06, d: 6.8, o: -4.4, c: DARK },
  { a: 276, r: 0.29, s: 0.07, d: 9.9, o: -0.6, c: WHITE },
  { a: 304, r: 0.35, s: 0.08, d: 12.2, o: -8.7, c: DARK },
  { a: 332, r: 0.21, s: 0.055, d: 7.9, o: -3.6, c: WHITE },
  { a: 350, r: 0.1, s: 0.05, d: 5.9, o: -2.8, c: DARK },
];

export function PixSignal({
  phase = 'idle',
  near = false,
  size = 'lg',
}: {
  phase?: PixPhase;
  /** The pointer has come close: play the edge trace once. */
  near?: boolean;
  /** `lg` is the 56px launcher, `sm` the 40px mark in the panel header. */
  size?: 'lg' | 'sm';
}) {
  return (
    <span
      aria-hidden
      className={`sig sig--${size}`}
      data-near={near ? 'true' : undefined}
      data-phase={phase}
    >
      <span className="sig__glow" />
      <span className="sig__body">
        <span className="sig__core" />
        <span className="sig__flow">
          {PIXELS.map((p, i) => (
            <i
              key={i}
              style={
                {
                  '--a': `${p.a}deg`,
                  '--r': p.r,
                  '--s': p.s,
                  '--d': `${p.d}s`,
                  '--o': `${p.o}s`,
                  '--c': p.c,
                } as CSSProperties
              }
            />
          ))}
        </span>
        <span className="sig__sheen" />
      </span>
      <span className="sig__trace" />
      <span className="sig__orbit">
        <i />
        <i />
        <i />
      </span>
      {/* Finished: a burst of eight pixels from the centre, not a soft glow,
          so the flash is made of the same squares as the current. */}
      <span className="sig__flash">
        <i />
      </span>
    </span>
  );
}

export default PixSignal;
