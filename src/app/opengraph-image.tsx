import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { isPublishable } from '@/content/claims';
import { company } from '@/content/company';

/**
 * Default social card, generated at build time.
 *
 * Inherited by every route that does not set its own image, so there is no
 * binary asset to keep in step with the brand. Deliberately plain: a share card
 * is read at thumbnail size, so it carries the mark, the positioning line and
 * the year the company was incorporated, and nothing else.
 *
 * ---------------------------------------------------------------------------
 * 2026-09-08 (WP13). The bottom row used to end "ISO 9001 · ISO 27001 · Cyber
 * Essentials Plus", three hardcoded strings with no register behind them. This
 * is the DEFAULT card — `pageMetadata` in src/lib/seo.ts points every page at
 * `/opengraph-image` — so that row was the badge wall on every LinkedIn, Slack,
 * X and iMessage share of this site, while public/llms.txt states that no
 * certification badge is published by Pixelette Technologies and
 * `iso-cyber-essentials-badges` sits HELD in src/content/claims.ts for want of
 * a current certificate for the exact legal entity, scope and validity. The
 * badge wall was taken off the header, the footer and the pages during the day;
 * it survived here because an image generator is not page copy and no copy
 * sweep greps it.
 *
 * It is now GATED on the register rather than deleted, so the row returns of
 * its own accord the day that claim moves to VERIFIED. One caveat worth
 * knowing: this file runs at build time, so a released claim reaches the card
 * on the next build rather than the next request.
 *
 * Layout. The card is a fixed 1200x630 column with `justify-content:
 * space-between` and exactly three children: the logo lockup, the three-line
 * headline, and this footer row. The badges sat INSIDE the third child, which
 * is a single-line flex row, so dropping them changes that row's width and not
 * its height — the three blocks keep the heights they had, space-between
 * distributes the same free space, and the composition stays as designed with
 * nothing to re-balance. The separator travels with the badges inside one
 * nested flex row (nested rather than a fragment because Satori, which renders
 * this, needs an explicit `display: flex` on any element with several
 * children), so the closed state can never leave an orphan "·" or a trailing
 * gap.
 * ---------------------------------------------------------------------------
 * 2026-09-08 (WP16). The first child used to be four CSS `div`s, two pale
 * outlined squares, one purple outlined and one solid purple, beside the
 * company name set as text. That device is not Pixelette's mark and appears in
 * no brand file. The real mark, in public/pixelette-logo.svg, is a TREE: a
 * canopy of 19 detached purple (#661a8f) squares over a crimson (#b3063c)
 * trunk and base bar, beside the "PIXELETTE / Technologies" wordmark. Because
 * seo.ts aims every page's OpenGraph and Twitter card at this one image, an
 * invented device was the brand on every share of this site.
 *
 * It is now the artwork itself. Satori resolves `data:` URIs and absolute web
 * URLs only (a relative path throws "Image source must be an absolute URL"),
 * and an absolute one cannot be fetched at build time while the site is
 * unpublished, so the file is read off disk and base64'd into a data URI at
 * module scope, once per build. The SVG is used rather than the 1024px PNG
 * beside it, because that PNG is drawn on an opaque white ground: it exists to
 * be `Organization.logo`, and a raster logo wants the ground the colour artwork
 * is designed for. A white rectangle on this lilac gradient would be a visible
 * patch. The SVG carries no ground, and its `viewBox="-1 4 187 52"` supplies
 * the aspect LOGO_WIDTH is derived from rather than eyeballed.
 *
 * The name text went with the device: the artwork already sets it in the
 * brand's own type, so keeping the 30px string would have said it twice.
 *
 * Layout consequence, which has to be worked out rather than assumed, because
 * `space-between` redistributes whatever the first child gains. Content box:
 * 630 - 2*72 = 486px. The children measure 80 (lockup) + 3 * 62 * 1.1
 * (headline) + 21 * 1.2 (footer) = 309.8px, leaving 176.2px free and 88.1px in
 * each of the two gaps, against 106.1px when the first child was 44px tall.
 * Under space-between the first and last children stay pinned to the padding
 * edges, so ONLY the headline moves: down by 18px. Measured on the built PNG,
 * the headline's first line sits at y=250 where it sat at y=232, and the footer
 * is unmoved at y 535..555. The lockup's ink occupies y 73..150 and x 81..365,
 * inside its 72..152 box, so nothing overlaps and the column has 176px of slack
 * before anything could clip.
 *
 * The 80px height was chosen by building both 64 and 80 and looking at them:
 * at 64 the mark reads as timid against a 62px headline. It is also 2.5x the
 * 32px default the site header uses, and the width is derived from the viewBox
 * by the same rule as src/components/BrandLogo.tsx, so the lockup is never
 * stretched and never disagrees with the header.
 */
export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Read at module scope so the file system is touched once per build rather than
 * once per card. `process.cwd()` is the project root during `next build`, which
 * is the only time this runs.
 */
const LOGO_DATA_URI = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public', 'pixelette-logo.svg'),
).toString('base64')}`;

/** Settled by looking at two real builds; see the layout note above. */
const LOGO_HEIGHT = 80;
/** Same derivation as BrandLogo: the artwork's own viewBox is 187 x 52. */
const LOGO_WIDTH = Math.round((LOGO_HEIGHT * 187) / 52);

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(150deg, #FFFFFF 0%, #eadcf2 100%)',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori draws
              this, not a browser; next/image cannot exist in an ImageResponse. */}
          <img src={LOGO_DATA_URI} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt={company.name} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 62, lineHeight: 1.1, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Engineering that ships.
          </div>
          <div style={{ fontSize: 62, lineHeight: 1.1, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Chains that hold.
          </div>
          <div style={{ fontSize: 62, lineHeight: 1.1, color: '#661a8f', letterSpacing: '-0.02em' }}>
            AI built into both.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 21, color: '#414D5C' }}>
          <span>UK software engineering since {company.incorporated}</span>
          {isPublishable('iso-cyber-essentials-badges') ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#C3D1DE' }}>·</span>
              <span>ISO 9001</span>
              <span style={{ color: '#C3D1DE' }}>·</span>
              <span>ISO 27001</span>
              <span style={{ color: '#C3D1DE' }}>·</span>
              <span>Cyber Essentials Plus</span>
            </div>
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
