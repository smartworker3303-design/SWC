const fs = require('fs');
const content = fs.readFileSync('src/app/admin-panel/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('BUY 1') || line.includes('CountdownTimer') || line.includes('product.discount') || line.includes('<div className="relative aspect-square')) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
