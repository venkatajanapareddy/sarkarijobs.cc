#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function generateJobIndex() {
  const jobsDir = path.join(__dirname, '..', 'public', 'data', 'jobs');
  const files = fs.readdirSync(jobsDir).filter(f => f.startsWith('job_') && f.endsWith('.json'));
  
  const index = [];
  
  for (const file of files) {
    const filePath = path.join(jobsDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Extract only essential fields for listing (reduce from ~70KB to ~500 bytes per job)
    const lightJob = {
      id: content.id,
      title: content.title,
      organization: content.organization,
      totalPosts: content.totalPosts,
      lastDate: content.lastDate,
      applicationStartDate: content.applicationStartDate,
      qualification: content.qualification,
      salary: content.salary,
      department: content.department,
      location: content.location,
      postedDate: content.postedDate,
      // Only include link flags, not full URLs
      hasApplicationForm: !!content.links?.applicationForm,
      hasOfficialLink: !!content.links?.official,
      hasNotification: !!content.links?.notification
    };
    
    index.push(lightJob);
  }
  
  // Sort by posted date (newest first)
  index.sort((a, b) => {
    const dateA = a.postedDate || a.lastDate || '';
    const dateB = b.postedDate || b.lastDate || '';
    return dateB.localeCompare(dateA);
  });
  
  // Write the index file
  const indexPath = path.join(jobsDir, 'jobs-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  
  console.log(`✅ Generated index with ${index.length} jobs`);
  console.log(`📊 Index size: ${(JSON.stringify(index).length / 1024).toFixed(2)} KB`);
  console.log(`📊 Average size per job: ${(JSON.stringify(index).length / index.length).toFixed(0)} bytes`);
}

generateJobIndex().catch(console.error);