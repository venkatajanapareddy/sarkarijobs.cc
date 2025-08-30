import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { loadJobs } from "@/lib/jobs-server";
import NextTopLoader from 'nextjs-toploader';
import { WebsiteStructuredData } from "@/components/StructuredData";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SarkariJobs.cc - Latest Government Jobs in India",
  description: "Find the latest government job notifications, exam dates, and application forms for various government departments across India.",
  keywords: "government jobs, sarkari naukri, govt jobs, indian government jobs, upsc, ssc, railway jobs, bank jobs, defense jobs",
  authors: [{ name: "SarkariJobs.cc Team" }],
  creator: "SarkariJobs.cc",
  publisher: "SarkariJobs.cc",
  metadataBase: new URL('https://sarkarijobs.cc'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://sarkarijobs.cc',
    siteName: 'SarkariJobs.cc',
    title: 'SarkariJobs.cc - Latest Government Jobs in India',
    description: 'Find the latest government job notifications, exam dates, and application forms for various government departments across India.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SarkariJobs.cc - Your Gateway to Government Jobs',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SarkariJobs.cc - Latest Government Jobs in India',
    description: 'Find the latest government job notifications, exam dates, and application forms for various government departments across India.',
    images: ['/og-image.png'],
    creator: '@sarkarijobs_cc',
  },
  alternates: {
    canonical: 'https://sarkarijobs.cc',
  },
  verification: {
    // google: handled via GSC
    // bing: imported from GSC
    yandex: '51f17cdf65df9a55',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load jobs for announcement bar
  const jobs = await loadJobs();
  
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <head>
        <meta name="yandex-verification" content="51f17cdf65df9a55" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Apply theme immediately before any paint to prevent flash
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    // Default to light if no preference
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback to light theme on error
                  document.documentElement.classList.remove('dark');
                }
                
                // Disable right-click context menu
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                  return false;
                });
                
                // Disable text selection with mouse
                document.addEventListener('selectstart', function(e) {
                  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Disable copy keyboard shortcuts
                document.addEventListener('keydown', function(e) {
                  // Disable Ctrl+A, Ctrl+C, Ctrl+X
                  if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'c' || e.key === 'x')) {
                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                      e.preventDefault();
                      return false;
                    }
                  }
                  // Disable F12 (Developer Tools)
                  if (e.key === 'F12') {
                    e.preventDefault();
                    return false;
                  }
                  // Disable Ctrl+Shift+I (Developer Tools)
                  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
                    e.preventDefault();
                    return false;
                  }
                  // Disable Ctrl+Shift+J (Console)
                  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
                    e.preventDefault();
                    return false;
                  }
                  // Disable Ctrl+U (View Source)
                  if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                    e.preventDefault();
                    return false;
                  }
                });
                
                // Disable drag
                document.addEventListener('dragstart', function(e) {
                  e.preventDefault();
                  return false;
                });
              })();
            `,
          }}
        />
      
        <NextTopLoader
          color="#0066CC"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #0066CC,0 0 5px #0066CC"
        />
        <GoogleAnalytics />
        <WebsiteStructuredData />
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
            <AnnouncementBar jobs={jobs} />
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
