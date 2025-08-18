'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, LogIn, LogOut, Star } from 'lucide-react'
import Link from 'next/link'
import { globalEvents, EVENTS } from '@/utils/events'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import AuthModal from '@/components/AuthModal'

interface LoginButtonProps {
  user: any
  savedJobsCount?: number
}

export default function LoginButton({ user, savedJobsCount: initialCount = 0 }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [savedJobsCount, setSavedJobsCount] = useState(initialCount)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [hasExistingAccount, setHasExistingAccount] = useState<boolean | null>(null)
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

  // Check if user has visited before (has existing account)
  useEffect(() => {
    const checkExistingAccount = () => {
      // Check localStorage for previous auth
      const hasSignedInBefore = localStorage.getItem('hasSignedIn')
      const lastAuthProvider = localStorage.getItem('lastAuthProvider')
      
      if (hasSignedInBefore === 'true') {
        setHasExistingAccount(true)
        // Store the provider for auto-signin
        if (lastAuthProvider) {
          localStorage.setItem('preferredAuthProvider', lastAuthProvider)
        }
      } else {
        setHasExistingAccount(false)
      }
    }
    
    checkExistingAccount()
  }, [])

  // Store auth success in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('hasSignedIn', 'true')
      // Try to detect which provider was used
      if (user.app_metadata?.provider) {
        localStorage.setItem('lastAuthProvider', user.app_metadata.provider)
      }
    }
  }, [user])

  const handleSignIn = async () => {
    // Check if user has signed in before
    const hasSignedInBefore = localStorage.getItem('hasSignedIn') === 'true'
    const lastProvider = localStorage.getItem('lastAuthProvider')
    
    if (hasSignedInBefore && lastProvider === 'google') {
      // Auto-signin with Google for returning users
      setIsLoading(true)
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) {
          console.error('Error signing in:', error)
          // If auto-signin fails, show the modal
          setShowAuthModal(true)
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      // Show modal for new users or users without clear provider preference
      setShowAuthModal(true)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
      // Use location.href for a full page reload
      window.location.href = '/'
    } catch (error) {
      console.error('Error during sign out:', error)
      // Force reload even if there's an error
      window.location.href = '/'
    }
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">
              {user.email?.split('@')[0]}
            </span>
            {savedJobsCount > 0 && (
              <Badge variant="default" className="ml-1">
                {savedJobsCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href="/saved-jobs" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Saved Jobs ({savedJobsCount})
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              handleSignOut()
            }}
            disabled={isLoading}
            className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <Button
        onClick={handleSignIn}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className="gap-2"
      >
        <LogIn className="w-4 h-4" />
        <span>{isLoading ? 'Signing in...' : 'Sign in'}</span>
      </Button>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        defaultToSignIn={hasExistingAccount === true}
      />
    </>
  )
}