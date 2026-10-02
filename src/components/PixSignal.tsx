import type { CSSProperties } from 'react';

/**
 * Pix T's "Signal" ball: the launcher, and the small mark in the panel header.
 *
 * THE DIRECTION IS THE FOUNDER'S, 2026-10-02: the Signal concept from the
 * "Pix T - four visual directions" board (a focused intelligence core), with
 * small pixels in the Pixelette palette flowing inside it, and the interaction
 * table that goes with it:
 *
 *   idle        a very subtle breathing glow                      .sig__glow
 *   approach    one light trace moves around the edge             .sig__trace
 *   hover       the symbol gently shifts and awakens              .sig__mark
 *   click       the core expands into the chat (in globals.css)   .asst-panel
 *   thinking    small points travel around the perimeter          .sig__orbit
 *   responding  a soft pulse through the central symbol           .sig__mark
 *   finished    one tiny flash, then it settles                   .sig__flash
 *
 * THE CENTRAL SYMBOL IS THE PIXELETTE TREE, not the "P" drawn on the board.
 * The launcher has carried the tree since the founder chose a mark over the
 * words "Ask Pix T", and the tree is itself drawn in pixels, so the pixels
 * flowing round it read as part of the same mark rather than as decoration.
 *
 * EVERY COLOUR IS ONE THE SITE ALREADY HAS. The sphere runs from the brand
 * purple to the dark band (--dark, --dark-2); the highlight is the brand mixed
 * 60/40 with --mint; the pixels are --mint, --brand-tint, white, the brand
 * purple and the logo's one crimson pixel. That crimson is written as the
 * logo's own hex rather than as var(--amber-ink), because the token means
 * CAUTION on this site and this is not a warning.
 *
 * PURELY DECORATIVE. It is aria-hidden; the button that holds it carries the
 * accessible name, and thinking is also exposed as aria-busy on the chat log.
 * Under prefers-reduced-motion every animation is removed and the pixels rest
 * where they are drawn (see pixsignal.css).
 */

export type PixPhase = 'idle' | 'thinking' | 'responding' | 'finished';

/* Each pixel: start angle (deg), orbit radius and size as fractions of the
   ball, loop length (s), offset into the loop (s, negative so they are already
   moving on first paint), and colour. Radii stay inside 0.38 so a pixel never
   reaches the rim, where it would be clipped mid-square.
   `e` marks the two brand-purple pixels: on a sphere that is itself brand
   purple they vanished, so they carry a light edge and read as darker squares
   in the current rather than as holes in it. */
const PIXELS: { a: number; r: number; s: number; d: number; o: number; c: string; e?: true }[] = [
  { a: 0, r: 0.34, s: 0.075, d: 9.5, o: -1.2, c: 'var(--mint)' },
  { a: 32, r: 0.22, s: 0.06, d: 7.2, o: -4.1, c: '#ffffff' },
  { a: 68, r: 0.3, s: 0.085, d: 11.8, o: -7.4, c: 'var(--brand-tint)' },
  { a: 104, r: 0.16, s: 0.055, d: 6.4, o: -2.6, c: 'var(--mint)' },
  { a: 140, r: 0.36, s: 0.065, d: 12.6, o: -9.9, c: '#b3063c' },
  { a: 176, r: 0.26, s: 0.07, d: 8.3, o: -5.5, c: '#ffffff' },
  { a: 212, r: 0.33, s: 0.08, d: 10.4, o: -3.3, c: 'var(--brand)', e: true },
  { a: 248, r: 0.2, s: 0.05, d: 7.7, o: -6.8, c: 'var(--brand-tint)' },
  { a: 284, r: 0.29, s: 0.065, d: 9.1, o: -0.4, c: 'var(--mint)' },
  { a: 320, r: 0.37, s: 0.055, d: 13.2, o: -11.3, c: '#ffffff' },
  { a: 350, r: 0.13, s: 0.05, d: 5.9, o: -3.9, c: 'var(--mint)' },
  { a: 196, r: 0.24, s: 0.06, d: 8.8, o: -8.2, c: 'var(--brand)', e: true },
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
        <span className="sig__flow">
          {PIXELS.map((p, i) => (
            <i
              data-edge={p.e ? '' : undefined}
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
          so the flash is made of the same squares as the mark. */}
      <span className="sig__flash">
        <i />
      </span>
      <img alt="" className="sig__mark" draggable={false} src="/pixelette-mark-white.svg" />
    </span>
  );
}

export default PixSignal;
