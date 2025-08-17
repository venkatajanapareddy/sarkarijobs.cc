'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, AlertCircle, TrendingUp, Calendar, MapPin, GraduationCap, Building2, X, Sparkles, ArrowRight, Users } from 'lucide-react'
import JobsTable from './JobsTable'
import { Job, getDaysLeft } from '@/lib/jobs-types'
import { generateJobSlug } from '@/lib/slug-utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface HomePageProps {
  jobs: Job[]
  savedJobIds?: string[]
}

export default function HomePage({ jobs, savedJobIds = [] }: HomePageProps) {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedUrgency, setSelectedUrgency] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Check for filter parameter in URL
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter === 'closing-today') {
      setSelectedUrgency('today')
      setShowFilters(true)
      // Scroll to the filter section after a brief delay to ensure it's rendered
      setTimeout(() => {
        const filterSection = document.getElementById('filter-section')
        if (filterSection) {
          filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [searchParams])
  const [canScroll, setCanScroll] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Extract unique locations and categories
  const locations = useMemo(() => {
    const locs = new Set<string>()
    jobs.forEach(job => {
      if (job.location) locs.add(job.location)
    })
    return Array.from(locs).sort()
  }, [jobs])

  // Categorize organizations
  const getCategory = (org: string): string => {
    const orgLower = org.toLowerCase()
    if (orgLower.includes('railway') || orgLower.includes('rrb')) return 'Railway'
    if (orgLower.includes('bank') || orgLower.includes('sbi') || orgLower.includes('rbi')) return 'Banking'
    if (orgLower.includes('upsc') || orgLower.includes('ssc') || orgLower.includes('psc')) return 'UPSC/SSC'
    if (orgLower.includes('police') || orgLower.includes('defence') || orgLower.includes('army') || orgLower.includes('navy') || orgLower.includes('air force')) return 'Defence/Police'
    if (orgLower.includes('university') || orgLower.includes('college') || orgLower.includes('school') || orgLower.includes('education')) return 'Teaching'
    if (orgLower.includes('hospital') || orgLower.includes('aiims') || orgLower.includes('medical')) return 'Medical'
    if (orgLower.includes('court') || orgLower.includes('judicial')) return 'Judicial'
    return 'Other'
  }

  // Filter jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase()
        const matchesSearch = 
          job.title?.toLowerCase().includes(search) ||
          job.organization?.toLowerCase().includes(search) ||
          job.qualification?.toLowerCase().includes(search)
        if (!matchesSearch) return false
      }

      // Location filter
      if (selectedLocation !== 'all' && job.location !== selectedLocation) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'all' && getCategory(job.organization) !== selectedCategory) {
        return false
      }

      // Urgency filter
      if (selectedUrgency !== 'all') {
        const daysLeft = getDaysLeft(job.lastDate)
        if (selectedUrgency === 'closing-soon' && (daysLeft === null || daysLeft > 7)) return false
        if (selectedUrgency === 'this-week' && (daysLeft === null || daysLeft > 7)) return false
        if (selectedUrgency === 'today' && daysLeft !== 0) return false
      }

      return true
    })
  }, [jobs, searchTerm, selectedLocation, selectedCategory, selectedUrgency])

  // Get stats
  const stats = useMemo(() => {
    const closingSoon = jobs.filter(job => {
      const days = getDaysLeft(job.lastDate)
      return days !== null && days <= 3
    }).length

    const closingToday = jobs.filter(job => {
      const days = getDaysLeft(job.lastDate)
      return days === 0
    }).length

    const byCategory = jobs.reduce((acc, job) => {
      const cat = getCategory(job.organization)
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { closingSoon, closingToday, byCategory }
  }, [jobs])

  // Get recently added jobs (last 3 days)
  const recentJobs = useMemo(() => {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    
    return jobs
      .filter(job => {
        const postedDate = new Date(job.publishedAt || job.processedAt || '')
        return postedDate >= threeDaysAgo
      })
      .slice(0, 5)
  }, [jobs])

  // Get urgent jobs for alert banner
  const urgentJobs = useMemo(() => {
    return jobs
      .filter(job => {
        const days = getDaysLeft(job.lastDate)
        return days !== null && days <= 1
      })
      .sort((a, b) => {
        const daysA = getDaysLeft(a.lastDate) || 999
        const daysB = getDaysLeft(b.lastDate) || 999
        return daysA - daysB
      })
      .slice(0, 3)
  }, [jobs])

  // Check if scroll is needed for recent jobs
  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current
        setCanScroll(scrollWidth > clientWidth)
      }
    }
    
    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [recentJobs])

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{jobs.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Closing Today</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.closingToday}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Closing in 3 Days</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.closingSoon}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500 opacity-20" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">States Hiring</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{locations.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Recently Added Jobs - Compact horizontal scroll */}
      {recentJobs.length > 0 && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New this week</span>
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
              {recentJobs.length}
            </span>
            {/* Scroll indicator - only show if content actually overflows */}
            {canScroll && (
              <>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  <span className="animate-pulse">→</span>
                  Scroll for more
                </span>
                <span className="sm:hidden text-xs text-gray-500 dark:text-gray-400 ml-auto">
                  Swipe →
                </span>
              </>
            )}
          </div>
          <div className="relative">
            {/* Gradient fade indicators - only show if scrollable */}
            {canScroll && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
              </>
            )}
            
            <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth" id="recent-jobs-scroll">
              {recentJobs.map((job, index) => {
                const daysLeft = getDaysLeft(job.lastDate)
                return (
                  <Link 
                    key={job.id}
                    href={`/jobs/${generateJobSlug(job)}`}
                    className="flex-shrink-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all min-w-[200px] max-w-[250px] group"
                  >
                    <div className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {job.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {job.organization}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {job.location && (
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          📍 {job.location}
                        </span>
                      )}
                      {daysLeft !== null && daysLeft <= 3 && (
                        <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                          ⚡ {daysLeft}d left
                        </span>
                      )}
                    </div>
                    {/* Show position indicator on mobile */}
                    {index === recentJobs.length - 1 && (
                      <div className="sm:hidden absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full opacity-50" />
                    )}
                  </Link>
                )
              })}
              {/* Add more indicator at the end if there are exactly 5 jobs */}
              {recentJobs.length >= 5 && (
                <div className="flex-shrink-0 flex items-center justify-center min-w-[100px] text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <span>More coming</span>
                    <span className="animate-pulse">...</span>
                  </span>
                </div>
              )}
            </div>
          </div>
          <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            @media (min-width: 640px) {
              #recent-jobs-scroll:hover + .scroll-hint {
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div id="filter-section" className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm scroll-mt-20">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by job title, organization, or qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Filter Toggle for Mobile */}
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            <span>Filters</span>
            {(selectedLocation !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all') && (
              <Badge variant="secondary" className="ml-2">
                {[selectedLocation !== 'all', selectedCategory !== 'all', selectedUrgency !== 'all'].filter(Boolean).length}
              </Badge>
            )}
          </Button>

          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-3">
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Railway">Railway</SelectItem>
                <SelectItem value="Banking">Banking</SelectItem>
                <SelectItem value="UPSC/SSC">UPSC/SSC</SelectItem>
                <SelectItem value="Defence/Police">Defence/Police</SelectItem>
                <SelectItem value="Teaching">Teaching</SelectItem>
                <SelectItem value="Medical">Medical</SelectItem>
                <SelectItem value="Judicial">Judicial</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedUrgency}
              onValueChange={setSelectedUrgency}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Deadlines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Deadlines</SelectItem>
                <SelectItem value="today">Closing Today</SelectItem>
                <SelectItem value="this-week">Next 7 Days</SelectItem>
                <SelectItem value="closing-soon">Closing Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Filters - Enhanced UI */}
        {showFilters && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">📍 All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">🏢 All Categories</option>
                  <option value="Railway">🚂 Railway</option>
                  <option value="Banking">🏦 Banking</option>
                  <option value="UPSC/SSC">📚 UPSC/SSC</option>
                  <option value="Defence/Police">🛡️ Defence/Police</option>
                  <option value="Teaching">🎓 Teaching</option>
                  <option value="Medical">🏥 Medical</option>
                  <option value="Judicial">⚖️ Judicial</option>
                  <option value="Other">📋 Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Urgency</label>
                <select
                  value={selectedUrgency}
                  onChange={(e) => setSelectedUrgency(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                >
                  <option value="all">⏰ All Deadlines</option>
                  <option value="today">🔥 Closing Today</option>
                  <option value="this-week">📅 Next 7 Days</option>
                  <option value="closing-soon">⚡ Closing Soon</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => {
                    setSelectedLocation('all')
                    setSelectedCategory('all')
                    setSelectedUrgency('all')
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Clear Filters
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  className="flex-1"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredJobs.length}</span> jobs
          {searchTerm && ` for "${searchTerm}"`}
          {selectedLocation !== 'all' && ` in ${selectedLocation}`}
          {selectedCategory !== 'all' && ` (${selectedCategory})`}
        </p>
        
        {(searchTerm || selectedLocation !== 'all' || selectedCategory !== 'all' || selectedUrgency !== 'all') && (
          <Button
            onClick={() => {
              setSearchTerm('')
              setSelectedLocation('all')
              setSelectedCategory('all')
              setSelectedUrgency('all')
            }}
            variant="outline"
            size="sm"
            className="border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <X className="w-4 h-4 mr-1.5" />
            Clear all filters
            <Badge className="ml-2 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              {[searchTerm ? 1 : 0, selectedLocation !== 'all' ? 1 : 0, selectedCategory !== 'all' ? 1 : 0, selectedUrgency !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
            </Badge>
          </Button>
        )}
      </div>

      {/* Category Quick Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(stats.byCategory)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 8)
          .map(([category, count]) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category === selectedCategory ? 'all' : category)}
              className="h-8"
            >
              {category} <Badge variant="secondary" className="ml-1.5">{count}</Badge>
            </Button>
          ))}
      </div>

      {/* Jobs Table */}
      {filteredJobs.length > 0 ? (
        <JobsTable jobs={filteredJobs} savedJobIds={savedJobIds} />
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}