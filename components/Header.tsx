import Link from "next/link"
import { Briefcase } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import LoginButton from "./auth/LoginButton"
import { createClient } from "@/utils/supabase/server"

export default async function Header() {
  // Check if Supabase is configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  let user = null
  let savedJobsCount = 0
  
  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      user = authUser
      
      if (user) {
        const { count } = await supabase
          .from('saved_jobs')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        savedJobsCount = count || 0
      }
    } catch (error) {
      console.error('Supabase auth error:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Briefcase className="w-6 h-6 md:w-8 md:h-8 text-primary-blue dark:text-blue-400" />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">SarkariJob.cc</h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block">Find Latest Government Jobs in India 🇮🇳</p>
            </div>
          </Link>
          
          {/* Right side actions */}
          <div className="flex items-center gap-3">
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