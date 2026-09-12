const fs = require('fs');

let content = fs.readFileSync('src/app/product/[id]/page.tsx', 'utf8');

// Use a regex that ignores whitespace differences
content = content.replace(
  /\{\s*\/\*\s*Prev\/Next Image Navigation Overlay\s*\*\/\s*\}/g,
  `{getActiveDiscount(product).hasDiscount && product.discountExpiresAt && (
              <div className="absolute top-4 right-4 z-20 pointer-events-none transform scale-90 origin-top-right">
                <CountdownTimer expiresAt={product.discountExpiresAt} />
              </div>
            )}
            
            {/* Prev/Next Image Navigation Overlay */}`
);

fs.writeFileSync('src/app/product/[id]/page.tsx', content, 'utf8');
console.log('Replaced correctly!');
