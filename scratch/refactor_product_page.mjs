import fs from 'fs';

let content = fs.readFileSync('src/app/product/[id]/page.tsx', 'utf-8');

// Inject imports
if (!content.includes('getActiveDiscount')) {
  content = content.replace(
    'import { useOrders } from "../../../context/OrdersContext";',
    'import { useOrders } from "../../../context/OrdersContext";\nimport { getActiveDiscount } from "../../../utils/discount";\nimport CountdownTimer from "../../../components/CountdownTimer";'
  );
}

// 1. Discount logic for main product
content = content.replace(
  /\{\(product\.discount \|\| \(product\.originalPrice && product\.originalPrice > product\.price\)\) && \(/g,
  `{getActiveDiscount(product).hasDiscount && (`
);

content = content.replace(
  /\{product\.discount \|\| \`\$\{Math\.round\(\(\(product\.originalPrice! - product\.price\) \/ product\.originalPrice!\) \* 100\)\}% OFF\`\}/g,
  `{getActiveDiscount(product).discountText || \`\${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF\`}`
);

content = content.replace(
  /\(product\.discount \|\| \(product\.originalPrice && product\.originalPrice > product\.price\)\) \? "left-28 sm:left-32" : "left-4"/g,
  `getActiveDiscount(product).hasDiscount ? "left-28 sm:left-32" : "left-4"`
);

content = content.replace(
  /\{product\.originalPrice && product\.originalPrice > product\.price \? "Promotional Sale Price" : "Premium Price"\}/g,
  `{getActiveDiscount(product).hasDiscount && product.originalPrice && product.originalPrice > product.price ? "Promotional Sale Price" : "Premium Price"}`
);

content = content.replace(
  /\{product\.originalPrice && product\.originalPrice > product\.price && \(/g,
  `{getActiveDiscount(product).hasDiscount && product.originalPrice && product.originalPrice > product.price && (`
);

// 2. Discount logic for related products
content = content.replace(
  /\{\(relProduct\.discount \|\| \(relProduct\.originalPrice && relProduct\.originalPrice > relProduct\.price\)\) && \(/g,
  `{getActiveDiscount(relProduct).hasDiscount && (`
);

content = content.replace(
  /\{relProduct\.discount \|\| \`\$\{Math\.round\(\(\(relProduct\.originalPrice! - relProduct\.price\) \/ relProduct\.originalPrice!\) \* 100\)\}% OFF\`\}/g,
  `{getActiveDiscount(relProduct).discountText || \`\${Math.round(((relProduct.originalPrice! - relProduct.price) / relProduct.originalPrice!) * 100)}% OFF\`}`
);

content = content.replace(
  /\{relProduct\.originalPrice && relProduct\.originalPrice > relProduct\.price && \(/g,
  `{getActiveDiscount(relProduct).hasDiscount && relProduct.originalPrice && relProduct.originalPrice > relProduct.price && (`
);

// 3. Inject CountdownTimer in Pricing Banner
const bannerLocation = `<div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                  {getActiveDiscount(product).hasDiscount && product.originalPrice && product.originalPrice > product.price ? "Promotional Sale Price" : "Premium Price"}
                </span>
                {getActiveDiscount(product).hasDiscount && (
                  <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                    {getActiveDiscount(product).discountText || \`\${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF\`}
                  </span>
                )}
              </div>`;

const newBannerLocation = `<div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">
                    {getActiveDiscount(product).hasDiscount && product.originalPrice && product.originalPrice > product.price ? "Promotional Sale Price" : "Premium Price"}
                  </span>
                  {getActiveDiscount(product).hasDiscount && (
                    <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                      {getActiveDiscount(product).discountText || \`\${Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF\`}
                    </span>
                  )}
                </div>
                {getActiveDiscount(product).isTimerActive && getActiveDiscount(product).expiresAt && (
                  <CountdownTimer expiresAt={getActiveDiscount(product).expiresAt!} />
                )}
              </div>`;

content = content.replace(bannerLocation, newBannerLocation);

fs.writeFileSync('src/app/product/[id]/page.tsx', content, 'utf-8');
console.log("Updated product page");
