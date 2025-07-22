import { existsSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import { processImageUrl } from '../lib/url.js';
import { BingImage } from '../lib/bing.js';
import { saveWallpaper } from '../repositories/wallpaperRepository.js';

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
    const year = img.startdate.slice(0, 4);
    const month = img.startdate.slice(4, 6);
    const day = img.startdate.slice(6);
    const file = join(opts.dest, year, month, `${day}.md`);
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
