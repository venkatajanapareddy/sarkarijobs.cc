const fs = require('fs');
const path = require('path');

// Test reading the index file
try {
  const indexPath = path.join(__dirname, 'public', 'data', 'results', 'index.json');
  console.log('Reading from:', indexPath);
  
  const indexData = fs.readFileSync(indexPath, 'utf-8');
  const index = JSON.parse(indexData);
  
  console.log('✅ Index loaded successfully');
  console.log('Total results:', index.totalResults);
  console.log('Categories:', index.categories);
  console.log('First result:', index.results[0]);
  
  // Try loading the full result
  const resultId = index.results[0].id;
  const resultPath = path.join(__dirname, 'public', 'data', 'results', `result_${resultId}.json`);
  console.log('\nReading result from:', resultPath);
  
  const resultData = fs.readFileSync(resultPath, 'utf-8');
  const result = JSON.parse(resultData);
  
  console.log('✅ Result loaded successfully');
  console.log('Exam Name:', result.examName);
  console.log('Organization:', result.organization);
  console.log('Status:', result.status);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error);
}