import { join } from "node:path";
import { readdir, writeFile } from "node:fs/promises";
import { ensureDir } from "fs-extra";
import { DIR_ARCHIVE } from "../lib/config.js";
import { DailyMarkdown } from "./dailyMarkdown.js";
import { transformBody } from "./readme.js";
import type { WallpaperRecord } from "../repositories/wallpaperRepository.js";

export class MonthlyArchive {
  constructor(
    public year: string,
    public month: string,
  ) {}

  static fromKey(key: string): MonthlyArchive {
    const [y, m] = key.split("-");
    return new MonthlyArchive(y, m);
  }

  static fromDaily(daily: DailyMarkdown): MonthlyArchive {
    return new MonthlyArchive(daily.year, daily.month);
  }

  get key(): string {
    return `${this.year}-${this.month}`;
  }

  get dir(): string {
    return join(DIR_ARCHIVE, this.year);
  }

  get file(): string {
    return join(this.dir, `${this.month}.md`);
  }

  static group(records: WallpaperRecord[]): Map<string, WallpaperRecord[]> {
    const map = new Map<string, WallpaperRecord[]>();
    for (const r of records) {
      const key = DailyMarkdown.fromRecord(r).monthKey;
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(r);
    }
    return map;
  }

  static async writeArchives(records: WallpaperRecord[]) {
    const map = MonthlyArchive.group(records);
    for (const [key, items] of map) {
      const archive = MonthlyArchive.fromKey(key);
      await ensureDir(archive.dir);
      const content = `# ${archive.key}\n\n${items.map((r) => transformBody(r.body)).join("\n")}`;
      await writeFile(archive.file, content);
    }
  }

  static async buildLinks(): Promise<string> {
    await ensureDir(DIR_ARCHIVE);
    const years = await readdir(DIR_ARCHIVE);
    const links: string[] = [];
    for (const y of years.sort().reverse()) {
      const months = await readdir(join(DIR_ARCHIVE, y));
      months
        .sort()
        .reverse()
        .forEach((m) => {
          const name = m.replace(/\.md$/, "");
          links.push(`[${y}-${name}](./${DIR_ARCHIVE}/${y}/${m})`);
        });
    }
    return links.join("\n");
  }
}
