import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | SarkariJobs.cc',
  description: 'Privacy Policy for SarkariJobs.cc - Learn how we collect, use, and protect your information when you use our government job portal.',
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Last updated: August 14, 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Introduction</h2>
              <p>
                Welcome to SarkariJobs.cc (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We respect your privacy and are committed to protecting 
                your personal information. This Privacy Policy explains how we collect, use, and safeguard your information 
                when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Automatically Collected Information</h3>
              <p>When you visit SarkariJobs.cc, we automatically collect certain information about your device:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address (anonymized)</li>
                <li>Pages you visit on our site</li>
                <li>Time and date of your visit</li>
                <li>Time spent on pages</li>
                <li>Referring website</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">Information You Provide</h3>
              <p>
                Currently, SarkariJobs.cc does not require user registration or collect personal information directly. 
                If you contact us via email, we may collect your email address and any information you provide in your message.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">3. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide and maintain our website</li>
                <li>Improve user experience and website functionality</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Detect and prevent technical issues</li>
                <li>Respond to user inquiries (if you contact us)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Analytics Services</h2>
              <p>We use the following analytics services to improve our website:</p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Google Analytics</h3>
              <p>
                We use Google Analytics to track website usage and user behavior. Google Analytics collects information 
                anonymously and reports website trends without identifying individual visitors. You can opt-out of Google 
                Analytics by installing the Google Analytics Opt-out Browser Add-on.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">Vercel Analytics</h3>
              <p>
                We use Vercel Analytics to monitor website performance and user experience metrics. This helps us ensure 
                fast loading times and optimal performance for all users.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Cookies</h2>
              <p>
                SarkariJobs.cc uses essential cookies to maintain user preferences (such as dark/light theme selection). 
                These cookies do not contain personal information and are necessary for the website to function properly.
              </p>
              <p className="mt-2">
                Third-party services (Google Analytics) may set their own cookies. Please refer to their respective 
                privacy policies for more information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information against 
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over 
                the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Third-Party Links</h2>
              <p>
                Our website contains links to official government websites and recruitment portals. We are not responsible 
                for the privacy practices or content of these external sites. We encourage you to read the privacy policies 
                of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">8. Children&apos;s Privacy</h2>
              <p>
                SarkariJobs.cc is intended for users who are at least 18 years old or the minimum age for employment in 
                their jurisdiction. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">9. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access the information we have about you</li>
                <li>Request correction of any inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of analytics tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted on this page with an 
                updated &quot;Last updated&quot; date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-3">11. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <p className="mt-2">
                Email: admin@sarkarijobs.cc<br />
                Website: https://sarkarijobs.cc
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}