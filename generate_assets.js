const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');

// Base64 string for a valid 1x1 pixel transparent PNG
const TRANSPARENT_PNG_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const imageBuffer = Buffer.from(TRANSPARENT_PNG_BASE64, 'base64');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR);
  console.log('Created assets directory.');
}

const assets = ['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'];

assets.forEach((assetFile) => {
  const filePath = path.join(ASSETS_DIR, assetFile);
  fs.writeFileSync(filePath, imageBuffer);
  console.log(`Successfully generated placeholder asset: ${assetFile}`);
});

console.log('Asset generation complete!');
