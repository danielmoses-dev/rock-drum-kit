import sharp from "sharp";
import path from "path";

const inputPath = path.resolve("..", "Hero References", "image__29778.webp");
const outputPath = path.resolve("public", "real-drumkit-cutout.png");

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
console.log(`Processing image ${width}x${height} with ${channels} channels...`);

// Check if a pixel is near-white studio background
function isWhiteBackground(r, g, b) {
  // Pure white studio backdrop usually has r, g, b > 238 and low saturation
  const minVal = Math.min(r, g, b);
  const maxVal = Math.max(r, g, b);
  const diff = maxVal - minVal;
  return minVal >= 232 && diff <= 15;
}

// Flood fill from outer perimeter to identify background pixels
const isBg = new Uint8Array(width * height);
const queue = [];

function addPixel(x, y) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = y * width + x;
  if (isBg[idx]) return;

  const pIdx = idx * 4;
  const r = data[pIdx];
  const g = data[pIdx + 1];
  const b = data[pIdx + 2];

  if (isWhiteBackground(r, g, b)) {
    isBg[idx] = 1;
    queue.push(x, y);
  }
}

// Seed the perimeter pixels
for (let x = 0; x < width; x++) {
  addPixel(x, 0);
  addPixel(x, height - 1);
}
for (let y = 0; y < height; y++) {
  addPixel(0, y);
  addPixel(width - 1, y);
}

// Breadth-First Flood Fill
let head = 0;
while (head < queue.length) {
  const x = queue[head++];
  const y = queue[head++];

  addPixel(x + 1, y);
  addPixel(x - 1, y);
  addPixel(x, y + 1);
  addPixel(x, y - 1);
}

console.log(`Identified ${queue.length / 2} background pixels out of ${width * height}`);

// Feathering / Anti-aliasing edges
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = y * width + x;
    const pIdx = idx * 4;

    if (isBg[idx] === 1) {
      data[pIdx + 3] = 0; // Transparent
    } else {
      // Check if neighboring any background pixel for smooth edge antialiasing
      let bgNeighbors = 0;
      if (x > 0 && isBg[idx - 1]) bgNeighbors++;
      if (x < width - 1 && isBg[idx + 1]) bgNeighbors++;
      if (y > 0 && isBg[idx - width]) bgNeighbors++;
      if (y < height - 1 && isBg[idx + width]) bgNeighbors++;

      if (bgNeighbors > 0) {
        const r = data[pIdx];
        const g = data[pIdx + 1];
        const b = data[pIdx + 2];
        const lum = (r + g + b) / 3;
        if (lum > 220) {
          data[pIdx + 3] = Math.max(0, Math.min(255, Math.floor((255 - lum) * 3)));
        }
      }
    }
  }
}

// Save as transparent PNG
await sharp(data, {
  raw: {
    width,
    height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log(`Saved transparent cutout to ${outputPath}`);
