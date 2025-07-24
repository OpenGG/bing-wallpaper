import { join, relative } from 'node:path';
import { ensureDir, readFile, writeFile } from 'fs-extra';
import matter from 'gray-matter';

import type { BingImage } from '../lib/bing.js';
import { DIR_WALLPAPER } from '../lib/config.js';

export interface WallpaperMeta {
  previewUrl: string;
  downloadUrl: string;
  bing: BingImage;
}

export function wallpaperPath(date: string): string {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6);
  return join(DIR_WALLPAPER, year, month, `${day}.md`);
}

export function buildContent(meta: WallpaperMeta, date: string): string {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6);
  const body = `# ${meta.bing.title}\n\n${meta.bing.copyright ?? ''}\n\n![${meta.bing.title}](${meta.previewUrl})\n\nDate: ${year}-${month}-${day}\n\nDownload 4k: [${meta.bing.title}](${meta.downloadUrl})\n`;
  return matter.stringify(body, meta);
}

export async function saveWallpaper(meta: WallpaperMeta, date: string) {
  const file = wallpaperPath(date);
  await ensureDir(join(DIR_WALLPAPER, date.slice(0, 4), date.slice(4, 6)));
  const content = buildContent(meta, date);
  await writeFile(file, content, 'utf8');
  return file;
}

export interface WallpaperRecord {
  file: string; // relative to root
  date: string;
  meta: WallpaperMeta;
  body: string;
}

export async function readWallpaper(file: string): Promise<WallpaperRecord> {
  const text = await readFile(file, 'utf8');
  const parsed = matter(text);
  const dateMatch = parsed.content.match(/Date:\s*(\d{4})-(\d{2})-(\d{2})/);
  const date = dateMatch ? dateMatch[1] + dateMatch[2] + dateMatch[3] : '';
  const meta = (parsed.data as unknown as WallpaperMeta) || {
    previewUrl: parsed.content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] ?? '',
    downloadUrl: parsed.content.match(/Download 4k: \[[^\]]+\]\(([^)]+)\)/)?.[1] ?? '',
    bing: {
      startdate: date,
      url: parsed.content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] ?? '',
      title: parsed.content.match(/^#\s*(.*)/m)?.[1] ?? '',
      copyright: parsed.content.split('\n')[2]?.trim() ?? '',
    },
  };
  return { file, date, meta, body: parsed.content };
}

export async function listWallpapers(root: string): Promise<WallpaperRecord[]> {
  const years = await (await import('fs/promises')).readdir(root, { withFileTypes: true });
  const records: WallpaperRecord[] = [];
  for (const y of years) {
    if (!y.isDirectory()) continue;
    const yearDir = join(root, y.name);
    const months = await (await import('fs/promises')).readdir(yearDir, { withFileTypes: true });
    for (const m of months) {
      if (!m.isDirectory()) continue;
      const monthDir = join(yearDir, m.name);
      const days = await (await import('fs/promises')).readdir(monthDir);
      for (const d of days) {
        if (!d.endsWith('.md')) continue;
        const file = join(monthDir, d);
        const rec = await readWallpaper(file);
        rec.file = relative(root, file);
        records.push(rec);
      }
    }
  }
  records.sort((a, b) => b.date.localeCompare(a.date));
  return records;
}
