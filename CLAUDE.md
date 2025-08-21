# SarkariJobs.cc Website - Context File

## Overview
Production Next.js 15 website for displaying Indian government jobs. Live at https://sarkarijobs.cc

## Current Status (Aug 18, 2025)
- **Live URL**: https://sarkarijobs.cc
- **Total Jobs**: 402 active listings
- **Authentication**: Google OAuth only (removed email auth)
- **Features**: Time-sensitive jobs, progressive disclosure, saved jobs
- **Deployment**: Vercel with automatic deploys on push

## Recent Changes Today
1. **Time-Sensitive Jobs Section**
   - Replaced "Featured Jobs" with "Closing Soon"
   - Shows jobs closing within 7 days
   - Progressive disclosure: show 6, expand to all
   - Jobs closing today appear first (fixed sorting bug)

2. **Authentication Simplification**
   - Removed email/magic link authentication
   - Kept only Google OAuth
   - Auto-signin for returning users
   - Loading feedback during auto-signin

3. **Bug Fixes**
   - Fixed TypeScript null check errors in HomePage
   - Fixed random page refreshes (removed ContentProtection component)
   - Fixed sign-out functionality
   - Fixed Vercel build failures

## Key Components

### Authentication
- `/components/AuthModal.tsx` - Google OAuth only modal
- `/components/auth/LoginButton.tsx` - Smart auto-signin logic
- `/components/LoadingToast.tsx` - Loading feedback UI

### Job Display
- `/components/HomePage.tsx` - Main listing with time-sensitive section
- `/components/JobsTable.tsx` - Full job table with filters
- `/components/SaveJobButton.tsx` - Save/unsave functionality
- `/components/AnnouncementBar.tsx` - Urgent job alerts (button removed)

### Layout
- `/app/layout.tsx` - Root layout with Supabase
- `/components/Header.tsx` - Site header
- `/components/Footer.tsx` - Site footer

## Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://ctnsyhvbklxswdipyuvg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
NEXT_PUBLIC_GA_ID=G-Z99EKTJFXB
```

## Database Schema (Supabase)
```sql
-- saved_jobs table
CREATE TABLE saved_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  job_id TEXT NOT NULL,
  saved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, job_id)
);

-- RLS policies enabled for user-specific access
```

## Build & Deploy
```bash
# Development
npm run dev

# Build locally
npm run build

# Deploy (automatic on push)
git push origin main
```

## API Routes
- `/api/jobs` - Returns all jobs JSON
- `/api/forms/[id]` - Redirects to R2 PDF storage

## Cloudflare R2 Integration
- Bucket: `sarkarijob-forms`
- All application PDFs stored in R2
- Direct redirect from API route

## Performance Optimizations
- Static generation for all job pages
- Lazy loading for images
- Progressive disclosure for long lists
- Pagination in job tables
- Edge caching via Vercel

## Known Issues & Solutions
1. **Page refreshing randomly** - Fixed by removing ContentProtection component
2. **TypeScript build errors** - Fixed null checks in HomePage
3. **Sign-out not working** - Fixed by using onSelect instead of onClick
4. **Jobs count mismatch** - Sync public/data/jobs with main data directory