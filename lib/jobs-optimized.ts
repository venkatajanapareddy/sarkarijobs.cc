import { Job } from './jobs-types';
import fs from 'fs/promises';
import path from 'path';

// Cache the index in memory for production
let cachedIndex: any[] | null = null;

// Use pre-generated index for lightning-fast loading
export async function loadJobsOptimized(): Promise<Job[]> {
  // Load index once and cache it
  if (!cachedIndex) {
    const indexPath = path.join(process.cwd(), 'public', 'data', 'jobs', 'jobs-index.json');
    const indexContent = await fs.readFile(indexPath, 'utf8');
    cachedIndex = JSON.parse(indexContent);
  }
  
  // Map the lightweight index to Job format
  return (cachedIndex || []).map((job: any) => ({
    id: job.id,
    title: job.title,
    organization: job.organization,
    totalPosts: job.totalPosts,
    lastDate: job.lastDate,
    startDate: job.applicationStartDate,
    qualification: job.qualification,
    salary: job.salary,
    category: job.department || 'Government',
    location: job.location || 'All India',
    
    // Generate R2 URLs on the fly
    applicationForm: job.hasApplicationForm 
      ? `https://pub-3e5281bc67d445b2b6cba74cdfca7241.r2.dev/${job.id}_form.pdf`
      : undefined,
    officialWebsite: job.hasOfficialLink ? `/api/job/${job.id}/official` : undefined,
    onlineApplication: job.hasNotification ? `/api/job/${job.id}/apply` : undefined,
    
    sourceUrl: `/jobs/${job.id}`,
    publishedAt: job.postedDate,
    processedAt: job.postedDate
  }));
}

// Load full job details only when needed
export async function loadJobDetailsOptimized(jobId: string): Promise<any> {
  try {
    const response = await fetch(`/data/jobs/job_${jobId}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error loading job details:', error);
    return null;
  }
}