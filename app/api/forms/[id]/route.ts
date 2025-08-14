import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    
    // Path to application forms directory
    const formsDir = path.join(process.cwd(), '..', 'data', 'application_forms');
    
    // Try different file extensions
    const extensions = ['.pdf', '.docx', '.doc'];
    let formPath = '';
    let foundFile = false;
    
    for (const ext of extensions) {
      const testPath = path.join(formsDir, `${jobId}_form${ext}`);
      try {
        await fs.access(testPath);
        formPath = testPath;
        foundFile = true;
        break;
      } catch {
        // File doesn't exist with this extension, try next
      }
    }
    
    if (!foundFile) {
      return NextResponse.json(
        { error: 'Application form not found' },
        { status: 404 }
      );
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(formPath);
    const fileName = path.basename(formPath);
    const mimeType = fileName.endsWith('.pdf') 
      ? 'application/pdf' 
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error serving form:', error);
    return NextResponse.json(
      { error: 'Failed to load application form' },
      { status: 500 }
    );
  }
}