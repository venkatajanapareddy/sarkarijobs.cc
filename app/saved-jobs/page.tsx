import PageLayout from '@/components/PageLayout'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import SavedJobsClient from '@/components/SavedJobsClient'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { loadJobs } from '@/lib/jobs-server'

export const metadata = {
  title: 'Saved Jobs | SarkariJobs.cc',
  description: 'View your saved government job postings',
}

export default async function SavedJobsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  // Get saved job IDs
  const { data: savedJobs } = await supabase
    .from('saved_jobs')
    .select('job_id, saved_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const savedJobIds = savedJobs?.map(sj => sj.job_id) || []
  
  // Load all jobs and filter by saved IDs
  const allJobs = await loadJobs()
  const jobs = allJobs.filter(job => savedJobIds.includes(job.id))

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all jobs
          </Link>
          
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Your Saved Jobs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'} saved
              </p>
            </div>
          </div>
        </div>

        <SavedJobsClient initialJobs={jobs} savedJobIds={savedJobIds} />
      </div>
    </PageLayout>
  )
}