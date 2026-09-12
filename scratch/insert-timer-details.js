const fs = require('fs');
let content = fs.readFileSync('src/app/product/[id]/page.tsx', 'utf8');

const target = `{product.tag && (
              <span className={\`absolute top-4 \${getActiveDiscount(product).hasDiscount ? "left-28 sm:left-32" : "left-4"} bg-gold-600 text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 z-10 shadow-lg\`}>
                {product.tag}
              </span>
            )}`;

const replacement = `{product.tag && (
              <span className={\`absolute top-4 \${getActiveDiscount(product).hasDiscount ? "left-28 sm:left-32" : "left-4"} bg-gold-600 text-black text-[9px] font-black tracking-widest uppercase px-3 py-1.5 z-10 shadow-lg\`}>
                {product.tag}
              </span>
            )}
            {getActiveDiscount(product).hasDiscount && product.discountExpiresAt && (
              <div className="absolute top-4 right-4 z-20 pointer-events-none transform scale-90 origin-top-right">
                <CountdownTimer targetDate={product.discountExpiresAt} />
              </div>
            )}`;

content = content.split(target).join(replacement);

fs.writeFileSync('src/app/product/[id]/page.tsx', content, 'utf8');
console.log('Added CountdownTimer to product details page');
