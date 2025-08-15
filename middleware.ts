import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Check if this is an old-style job URL (UUID only)
  const oldJobUrlPattern = /^\/jobs\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i
  const match = pathname.match(oldJobUrlPattern)
  
  if (match) {
    // This is an old URL with just the UUID
    // We can't generate the full slug without the job data, 
    // but we can redirect to a special handler that will do a proper redirect
    const jobId = match[1]
    
    // For now, we'll just accept both formats
    // The page component will handle extracting the ID from either format
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/jobs/:path*'
}