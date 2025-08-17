import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Clock, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | SarkariJobs.cc',
  description: 'Get in touch with SarkariJobs.cc for any queries about government job notifications, recruitment updates, or website feedback.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Contact Us</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              We&apos;re here to help! Whether you have questions about job listings, need assistance navigating the website, 
              or want to report an issue, feel free to reach out to us.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <Mail className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Email Support</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  For general inquiries and support
                </p>
                <a 
                  href="mailto:admin@sarkarijobs.cc" 
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  admin@sarkarijobs.cc
                </a>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <Clock className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Response Time</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We typically respond within 24-48 hours during business days. 
                  Please allow additional time during weekends and holidays.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">How We Can Help</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Job Listing Queries</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Questions about specific job postings, eligibility criteria, or application procedures
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Technical Support</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Issues with website functionality, downloading forms, or accessing job details
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Feedback & Suggestions</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Ideas to improve our service or features you&apos;d like to see added
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Report Issues</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Broken links, incorrect information, or any problems you encounter
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-6 mb-8">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Before You Contact Us</h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Check our FAQ page for answers to common questions</li>
                    <li>• Verify job details on the official recruitment website</li>
                    <li>• Ensure you&apos;re viewing the latest job information</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Important Notice</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    SarkariJobs.cc is an information portal only. We do not charge any fees for job applications 
                    or guarantee job placements. Always apply through official government websites and beware of 
                    fraudulent job offers asking for payment.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Links</h3>
              <div className="flex flex-wrap gap-4">
                <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">Home</Link>
                <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">About Us</Link>
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
                <Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">FAQ</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}