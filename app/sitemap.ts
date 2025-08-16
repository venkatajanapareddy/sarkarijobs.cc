import { MetadataRoute } from 'next'
import { loadJobs } from '@/lib/jobs-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await loadJobs()
  
  // Generate job URLs
  const jobUrls = jobs.map((job) => ({
    url: `https://sarkarijobs.cc/jobs/${job.id}`,
    lastModified: new Date(job.processedAt || job.publishedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [
    {
      url: 'https://sarkarijobs.cc',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://sarkarijobs.cc/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://sarkarijobs.cc/contact',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://sarkarijobs.cc/privacy',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: 'https://sarkarijobs.cc/faq',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...jobUrls,
  ]
}