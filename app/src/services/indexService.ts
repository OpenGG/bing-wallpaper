import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';

import { listWallpapers, type WallpaperRecord } from '../repositories/wallpaperRepository.js';
import {
  DIR_WALLPAPER,
  ALL_TXT,
  CURRENT_TXT,
  PATH_ALL_TXT,
  PATH_CURRENT_TXT,
} from '../lib/config.js';

interface IndexItem {
  path: string;
  url: string;
}

function format(items: IndexItem[]): string {
  return items.map((i) => `${i.path} ${i.url}`).join('\n') + '\n';
}

function toItem(rec: WallpaperRecord): IndexItem {
  return { path: rec.file, url: rec.meta.downloadUrl };
}

function groupByMonth(items: IndexItem[]): Map<string, IndexItem[]> {
  const map = new Map<string, IndexItem[]>();
  for (const it of items) {
    const [year, month] = it.path.split('/');
    const key = join(year, month);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  return map;
}

export async function buildIndexes() {
  const records = await listWallpapers(DIR_WALLPAPER);
  const items = records.map(toItem);

  await writeFile(PATH_ALL_TXT, format(items));
  if (items[0]) {
    await writeFile(PATH_CURRENT_TXT, format([items[0]]));
  }

  const monthMap = groupByMonth(items);
  for (const [key, arr] of monthMap) {
    const dir = join(DIR_WALLPAPER, key);
    await writeFile(join(dir, ALL_TXT), format(arr));
    await writeFile(join(dir, CURRENT_TXT), format([arr[0]]));
  }
}

