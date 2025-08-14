// Design System Constants for consistency across the app

export const colors = {
  primary: {
    blue: '#0066CC',
    dark: '#003D7A',
    light: '#E6F2FF',
  },
  status: {
    success: '#22C55E',
    warning: '#F97316',
    danger: '#DC2626',
    info: '#3B82F6',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
}

export const buttonStyles = {
  primary: 'bg-gradient-to-r from-primary-blue to-blue-600 text-white shadow-sm hover:shadow-md transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2',
  secondary: 'bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2',
  success: 'bg-success-green text-white hover:bg-green-700 transition-colors',
  danger: 'bg-danger-red text-white hover:bg-red-700 transition-colors',
}

export const transitions = {
  default: 'transition-all duration-200',
  smooth: 'transition-all duration-300',
  slow: 'transition-all duration-500',
}

export const shadows = {
  sm: 'shadow-sm',
  default: 'shadow',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
}

export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  pulse: 'animate-pulse',
}