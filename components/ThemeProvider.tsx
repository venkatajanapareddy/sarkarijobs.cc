'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Start with 'light' on server to match default, will be corrected on mount
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Once mounted, read the actual theme from DOM/localStorage
    const isDark = document.documentElement.classList.contains('dark')
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const currentTheme = isDark ? 'dark' : (savedTheme || 'light')
    
    setTheme(currentTheme)
    setMounted(true)
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