// Optimized server-side job loading using lightweight index
import fs from 'fs/promises';
import path from 'path';
import { Job } from './jobs-types';

// Cache for production
let cachedJobs: Job[] | null = null;

// Load jobs using the lightweight index for better performance
export async function loadJobs(): Promise<Job[]> {
  // In production, use cached jobs
  if (process.env.NODE_ENV === 'production' && cachedJobs) {
    return cachedJobs;
  }

  try {
    const dataBasePath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'public', 'data')
      : path.join(process.cwd(), '..', 'data');
    
    // First try to load the lightweight index
    const indexPath = path.join(dataBasePath, 'jobs', 'jobs-index.json');
    
    try {
      const indexContent = await fs.readFile(indexPath, 'utf8');
      const jobsIndex = JSON.parse(indexContent);
      
      // Map index to Job format
      const jobs: Job[] = jobsIndex.map((job: any) => ({
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
        
        // Generate R2 URLs for PDFs
        applicationForm: job.hasApplicationForm
          ? `https://pub-3e5281bc67d445b2b6cba74cdfca7241.r2.dev/${job.id}_form.pdf`
          : undefined,
        officialWebsite: job.hasOfficialLink ? 'available' : undefined,
        onlineApplication: job.hasNotification ? 'available' : undefined,
        
        sourceUrl: `/jobs/${job.id}`,
        publishedAt: job.postedDate,
        processedAt: job.postedDate
      }));
      
      // Cache in production
      if (process.env.NODE_ENV === 'production') {
        cachedJobs = jobs;
      }
      
      return jobs;
      
    } catch (indexError) {
      console.log('Index not found, falling back to individual files');
      
      // Fallback to loading individual files if index doesn't exist
      const jobsDir = path.join(dataBasePath, 'jobs');
      const files = await fs.readdir(jobsDir);
      const jsonFiles = files.filter(f => f.startsWith('job_') && f.endsWith('.json'));
      
      const jobs: Job[] = [];
      
      // Load only essential data from each file
      for (const file of jsonFiles) {
        const filePath = path.join(jobsDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const jobData = JSON.parse(content);
        
        if (!jobData.id || !jobData.title || !jobData.organization) continue;
        
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
          
          applicationForm: jobData.links?.applicationFormR2 || 
            (jobData.id 
              ? `https://pub-3e5281bc67d445b2b6cba74cdfca7241.r2.dev/${jobData.id}_form.pdf`
              : jobData.links?.applicationForm),
          officialWebsite: jobData.links?.official,
          onlineApplication: jobData.links?.notification,
          
          sourceUrl: jobData.links?.sourceUrl || jobData.url,
          publishedAt: jobData.postedDate || jobData.metadata?.scrapedAt,
          processedAt: jobData.metadata?.processedAt
        };
        
        jobs.push(job);
      }
      
      // Sort by published date
      jobs.sort((a, b) => {
        const dateA = a.publishedAt || a.processedAt || a.lastDate || '';
        const dateB = b.publishedAt || b.processedAt || b.lastDate || '';
        return dateB.localeCompare(dateA);
      });
      
      // Cache in production
      if (process.env.NODE_ENV === 'production') {
        cachedJobs = jobs;
      }
      
      return jobs;
    }
  } catch (error) {
    console.error('Error loading jobs:', error);
    return [];
  }
}

// Load a single job with full details (unchanged)
export async function loadJobDetails(jobId: string): Promise<any> {
  try {
    const dataBasePath = process.env.NODE_ENV === 'production' 
      ? path.join(process.cwd(), 'public', 'data')
      : path.join(process.cwd(), '..', 'data');
    
    const jobPath = path.join(dataBasePath, 'jobs', `job_${jobId}.json`);
    const jobContent = await fs.readFile(jobPath, 'utf8');
    const processedJob = JSON.parse(jobContent);
    
    if (processedJob.links?.applicationForm) {
      processedJob.links.applicationFormLocal = true;
    }
    
    if (process.env.NODE_ENV !== 'production') {
      const rawJobPath = path.join(dataBasePath, 'raw_jobs', `raw_job_${jobId}.json`);
      try {
        const rawContent = await fs.readFile(rawJobPath, 'utf8');
        const rawJob = JSON.parse(rawContent);
        
        return {
          ...processedJob,
          rawContent: rawJob.rawContent
        };
      } catch {
        return processedJob;
      }
    }
    
    return processedJob;
  } catch (error) {
    console.error('Error loading job details:', error);
    return null;
  }
}