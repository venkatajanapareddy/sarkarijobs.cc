'use client'

import { Moon, Sun } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeContext } from './ThemeProvider'

export default function ThemeToggle() {
  // Use useContext directly to handle undefined case
  const context = useContext(ThemeContext)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // If no context, don't render anything (component is outside provider)
  if (!context) {
    return null
  }

  const { theme, toggleTheme } = context

  // Use a fixed aria-label to prevent hydration mismatch
  // The icons already indicate the current state visually
  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      title={mounted ? `Switch to ${theme === 'light' ? 'dark' : 'light'} mode` : 'Toggle theme'}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-100 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}