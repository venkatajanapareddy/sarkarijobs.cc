'use client'

import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SignInModal from './SignInModal'
import { globalEvents, EVENTS } from '@/utils/events'
import { createClient } from '@/utils/supabase/client'

interface SaveJobButtonProps {
  jobId: string
  jobTitle?: string
  jobOrganization?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  initialSaved?: boolean
}

export default function SaveJobButton({ 
  jobId, 
  jobTitle,
  jobOrganization,
  size = 'md',
  showText = false,
  initialSaved = false
}: SaveJobButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(false)
  const [showSignInModal, setShowSignInModal] = useState(false)
  const router = useRouter()

  // Update isSaved when initialSaved prop changes
  useEffect(() => {
    setIsSaved(initialSaved)
  }, [initialSaved])

  useEffect(() => {
    // Check if Supabase is configured
    const checkSupabase = async () => {
      try {
        const supabase = createClient()
        setIsSupabaseConfigured(true)
        
        // Check if user is logged in
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // Don't check saved status here - rely on initialSaved prop
        // Client-side Supabase queries are hanging
        
        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.log('Supabase not configured:', error)
        setIsSupabaseConfigured(false)
      }
    }
    
    checkSupabase()
  }, [jobId, initialSaved])

  const handleSignIn = async () => {
    setShowSignInModal(false)
    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${window.location.pathname}`,
        },
      })
      
      if (error) {
        console.error('Error signing in:', error)
      }
    } catch (error) {
      console.error('Error signing in:', error)
    }
  }

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if button is inside a link
    e.stopPropagation()

    if (!isSupabaseConfigured) {
      // Supabase not configured, do nothing
      return
    }

    if (!user) {
      // Show sign in modal instead of redirecting immediately
      setShowSignInModal(true)
      return
    }

    // Optimistic update - change UI immediately
    const newSavedState = !isSaved
    setIsSaved(newSavedState)
    
    // Emit event immediately for instant UI updates across components
    globalEvents.emit(EVENTS.SAVED_JOBS_UPDATED, { 
      jobId, 
      action: newSavedState ? 'saved' : 'unsaved' 
    })

    // Then sync with backend (no loading state to avoid UI flicker)
    try {
      const supabase = createClient()

      if (!newSavedState) {
        // Remove from saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId)

        if (error) {
          // Revert on error
          console.error('Error removing saved job:', error)
          setIsSaved(true)
          globalEvents.emit(EVENTS.SAVED_JOBS_UPDATED, { jobId, action: 'saved' })
        }
      } else {
        // Add to saved jobs
        const { error } = await supabase
          .from('saved_jobs')
          .insert({
            user_id: user.id,
            job_id: jobId,
            job_title: jobTitle,
            job_organization: jobOrganization,
          })

        if (error) {
          // Revert on error
          console.error('Error saving job:', error)
          setIsSaved(false)
          globalEvents.emit(EVENTS.SAVED_JOBS_UPDATED, { jobId, action: 'unsaved' })
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error)
      // Revert optimistic update on network error
      setIsSaved(!newSavedState)
      globalEvents.emit(EVENTS.SAVED_JOBS_UPDATED, { 
        jobId, 
        action: !newSavedState ? 'saved' : 'unsaved' 
      })
    }
  }

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  // Don't render if Supabase is not configured
  if (!isSupabaseConfigured) {
    return null
  }

  return (
    <>
      <button
        onClick={handleSaveToggle}
        disabled={isLoading}
        className={`${sizeClasses[size]} rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2`}
        title={isSaved ? 'Remove from saved jobs' : 'Save job'}
      >
        <Star 
          className={`${iconSizes[size]} ${isSaved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'} transition-colors`}
        />
        {showText && (
          <span className="text-sm font-medium">
            {isSaved ? 'Saved' : 'Save'}
          </span>
        )}
      </button>
      
      <SignInModal 
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
      />
    </>
  )
}