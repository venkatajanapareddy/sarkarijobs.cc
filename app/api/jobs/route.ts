import { NextResponse } from 'next/server';
import { loadJobs } from '@/lib/jobs-server';
import { searchJobs, filterJobsByCategory, type JobsApiResponse } from '@/lib/jobs-types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Load all jobs
    let jobs = await loadJobs();
    
    // Apply filters
    if (query) {
      jobs = searchJobs(jobs, query);
    }
    
    if (category) {
      jobs = filterJobsByCategory(jobs, category);
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    
    const response: JobsApiResponse = {
      jobs: paginatedJobs,
      totalCount: jobs.length,
      source: 'sarkarijobs.cc',
      fetchedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      jobs: [],
      totalCount: 0,
      source: 'sarkarijobs.cc',
      error: 'Failed to load jobs'
    } as JobsApiResponse, { status: 500 });
  }
}