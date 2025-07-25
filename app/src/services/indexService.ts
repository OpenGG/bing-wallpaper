import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';

import { listWallpapers } from '../repositories/wallpaperRepository.js';
import { DailyMarkdown } from '../models/dailyMarkdown.js';
import {
  DIR_WALLPAPER,
  ALL_TXT,
  CURRENT_TXT,
  PATH_ALL_TXT,
  PATH_CURRENT_TXT,
} from '../lib/config.js';

function format(items: DailyMarkdown[]): string {
  return items.map((d) => d.indexLine()).join('\n') + '\n';
}

function groupByMonth(items: DailyMarkdown[]): Map<string, DailyMarkdown[]> {
  const map = new Map<string, DailyMarkdown[]>();
  for (const it of items) {
    const key = it.monthPath;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(it);
  }
  return map;
}

export async function buildIndexes() {
  const records = await listWallpapers(DIR_WALLPAPER);
  const items = records.map((rec) => DailyMarkdown.fromRecord(rec));

  await writeFile(PATH_ALL_TXT, format(items));
  if (items[0]) {
    await writeFile(PATH_CURRENT_TXT, format([items[0]]));
  }

  const monthMap = groupByMonth(items);
  for (const [, arr] of monthMap) {
    const dir = arr[0].monthDir;
    await writeFile(join(dir, ALL_TXT), format(arr));
    await writeFile(join(dir, CURRENT_TXT), format([arr[0]]));
  }
}

