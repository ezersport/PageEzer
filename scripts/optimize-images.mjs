import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagesDir = path.resolve('public/images');

async function optimizeImages() {
  const files = fs.readdirSync(imagesDir);
  console.log(`Found ${files.length} items in ${imagesDir}`);

  let totalOldSize = 0;
  let totalNewWebpSize = 0;

  for (const file of files) {
    if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;

    const inputPath = path.join(imagesDir, file);
    const stat = fs.statSync(inputPath);
    totalOldSize += stat.size;

    const parsed = path.parse(file);
    const webpPath = path.join(imagesDir, `${parsed.name}.webp`);

    try {
      // Create WebP version
      await sharp(inputPath)
        .resize({ width: 1400, withoutEnlargement: true }) // Prevent unnecessarily huge dimensions
        .webp({ quality: 82, effort: 6 })
        .toFile(webpPath);

      const webpStat = fs.statSync(webpPath);
      totalNewWebpSize += webpStat.size;

      console.log(`✓ Converted ${file} (${(stat.size / 1024).toFixed(0)} KB) -> ${parsed.name}.webp (${(webpStat.size / 1024).toFixed(0)} KB) [-${(((stat.size - webpStat.size) / stat.size) * 100).toFixed(1)}%]`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err.message);
    }
  }

  console.log('--------------------------------------------------');
  console.log(`Total original: ${(totalOldSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total WebP:     ${(totalNewWebpSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Saved:          ${(((totalOldSize - totalNewWebpSize) / totalOldSize) * 100).toFixed(1)}% bandwidth!`);
}

optimizeImages();
