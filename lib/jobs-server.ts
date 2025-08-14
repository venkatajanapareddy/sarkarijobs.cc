// Server-side only functions (uses Node.js APIs)
import fs from 'fs/promises';
import path from 'path';
import { Job } from './jobs-types';

// Load a single job with full details
export async function loadJobDetails(jobId: string): Promise<any> {
  try {
    // Determine data path based on environment
    const dataBasePath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'public', 'data')
      : path.join(process.cwd(), '..', 'data');
    
    // First try to load the processed job
    const jobPath = path.join(dataBasePath, 'jobs', `job_${jobId}.json`);
    const jobContent = await fs.readFile(jobPath, 'utf8');
    const processedJob = JSON.parse(jobContent);
    
    // Then load the raw job for full content
    const rawJobPath = path.join(dataBasePath, 'raw_jobs', `raw_job_${jobId}.json`);
    try {
      const rawContent = await fs.readFile(rawJobPath, 'utf8');
      const rawJob = JSON.parse(rawContent);
      
      // Merge both to get complete data
      return {
        ...processedJob,
        rawContent: rawJob.rawContent
      };
    } catch {
      // If raw job doesn't exist, return processed job only
      return processedJob;
    }
  } catch (error) {
    console.error('Error loading job details:', error);
    return null;
  }
}

// Load jobs from the file system
export async function loadJobs(): Promise<Job[]> {
  try {
    // Determine data path based on environment
    const dataBasePath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'public', 'data')
      : path.join(process.cwd(), '..', 'data');
    
    const jobsDir = path.join(dataBasePath, 'jobs');
    const files = await fs.readdir(jobsDir);
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'index.json');
    
    const jobs: Job[] = [];
    
    for (const file of jsonFiles) {
      const filePath = path.join(jobsDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      const jobData = JSON.parse(content);
      
      // Skip if job doesn't have required fields
      if (!jobData.id || !jobData.title || !jobData.organization) continue;
      
      // Map our processed job data to the expected format
      const job: Job = {
        id: jobData.id,
        title: jobData.title,
        organization: jobData.organization,
        totalPosts: jobData.totalPosts,
        lastDate: jobData.lastDate,
        startDate: jobData.applicationStartDate,
        qualification: jobData.qualification,
        salary: jobData.salary,
        category: jobData.department || 'Government',
        location: jobData.location || 'All India',
        
        // Map links - for local forms, create a proper URL path
        applicationForm: jobData.links?.applicationFormLocal 
          ? `/api/forms/${jobData.id}` 
          : jobData.links?.applicationForm,
        officialWebsite: jobData.links?.official,
        onlineApplication: jobData.links?.notification,
        
        // Source info
        sourceUrl: jobData.links?.sourceUrl || jobData.url,
        publishedAt: jobData.postedDate || jobData.metadata?.scrapedAt,
        processedAt: jobData.metadata?.processedAt
      };
      
      jobs.push(job);
    }
    
    // Sort by last date (newest first) or published date
    jobs.sort((a, b) => {
      const dateA = a.lastDate || a.publishedAt || '';
      const dateB = b.lastDate || b.publishedAt || '';
      return dateB.localeCompare(dateA);
    });
    
    return jobs;
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}