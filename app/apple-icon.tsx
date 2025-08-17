import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: 36,
          position: 'relative',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: 140, height: 140 }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle cx="50" cy="50" r="48" fill="#EFF6FF" />
          
          {/* Base Platform */}
          <rect x="15" y="75" width="70" height="5" fill="#2563EB" />
          
          {/* Steps */}
          <rect x="20" y="72" width="60" height="3" fill="#2563EB" />
          
          {/* Main Building Body */}
          <rect x="25" y="45" width="50" height="27" fill="#2563EB" />
          
          {/* Pillars */}
          <rect x="28" y="50" width="4" height="22" fill="#1E40AF" />
          <rect x="38" y="50" width="4" height="22" fill="#1E40AF" />
          <rect x="48" y="50" width="4" height="22" fill="#1E40AF" />
          <rect x="58" y="50" width="4" height="22" fill="#1E40AF" />
          <rect x="68" y="50" width="4" height="22" fill="#1E40AF" />
          
          {/* Dome */}
          <path d="M 30 45 Q 50 25, 70 45" fill="#2563EB" />
          
          {/* Dome Top Circle */}
          <circle cx="50" cy="30" r="3" fill="#2563EB" />
          
          {/* Flag Pole */}
          <rect x="49" y="20" width="2" height="10" fill="#2563EB" />
          
          {/* Indian Flag (Tricolor) */}
          <rect x="51" y="20" width="12" height="2" fill="#FF9933" />
          <rect x="51" y="22" width="12" height="2" fill="white" />
          <rect x="51" y="24" width="12" height="2" fill="#138808" />
          
          {/* Ashoka Chakra in the white band */}
          <circle cx="57" cy="23" r="1" fill="none" stroke="#000080" strokeWidth="0.2" />
          {/* Tiny spokes for the chakra */}
          <line x1="57" y1="23" x2="57.8" y2="23" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="56.2" y2="23" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="57" y2="23.8" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="57" y2="22.2" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="57.6" y2="23.6" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="56.4" y2="22.4" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="57.6" y2="22.4" stroke="#000080" strokeWidth="0.1" />
          <line x1="57" y1="23" x2="56.4" y2="23.6" stroke="#000080" strokeWidth="0.1" />
          
          {/* Central Door */}
          <rect x="45" y="55" width="10" height="12" fill="white" />
          
          {/* Side Windows */}
          <rect x="33" y="57" width="6" height="6" fill="white" />
          <rect x="61" y="57" width="6" height="6" fill="white" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}