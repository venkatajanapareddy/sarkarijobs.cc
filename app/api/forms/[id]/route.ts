import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    // Redirect to R2 URL - files are now hosted on Cloudflare R2
    const r2BaseUrl = 'https://pub-3e5281bc67d445b2b6cba74cdfca7241.r2.dev';
    
    // Most files are PDFs, but we have some JPGs and DOCX
    // For simplicity, default to PDF (can be enhanced with metadata later)
    const redirectUrl = `${r2BaseUrl}/${jobId}_form.pdf`;
    
    // Return a 301 permanent redirect to R2
    return NextResponse.redirect(redirectUrl, { status: 301 });
  } catch (error) {
    console.error('Error redirecting to form:', error);
    return NextResponse.json(
      { error: 'Failed to load application form' },
      { status: 500 }
    );
  }
}