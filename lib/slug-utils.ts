/**
 * Generate SEO-friendly slug from job data
 */
export function generateJobSlug(job: any): string {
  const organization = job.organization || 'government';
  const title = job.title || 'job';
  const year = new Date().getFullYear();
  
  // Clean and format the slug parts
  const orgSlug = organization
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
    
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30);
  
  // Combine with ID for uniqueness
  return `${orgSlug}-${titleSlug}-${year}-${job.id}`;
}

/**
 * Extract job ID from slug
 */
export function extractJobIdFromSlug(slug: string): string {
  // The ID is the last part after the last hyphen that looks like a UUID
  const parts = slug.split('-');
  
  // UUID pattern: 8-4-4-4-12 characters
  // We'll reconstruct it from the end parts
  if (parts.length >= 5) {
    const possibleId = parts.slice(-5).join('-');
    // Check if it matches UUID pattern
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(possibleId)) {
      return possibleId;
    }
  }
  
  // Fallback: return the whole slug (for backward compatibility)
  return slug;
}