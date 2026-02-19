import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          borderRadius: 36,
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            background: '#f97316',
            transform: 'rotate(45deg)',
            borderRadius: 12,
            boxShadow: '0 0 0 6px rgba(148, 163, 184, 0.4)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
