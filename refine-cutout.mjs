import sharp from "sharp";
import path from "path";

const inputPath = path.resolve("..", "Hero References", "image__29778.webp");
const outputPath = path.resolve("public", "real-drumkit-cutout.png");

const { data, info } = await sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;

// Check if a point (x, y) is inside any drum head
function isInsideDrumHead(x, y) {
  // 1. Snare head (ellipse cx=320, cy=420, rx=110, ry=55)
  const snareDx = (x - 320) / 110;
  const snareDy = (y - 420) / 55;
  if (snareDx * snareDx + snareDy * snareDy <= 1.0) return true;

  // 2. Rack Tom 1 head (ellipse cx=485, cy=285, rx=75, ry=45)
  const t1Dx = (x - 485) / 75;
  const t1Dy = (y - 285) / 45;
  if (t1Dx * t1Dx + t1Dy * t1Dy <= 1.0) return true;

  // 3. Rack Tom 2 head (ellipse cx=660, cy=285, rx=85, ry=48)
  const t2Dx = (x - 660) / 85;
  const t2Dy = (y - 285) / 48;
  if (t2Dx * t2Dx + t2Dy * t2Dy <= 1.0) return true;

  // 4. Floor Tom head (ellipse cx=850, cy=460, rx=120, ry=55)
  const ftDx = (x - 850) / 120;
  const ftDy = (y - 460) / 55;
  if (ftDx * ftDx + ftDy * ftDy <= 1.0) return true;

  // 5. Bass drum batter circle (center cx=570, cy=585, rx=150, ry=150)
  const bdDx = (x - 570) / 150;
  const bdDy = (y - 585) / 150;
  if (bdDx * bdDx + bdDy * bdDy <= 1.0) return true;

  return false;
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];

    const isWhite = r >= 230 && g >= 230 && b >= 230 && Math.abs(r - g) <= 18 && Math.abs(g - b) <= 18;
    const isGroundShadow = y > 720 && r >= 200 && g >= 200 && b >= 200 && (x < 150 || x > 850 || y > 880);

    if ((isWhite || isGroundShadow) && !isInsideDrumHead(x, y)) {
      // Soft edge feathering
      const brightness = (r + g + b) / 3;
      if (brightness >= 245) {
        data[idx + 3] = 0;
      } else {
        data[idx + 3] = Math.max(0, Math.min(255, Math.floor((245 - brightness) * 12)));
      }
    }
  }
}

await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toFile(outputPath);

console.log("Enhanced cutout saved to", outputPath);
