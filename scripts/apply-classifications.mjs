import fs from 'fs';
import path from 'path';

const classifications = {
  "1": "wall-clocks", "2": "wall-clocks", "3": "wall-clocks", "4": "wall-clocks", "5": "mens",
  "6": "wall-clocks", "7": "wall-clocks", "8": "mens", "9": "wall-clocks", "10": "mens",
  "11": "mens", "12": "wall-clocks", "13": "mens", "14": "mens", "15": "mens",
  "16": "mens", "17": "wall-clocks", "18": "womens", "19": "wall-clocks", "20": "womens",
  "21": "womens", "22": "mens", "23": "wall-clocks", "24": "womens", "25": "wall-clocks",
  "26": "womens", "27": "wall-clocks", "28": "womens", "29": "womens", "30": "wall-clocks",
  "31": "wall-clocks", "32": "mens", "33": "mens", "34": "mens", "35": "mens",
  "36": "mens", "37": "mens", "38": "mens", "39": "mens", "40": "mens",
  "41": "mens", "42": "mens", "43": "mens", "44": "mens", "45": "mens",
  "46": "mens", "47": "mens", "48": "mens", "49": "mens", "50": "mens",
  "51": "mens", "52": "mens", "53": "mens", "54": "mens", "55": "mens"
};

const dataFilePath = path.join(process.cwd(), 'src', 'data.ts');
let content = fs.readFileSync(dataFilePath, 'utf8');

// The file has a products array like: export const products: Product[] = [ ... ];
// We will replace categories and subcategories in the JSON-like objects for items that start with "swc_product_"

// Split content by `export const products: Product[] = [`
const parts = content.split('export const products: Product[] = [');
if (parts.length < 2) {
  console.error("Could not find products array in data.ts");
  process.exit(1);
}

let head = parts[0] + 'export const products: Product[] = [';
let tail = parts[1];

// Find all occurrences of image: "/images/products/swc_product_X.webp"
for (let i = 1; i <= 55; i++) {
  const cls = classifications[i.toString()];
  let newCat = "hand-watches";
  let newSubcat = undefined;

  if (cls === "wall-clocks") {
    newCat = "wall-clocks";
  } else if (cls === "mens") {
    newSubcat = "mens";
  } else if (cls === "womens") {
    newSubcat = "womens";
  }

  // We need to find the block for swc_product_${i}.webp
  const imgStr = `"/images/products/swc_product_${i}.webp"`;
  
  // Replace category inside this specific block
  // It's a bit tricky with string replacement. We can use regex to find the block.
  // Assuming the block is enclosed in { ... id: "swc-prod-${i}", ... }
  const blockRegex = new RegExp(`{\\s*id:\\s*"swc-prod-${i}"[^}]*?}`, "gs");
  
  tail = tail.replace(blockRegex, (match) => {
    // replace category
    match = match.replace(/category:\s*"[^"]*"/, `category: "${newCat}"`);
    
    // replace subcategory
    if (newSubcat) {
      if (match.includes("subcategory:")) {
        match = match.replace(/subcategory:\s*"[^"]*"/, `subcategory: "${newSubcat}"`);
      } else {
        match = match.replace(/category:\s*"[^"]*",/, `category: "${newCat}",\n    subcategory: "${newSubcat}",`);
      }
    } else {
      // remove subcategory if it exists
      match = match.replace(/\s*subcategory:\s*"[^"]*",/, "");
    }
    
    return match;
  });
}

fs.writeFileSync(dataFilePath, head + tail, 'utf8');
console.log("Successfully updated categories in data.ts");
