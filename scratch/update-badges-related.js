const fs = require('fs');

const files = [
  'src/app/product/[id]/page.tsx'
];

const replacement = `{/* Discount Badge */}
                  {getActiveDiscount(relProduct).hasDiscount && (
                    <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 items-start">
                      <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-md border border-red-400/30">
                        {getActiveDiscount(relProduct).discountText || \`\${Math.round(((relProduct.originalPrice! - relProduct.price) / relProduct.originalPrice!) * 100)}% OFF\`}
                      </span>
                      {getActiveDiscount(relProduct).isTimerActive && getActiveDiscount(relProduct).expiresAt && (
                        <CountdownTimer 
                          expiresAt={getActiveDiscount(relProduct).expiresAt!} 
                          onExpire={() => window.location.reload()} 
                        />
                      )}
                    </div>
                  )}`;

const targetRegex = /\{\/\*\s*Discount Badge\s*\*\/\}\s*\{getActiveDiscount\(relProduct\)\.hasDiscount && \(\s*<span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-amber-600 text-white text-\[9px\] font-black uppercase tracking-wider px-2 py-0\.5 rounded-sm shadow-md border border-red-400\/30 z-20">\s*\{getActiveDiscount\(relProduct\)\.discountText \|\| `\$\{Math\.round\(\(\(relProduct\.originalPrice! - relProduct\.price\) \/ relProduct\.originalPrice!\) \* 100\)\}% OFF`\}\s*<\/span>\s*\)\}/g;

const importStatementDeep = `import CountdownTimer from "../../../components/CountdownTimer";`; // For others

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;

    if (targetRegex.test(content)) {
      content = content.replace(targetRegex, replacement);
      modified = true;
    }

    if (modified && !content.includes('CountdownTimer')) {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + importStatementDeep + '\\n' + content.slice(nextLineIndex + 1);
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
