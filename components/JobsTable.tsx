import Link from "next/link"
import { ArrowRight, Calendar, Users, Building, MapPin } from "lucide-react"
import { Job, formatDate, getDaysLeft } from "@/lib/jobs-types"

export default function JobsTable({ jobs }: { jobs: Job[] }) {
  // Get urgency class based on days remaining
  const getUrgencyClass = (days: number | null) => {
    if (days === null) return "text-gray-500"
    if (days <= 2) return "text-danger-red font-semibold"
    if (days <= 7) return "text-warning-orange font-semibold"
    return "text-success-green"
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm dark:shadow-gray-800 overflow-hidden">
        {/* Desktop Table - shown on large screens only */}
        <div className="hidden xl:block overflow-x-auto">
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
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
              {jobs.map((job) => {
                const daysLeft = getDaysLeft(job.lastDate);
                return (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
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
                      <Link href={`/jobs/${job.id}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                        {job.title}
                      </Link>
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

        {/* Mobile & Small Tablet Cards - shown on medium screens and below */}
        <div className="lg:hidden">
          {jobs.map((job) => {
            const daysLeft = getDaysLeft(job.lastDate);
            return (
              <div key={job.id} className="job-card m-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{job.organization}</h3>
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
                
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {job.totalPosts && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <span>{job.totalPosts} Posts</span>
                    </div>
                  )}
                  
                  
                  {job.lastDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
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
                </div>
              </div>
            );
          })}
        </div>
    </div>
  )
}