const fs = require('fs').promises;
const path = require('path');

async function mergeRawIntoJobs() {
  console.log('Starting to merge raw content into processed jobs...');
  
  const dataPath = path.join(__dirname, '../../data');
  const jobsDir = path.join(dataPath, 'jobs');
  const rawJobsDir = path.join(dataPath, 'raw_jobs');
  const publicJobsDir = path.join(__dirname, '../public/data/jobs');
  
  // Get all job files
  const jobFiles = await fs.readdir(jobsDir);
  const jsonFiles = jobFiles.filter(f => f.endsWith('.json') && f !== 'index.json');
  
  let merged = 0;
  let skipped = 0;
  
  for (const jobFile of jsonFiles) {
    try {
      // Load processed job
      const jobPath = path.join(jobsDir, jobFile);
      const jobContent = await fs.readFile(jobPath, 'utf8');
      const job = JSON.parse(jobContent);
      
      // Try to load corresponding raw job
      const jobId = job.id;
      const rawJobPath = path.join(rawJobsDir, `raw_job_${jobId}.json`);
      
      try {
        const rawContent = await fs.readFile(rawJobPath, 'utf8');
        const rawJob = JSON.parse(rawContent);
        
        // Merge raw content into job
        job.rawContent = rawJob.rawContent;
        
        // Save to public directory
        const publicJobPath = path.join(publicJobsDir, jobFile);
        await fs.writeFile(publicJobPath, JSON.stringify(job, null, 2));
        
        merged++;
        console.log(`✓ Merged ${jobFile}`);
      } catch (err) {
        // No raw content available, just copy the job as is
        const publicJobPath = path.join(publicJobsDir, jobFile);
        await fs.writeFile(publicJobPath, JSON.stringify(job, null, 2));
        skipped++;
        console.log(`- Copied ${jobFile} (no raw content)`);
      }
    } catch (error) {
      console.error(`Error processing ${jobFile}:`, error.message);
    }
  }
  
  console.log(`\nDone! Merged: ${merged}, Copied without raw: ${skipped}`);
}

mergeRawIntoJobs().catch(console.error);