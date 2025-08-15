'use client'

import { useState, useEffect } from 'react'
import JobsTable from './JobsTable'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { Job } from '@/lib/jobs-types'
import { globalEvents, EVENTS } from '@/utils/events'

interface SavedJobsClientProps {
  initialJobs: Job[]
  savedJobIds: string[]
}

export default function SavedJobsClient({ initialJobs, savedJobIds: initialSavedJobIds }: SavedJobsClientProps) {
  const [jobs, setJobs] = useState(initialJobs)
  const [savedJobIds, setSavedJobIds] = useState(initialSavedJobIds)

  useEffect(() => {
    // Listen for saved jobs updates
    const handleUpdate = (event: CustomEvent) => {
      const { jobId, action } = event.detail || {}
      
      if (action === 'unsaved' && jobId) {
        // Remove the unsaved job from the list
        setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
        setSavedJobIds(prevIds => prevIds.filter(id => id !== jobId))
      }
    }

    globalEvents.addEventListener(EVENTS.SAVED_JOBS_UPDATED, handleUpdate as EventListener)
    
    return () => {
      globalEvents.removeEventListener(EVENTS.SAVED_JOBS_UPDATED, handleUpdate as EventListener)
    }
  }, [])

  return (
    <>
      {jobs.length > 0 ? (
        <JobsTable jobs={jobs} savedJobIds={savedJobIds} />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No saved jobs yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start saving jobs you're interested in and they'll appear here.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </>
  )
}