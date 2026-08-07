import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../public/images/products');
const outputDir = path.join(__dirname, '../public/images/products_processed');

async function processImages() {
  if (!fs.existsSync(inputDir)) {
    console.error(`Input directory does not exist: ${inputDir}`);
    return;
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  const seenHashes = new Set();
  let counter = 1;

  console.log(`Found ${files.length} files. Processing...`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    
    // Skip non-image files or directories
    const stat = fs.statSync(inputPath);
    if (!stat.isFile()) continue;
    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(file)) continue;

    try {
      // 1. Resize and normalize the image to 800x800 WebP
      const processedBuffer = await sharp(inputPath)
        .resize(800, 800, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent padding
        })
        .webp({ quality: 85 })
        .toBuffer();

      // 2. Hash the resulting buffer to detect duplicates
      // Since we standardized the size and format, identical visual sources 
      // (even with different original sizes or names) might hash the same or very close.
      const rawPixels = await sharp(processedBuffer).raw().toBuffer();
      const hash = crypto.createHash('md5').update(rawPixels).digest('hex');

      if (seenHashes.has(hash)) {
        console.log(`Duplicate found: ${file}. Skipping.`);
        continue;
      }

      seenHashes.add(hash);

      // 3. Save the unique processed image
      const newFileName = `swc_product_${counter}.webp`;
      const outputPath = path.join(outputDir, newFileName);
      
      fs.writeFileSync(outputPath, processedBuffer);
      console.log(`Processed: ${file} -> ${newFileName}`);
      counter++;

    } catch (err) {
      console.error(`Failed to process ${file}:`, err);
    }
  }

  console.log('\n--- Processing Complete ---');
  console.log(`Total unique images generated: ${counter - 1}`);
  
  // Swap directories
  console.log('Replacing old products folder with the processed one...');
  fs.rmSync(inputDir, { recursive: true, force: true });
  fs.renameSync(outputDir, inputDir);
  console.log('Done! All images are now standardized 800x800 WebP format without duplicates.');
}

processImages();
