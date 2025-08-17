import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Target, Users, Award, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | SarkariJobs.cc - Your Trusted Government Job Portal',
  description: 'Learn about SarkariJobs.cc, India\'s dedicated platform for latest government job notifications, exam dates, and recruitment updates across all government departments.',
};

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About SarkariJobs.cc</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Welcome to SarkariJobs.cc, your comprehensive destination for the latest government job notifications 
              across India. We are dedicated to helping job seekers find their dream government positions by providing 
              timely, accurate, and detailed information about recruitment opportunities.
            </p>

            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="flex gap-4">
                <Target className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Our Mission</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    To simplify the government job search process by providing all recruitment information in one 
                    centralized, easy-to-navigate platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Users className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Who We Serve</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Students, graduates, and professionals across India looking for opportunities in government 
                    departments, PSUs, banks, railways, and defense services.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Award className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">What We Offer</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Latest job notifications, application forms, exam dates, eligibility criteria, and direct links 
                    to official recruitment websites.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <TrendingUp className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Our Commitment</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    We update our portal daily to ensure you never miss an important government job opportunity 
                    or application deadline.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">Why Choose SarkariJobs.cc?</h2>
            
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Comprehensive Coverage:</strong> All government job notifications from central and state governments in one place</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Real-time Updates:</strong> Fresh job postings added daily with instant notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Detailed Information:</strong> Complete job details including eligibility, salary, and application process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Direct Links:</strong> Official application forms and notification PDFs for easy access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Mobile Friendly:</strong> Access job notifications on any device, anywhere, anytime</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Free Service:</strong> No registration fees or hidden charges - completely free for all users</span>
              </li>
            </ul>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Stay Connected</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Bookmark SarkariJobs.cc and visit daily for the latest government job updates. Your dream government 
                job might be just one click away!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}