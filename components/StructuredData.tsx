export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SarkariJobs.cc",
    "description": "Find the latest government job notifications, exam dates, and application forms for various government departments across India.",
    "url": "https://sarkarijobs.cc",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://sarkarijobs.cc/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SarkariJobs.cc",
      "logo": {
        "@type": "ImageObject",
        "url": "https://sarkarijobs.cc/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface JobPostingProps {
  job: {
    title: string;
    organization: string;
    description?: string;
    location?: string;
    salary?: string;
    qualification?: string;
    lastDate?: string;
    postedDate?: string;
    vacancies?: number;
    applicationUrl?: string;
  };
}

export function JobPostingStructuredData({ job }: JobPostingProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": job.title,
    "description": job.description || `${job.title} position at ${job.organization}`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": job.organization,
      "sameAs": "https://sarkarijobs.cc"
    },
    "jobLocation": job.location ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN",
        "addressLocality": job.location
      }
    } : {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    },
    "datePosted": job.postedDate || new Date().toISOString(),
    "validThrough": job.lastDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "employmentType": "FULL_TIME",
    "baseSalary": job.salary ? {
      "@type": "MonetaryAmount",
      "currency": "INR",
      "value": {
        "@type": "QuantitativeValue",
        "value": job.salary,
        "unitText": "MONTH"
      }
    } : undefined,
    "educationRequirements": job.qualification ? {
      "@type": "EducationalOccupationalCredential",
      "credentialCategory": job.qualification
    } : undefined,
    "totalJobOpenings": job.vacancies,
    "applicationUrl": job.applicationUrl || "https://sarkarijobs.cc"
  };

  // Remove undefined values
  Object.keys(structuredData).forEach(key => {
    if (structuredData[key as keyof typeof structuredData] === undefined) {
      delete structuredData[key as keyof typeof structuredData];
    }
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url?: string }> }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url || undefined
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}