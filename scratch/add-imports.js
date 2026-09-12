const fs = require('fs');
const files = [
  'src/app/women-watch/page.tsx',
  'src/app/wall-clock/page.tsx',
  'src/app/wishlist/page.tsx'
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('import CountdownTimer')) {
      const importStr = `import CountdownTimer from "../../components/CountdownTimer";\n`;
      const discountImportIdx = content.indexOf('import { getActiveDiscount }');
      if (discountImportIdx !== -1) {
        const nextLineIdx = content.indexOf('\n', discountImportIdx);
        content = content.slice(0, nextLineIdx + 1) + importStr + content.slice(nextLineIdx + 1);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added import to ' + file);
      } else {
        console.log('getActiveDiscount import not found in ' + file);
      }
    } else {
      console.log('CountdownTimer already imported in ' + file);
    }
  } catch(e) {
    console.error('Error on ' + file + ':', e);
  }
}
