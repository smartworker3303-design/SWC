const fs = require('fs');

let content = fs.readFileSync('src/context/ProductsContext.tsx', 'utf8');

content = content.replace(
  /fetchSupabaseProducts\(\)\.then\(dbProducts => \{/g,
  `fetchSupabaseProducts().then(async (dbProducts) => {`
);

fs.writeFileSync('src/context/ProductsContext.tsx', content, 'utf8');
console.log('Fixed async callbacks in ProductsContext.tsx');
