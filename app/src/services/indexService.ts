import { join } from 'node:path';

import { listWallpapers } from '../repositories/wallpaperRepository.js';
import { DailyMarkdown } from '../models/dailyMarkdown.js';
import {
  WallpaperIndex,
  format,
  groupByMonth,
} from '../models/wallpaperIndex.js';
import {
  DIR_WALLPAPER,
  ALL_TXT,
  CURRENT_TXT,
  PATH_ALL_TXT,
  PATH_CURRENT_TXT,
} from '../lib/config.js';

export async function buildIndexes() {
  const records = await listWallpapers(DIR_WALLPAPER);
  const items = records.map((rec) => DailyMarkdown.fromRecord(rec));

  const globalIndex = new WallpaperIndex(PATH_ALL_TXT, PATH_CURRENT_TXT);
  await globalIndex.updateWallpapers(items);

  const monthMap = groupByMonth(items);
  for (const [, arr] of monthMap) {
    const dir = arr[0].monthDir;
    const index = new WallpaperIndex(join(dir, ALL_TXT), join(dir, CURRENT_TXT));
    await index.updateWallpapers(arr);
  }
}

