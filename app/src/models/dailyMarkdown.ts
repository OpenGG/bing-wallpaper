import { join, dirname } from "node:path";
import matter from "gray-matter";
import { ensureDir } from "fs-extra";
import { readFile, writeFile } from "node:fs/promises";
import { DIR_WALLPAPER } from "../lib/config.js";
import type { BingImage } from "../lib/bing.js";
import { wallpaperPath } from "../repositories/wallpaperRepository.js";

export interface WallpaperMeta {
  previewUrl: string;
  downloadUrl: string;
  bing: BingImage;
}

export class DailyMarkdown {
  constructor(
    public date: string,
    public meta: WallpaperMeta,
  ) {}

  static async fromPath(path: string): Promise<DailyMarkdown> {
    const text = await readFile(path, "utf8");
    const parsed = matter(text);
    const meta = parsed.data as WallpaperMeta;
    const date = meta?.bing?.startdate ?? "";
    return new DailyMarkdown(date, meta);
  }

  get year(): string {
    return this.date.slice(0, 4);
  }

  get month(): string {
    return this.date.slice(4, 6);
  }

  /**
   * year/month folder relative to wallpaper directory
   */
  get monthPath(): string {
    return join(this.year, this.month);
  }

  /**
   * YYYY-MM segment used for archive grouping
   */
  get monthKey(): string {
    return `${this.year}-${this.month}`;
  }

  get day(): string {
    return this.date.slice(6);
  }

  get path(): string {
    return wallpaperPath(this.date);
  }

  /**
   * Absolute directory path for the month
   */
  get monthDir(): string {
    return join(DIR_WALLPAPER, this.monthPath);
  }

  async save(): Promise<void> {
    await ensureDir(dirname(this.path));
    return writeFile(this.path, this.content(), "utf8");
  }

  /**
   * Generate markdown content including front matter
   */
  content(): string {
    const body =
      `# ${this.meta.bing.title}\n\n${this.meta.bing.copyright ?? ""}\n\n` +
      `![${this.meta.bing.title}](${this.meta.previewUrl})\n\n` +
      `Date: ${this.year}-${this.month}-${this.day}\n\n` +
      `Download 4k: [${this.meta.bing.title}](${this.meta.downloadUrl})\n`;
    return matter.stringify(body, this.meta);
  }
}
