import { relative, dirname } from "node:path";
import { writeFile } from "node:fs/promises";
import type { DailyMarkdown } from "./dailyMarkdown.js";

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

export class WallpaperIndex {
  static parseIndexLine = parseIndexLine;

  private dirname = "";

  constructor(
    public allPath: string,
    public currentPath: string,
  ) {
    this.dirname = dirname(allPath);
  }

  private indexLine(daily: DailyMarkdown): string {
    return `${relative(this.dirname, daily.path)} ${daily.meta.downloadUrl}`;
  }

  private format(items: DailyMarkdown[]): string {
    return `${items.map((d) => this.indexLine(d)).join("\n")}\n`;
  }

  async updateWallpapers(items: DailyMarkdown[]) {
    await writeFile(this.allPath, this.format(items));
    if (items[0]) {
      await writeFile(this.currentPath, this.format([items[0]]));
    }
  }
}
