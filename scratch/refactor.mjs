import fs from 'fs';
import path from 'path';

const files = [
  'src/app/page.tsx',
  'src/app/hand-watch/page.tsx',
  'src/app/women-watch/page.tsx',
  'src/app/wall-clock/page.tsx',
  'src/app/wishlist/page.tsx',
  'src/app/admin-panel/page.tsx',
  'src/app/checkout/page.tsx',
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    let hasChanges = false;

    // We need to inject `import { getActiveDiscount } from "../../utils/discount";` (or appropriate depth)
    if (!content.includes('getActiveDiscount')) {
      const depth = file.split('/').length - 2;
      const importPath = depth === 1 ? '../utils/discount' : depth === 2 ? '../../utils/discount' : '../../../utils/discount';
      
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLine = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLine + 1) + `import { getActiveDiscount } from "${importPath}";\n` + content.slice(endOfLine + 1);
        hasChanges = true;
      }
    }

    // Now, replace the manual checking with getActiveDiscount call.
    // The pattern is generally:
    // (product.discount || (product.originalPrice && product.originalPrice > product.price))
    // We can replace `product` with whatever the loop variable is.
    
    // In page.tsx and others it's `product.discount`. In admin-panel/page.tsx it's `p.discount`.
    
    const varNames = ['product', 'p', 'relProduct'];
    
    for (const v of varNames) {
      const condRegex = new RegExp(`\\(${v}\\.discount \\|\\| \\(${v}\\.originalPrice && ${v}\\.originalPrice > ${v}\\.price\\)\\)`, 'g');
      if (condRegex.test(content)) {
        content = content.replace(condRegex, `getActiveDiscount(${v}).hasDiscount`);
        hasChanges = true;
      }
      
      const textRegex = new RegExp(`\\{${v}\\.discount \\|\\| \\\`\\$\\{Math\\.round\\(\\(\\(${v}\\.originalPrice! - ${v}\\.price\\) / ${v}\\.originalPrice!\\) \\* 100\\)\\}% OFF\\\`\\}`, 'g');
      if (textRegex.test(content)) {
        content = content.replace(textRegex, `{getActiveDiscount(${v}).discountText || \`\${Math.round(((${v}.originalPrice! - ${v}.price) / ${v}.originalPrice!) * 100)}% OFF\`}`);
        hasChanges = true;
      }

      // Replaces for just checking original price condition: `{product.originalPrice && product.originalPrice > product.price && (`
      const origCondRegex = new RegExp(`\\{${v}\\.originalPrice && ${v}\\.originalPrice > ${v}\\.price && \\(`, 'g');
      if (origCondRegex.test(content)) {
        content = content.replace(origCondRegex, `{getActiveDiscount(${v}).hasDiscount && ${v}.originalPrice && ${v}.originalPrice > ${v}.price && (`);
        hasChanges = true;
      }
      
      // Also the ternary: {product.originalPrice && product.originalPrice > product.price ? "Special Offer" : "Price starting at"}
      const origTernaryRegex = new RegExp(`\\{${v}\\.originalPrice && ${v}\\.originalPrice > ${v}\\.price \\?`, 'g');
      if (origTernaryRegex.test(content)) {
        content = content.replace(origTernaryRegex, `{getActiveDiscount(${v}).hasDiscount && ${v}.originalPrice && ${v}.originalPrice > ${v}.price ?`);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content, 'utf-8');
      console.log(`Updated ${file}`);
    } else {
      console.log(`No changes made to ${file}`);
    }

  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
}
