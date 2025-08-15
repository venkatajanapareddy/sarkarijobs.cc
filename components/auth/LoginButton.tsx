'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, LogIn, LogOut, Star } from 'lucide-react'
import Link from 'next/link'
import { globalEvents, EVENTS } from '@/utils/events'

interface LoginButtonProps {
  user: any
  savedJobsCount?: number
}

export default function LoginButton({ user, savedJobsCount: initialCount = 0 }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [savedJobsCount, setSavedJobsCount] = useState(initialCount)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Fetch saved jobs count
  const fetchSavedJobsCount = useCallback(async () => {
    if (user) {
      try {
        const { count } = await supabase
          .from('saved_jobs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        
        setSavedJobsCount(count || 0)
      } catch (error) {
        console.error('Error fetching saved jobs count:', error)
      }
    }
  }, [user, supabase])

  // Listen for saved jobs updates and update count optimistically
  useEffect(() => {
    const handleUpdate = (event: CustomEvent) => {
      const { action } = event.detail || {}
      
      // Update count immediately based on action
      if (action === 'saved') {
        setSavedJobsCount(prev => prev + 1)
      } else if (action === 'unsaved') {
        setSavedJobsCount(prev => Math.max(0, prev - 1))
      }
      
      // Then fetch actual count in background to sync
      // Use a small delay to ensure database is updated
      setTimeout(() => {
        fetchSavedJobsCount()
      }, 500)
    }

    globalEvents.addEventListener(EVENTS.SAVED_JOBS_UPDATED, handleUpdate as EventListener)
    
    return () => {
      globalEvents.removeEventListener(EVENTS.SAVED_JOBS_UPDATED, handleUpdate as EventListener)
    }
  }, [user, fetchSavedJobsCount])

  // Fetch count when dropdown opens or user changes
  useEffect(() => {
    if (showDropdown && user) {
      fetchSavedJobsCount()
    }
  }, [showDropdown, user, fetchSavedJobsCount])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleSignIn = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      console.error('Error signing in:', error)
    }
    setIsLoading(false)
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">
            {user.email?.split('@')[0]}
          </span>
          {savedJobsCount > 0 && (
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {savedJobsCount}
            </span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
            <Link
              href="/saved-jobs"
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowDropdown(false)}
            >
              <Star className="w-4 h-4" />
              Saved Jobs ({savedJobsCount})
            </Link>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left text-red-600 dark:text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-all disabled:opacity-50"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign in</span>
    </button>
  )
}