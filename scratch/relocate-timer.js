const fs = require('fs');

const files = [
  'src/app/page.tsx',
  'src/app/hand-watch/page.tsx',
  'src/app/women-watch/page.tsx',
  'src/app/wall-clock/page.tsx',
  'src/app/wishlist/page.tsx'
];

const targetRegex = /\{\/\*\s*Discount Badge\s*\*\/\}\s*\{getActiveDiscount\(product\)\.hasDiscount && \(\s*<div className="absolute top-4 left-4 z-20 flex flex-col gap-1\.5 items-start">\s*<span className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-\[10px\] font-black tracking-wider uppercase px-2\.5 py-1 shadow-lg rounded-sm border border-red-400\/30">\s*\{getActiveDiscount\(product\)\.discountText \|\| `\$\{Math\.round\(\(\(product\.originalPrice! - product\.price\) \/ product\.originalPrice!\) \* 100\)\}% OFF`\}\s*<\/span>\s*\{getActiveDiscount\(product\)\.isTimerActive && getActiveDiscount\(product\)\.expiresAt && \(\s*<CountdownTimer\s*expiresAt=\{getActiveDiscount\(product\)\.expiresAt!\}\s*onExpire=\{\(\) => window\.location\.reload\(\)\}\s*\/>\s*\)\}\s*<\/div>\s*\)\}/g;

const replacement = `{/* Discount Badge */}
                {getActiveDiscount(product).hasDiscount && (
                  <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 shadow-lg rounded-sm border border-red-400/30">
                    {getActiveDiscount(product).discountText || \`\${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF\`}
                  </span>
                )}

                {/* Countdown Timer */}
                {getActiveDiscount(product).isTimerActive && getActiveDiscount(product).expiresAt && (
                  <div className="absolute top-4 right-14 sm:right-16 z-20">
                    <CountdownTimer 
                      expiresAt={getActiveDiscount(product).expiresAt!} 
                      onExpire={() => window.location.reload()} 
                    />
                  </div>
                )}`;

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (targetRegex.test(content)) {
      content = content.replace(targetRegex, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated ' + file);
    } else {
      console.log('No match found in ' + file);
      // Wait, let's see if the structure is slightly different (e.g. whitespace). Let's print a part to see.
      const match = content.match(/\{\/\*\s*Discount Badge\s*\*\/\}[\s\S]*?<\/div>\s*\)\}/);
      if (match) {
        console.log("Found something close in " + file);
      }
    }
  } catch (err) {
    console.error('Error on ' + file, err);
  }
}
