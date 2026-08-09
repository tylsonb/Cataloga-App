const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const iconsDir = path.join(__dirname, "..", "public", "icons");

async function generate() {
  const svg192 = fs.readFileSync(path.join(iconsDir, "icon-192.svg"));
  const svg512 = fs.readFileSync(path.join(iconsDir, "icon-512.svg"));

  await sharp(svg192).png().toFile(path.join(iconsDir, "icon-192.png"));
  await sharp(svg512).png().toFile(path.join(iconsDir, "icon-512.png"));

  await sharp(svg512).resize(180, 180).png().toFile(path.join(iconsDir, "apple-touch-icon.png"));
  await sharp(svg512).resize(32, 32).png().toFile(path.join(iconsDir, "favicon-32.png"));
  await sharp(svg512).resize(16, 16).png().toFile(path.join(iconsDir, "favicon-16.png"));

  console.log("Icons generated successfully");
}

generate().catch(console.error);
