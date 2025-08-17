import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Building, MapPin, Banknote, FileText, ExternalLink, Download, Clock, GraduationCap, IndianRupee } from 'lucide-react';
import { loadJobDetails, loadJobs } from '@/lib/jobs-server';
import { formatDate, getDaysLeft } from '@/lib/jobs-types';
import { generateJobSlug, extractJobIdFromSlug } from '@/lib/slug-utils';
import type { Metadata } from 'next';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: slug } = await params;
  const jobId = extractJobIdFromSlug(slug);
  const job = await loadJobDetails(jobId);
  
  if (!job) {
    return {
      title: 'Job Not Found | SarkariJobs.cc',
    };
  }
  
  const description = `${job.organization} is hiring for ${job.title}. ${job.totalPosts ? `${job.totalPosts} vacancies available.` : ''} ${job.salary ? `Salary: ${job.salary}.` : ''} Last date to apply: ${job.lastDate ? formatDate(job.lastDate) : 'Check notification'}.`;
  
  return {
    title: `${job.title} - ${job.organization} | SarkariJobs.cc`,
    description: description.substring(0, 160),
    keywords: `${job.title}, ${job.organization}, government jobs, sarkari naukri, ${job.location || 'India'}, recruitment 2025`,
    openGraph: {
      title: `${job.title} - ${job.organization}`,
      description,
      type: 'article',
      siteName: 'SarkariJobs.cc',
    },
    twitter: {
      card: 'summary',
      title: `${job.title} - ${job.organization}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// Pre-build all job pages at build time
export async function generateStaticParams() {
  const jobs = await loadJobs();
  return jobs.map((job) => ({
    id: generateJobSlug(job),
  }));
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: slug } = await params;
  const jobId = extractJobIdFromSlug(slug);
  const job = await loadJobDetails(jobId);
  
  if (!job) {
    notFound();
  }
  
  const daysLeft = getDaysLeft(job.lastDate);
  const rawContent = job.rawContent?.content;
  
  // Parse sections from raw content
  const sections = rawContent?.sections || {};
  const tables = rawContent?.tables || [];
  const lists = rawContent?.lists || [];
  const paragraphs = rawContent?.paragraphs || [];
  
  // Extract specific information from tables and content
  let ageLimit = null;
  let selectionProcess = null;
  let applicationFee = null;
  let howToApply = null;
  
  // First check tables for structured data
  for (const table of tables) {
    if (table.rows) {
      for (const row of table.rows) {
        const rowText = row.map((cell: any) => cell.text || '').join(' ').toLowerCase();
        
        // Look for age limit in table rows
        if (rowText.includes('age limit') || rowText.includes('age:')) {
          const ageCell = row.find((cell: any) => 
            cell.text && (cell.text.includes('years') || cell.text.includes('yrs') || /\d{2}-\d{2}/.test(cell.text))
          );
          if (ageCell) ageLimit = ageCell.text;
        }
        
        // Look for application fee
        if (rowText.includes('application fee') || rowText.includes('fee')) {
          const feeCell = row.find((cell: any) => 
            cell.text && (cell.text.includes('₹') || cell.text.includes('Rs') || cell.text.includes('Free') || cell.text.includes('Nil'))
          );
          if (feeCell) applicationFee = feeCell.text;
        }
        
        // Look for selection process
        if (rowText.includes('selection process') || rowText.includes('selection procedure')) {
          const nextRowIndex = table.rows.indexOf(row) + 1;
          if (nextRowIndex < table.rows.length) {
            selectionProcess = table.rows[nextRowIndex].map((cell: any) => cell.text).join(', ');
          }
        }
      }
    }
  }
  
  // If not found in tables, try to extract from paragraphs more precisely
  if (!ageLimit) {
    for (const para of paragraphs) {
      const ageMatch = para.match(/age\s*(?:limit)?[:\s]+(\d{2}\s*(?:to|-)\s*\d{2}\s*years?)/i) ||
                       para.match(/(\d{2}\s*(?:to|-)\s*\d{2}\s*years?)/i);
      if (ageMatch) {
        ageLimit = ageMatch[1];
        break;
      }
    }
  }
  
  if (!applicationFee) {
    for (const para of paragraphs) {
      const feeMatch = para.match(/application\s*fee[:\s]+(₹?\s*\d+(?:\/-)?)|(Free|Nil|No\s*fee)/i) ||
                       para.match(/fee[:\s]+(₹?\s*\d+)/i);
      if (feeMatch) {
        applicationFee = feeMatch[0];
        break;
      }
    }
  }
  
  if (!selectionProcess) {
    for (const para of paragraphs) {
      if (para.toLowerCase().includes('written test') || para.toLowerCase().includes('interview') || 
          para.toLowerCase().includes('skill test')) {
        // Extract just the selection process part, not the entire paragraph
        const processMatch = para.match(/(?:selection\s*(?:process|procedure)?[:\s]+)?([^.]*(?:written|interview|skill|test|examination)[^.]*)/i);
        if (processMatch) {
          selectionProcess = processMatch[1].substring(0, 200); // Limit length
          break;
        }
      }
    }
  }
  
  // Extract how to apply from lists or paragraphs
  const applyList = lists.find((list: any) => 
    list.items?.some((item: string) => item.toLowerCase().includes('official website') || 
                                       item.toLowerCase().includes('apply'))
  );
  if (applyList) {
    howToApply = applyList.items;
  }
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": paragraphs[0] || `${job.organization} is hiring for ${job.title}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization,
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressRegion": job.location || "India"
      }
    },
    "datePosted": job.publishedAt || job.metadata?.scrapedAt,
    "validThrough": job.lastDate,
    "employmentType": "FULL_TIME",
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "MONTH"
      }
    } : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Jobs
        </Link>
        
        {/* Job Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{job.organization}</span>
                </div>
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.totalPosts && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{job.totalPosts} Posts</span>
                  </div>
                )}
              </div>
            </div>
            {daysLeft !== null && (
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                daysLeft <= 2 ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                daysLeft <= 7 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              }`}>
                {daysLeft === 0 ? 'Last Day!' : 
                 daysLeft === 1 ? '1 day left' : 
                 `${daysLeft} days left`}
              </div>
            )}
          </div>
          
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t dark:border-gray-800">
            {job.salary && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Salary</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{job.salary}</p>
              </div>
            )}
            {job.lastDate && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Last Date</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(job.lastDate)}</p>
              </div>
            )}
            {job.applicationStartDate && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Start Date</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(job.applicationStartDate)}</p>
              </div>
            )}
            {job.category && (
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Category</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{job.category}</p>
              </div>
            )}
          </div>
          
          {/* Quick Actions - All important links in one place */}
          {(job.links?.applicationFormLocal || job.links?.applicationForm || job.links?.official || job.links?.notification) && (
            <div className="mt-4 pt-4 border-t dark:border-gray-800">
              <div className="flex flex-wrap gap-3">
                {(job.links?.applicationFormLocal || job.links?.applicationForm) && (
                  <a
                    href={job.links?.applicationFormLocal ? `/api/forms/${job.id}` : job.links.applicationForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Application Form
                  </a>
                )}
                
                {job.links?.official && (
                  <a
                    href={job.links.official}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Official Website
                  </a>
                )}
                
                {job.links?.notification && (
                  <a
                    href={job.links.notification}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    View Notification
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content from Raw Data */}
        {paragraphs.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Job Details</h2>
            <div className="prose dark:prose-invert max-w-none">
              {paragraphs[0] && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  {paragraphs[0]}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Vacancy Details Table - Only show relevant positions */}
        {job.positions && job.positions.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Vacancy Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Post Name</th>
                    <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Vacancies</th>
                    <th className="text-left p-3 font-medium text-gray-900 dark:text-gray-100">Qualification</th>
                  </tr>
                </thead>
                <tbody>
                  {job.positions
                    .filter((position: any) => 
                      !position.title.toLowerCase().includes('posted on') && 
                      !position.title.toLowerCase().includes('jobs')
                    )
                    .slice(0, 10)
                    .map((position: any, index: number) => (
                      <tr key={index} className="border-b dark:border-gray-800">
                        <td className="p-3 text-gray-700 dark:text-gray-300">{position.title}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{position.vacancies || '-'}</td>
                        <td className="p-3 text-gray-700 dark:text-gray-300">{position.qualification || 'See notification'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        
        {/* Important Information Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Age Limit */}
          {ageLimit && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Age Limit
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{ageLimit}</p>
            </div>
          )}
          
          {/* Selection Process */}
          {selectionProcess && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-green-500" />
                Selection Process
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{selectionProcess}</p>
            </div>
          )}
          
          {/* Application Fee */}
          {applicationFee && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-orange-500" />
                Application Fee
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{applicationFee}</p>
            </div>
          )}
          
          {/* Pay Scale */}
          {job.salary && (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-purple-500" />
                Pay Scale
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Salary Range: {job.salary}
              </p>
            </div>
          )}
        </div>
        
        {/* How to Apply */}
        {howToApply && Array.isArray(howToApply) && howToApply.length > 0 && (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">How to Apply</h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-2">
              {howToApply.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
      </div>
    </div>
    </>
  );
}