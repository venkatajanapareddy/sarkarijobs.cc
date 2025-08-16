import Header from "@/components/Header"
import HomePage from "@/components/HomePage"
import AnnouncementBar from "@/components/AnnouncementBar"
import { loadJobs } from "@/lib/jobs-server"
import { createClient } from "@/utils/supabase/server"
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Latest Government Jobs 2025 | SarkariJob.cc - Sarkari Naukri',
  description: 'Find latest government jobs, sarkari naukri, and recruitment notifications from UPSC, SSC, Railway, Banking, Defence, and more. Updated daily with 300+ active job postings.',
  keywords: 'government jobs, sarkari naukri, sarkari job, government jobs 2025, upsc, ssc, railway jobs, bank jobs, defence jobs, teaching jobs, india',
  openGraph: {
    title: 'Latest Government Jobs 2025 | SarkariJob.cc',
    description: 'Find latest government jobs and sarkari naukri. 300+ active job postings from various government departments.',
    type: 'website',
    siteName: 'SarkariJob.cc',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest Government Jobs 2025 | SarkariJob.cc',
    description: 'Find latest government jobs and sarkari naukri. 300+ active job postings.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-verification-code',
  },
}

export default async function Home() {
  const jobs = await loadJobs()
  
  // Get saved job IDs for current user
  let savedJobIds: string[] = []
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data: savedJobs } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user.id)
      
      savedJobIds = savedJobs?.map(sj => sj.job_id) || []
    }
  } catch (error) {
    console.error('Error fetching saved jobs:', error)
  }
  
  return (
    <>
      <AnnouncementBar jobs={jobs} />
      <Header />
      <div className="container mx-auto px-4 py-8" role="main">
        <HomePage jobs={jobs} savedJobIds={savedJobIds} />
      </div>
    </>
  )
}