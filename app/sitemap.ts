import { MetadataRoute } from 'next'
import { loadJobs } from '@/lib/jobs-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await loadJobs()
  
  // Generate job URLs
  const jobUrls = jobs.map((job) => ({
    url: `https://sarkarijob.cc/jobs/${job.id}`,
    lastModified: new Date(job.processedAt || job.publishedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: 'https://sarkarijob.cc',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...jobUrls,
  ]
}