import sharp from "sharp";
import path from "path";

const inputPath = path.resolve("..", "Hero References", "image__29778.webp");
const meta = await sharp(inputPath).metadata();
console.log("Metadata:", meta);
