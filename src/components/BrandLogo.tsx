import { company } from '@/content/company';

/** Intrinsic size of both lockup files, in pixels. */
const ARTWORK_WIDTH = 691;
const ARTWORK_HEIGHT = 240;

/**
 * The Pixelette Technologies lockup: tree device plus wordmark.
 *
 * Two artworks, not one recoloured with a CSS filter. The colour version keeps
 * the purple canopy and slate wordmark the brand is drawn in; the white version
 * is the reversed lockup for the dark footer, and is the same artwork's alpha
 * filled white — tree included, which is how the previous reversed lockup was
 * drawn too. A CSS filter could not produce it, because it would have to flatten
 * the purple and the slate into one value and would take the page background
 * with it.
 *
 * SIZED FROM THE ARTWORK, NOT FROM A CONSTANT. The width is derived from the
 * file's own intrinsic size above. The earlier lockup was 187 x 52 (aspect
 * 3.596) and this one is 691 x 240 (aspect 2.879), so a hardcoded ratio left
 * over from the old artwork would stretch this one horizontally by about 25%.
 *
 * WHY THE CALLERS ASK FOR A LARGER HEIGHT THAN THEY USED TO. A reader registers
 * the wordmark's cap height, not the box. Rendered at a common 240px box, this
 * lockup's cap height is 87px against the old lockup's 98px, because its tree
 * device is proportionally taller. Matching the old optical weight therefore
 * needs 1.126x the box height — 36px in the header where the old one used 32,
 * 38px in the footer against 34. Those numbers are measured, not guessed.
 *
 * Rendered as <img> rather than inline: it appears on every page twice, so as a
 * file it is fetched once and cached instead of being repeated in every HTML
 * document.
 *
 * The wordmark carries the company name, so the <img> alt does too — which is
 * why the header and footer do not repeat it as text.
 */
export function BrandLogo({
  variant = 'colour',
  height = 36,
  className,
}: {
  variant?: 'colour' | 'white';
  height?: number;
  className?: string;
}) {
  const width = Math.round((height * ARTWORK_WIDTH) / ARTWORK_HEIGHT);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={variant === 'white' ? '/pixelette-logo-white.png' : '/pixelette-logo.png'}
      alt={company.name}
      width={width}
      height={height}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
}
