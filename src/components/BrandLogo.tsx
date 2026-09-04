import { company } from '@/content/company';

/**
 * The Pixelette Technologies lockup: tree device plus wordmark.
 *
 * Two artworks, not one recoloured with a CSS filter. The colour version keeps
 * the purple canopy, crimson trunk and black wordmark the brand is drawn in;
 * the white version is the reversed lockup for the dark footer. A filter would
 * flatten the three colours into one and lose the trunk.
 *
 * Rendered as <img> rather than inline SVG on purpose: the artwork is ~24kB of
 * path data and it appears on every page twice, so inlining it would add more
 * to each HTML document than the whole rest of the page. As a file it is
 * fetched once and cached.
 *
 * The wordmark carries the company name, so the <img> alt does too — which is
 * why the header and footer no longer repeat it as text.
 */
export function BrandLogo({
  variant = 'colour',
  height = 32,
  className,
}: {
  variant?: 'colour' | 'white';
  height?: number;
  className?: string;
}) {
  // Intrinsic viewBox of both files is 187 x 52.
  const width = Math.round((height * 187) / 52);

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={variant === 'white' ? '/pixelette-logo-white.svg' : '/pixelette-logo.svg'}
      alt={company.name}
      width={width}
      height={height}
      className={className}
      style={{ width, height, display: 'block' }}
    />
  );
}
