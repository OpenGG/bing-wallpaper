import { pathToFileURL } from "node:url";
import { fetchBingImages, type BingImage } from "../lib/bing.js";
import { processImageUrl } from "../lib/url.js";
import { checkFileExists } from "../lib/checkFileExists.js";
import { DailyMarkdown } from "../models/dailyMarkdown.js";

export interface SaveOptions {
  force?: boolean;
}

export async function saveImages(images: BingImage[], opts: SaveOptions = {}) {
  for (const img of images) {
    const { previewUrl, downloadUrl } = processImageUrl(img.url);
    const daily = new DailyMarkdown(img.startdate, {
      previewUrl,
      downloadUrl,
      bing: img,
    });
    if (!opts.force && (await checkFileExists(daily.path))) {
      continue;
    }
    await daily.save();
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
