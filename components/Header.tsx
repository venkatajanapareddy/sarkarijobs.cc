import { createClient } from "@/utils/supabase/server"
import HeaderClient from "./HeaderClient"

export default async function Header() {
  // Check if Supabase is configured
  const isSupabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
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
    <HeaderClient 
      user={user} 
      savedJobsCount={savedJobsCount} 
      isSupabaseConfigured={isSupabaseConfigured}
    />
  )
}