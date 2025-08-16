'use client'

import { Moon, Sun } from 'lucide-react'
import { useContext } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeContext } from './ThemeProvider'

export default function ThemeToggle() {
  // Use useContext directly to handle undefined case
  const context = useContext(ThemeContext)
  
  // If no context, don't render anything (component is outside provider)
  if (!context) {
    return null
  }

  const { theme, toggleTheme } = context

  return (
    <Button
      onClick={toggleTheme}
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-transform duration-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-transform duration-100 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}