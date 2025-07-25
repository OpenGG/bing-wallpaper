import { join } from "node:path";
import { ensureDir } from "fs-extra";

import { listWallpapers } from "../repositories/wallpaperRepository.js";
import { DailyMarkdown } from "../models/dailyMarkdown.js";
import { WallpaperIndex } from "../models/wallpaperIndex.js";
import { DIR_WALLPAPER, ALL_TXT, CURRENT_TXT, PATH_ALL_TXT, PATH_CURRENT_TXT, DIR_ARCHIVE } from "../lib/config.js";

export async function buildIndexes() {
  const records = await listWallpapers(DIR_WALLPAPER);
  const items = await Promise.all(records.map((rec) => DailyMarkdown.fromPath(rec.path)));

  const globalIndex = new WallpaperIndex(PATH_ALL_TXT, PATH_CURRENT_TXT);
  await globalIndex.updateWallpapers(items);

  const yearMap = new Map<string, DailyMarkdown[]>();
  for (const item of items) {
    const { year } = item;
    if (!yearMap.has(year)) {
      yearMap.set(year, []);
    }
    yearMap.get(year)?.push(item);
  }
  for (const [year, arr] of yearMap) {
    const dir = join(DIR_ARCHIVE, year);
    await ensureDir(dir);
    const index = new WallpaperIndex(join(DIR_WALLPAPER, year, ALL_TXT), join(DIR_WALLPAPER, year, CURRENT_TXT));
    await index.updateWallpapers(arr);
  }
}
