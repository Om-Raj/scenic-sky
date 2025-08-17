import fs from "fs";
import path from "path";
import sharp from "sharp";

const IMAGES_DIR = path.join(process.cwd(), "public/scenic_locations");
const OUTPUT_DIR = path.join(process.cwd(), "public/scenic_locations_optimized");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(file) {
  const inputPath = path.join(IMAGES_DIR, file);
  const outputPath = path.join(OUTPUT_DIR, file);

  await sharp(inputPath)
    .resize(600) // max width (good balance for web)
    .jpeg({ quality: 70 }) // compress
    .toFile(outputPath);

  console.log(`✅ Optimized: ${file}`);
}

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith(".jpg"));
  for (const file of files) {
    await optimizeImage(file);
  }
}

main();
