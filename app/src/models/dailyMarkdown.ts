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

const parseLegacy = (content: string): { data: WallpaperMeta } => {
  const lines = content
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s);
  const title = lines[0].slice(1);
  const copyright = lines[1];
  const previewUrl = lines[2].match(/!\[.*?\]\((\S*?)\)/)?.[1];
  const date = lines[3].match(/\d{4}-\d{2}-\d{2}/)?.[0]?.replace(/-/g, "");
  const downloadUrl = lines[4].match(/4k:\s*\[.*?\]\((\S*?)\)/)?.[1];
  if (!title || !copyright || !previewUrl || !date || !downloadUrl) {
    throw new Error("Invalid legacy markdown format");
  }

  const data = {
    previewUrl,
    downloadUrl,
    bing: {
      copyright,
      startdate: date,
      title,
      url: "",
    },
  };

  return {
    data,
  };
};

export class DailyMarkdown {
  constructor(
    public date: string,
    public meta: WallpaperMeta,
  ) {}

  static async fromPath(path: string): Promise<DailyMarkdown> {
    const text = await readFile(path, "utf8");
    const parsed = text.startsWith("#") ? parseLegacy(text) : matter(text);
    const meta = parsed.data as WallpaperMeta;
    const date = meta?.bing?.startdate ?? "";
    if (!date) {
      throw new Error(`Could not find startdate in ${path}`);
    }
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
    return writeFile(this.path, this.content, "utf8");
  }

  get body() {
    return (
      `# ${this.meta.bing.title}\n\n${this.meta.bing.copyright ?? ""}\n\n` +
      `![${this.meta.bing.title}](${this.meta.previewUrl})\n\n` +
      `Date: ${this.year}-${this.month}-${this.day}\n\n` +
      `Download 4k: [${this.meta.bing.title}](${this.meta.downloadUrl})\n`
    );
  }

  /**
   * Generate markdown content including front matter
   */
  get content() {
    return matter.stringify(this.body, this.meta);
  }
}
