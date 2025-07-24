import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { processImageUrl } from '../lib/url.js';
import { BingImage } from '../lib/bing.js';
import { saveWallpaper, wallpaperPath } from '../repositories/wallpaperRepository.js';
import { DIR_WALLPAPER } from '../lib/config.js';

export interface MigrateOptions {
  plugin: string;
  source: string;
  force?: boolean;
}

export async function migrateCommand(opts: MigrateOptions) {
  const mod = await import(pathToFileURL(opts.plugin).href);
  const loader: (src: string) => Promise<BingImage[]> = mod.default;
  const images = await loader(opts.source);
  for (const img of images) {
    const file = wallpaperPath(img.startdate);
    if (!opts.force && existsSync(file)) {
      continue;
    }
    const { previewUrl, downloadUrl } = processImageUrl(img.url);
    await saveWallpaper(
      { previewUrl, downloadUrl, bing: img },
      img.startdate,
    );
  }
}
