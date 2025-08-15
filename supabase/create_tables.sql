-- Supabase SQL Script for SarkariJob.cc
-- Run this in Supabase SQL Editor to create all necessary tables

-- Create saved_jobs table for storing user's saved jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id TEXT NOT NULL,
  job_title TEXT,
  job_organization TEXT,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  applied BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, job_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_saved_at ON saved_jobs(saved_at DESC);

-- Enable Row Level Security (IMPORTANT!)
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can insert own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can update own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can delete own saved jobs" ON saved_jobs;

-- Create security policies (users can only see/edit their own saves)
CREATE POLICY "Users can view own saved jobs" 
  ON saved_jobs FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved jobs" 
  ON saved_jobs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved jobs" 
  ON saved_jobs FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved jobs" 
  ON saved_jobs FOR DELETE 
  USING (auth.uid() = user_id);

-- Optional: Create a view for easier querying with job counts
CREATE OR REPLACE VIEW saved_jobs_stats AS
SELECT 
  user_id,
  COUNT(*) as total_saved,
  COUNT(CASE WHEN applied = true THEN 1 END) as total_applied,
  MAX(saved_at) as last_saved_at
FROM saved_jobs
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON saved_jobs_stats TO authenticated;

-- Success message
SELECT 'Tables created successfully! ✅' as status;