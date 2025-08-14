'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { ArrowRight, RefreshCw, Loader2, Calendar, Users, Building, MapPin } from "lucide-react"
import { Job, JobsApiResponse, formatDate, getDaysLeft } from "@/lib/jobs-types"

export default function RealTimeJobsTable() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastFetched, setLastFetched] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch jobs from API with pagination
  const fetchJobs = async (refresh = false, loadMore = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
        setPage(1);
      } else if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      
      const currentPage = loadMore ? page + 1 : refresh ? 1 : page;
      const response = await fetch(`/api/jobs?page=${currentPage}&limit=20`)
      const data: JobsApiResponse = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (loadMore) {
        setJobs(prev => [...prev, ...data.jobs])
        setPage(currentPage)
      } else {
        setJobs(data.jobs)
        if (refresh) setPage(1)
      }
      
      setHasMore(data.jobs.length === 20 && jobs.length + data.jobs.length < data.totalCount)
      setTotalCount(data.totalCount)
      setLastFetched(new Date(data.fetchedAt || new Date()))
      setError(null)
    } catch (err) {
      setError('Failed to load jobs. Please try again later.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
      setLoadingMore(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get urgency class based on days remaining
  const getUrgencyClass = (days: number | null) => {
    if (days === null) return "text-gray-500"
    if (days <= 2) return "text-danger-red font-semibold"
    if (days <= 7) return "text-warning-orange font-semibold"
    return "text-success-green"
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-blue dark:text-blue-400 mr-3" />
        <span className="text-gray-600 dark:text-gray-400">Loading latest government jobs...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={() => fetchJobs()}
          className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {jobs.length} active job postings • Last updated: {lastFetched?.toLocaleTimeString('en-IN')}
        </p>
        <button
          onClick={() => fetchJobs(true)}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary-blue dark:text-blue-400 hover:bg-primary-light/20 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Jobs table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-800 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="job-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Post Name</th>
                <th>Location</th>
                <th>Vacancies</th>
                <th>Salary</th>
                <th>Last Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const daysLeft = getDaysLeft(job.lastDate);
                return (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {job.organization}
                      </div>
                    </td>
                    <td>
                      <Link href={`/jobs/${job.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        {job.title}
                      </Link>
                    </td>
                    <td>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {job.location || 'All India'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{job.totalPosts || '-'}</span>
                      </div>
                    </td>
                    <td className="text-sm">
                      {job.salary ? (
                        <span className="font-medium text-green-600 dark:text-green-400">{job.salary}</span>
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm">{formatDate(job.lastDate)}</div>
                          {daysLeft !== null && (
                            <div className={`text-xs ${getUrgencyClass(daysLeft)}`}>
                              {daysLeft === 0 ? 'Today' : 
                               daysLeft === 1 ? '1 day left' : 
                               `${daysLeft} days left`}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-blue text-white rounded hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                      >
                        View
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {jobs.map((job) => {
            const daysLeft = getDaysLeft(job.lastDate);
            return (
              <div key={job.id} className="job-card m-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">{job.organization}</h3>
                  <Link href={`/jobs/${job.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                    {job.title}
                  </Link>
                  <div className="flex gap-2 mt-1">
                    {job.location && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded">
                        📍 {job.location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {job.totalPosts && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{job.totalPosts} Posts</span>
                    </div>
                  )}
                  
                  
                  {job.lastDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Last Date: {formatDate(job.lastDate)}</span>
                      {daysLeft !== null && (
                        <span className={`ml-auto ${getUrgencyClass(daysLeft)}`}>
                          {daysLeft === 0 ? 'Today' : 
                           daysLeft === 1 ? '1 day left' : 
                           `${daysLeft} days left`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-primary-blue text-white rounded hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                  >
                    View
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  {job.applicationForm && (
                    <a
                      href={job.applicationForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 text-sm bg-success-green text-white rounded hover:bg-green-700 transition-colors"
                    >
                      Form
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Load More Button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchJobs(false, true)}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More Jobs
                  <span className="text-sm opacity-75">
                    ({jobs.length} of {totalCount})
                  </span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Show total when all loaded */}
        {!hasMore && jobs.length > 0 && (
          <div className="mt-6 text-center text-gray-500 dark:text-gray-400">
            Showing all {jobs.length} jobs
          </div>
        )}
      </div>
    </div>
  )
}