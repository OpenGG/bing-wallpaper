import { existsSync } from 'fs';
import { pathToFileURL } from 'url';
import { processImageUrl } from '../lib/url.js';
import { BingImage } from '../lib/bing.js';
import { saveWallpaper, wallpaperPath } from '../repositories/wallpaperRepository.js';

export interface MigrateOptions {
  plugin: string;
  source: string;
  dest: string;
  force?: boolean;
}

export async function migrateCommand(opts: MigrateOptions) {
  const mod = await import(pathToFileURL(opts.plugin).href);
  const loader: (src: string) => Promise<BingImage[]> = mod.default;
  const images = await loader(opts.source);
  for (const img of images) {
    const file = wallpaperPath(opts.dest, img.startdate);
    if (!opts.force && existsSync(file)) {
      continue;
    }
    const { previewUrl, downloadUrl } = processImageUrl(img.url);
    await saveWallpaper(
      opts.dest,
      { previewUrl, downloadUrl, bing: img },
      img.startdate,
    );
  }
}
