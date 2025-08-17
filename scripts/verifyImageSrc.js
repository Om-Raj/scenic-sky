const fs = require("fs");
const path = require("path");

// ------------------------------
// Configurable variables
// ------------------------------

// JSON file containing scenic locations (inside /scripts/)
const JSON_FILE = path.join(__dirname, "scenicLocations.json");

// Folder where the images are expected to be (one level up from /scripts/)
const IMAGE_FOLDER = path.join(__dirname, "../public/scenic_locations");

// Property names in the JSON objects
const NAME_PROPERTY = "name"; 
const SRC_PROPERTY = "src";   

// ------------------------------
// Main Script
// ------------------------------

try {
  const rawData = fs.readFileSync(JSON_FILE, "utf8");
  const scenicLocations = JSON.parse(rawData);

  let validCount = 0;
  let invalidCount = 0;

  scenicLocations.forEach((location) => {
    const imageFileName = path.basename(location[SRC_PROPERTY]); // just filename
    const imagePath = path.join(IMAGE_FOLDER, imageFileName);

    if (fs.existsSync(imagePath)) {
      validCount++;
    } else {
      invalidCount++;
      console.log(
        `Missing image for location: ${location[NAME_PROPERTY]} (expected: ${imageFileName})`
      );
    }
  });

  console.log("\nSummary Report:");
  console.log(`Valid locations   : ${validCount}`);
  console.log(`Invalid locations : ${invalidCount}`);

} catch (err) {
  console.error("Error processing file:", err.message);
}
