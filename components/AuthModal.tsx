'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Shield, Star, Bell, BookmarkCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultToSignIn?: boolean;
}

export default function AuthModal({ isOpen, onClose, defaultToSignIn = true }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(!defaultToSignIn);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setEmail('');
      setMessage(null);
      setIsSignUp(!defaultToSignIn);
    }
  }, [isOpen, defaultToSignIn]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      
      if (isSignUp) {
        // Sign up with magic link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          // Check if the error is due to existing account with different provider
          if (error.message?.includes('already registered') || error.message?.includes('identity already exists')) {
            throw new Error('This email is already registered. Please sign in with Google if you previously used Google to create your account.');
          }
          throw error;
        }

        setMessage({
          type: 'success',
          text: 'Check your email for the magic link to complete sign up!'
        });
        setEmail('');
      } else {
        // Sign in with magic link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          // Check if the error is due to existing account with different provider
          if (error.message?.includes('already registered') || error.message?.includes('identity already exists')) {
            throw new Error('This email is already registered with Google. Please use "Continue with Google" to sign in.');
          }
          throw error;
        }

        setMessage({
          type: 'success',
          text: 'Check your email for the magic link to sign in!'
        });
        setEmail('');
      }
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to sign in with Google'
      });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {isSignUp 
                  ? 'Start saving jobs and get notifications' 
                  : 'Sign in to access your saved jobs'}
              </p>
            </div>

            {/* Benefits (only show for new sign ups) */}
            {isSignUp && (
              <div className="mb-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Save Your Favorite Jobs</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Bookmark jobs to review later</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Get Notifications</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Never miss application deadlines</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookmarkCheck className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Track Applications</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Keep track of where you&apos;ve applied</p>
                  </div>
                </div>
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up with Email' : 'Sign In with Email')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                {isLoading ? 'Please wait...' : 'Continue with Google'}
              </span>
            </button>

            {/* Toggle between sign up and sign in */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {isSignUp ? 'Already have an account?' : "New to SarkariJobs.cc?"}
              </span>{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage(null);
                }}
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {isSignUp ? 'Sign In Instead' : 'Create Account'}
              </button>
            </div>

            {/* Privacy notice */}
            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            
            {/* Sign in method notice */}
            {!isSignUp && (
              <p className="mt-2 text-xs text-center text-amber-600 dark:text-amber-400">
                ⚠️ Use the same method you used to create your account
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}