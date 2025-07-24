import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { fetchBingImages, BingImage } from '../lib/bing.js';
import { processImageUrl } from '../lib/url.js';
import { saveWallpaper, wallpaperPath } from '../repositories/wallpaperRepository.js';

export interface SaveOptions {
  force?: boolean;
}

export async function saveImages(images: BingImage[], opts: SaveOptions = {}) {
  for (const img of images) {
    const file = wallpaperPath(img.startdate);
    if (!opts.force && existsSync(file)) continue;
    const { previewUrl, downloadUrl } = processImageUrl(img.url);
    await saveWallpaper({ previewUrl, downloadUrl, bing: img }, img.startdate);
  }
}

export async function updateWallpapers() {
  const images = await fetchBingImages();
  await saveImages(images);
}

export async function migrateWallpapers(plugin: string, source: string, opts: SaveOptions = {}) {
  const mod = await import(/* @vite-ignore */ pathToFileURL(plugin).href);
  const loader: (src: string) => Promise<BingImage[]> = mod.default;
  const images = await loader(source);
  await saveImages(images, opts);
}

