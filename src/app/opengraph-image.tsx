import { ImageResponse } from 'next/og';

import { isPublishable } from '@/content/claims';
import { company } from '@/content/company';

/**
 * Default social card, generated at build time.
 *
 * Inherited by every route that does not set its own image, so there is no
 * binary asset to keep in step with the brand. Deliberately plain: a share card
 * is read at thumbnail size, so it carries the name, the positioning line and
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
 */
export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', width: 44, height: 44 }}>
            <div style={{ width: 20, height: 20, border: '3px solid #661a8f', borderRadius: 4 }} />
            <div
              style={{ width: 20, height: 20, border: '3px solid #C3D1DE', borderRadius: 4, marginLeft: 4 }}
            />
            <div
              style={{ width: 20, height: 20, border: '3px solid #C3D1DE', borderRadius: 4, marginTop: 4 }}
            />
            <div
              style={{
                width: 20,
                height: 20,
                background: '#661a8f',
                borderRadius: 4,
                marginTop: 4,
                marginLeft: 4,
              }}
            />
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, color: '#0A0A0A' }}>{company.name}</div>
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
