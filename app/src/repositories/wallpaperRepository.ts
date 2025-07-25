import { join, relative } from "node:path";
import { readdir } from "node:fs/promises";

import { DIR_WALLPAPER } from "../lib/config.js";

export function wallpaperPath(date: string): string {
  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6);
  return join(DIR_WALLPAPER, year, month, `${day}.md`);
}

export interface WallpaperRecord {
  relPath: string; // relative to root
  path: string;
  year: string;
  month: string;
  day: string;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

export async function listWallpapers(root: string): Promise<WallpaperRecord[]> {
  const years = await readdir(root, { withFileTypes: true });
  const records: WallpaperRecord[] = [];
  for (const y of years) {
    if (!y.isDirectory()) continue;
    const yearDir = join(root, y.name);
    const months = await readdir(yearDir, { withFileTypes: true });
    for (const m of months) {
      if (!m.isDirectory()) continue;
      const monthDir = join(yearDir, m.name);
      const days = await readdir(monthDir);
      for (const d of days) {
        if (!d.endsWith(".md")) continue;
        const path = join(monthDir, d);
        const rec = {
          relPath: relative(root, path),
          path,
          year: y.name,
          month: m.name,
          day: d.slice(0, 2),
        };
        records.push(rec);
      }
    }
  }
  records.sort((a, b) => collator.compare(`${b.year}-${b.month}-${b.day}`, `${a.year}-${a.month}-${a.day}`));
  return records;
}
