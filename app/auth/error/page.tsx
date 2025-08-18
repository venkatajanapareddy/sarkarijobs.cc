import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}) {
  const params = await searchParams;
  const error = params.error || 'unknown_error';
  const errorDescription = params.error_description || '';

  // Determine user-friendly error message based on error type
  let errorMessage = 'An error occurred during authentication.';
  let suggestion = 'Please try again or contact support if the issue persists.';

  if (errorDescription.includes('already registered') || errorDescription.includes('identity already exists')) {
    errorMessage = 'This email is already registered with a different sign-in method.';
    suggestion = 'Please sign in using the same method you used when creating your account (Google or Email).';
  } else if (error === 'access_denied') {
    errorMessage = 'Access was denied during authentication.';
    suggestion = 'You may have cancelled the sign-in process. Please try again.';
  } else if (error === 'invalid_request') {
    errorMessage = 'The authentication request was invalid.';
    suggestion = 'The link may have expired or been used already. Please request a new sign-in link.';
  } else if (error === 'server_error') {
    errorMessage = 'A server error occurred during authentication.';
    suggestion = 'Please wait a moment and try again.';
  } else if (errorDescription.includes('email not confirmed')) {
    errorMessage = 'Your email address has not been confirmed yet.';
    suggestion = 'Please check your email for a confirmation link.';
  } else if (errorDescription.includes('invalid') || errorDescription.includes('expired')) {
    errorMessage = 'The authentication link is invalid or has expired.';
    suggestion = 'Please request a new sign-in link.';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-4">
            Authentication Error
          </h1>

          {/* Error Message */}
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 dark:text-red-300 mb-2">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-400">
              {suggestion}
            </p>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Technical Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                <p className="text-gray-600 dark:text-gray-400">
                  Error: {error}
                </p>
                {errorDescription && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Description: {errorDescription}
                  </p>
                )}
              </div>
            </details>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>

            <button
              onClick={() => window.history.back()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Need help? Contact us at{' '}
            <a
              href="mailto:admin@sarkarijobs.cc"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              admin@sarkarijobs.cc
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}