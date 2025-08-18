'use client';

import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingToastProps {
  message: string;
  isVisible: boolean;
}

export default function LoadingToast({ message, isVisible }: LoadingToastProps) {
  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 10 seconds (failsafe)
      const timeout = setTimeout(() => {
        const toast = document.getElementById('loading-toast');
        if (toast) {
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
        }
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      id="loading-toast"
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300"
      style={{
        animation: 'slideDown 0.3s ease-out'
      }}
    >
      <div className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 backdrop-blur-sm">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="font-medium">{message}</span>
      </div>
      
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -1rem);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
}