import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    
    // Redirect to R2 URL - files are now hosted on Cloudflare R2
    const r2BaseUrl = 'https://pub-3e5281bc67d445b2b6cba74cdfca7241.r2.dev';
    
    // Check which extension exists in R2 (order by most common)
    const extensions = ['.pdf', '.jpg', '.jpeg', '.docx', '.doc', '.png'];
    
    // First, try to check the job data for the actual extension
    try {
      const jobFilePath = path.join(process.cwd(), 'public', 'data', 'jobs', `job_${jobId}.json`);
      const jobData = JSON.parse(await fs.readFile(jobFilePath, 'utf8'));
      
      // If we have an R2 URL stored, use it directly
      if (jobData.links?.applicationFormR2) {
        return NextResponse.redirect(jobData.links.applicationFormR2, { status: 301 });
      }
      
      // If we have a local path, extract the extension
      if (jobData.links?.applicationFormLocal) {
        const localPath = jobData.links.applicationFormLocal;
        const ext = path.extname(localPath);
        if (ext) {
          const redirectUrl = `${r2BaseUrl}/${jobId}_form${ext}`;
          return NextResponse.redirect(redirectUrl, { status: 301 });
        }
      }
    } catch (e) {
      // Job file not found or error reading, fall back to default
      console.log(`Could not read job data for ${jobId}, using default extension`);
    }
    
    // Default to PDF as it's most common
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