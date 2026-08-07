import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, '../src/data.ts');

let content = fs.readFileSync(dataFile, 'utf8');

// 1. Update Product interface
if (!content.includes('subcategory?: "mens" | "womens";')) {
  content = content.replace(
    'category: "hand-watches" | "wall-clocks";',
    'category: "hand-watches" | "wall-clocks";\n  subcategory?: "mens" | "womens";'
  );
}

// 2. Generate 55 products
let newProductsStr = '';
for (let i = 1; i <= 55; i++) {
  const isClock = i <= 15;
  const isMens = !isClock && i % 2 === 0;
  
  const category = isClock ? "wall-clocks" : "hand-watches";
  const subcategoryStr = isClock ? '' : `\n    subcategory: "${isMens ? 'mens' : 'womens'}",`;
  
  let name = "";
  let desc = "";
  if (isClock) {
    name = `Luxury Wall Clock Model ${i}`;
    desc = `An elegant masterpiece for your living space. Silent sweep quartz movement with premium finish.`;
  } else if (isMens) {
    name = `Executive Men's Chrono ${i}`;
    desc = `A bold statement of elegance for men. Features durable build and sophisticated design.`;
  } else {
    name = `Elegant Women's Timepiece ${i}`;
    desc = `Sleek, slim, and sophisticated. Designed for women who appreciate understated luxury.`;
  }
  
  const price = 10000 + Math.floor(Math.random() * 50000);
  const rating = (4.0 + Math.random()).toFixed(1);
  const reviews = Math.floor(Math.random() * 200);

  const prod = `  {
    id: "prod-gen-${i}",
    name: "${name}",
    category: "${category}",${subcategoryStr}
    price: ${price},
    rating: Number(${rating}),
    reviews: ${reviews},
    image: "/images/products/swc_product_${i}.webp",
    description: "${desc}",
    specs: {
      "Material": "Premium",
      "Warranty": "1 Year"
    },
    featured: false,
    tag: "New"
  }`;
  
  newProductsStr += ',\n' + prod;
}

// 3. Insert before the array closing bracket for products
content = content.replace('\n];\n\nexport const reviews', newProductsStr + '\n];\n\nexport const reviews');

fs.writeFileSync(dataFile, content);
console.log('Successfully appended 55 dummy products and updated Product interface.');
