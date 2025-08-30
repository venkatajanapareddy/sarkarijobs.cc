'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Helper to get initial theme
function getInitialTheme(): Theme {
  // Check if we're on the client and if dark class is already applied
  if (typeof window !== 'undefined') {
    // First check if dark class is already applied by the script
    if (document.documentElement.classList.contains('dark')) {
      return 'dark'
    }
    // Fallback to localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null
    return savedTheme || 'light'
  }
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme based on what's already applied to prevent flash
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Ensure the theme class matches our state
    const currentTheme = getInitialTheme()
    if (currentTheme !== theme) {
      setTheme(currentTheme)
    }
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    
    const newTheme = theme === 'light' ? 'dark' : 'light'
    
    // Apply changes immediately to prevent flash
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    localStorage.setItem('theme', newTheme)
    setTheme(newTheme)
  }

  // Don't wait for mounting - render immediately to prevent flash
  // The theme is already set from localStorage in useEffect

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}