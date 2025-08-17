import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#EFF6FF',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Simplified government building for favicon */}
        <svg
          viewBox="0 0 32 32"
          style={{ width: 32, height: 32 }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle cx="16" cy="16" r="15" fill="#EFF6FF" />
          
          {/* Base Platform */}
          <rect x="4" y="24" width="24" height="2" fill="#2563EB" />
          
          {/* Main Building */}
          <rect x="7" y="14" width="18" height="10" fill="#2563EB" />
          
          {/* Dome */}
          <path d="M 8 14 Q 16 6, 24 14" fill="#2563EB" />
          
          {/* Dome Top */}
          <circle cx="16" cy="9" r="1.5" fill="#2563EB" />
          
          {/* Flag Pole */}
          <rect x="15.5" y="5" width="1" height="4" fill="#2563EB" />
          
          {/* Indian Flag - Simplified */}
          <rect x="16.5" y="5" width="5" height="0.8" fill="#FF9933" />
          <rect x="16.5" y="5.8" width="5" height="0.8" fill="white" />
          <rect x="16.5" y="6.6" width="5" height="0.8" fill="#138808" />
          
          {/* Tiny Ashoka Chakra */}
          <circle cx="19" cy="6.2" r="0.3" fill="none" stroke="#000080" strokeWidth="0.1" />
          
          {/* Central Door */}
          <rect x="13" y="18" width="6" height="6" fill="white" />
          
          {/* Pillars */}
          <rect x="9" y="16" width="1.5" height="8" fill="#1E40AF" />
          <rect x="14.25" y="16" width="1.5" height="8" fill="#1E40AF" />
          <rect x="16.25" y="16" width="1.5" height="8" fill="#1E40AF" />
          <rect x="21.5" y="16" width="1.5" height="8" fill="#1E40AF" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}