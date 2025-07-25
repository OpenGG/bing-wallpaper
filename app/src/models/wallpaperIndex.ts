import { relative } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { DIR_WALLPAPER } from '../lib/config.js';
import { DailyMarkdown } from './dailyMarkdown.js';

export interface IndexEntry {
  date: string;
  url: string;
  key: string;
}

export function parseIndexLine(line: string): IndexEntry {
  const [path, url] = line.split(' ').map((s) => s.trim());
  const date = path.replace(/\.md$/, '');
  let id = '';
  try {
    id = new URL(url).searchParams.get('id') ?? '';
  } catch {
    id = url.replace(/.*[?&]id=/, '').replace(/&.*$/, '');
  }
  return { date, url, key: `${date}/${id}` };
}

export function indexLine(daily: DailyMarkdown): string {
  return `${relative(DIR_WALLPAPER, daily.file)} ${daily.meta.downloadUrl}`;
}

export function format(items: DailyMarkdown[]): string {
  return items.map((d) => indexLine(d)).join('\n') + '\n';
}

export function groupByMonth(items: DailyMarkdown[]): Map<string, DailyMarkdown[]> {
  const map = new Map<string, DailyMarkdown[]>();
  for (const it of items) {
    const key = it.monthPath;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  return map;
}

export class WallpaperIndex {
  constructor(public allPath: string, public currentPath: string) {}

  async updateWallpapers(items: DailyMarkdown[]) {
    await writeFile(this.allPath, format(items));
    if (items[0]) {
      await writeFile(this.currentPath, format([items[0]]));
    }
  }
}
