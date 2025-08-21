'use client'

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"
import LoginButton from "./auth/LoginButton"
import GovBuildingLogo from "./GovBuildingLogo"

interface HeaderClientProps {
  user: any
  savedJobsCount: number
  isSupabaseConfigured: boolean
}

export default function HeaderClient({ user, savedJobsCount, isSupabaseConfigured }: HeaderClientProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <GovBuildingLogo className="w-10 h-10 md:w-12 md:h-12" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">SarkariJobs.cc</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Find Latest Government Jobs in India 🇮🇳</p>
            </div>
          </Link>
          
          {/* Navigation and actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Right side actions */}
            {isSupabaseConfigured && (
              <LoginButton user={user} savedJobsCount={savedJobsCount} />
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}