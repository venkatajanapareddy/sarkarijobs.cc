#!/bin/bash

# Prepare data for Vercel deployment
echo "📦 Preparing data for deployment..."

# Create public/data directory if it doesn't exist
mkdir -p public/data

# Copy jobs data
echo "📋 Copying jobs data..."
cp -r ../data/jobs public/data/
echo "  ✓ Copied $(ls public/data/jobs/*.json | wc -l) job files"

# Copy application forms
echo "📄 Copying application forms..."
cp -r ../data/application_forms public/data/
echo "  ✓ Copied $(ls public/data/application_forms/* | wc -l) form files"

# Copy raw jobs for job detail pages
echo "📝 Copying raw job data..."
mkdir -p public/data/raw_jobs
cp -r ../data/raw_jobs public/data/
echo "  ✓ Copied $(ls public/data/raw_jobs/*.json | wc -l) raw job files"

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Commit these changes: git add . && git commit -m 'Add job data for deployment'"
echo "2. Push to GitHub: git push origin main"
echo "3. Vercel will automatically deploy!"