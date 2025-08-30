'use client'

import { useState, useMemo, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, AlertCircle, TrendingUp, Calendar, MapPin, X, ArrowRight } from 'lucide-react'
import { Job, getDaysLeft } from '@/lib/jobs-types'
import { generateJobSlug } from '@/lib/slug-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

// Lazy load heavy components
const JobsTable = lazy(() => import('./JobsTable'))
const Select = lazy(() => import('@/components/ui/select').then(m => ({ default: m.Select })))
const SelectContent = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectContent })))
const SelectItem = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectItem })))
const SelectTrigger = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectTrigger })))
const SelectValue = lazy(() => import('@/components/ui/select').then(m => ({ default: m.SelectValue })))

interface HomePageProps {
  jobs: Job[]
  savedJobIds?: string[]
}

// Memoize category function outside component
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

export default function HomePageOptimized({ jobs, savedJobIds = [] }: HomePageProps) {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedUrgency, setSelectedUrgency] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showAllUrgentJobs, setShowAllUrgentJobs] = useState(false)
  const [displayCount, setDisplayCount] = useState(50) // Start with 50 jobs
  
  // Debounce search input
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])
  
  // Check for filter parameter in URL
  useEffect(() => {
    const filter = searchParams.get('filter')
    if (filter === 'closing-today') {
      setSelectedUrgency('today')
      setShowFilters(true)
    }
  }, [searchParams])
  
  // Extract unique locations with better memoization
  const locations = useMemo(() => {
    const locs = new Set<string>()
    for (let i = 0; i < Math.min(jobs.length, 100); i++) {
      const location = jobs[i].location
      if (location) locs.add(location)
    }
    return Array.from(locs).sort()
  }, [jobs])
  
  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (let i = 0; i < Math.min(jobs.length, 100); i++) {
      cats.add(getCategory(jobs[i].organization))
    }
    return Array.from(cats).sort()
  }, [jobs])
  
  // Filter jobs with better performance
  const filteredJobs = useMemo(() => {
    let result = jobs
    
    // Apply filters only if needed
    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase()
      result = result.filter(job => 
        job.title?.toLowerCase().includes(search) ||
        job.organization?.toLowerCase().includes(search) ||
        job.qualification?.toLowerCase().includes(search)
      )
    }
    
    if (selectedLocation !== 'all') {
      result = result.filter(job => job.location === selectedLocation)
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(job => getCategory(job.organization) === selectedCategory)
    }
    
    if (selectedUrgency !== 'all') {
      result = result.filter(job => {
        const daysLeft = getDaysLeft(job.lastDate)
        if (selectedUrgency === 'today') return daysLeft === 0
        if (selectedUrgency === '3days') return daysLeft !== null && daysLeft >= 0 && daysLeft <= 3
        if (selectedUrgency === 'week') return daysLeft !== null && daysLeft >= 0 && daysLeft <= 7
        return true
      })
    }
    
    return result
  }, [jobs, debouncedSearchTerm, selectedLocation, selectedCategory, selectedUrgency])
  
  // Paginate results for better performance
  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, displayCount)
  }, [filteredJobs, displayCount])
  
  // Calculate stats with better performance
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let closingToday = 0
    let closingSoon = 0
    
    // Only check first 100 jobs for stats
    for (let i = 0; i < Math.min(jobs.length, 100); i++) {
      const daysLeft = getDaysLeft(jobs[i].lastDate)
      if (daysLeft === 0) closingToday++
      if (daysLeft !== null && daysLeft >= 0 && daysLeft <= 3) closingSoon++
    }
    
    return {
      total: jobs.length,
      closingToday,
      closingSoon
    }
  }, [jobs])
  
  // Time-sensitive jobs with pagination
  const timeSensitiveJobs = useMemo(() => {
    return jobs
      .filter(job => {
        const daysLeft = getDaysLeft(job.lastDate)
        return daysLeft !== null && daysLeft >= 0 && daysLeft <= 3
      })
      .sort((a, b) => {
        const daysA = getDaysLeft(a.lastDate)
        const daysB = getDaysLeft(b.lastDate)
        return (daysA ?? 999) - (daysB ?? 999)
      })
      .slice(0, showAllUrgentJobs ? undefined : 5)
  }, [jobs, showAllUrgentJobs])
  
  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => prev + 50)
  }, [])
  
  const handleResetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedLocation('all')
    setSelectedCategory('all')
    setSelectedUrgency('all')
  }, [])
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Find Your Dream Government Job
        </h1>
        <p className="text-blue-100 mb-6">
          {stats.total}+ active government job openings across India
        </p>
        
        {/* Search Bar */}
        <div className="bg-white rounded-lg p-2 flex gap-2">
          <Input
            type="text"
            placeholder="Search by job title, organization, or qualification..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 text-gray-900 placeholder:text-gray-500"
          />
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
        </div>
        
        <Link href="/?filter=closing-today">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Closing Today</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.closingToday}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 opacity-20" />
            </div>
          </div>
        </Link>
        
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
              <p className="text-sm text-gray-600 dark:text-gray-400">States & UTs Hiring</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{locations.length}</p>
            </div>
            <MapPin className="w-8 h-8 text-green-500 opacity-20" />
          </div>
        </div>
      </div>
      
      {/* Time-Sensitive Jobs */}
      {timeSensitiveJobs.length > 0 && (
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Closing Soon</span>
            <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 px-1.5 py-0.5 rounded-full font-medium">
              {timeSensitiveJobs.length} jobs
            </span>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4 space-y-3">
            {timeSensitiveJobs.map(job => {
              const daysLeft = getDaysLeft(job.lastDate)
              return (
                <Link 
                  key={job.id} 
                  href={`/jobs/${generateJobSlug(job)}`}
                  className="block hover:bg-white dark:hover:bg-gray-900 p-3 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {job.organization} • {job.totalPosts} posts
                      </p>
                    </div>
                    <Badge 
                      variant={daysLeft === 0 ? "destructive" : "secondary"}
                      className="shrink-0"
                    >
                      {daysLeft === 0 ? 'Last Day' : `${daysLeft} days left`}
                    </Badge>
                  </div>
                </Link>
              )
            })}
            
            {!showAllUrgentJobs && timeSensitiveJobs.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setShowAllUrgentJobs(true)}
              >
                Show all {timeSensitiveJobs.length} urgent jobs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
      
      {/* Filters Section */}
      {showFilters && (
        <Suspense fallback={<div>Loading filters...</div>}>
          <div id="filter-section" className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Filters</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="today">Closing Today</SelectItem>
                  <SelectItem value="3days">Closing in 3 Days</SelectItem>
                  <SelectItem value="week">Closing This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Suspense>
      )}
      
      {/* Jobs Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm">
        <Suspense fallback={<div className="p-8 text-center">Loading jobs...</div>}>
          <JobsTable 
            jobs={displayedJobs} 
            savedJobIds={savedJobIds}
          />
        </Suspense>
        
        {displayedJobs.length < filteredJobs.length && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <Button onClick={handleLoadMore} variant="outline">
              Load More ({filteredJobs.length - displayedJobs.length} remaining)
            </Button>
          </div>
        )}
      </div>
      
      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>No jobs found matching your criteria.</p>
          <Button 
            variant="link" 
            onClick={handleResetFilters}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}