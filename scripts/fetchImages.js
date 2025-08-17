// scripts/fetchImages.js

import fs from "fs";
import path from "path";
import axios from "axios";

// Load scenicSites.json manually
const scenicSites = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "scripts", "scenicSites.json"), "utf-8")
);

// 📌 Unsplash API (replace with Pixabay/Pexels if needed)
const UNSPLASH_KEY = "dQycutvzHT-MZST6asIgLQcuJs7Q8m-YypJ9Kect1XI"
const OUTPUT_DIR = path.join(process.cwd(), "public/scenic_locations_unoptimized");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchImageUrl(query) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=1&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const { data } = await axios.get(url);
  if (data.results && data.results.length > 0) {
    return data.results[0].urls.full; // HD image
  }
  return null;
}

async function downloadImage(url, filepath) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  fs.writeFileSync(filepath, response.data);
}

async function main() {
  const updatedSites = [];

  for (const site of scenicSites) {
    // ✅ Skip if already has an image
    if (site.src && site.src !== null) {
      console.log(`⏭️ Skipping ${site.name}, already has image`);
      updatedSites.push(site);
      continue;
    }

    try {
      console.log(`🔍 Searching image for: ${site.name}`);
      const imageUrl = await fetchImageUrl(site.name);

      if (!imageUrl) {
        console.warn(`⚠️ No image found for ${site.name}`);
        updatedSites.push({ ...site, src: null });
        continue;
      }

      const fileName =
        site.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".jpg";
      const filePath = path.join(OUTPUT_DIR, fileName);

      console.log(`📥 Downloading ${imageUrl} -> ${filePath}`);
      await downloadImage(imageUrl, filePath);

      updatedSites.push({ ...site, src: `/scenic_locations/${fileName}` });
    } catch (err) {
      console.error(`❌ Error fetching image for ${site.name}:`, err.message);
      updatedSites.push({ ...site, src: null });
    }
  }

  fs.writeFileSync(
    "scripts/scenicSitesWithImages.json",
    JSON.stringify(updatedSites, null, 2)
  );
  console.log("✅ Done! Check scripts/scenicSitesWithImages.json");
}

main();
