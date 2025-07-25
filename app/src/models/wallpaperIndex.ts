import { relative } from "node:path";
import { writeFile } from "node:fs/promises";
import { DIR_WALLPAPER } from "../lib/config.js";
import { DailyMarkdown } from "./dailyMarkdown.js";

export interface IndexEntry {
  date: string;
  url: string;
  key: string;
}

function parseIndexLine(line: string): IndexEntry {
  const [path, url] = line.split(" ").map((s) => s.trim());
  const date = path.replace(/\.md$/, "");
  const id = new URL(url).searchParams.get("id") || "";
  return { date, url, key: `${date}/${id}` };
}

function indexLine(daily: DailyMarkdown): string {
  return `${relative(DIR_WALLPAPER, daily.file)} ${daily.meta.downloadUrl}`;
}

function format(items: DailyMarkdown[]): string {
  return items.map((d) => indexLine(d)).join("\n") + "\n";
}

export class WallpaperIndex {
  static parseIndexLine = parseIndexLine;

  constructor(public allPath: string, public currentPath: string) {}

  async updateWallpapers(items: DailyMarkdown[]) {
    await writeFile(this.allPath, format(items));
    if (items[0]) {
      await writeFile(this.currentPath, format([items[0]]));
    }
  }
}
