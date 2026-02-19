import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%)',
          borderRadius: 6,
        }}
      >
        {/* Compass diamond - EA / Insight Compass */}
        <div
          style={{
            width: 18,
            height: 18,
            background: '#f97316',
            transform: 'rotate(45deg)',
            borderRadius: 2,
            boxShadow: '0 0 0 2px rgba(148, 163, 184, 0.5)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
