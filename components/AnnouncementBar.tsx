'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, TrendingUp, Clock, Bell, ArrowRight, Sparkles, Zap } from 'lucide-react'
import { Job, getDaysLeft } from '@/lib/jobs-types'
import { generateJobSlug } from '@/lib/slug-utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface AnnouncementBarProps {
  jobs: Job[]
}

export default function AnnouncementBar({ jobs }: AnnouncementBarProps) {
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0)

  // Get urgent and new jobs
  const urgentJobs = jobs
    .filter(job => {
      const days = getDaysLeft(job.lastDate)
      return days !== null && days <= 1
    })
    .sort((a, b) => {
      const daysA = getDaysLeft(a.lastDate) || 999
      const daysB = getDaysLeft(b.lastDate) || 999
      return daysA - daysB
    })

  const todayJobs = jobs.filter(job => {
    const postedDate = new Date(job.postedDate || job.metadata?.scrapedAt || job.publishedAt || '')
    const today = new Date()
    return postedDate.toDateString() === today.toDateString()
  })

  // Calculate stats
  const closingToday = urgentJobs.filter(job => getDaysLeft(job.lastDate) === 0).length
  const closingTomorrow = urgentJobs.filter(job => getDaysLeft(job.lastDate) === 1).length
  const newToday = todayJobs.length

  // Create announcements array
  const announcements = []
  
  if (closingToday > 0) {
    announcements.push({
      type: 'urgent',
      icon: AlertTriangle,
      text: `🚨 ${closingToday} job${closingToday > 1 ? 's' : ''} closing TODAY!`,
      subtext: closingToday > 1 ? `View all ${closingToday} jobs closing today` : (urgentJobs[0] ? `${urgentJobs[0].organization} - ${urgentJobs[0].title}` : ''),
      link: closingToday > 1 ? '/?filter=closing-today' : (urgentJobs[0] ? `/jobs/${generateJobSlug(urgentJobs[0])}` : null),
      color: 'red'
    })
  }

  if (closingTomorrow > 0) {
    announcements.push({
      type: 'warning',
      icon: Clock,
      text: `⏰ ${closingTomorrow} job${closingTomorrow > 1 ? 's' : ''} closing tomorrow`,
      subtext: 'Last chance to apply!',
      link: null,
      color: 'orange'
    })
  }

  if (newToday > 0) {
    announcements.push({
      type: 'new',
      icon: Sparkles,
      text: `✨ ${newToday} new job${newToday > 1 ? 's' : ''} posted today`,
      subtext: 'Fresh opportunities available',
      link: null,
      color: 'blue'
    })
  }

  // Add a general stat if no urgent announcements
  if (announcements.length === 0) {
    announcements.push({
      type: 'info',
      icon: TrendingUp,
      text: `${jobs.length} active government jobs available`,
      subtext: 'Find your perfect opportunity',
      link: null,
      color: 'green'
    })
  }

  // Rotate announcements
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length)
      }, 5000) // Change every 5 seconds
      return () => clearInterval(interval)
    }
  }, [announcements.length])

  const announcement = announcements[currentAnnouncement] || announcements[0]
  const Icon = announcement?.icon || Bell

  // Define gradient backgrounds based on type
  const gradients = {
    urgent: 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500',
    warning: 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500',
    new: 'bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500',
    info: 'bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500'
  }

  const pulseColors = {
    urgent: 'bg-white/30',
    warning: 'bg-white/25',
    new: 'bg-white/20',
    info: 'bg-white/20'
  }

  return (
    <div className={`relative overflow-hidden ${gradients[announcement?.type as keyof typeof gradients] || gradients.info}`}>
      {/* Animated background effect */}
      <div className="absolute inset-0">
        <div className={`absolute -inset-[10px] opacity-50 ${pulseColors[announcement?.type as keyof typeof pulseColors] || pulseColors.info}`}>
          <div className="absolute inset-0 animate-pulse" />
        </div>
        {/* Moving gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-between py-1.5">
          <div className="flex items-center gap-3 flex-1">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              <Icon className="relative w-4 h-4 text-white animate-pulse" />
            </div>

            {/* Main content */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <span className="text-white font-semibold text-xs sm:text-sm">
                  {announcement?.text}
                </span>
                {announcement?.subtext && (
                  <>
                    <span className="hidden sm:inline text-white/60 text-xs">•</span>
                    <span className="text-white/90 text-xs">
                      {announcement.subtext}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Dots indicator if multiple announcements */}
            {announcements.length > 1 && (
              <div className="hidden sm:flex items-center gap-1.5 ml-4">
                {announcements.map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => setCurrentAnnouncement(index)}
                    variant="ghost"
                    size="sm"
                    className={`w-1.5 h-1.5 p-0 rounded-full transition-all ${
                      index === currentAnnouncement 
                        ? 'bg-white w-4' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to announcement ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Quick Stats Badge */}
            <div className="hidden lg:flex items-center gap-3 ml-auto mr-4">
              <div className="flex items-center gap-2 px-2 py-0.5 bg-white/20 rounded-full">
                <Zap className="w-3 h-3 text-yellow-300" />
                <span className="text-white text-xs font-medium">{jobs.length} Active Jobs</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Add shimmer animation to styles */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  )
}