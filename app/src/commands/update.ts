import { fetchBingImages } from '../lib/bing.js';
import { processImageUrl } from '../lib/url.js';
import { saveWallpaper } from '../repositories/wallpaperRepository.js';

export async function updateCommand() {
  const images = await fetchBingImages();
  for (const img of images) {
    const { previewUrl, downloadUrl } = processImageUrl(img.url);
    await saveWallpaper({
      previewUrl,
      downloadUrl,
      bing: img,
    }, img.startdate);
  }
}
