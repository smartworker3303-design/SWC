const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/app/hand-watch/page.tsx',
  'src/app/women-watch/page.tsx',
  'src/app/wall-clock/page.tsx',
  'src/app/wishlist/page.tsx'
];

const replacement = `{/* Discount Badge */}
              {getActiveDiscount(product).hasDiscount && (
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                  <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 shadow-lg rounded-sm border border-red-400/30">
                    {getActiveDiscount(product).discountText || \`\${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF\`}
                  </span>
                  {getActiveDiscount(product).isTimerActive && getActiveDiscount(product).expiresAt && (
                    <CountdownTimer 
                      expiresAt={getActiveDiscount(product).expiresAt!} 
                      onExpire={() => window.location.reload()} 
                    />
                  )}
                </div>
              )}`;

const targetRegex = /\{\/\*\s*Discount Badge\s*\*\/\}\s*\{getActiveDiscount\(product\)\.hasDiscount && \(\s*<span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-600 text-white text-\[10px\] font-black tracking-wider uppercase px-2\.5 py-1 z-20 shadow-lg rounded-sm border border-red-400\/30">\s*\{getActiveDiscount\(product\)\.discountText \|\| `\$\{Math\.round\(\(\(product\.originalPrice! - product\.price\) \/ product\.originalPrice!\) \* 100\)\}% OFF`\}\s*<\/span>\s*\)\}/g;

const importStatement = `import CountdownTimer from "../components/CountdownTimer";`; // For page.tsx
const importStatementDeep = `import CountdownTimer from "../../components/CountdownTimer";`; // For others

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    if (targetRegex.test(content)) {
      content = content.replace(targetRegex, replacement);
      modified = true;
    }

    if (modified && !content.includes('CountdownTimer')) {
      const isRootPage = file === 'src/app/page.tsx';
      const imp = isRootPage ? importStatement : importStatementDeep;
      
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + imp + '\\n' + content.slice(nextLineIndex + 1);
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log('Updated ' + file);
    } else {
      console.log('No match found in ' + file);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error processing ' + file + ':', err);
    } else {
      console.log('File not found: ' + file);
    }
  }
}
