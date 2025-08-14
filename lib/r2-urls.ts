/**
 * Helper to generate R2 URLs for application forms
 */

const R2_PUBLIC_URL = 'https://pub-3e5281bc67d445b2b6cba74cdfca7241.r2.dev';

export function getR2FormUrl(jobId: string): string {
  // Generate R2 URL for the form
  // Files are named like: {jobId}_form.pdf (or .jpg, .docx)
  return `${R2_PUBLIC_URL}/${jobId}_form.pdf`;
}

export function getR2FormUrlWithExtension(jobId: string, extension: string): string {
  // For cases where we know the specific extension
  return `${R2_PUBLIC_URL}/${jobId}_form.${extension}`;
}

// Check if a form exists on R2 (for fallback logic)
export async function checkR2FormExists(jobId: string): Promise<string | null> {
  const extensions = ['pdf', 'jpg', 'docx'];
  
  for (const ext of extensions) {
    const url = `${R2_PUBLIC_URL}/${jobId}_form.${ext}`;
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return url;
      }
    } catch {
      // Continue checking other extensions
    }
  }
  
  return null;
}