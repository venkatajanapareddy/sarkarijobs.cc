import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions | SarkariJob.cc',
  description: 'Find answers to common questions about government job applications, eligibility, exam patterns, and using SarkariJob.cc effectively.',
};

const faqs = [
  {
    question: "What is SarkariJob.cc?",
    answer: "SarkariJob.cc is a free job portal that provides the latest government job notifications from various central and state government departments, PSUs, banks, railways, defense services, and other government organizations across India."
  },
  {
    question: "Is SarkariJob.cc an official government website?",
    answer: "No, SarkariJob.cc is an independent information portal that aggregates and presents government job notifications from official sources. We provide links to official websites for applications. Always verify information on the official recruitment website."
  },
  {
    question: "Do I need to pay any fees to use SarkariJob.cc?",
    answer: "No, SarkariJob.cc is completely free to use. We do not charge any fees for accessing job information, downloading forms, or using any features of our website. Beware of any website or person asking for payment for government job information."
  },
  {
    question: "How often is the website updated with new jobs?",
    answer: "We update our website daily with new government job notifications. We recommend visiting regularly or bookmarking our site to stay updated with the latest opportunities."
  },
  {
    question: "How do I apply for jobs listed on SarkariJob.cc?",
    answer: "Click on any job listing to view detailed information. Each job page provides direct links to the official application website and downloadable application forms. Always apply through the official government website mentioned in the notification."
  },
  {
    question: "Can I apply for government jobs through SarkariJob.cc directly?",
    answer: "No, we only provide information about job openings. You must apply through the official website of the recruiting organization. We provide direct links to official websites and application forms for your convenience."
  },
  {
    question: "What information is provided for each job listing?",
    answer: "Each job listing includes: organization name, post details, number of vacancies, eligibility criteria, age limits, educational qualifications, salary/pay scale, application fees, important dates, and links to official notifications and application forms."
  },
  {
    question: "How can I download application forms?",
    answer: "Click on any job listing and look for the 'Download Application Form' button. This will download the official application form PDF. Some posts require online application only, in which case we provide the link to the official website."
  },
  {
    question: "What is the age limit for government jobs?",
    answer: "Age limits vary by position and organization, typically ranging from 18-30 years for general category. Age relaxation is provided for SC/ST, OBC, PWD, and other reserved categories as per government rules. Check specific job notifications for exact age criteria."
  },
  {
    question: "How do I know if I'm eligible for a government job?",
    answer: "Each job listing specifies eligibility criteria including educational qualifications, age limits, and experience requirements. Carefully read the detailed notification and official advertisement before applying."
  },
  {
    question: "What documents are typically required for government job applications?",
    answer: "Common documents include: educational certificates, caste certificate (if applicable), age proof, photograph, signature, Aadhaar card, and experience certificates (if required). Specific requirements are mentioned in each job notification."
  },
  {
    question: "How can I prepare for government job exams?",
    answer: "Focus on the syllabus mentioned in the official notification. Prepare topics like General Knowledge, Current Affairs, Reasoning, Quantitative Aptitude, and subject-specific knowledge based on the post. Practice previous year question papers and mock tests."
  },
  {
    question: "What if I find incorrect information on SarkariJob.cc?",
    answer: "While we strive for accuracy, if you find any incorrect information, please contact us immediately at admin@sarkarijob.cc. Always verify critical information like dates and eligibility on the official recruitment website."
  },
  {
    question: "Why should I trust SarkariJob.cc?",
    answer: "We source all information directly from official government websites and notifications. We provide direct links to official sources for verification. We never charge fees or make false promises about job guarantees."
  },
  {
    question: "What should I do if an application link is not working?",
    answer: "First, try accessing the official website directly. Government websites sometimes face high traffic. If the issue persists, contact us at admin@sarkarijob.cc with the job details, and we'll update the information."
  },
  {
    question: "Are state government jobs also listed on SarkariJob.cc?",
    answer: "Yes, we list both central and state government job opportunities from across India, including state PSCs, state police, state health departments, and other state government organizations."
  },
  {
    question: "How can I stay safe from job scams?",
    answer: "Never pay money for government job applications (except official application fees paid on government websites). Always verify job notifications on official websites. Be cautious of promises of guaranteed selection or insider information."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Frequently Asked Questions</h1>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
            Find answers to common questions about government jobs and using SarkariJob.cc
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group border dark:border-gray-700 rounded-lg">
                <summary className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Still Have Questions?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you couldn't find the answer you're looking for, feel free to contact us.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-8 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">⚠️ Important Disclaimer</h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              SarkariJob.cc is not affiliated with any government organization. We are an independent platform providing 
              information about government job opportunities. Always verify information on official government websites 
              before making any decisions. We are not responsible for any changes in recruitment processes or requirements 
              made by recruiting organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}