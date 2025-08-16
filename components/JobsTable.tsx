import Link from "next/link"
import { ArrowRight, Calendar, Users, Building, MapPin } from "lucide-react"
import { Job, formatDate, getDaysLeft } from "@/lib/jobs-types"
import { generateJobSlug } from "@/lib/slug-utils"
import SaveJobButton from "./SaveJobButton"

export default function JobsTable({ jobs, savedJobIds = [] }: { jobs: Job[], savedJobIds?: string[] }) {
  // Get urgency class based on days remaining
  const getUrgencyClass = (days: number | null) => {
    if (days === null) return "text-gray-500"
    if (days <= 2) return "text-danger-red font-semibold"
    if (days <= 7) return "text-warning-orange font-semibold"
    return "text-success-green"
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 dark:shadow-gray-800 overflow-hidden">
        {/* Desktop Table - shown on large screens only */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="job-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Post Name</th>
                <th>Location</th>
                <th>Vacancies</th>
                <th>Posted</th>
                <th>Last Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => {
                const daysLeft = getDaysLeft(job.lastDate);
                return (
                  <tr key={job.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100/40 dark:bg-gray-800/30'} hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}>
                    <td className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        {job.organization}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${generateJobSlug(job)}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {job.title}
                        </Link>
                        {daysLeft !== null && daysLeft <= 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Urgent
                          </span>
                        )}
                      </div>
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
                    <td>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('en-IN', { 
                          day: 'numeric',
                          month: 'short'
                        }) : 'Recent'}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm whitespace-nowrap">{formatDate(job.lastDate)}</div>
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
                      <div className="flex items-center gap-2">
                        <SaveJobButton 
                          jobId={job.id} 
                          jobTitle={job.title}
                          jobOrganization={job.organization}
                          size="sm"
                          initialSaved={savedJobIds.includes(job.id)}
                        />
                        <Link
                          href={`/jobs/${generateJobSlug(job)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-blue text-white rounded hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                        >
                          View
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tablet View - Simplified Table */}
        <div className="hidden lg:block xl:hidden overflow-x-auto">
          <table className="job-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Post Name</th>
                <th>Last Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index) => {
                const daysLeft = getDaysLeft(job.lastDate);
                return (
                  <tr key={job.id} className={`${index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-100/40 dark:bg-gray-800/30'} hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors`}>
                    <td className="font-medium">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-400" />
                          {job.organization}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {job.location || 'All India'} • {job.totalPosts || '-'} Posts
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Link href={`/jobs/${generateJobSlug(job)}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                          {job.title}
                        </Link>
                        {daysLeft !== null && daysLeft <= 2 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            Urgent
                          </span>
                        )}
                      </div>
                      {job.salary && (
                        <div className="text-xs text-green-600 dark:text-green-400 mt-1">{job.salary}</div>
                      )}
                    </td>
                    <td>
                      <div>
                        <div className="text-sm whitespace-nowrap">{formatDate(job.lastDate)}</div>
                        {daysLeft !== null && (
                          <div className={`text-xs ${getUrgencyClass(daysLeft)}`}>
                            {daysLeft === 0 ? 'Today' : 
                             daysLeft === 1 ? '1 day left' : 
                             `${daysLeft} days left`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <SaveJobButton 
                          jobId={job.id} 
                          jobTitle={job.title}
                          jobOrganization={job.organization}
                          size="sm"
                          initialSaved={savedJobIds.includes(job.id)}
                        />
                        <Link
                          href={`/jobs/${generateJobSlug(job)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary-blue text-white rounded hover:bg-primary-dark dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                        >
                          View
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Compact & Touch-Optimized */}
        <div className="lg:hidden space-y-2">
          {jobs.map((job, index) => {
            const daysLeft = getDaysLeft(job.lastDate);
            const isUrgent = daysLeft !== null && daysLeft <= 2;
            
            return (
              <Link
                key={job.id}
                href={`/jobs/${generateJobSlug(job)}`}
                className={`block bg-white dark:bg-gray-900 border-l-4 ${
                  isUrgent ? 'border-l-red-500' : 'border-l-blue-500'
                } shadow-sm active:shadow-lg transition-all`}
              >
                <div className="p-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                        {job.organization}
                      </h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-0.5">
                        {job.title}
                      </p>
                    </div>
                    {isUrgent && (
                      <span className="flex-shrink-0 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs px-2 py-1 rounded-full font-medium">
                        {daysLeft === 0 ? 'Today' : `${daysLeft}d`}
                      </span>
                    )}
                  </div>

                  {/* Info Row */}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600 dark:text-gray-400">
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                    )}
                    {job.totalPosts && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {job.totalPosts}
                      </span>
                    )}
                    {job.salary && (
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Date Row */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Posted {job.publishedAt ? new Date(job.publishedAt).toLocaleDateString('en-IN', { 
                        day: 'numeric',
                        month: 'short'
                      }) : 'recently'} • Apply by {formatDate(job.lastDate)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
    </div>
  )
}