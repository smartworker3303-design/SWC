const fs = require('fs');

let content = fs.readFileSync('src/app/admin-panel/page.tsx', 'utf8');

content = content.replace(
  /\{\/\* Category Tag \*\/\}/g,
  `{getActiveDiscount(p).hasDiscount && p.discountExpiresAt && (
                      <div className="absolute top-10 right-2 z-20 pointer-events-none transform scale-75 origin-top-right">
                        <CountdownTimer targetDate={p.discountExpiresAt} />
                      </div>
                    )}
                    {/* Category Tag */}`
);

fs.writeFileSync('src/app/admin-panel/page.tsx', content, 'utf8');
console.log('Replaced correctly!');
