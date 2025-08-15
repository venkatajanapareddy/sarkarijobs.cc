// Shared types and client-side utilities

export interface Job {
  id: string;
  title: string;
  organization: string;
  totalPosts?: number | null;
  lastDate?: string | null;
  startDate?: string | null;
  link?: string;
  category?: string;
  location?: string;
  qualification?: string;
  ageLimit?: {
    min: number;
    max: number;
  } | null;
  salary?: string | null;
  applicationFee?: string | null;
  applicationForm?: string | null;
  officialWebsite?: string | null;
  onlineApplication?: string | null;
  source?: string;
  sourceUrl?: string;
  publishedAt?: string;
  processedAt?: string;
  postedDate?: string;
  metadata?: {
    scrapedAt?: string;
    processedAt?: string;
  };
  [key: string]: any; // Allow additional properties
}

export interface JobsApiResponse {
  jobs: Job[];
  totalCount: number;
  source: string;
  lastUpdated?: string;
  fetchedAt?: string;
  cachedAt?: string;
  error?: string;
}

// Format date for display
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Not specified';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

// Calculate days left until deadline
export function getDaysLeft(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  
  try {
    const deadline = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 ? diffDays : null;
  } catch {
    return null;
  }
}

// Filter jobs by category
export function filterJobsByCategory(jobs: Job[], category: string): Job[] {
  if (!category || category === 'all') return jobs;
  return jobs.filter(job => job.category?.toLowerCase() === category.toLowerCase());
}

// Search jobs
export function searchJobs(jobs: Job[], query: string): Job[] {
  if (!query) return jobs;
  
  const searchTerm = query.toLowerCase();
  return jobs.filter(job => 
    job.title?.toLowerCase().includes(searchTerm) ||
    job.organization?.toLowerCase().includes(searchTerm) ||
    job.qualification?.toLowerCase().includes(searchTerm) ||
    job.category?.toLowerCase().includes(searchTerm)
  );
}

// Get unique categories from jobs
export function getCategories(jobs: Job[]): string[] {
  const categories = new Set<string>();
  jobs.forEach(job => {
    if (job.category) categories.add(job.category);
  });
  return Array.from(categories).sort();
}