const fs = require('fs');
const content = fs.readFileSync('src/app/admin-panel/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('setIsModalOpen') || line.includes('openModal') || line.includes('Edit Timepiece')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
