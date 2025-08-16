import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'SarkariJobs.cc - Latest Government Jobs in India';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 'bold', marginBottom: 20 }}>
          SarkariJobs.cc
        </div>
        <div style={{ fontSize: 40, opacity: 0.9 }}>
          Latest Government Jobs in India
        </div>
        <div style={{ fontSize: 30, marginTop: 30, opacity: 0.8 }}>
          UPSC • SSC • Railway • Banking • Defense
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}