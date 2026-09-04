import { ImageResponse } from 'next/og';

import { company } from '@/content/company';

/**
 * Default social card, generated at build time.
 *
 * Inherited by every route that does not set its own image, so there is no
 * binary asset to keep in step with the brand. Deliberately plain: a share card
 * is read at thumbnail size, so it carries the name, the positioning line and
 * the certifications, and nothing else.
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
          <span style={{ color: '#C3D1DE' }}>·</span>
          <span>ISO 9001</span>
          <span style={{ color: '#C3D1DE' }}>·</span>
          <span>ISO 27001</span>
          <span style={{ color: '#C3D1DE' }}>·</span>
          <span>Cyber Essentials Plus</span>
        </div>
      </div>
    ),
    size,
  );
}
