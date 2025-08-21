import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import ResultDetailClient from './ResultDetailClient';

interface ResultData {
  id: string;
  examName: string;
  organization: string;
  resultType: string;
  status: string;
  category: string;
  dates: {
    declared?: string;
    exam?: string;
  };
  links: {
    resultPage?: string;
    downloadPDF?: string;
    officialWebsite?: string;
    answerKey?: string;
    notification?: string;
  };
  metadata: {
    originalTitle: string;
    url: string;
    scrapedAt?: string;
    processedAt?: string;
  };
  rawContent?: string;
  extractedContent?: any;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getResult(id: string): Promise<ResultData | null> {
  try {
    // Get basic result data
    const filePath = path.join(process.cwd(), 'public', 'data', 'exam_results', `result_${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    const result = JSON.parse(data);
    
    // Try to get raw scraped content
    try {
      // Use absolute path to dreadnought/data directory
      const rawFilePath = path.join('/Users/v/code/dreadnought/data/exam_results/raw', `result_${id}.json`);
      const rawContent = await fs.readFile(rawFilePath, 'utf-8');
      const rawData = JSON.parse(rawContent);
      
      // Add extracted content to result
      if (rawData.extractedContent) {
        result.extractedContent = rawData.extractedContent;
      }
      if (rawData.rawHTML) {
        // We'll process this client-side for safety
        result.rawContent = rawData.rawHTML;
        console.log(`Loaded raw HTML for ${id}, length: ${rawData.rawHTML.length}`);
      }
    } catch (rawError) {
      // Raw content not available, continue without it
      console.error(`No raw content for result ${id}:`, rawError);
    }
    
    return result;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  
  if (!result) {
    return {
      title: 'Result Not Found',
    };
  }

  return {
    title: `${result.examName} - ${result.organization} | SarkariJobs.cc`,
    description: `View ${result.examName} exam results, important dates, and download links. ${result.organization} ${result.resultType} details.`,
  };
}

export async function generateStaticParams() {
  try {
    const indexPath = path.join(process.cwd(), 'public', 'data', 'exam_results', 'index.json');
    const indexData = await fs.readFile(indexPath, 'utf-8');
    const index = JSON.parse(indexData);
    
    return index.results.map((result: any) => ({
      id: result.id,
    }));
  } catch (error) {
    return [];
  }
}

export default async function ResultDetailPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getResult(id);

  if (!result) {
    notFound();
  }

  return <ResultDetailClient result={result} />;
}