import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "@/components/Footer";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
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
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
