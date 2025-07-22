import { join } from 'path';
import { ensureDir, writeFile } from 'fs-extra';
import matter from 'gray-matter';

import type { BingImage } from '../lib/bing.js';

export interface WallpaperMeta {
  previewUrl: string;
  downloadUrl: string;
  bing: BingImage;
}

export async function saveWallpaper(root: string, meta: WallpaperMeta, date: string) {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6);
  const dir = join(root, year, month);
  await ensureDir(dir);
  const body = `# ${meta.bing.title}\n\n${meta.bing.copyright ?? ''}\n\n![${meta.bing.title}](${meta.previewUrl})\n\nDate: ${year}-${month}-${day}\n\nDownload 4k: [${meta.bing.title}](${meta.downloadUrl})\n`;
  const file = join(dir, `${day}.md`);
  const content = matter.stringify(body, meta);
  await writeFile(file, content, 'utf8');
  return file;
}
