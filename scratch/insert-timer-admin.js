const fs = require('fs');

let content = fs.readFileSync('src/app/admin-panel/page.tsx', 'utf8');

if (!content.includes('import CountdownTimer')) {
  content = content.replace(
    'import { getActiveDiscount } from "../../utils/discount";',
    'import { getActiveDiscount } from "../../utils/discount";\nimport CountdownTimer from "../../components/CountdownTimer";'
  );
}

// Target content in the map loop
const target = `{/* Overlay Tag */}
                    {p.tag && (
                      <span className={\`absolute top-3 \${getActiveDiscount(p).hasDiscount ? "left-40" : "left-20"} bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-md z-10\`}>
                        {p.tag}
                      </span>
                    )}`;

const replacement = `{/* Overlay Tag */}
                    {p.tag && (
                      <span className={\`absolute top-3 \${getActiveDiscount(p).hasDiscount ? "left-40" : "left-20"} bg-gold-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-md z-10\`}>
                        {p.tag}
                      </span>
                    )}
                    {getActiveDiscount(p).hasDiscount && p.discountExpiresAt && (
                      <div className="absolute top-10 right-2 z-20 pointer-events-none transform scale-75 origin-top-right">
                        <CountdownTimer targetDate={p.discountExpiresAt} />
                      </div>
                    )}`;

content = content.split(target).join(replacement);

fs.writeFileSync('src/app/admin-panel/page.tsx', content, 'utf8');
console.log('Added CountdownTimer to admin-panel/page.tsx');
