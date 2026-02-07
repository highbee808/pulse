import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Pulse - Freelancer Revenue Intelligence';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5F2EA',
          position: 'relative',
        }}
      >
        {/* Edge lines */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Salmon accent dot */}
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#FF9678',
              marginBottom: 8,
              display: 'flex',
            }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: 80,
              fontFamily: 'Georgia, serif',
              color: '#2A2A28',
              letterSpacing: -2,
              display: 'flex',
            }}
          >
            Pulse
          </div>

          {/* Divider */}
          <div
            style={{
              width: 60,
              height: 1,
              backgroundColor: 'rgba(0,0,0,0.15)',
              margin: '8px 0',
              display: 'flex',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              fontSize: 24,
              color: 'rgba(42,42,40,0.5)',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              display: 'flex',
            }}
          >
            Freelancer Revenue Intelligence
          </div>
        </div>

        {/* Bottom pill */}
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: 100,
            fontSize: 14,
            color: 'rgba(42,42,40,0.6)',
            border: '1px solid rgba(0,0,0,0.08)',
          }}
        >
          Track every dollar. Predict your income.
        </div>
      </div>
    ),
    { ...size }
  );
}
