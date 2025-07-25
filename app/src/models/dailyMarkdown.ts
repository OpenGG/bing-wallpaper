import { join, relative } from 'node:path';
import matter from 'gray-matter';
import { DIR_WALLPAPER } from '../lib/config.js';
import type { WallpaperMeta, WallpaperRecord } from '../repositories/wallpaperRepository.js';
import { wallpaperPath, saveWallpaper, readWallpaper } from '../repositories/wallpaperRepository.js';

export class DailyMarkdown {
  constructor(public date: string, public meta: WallpaperMeta) {}

  static fromRecord(rec: WallpaperRecord): DailyMarkdown {
    return new DailyMarkdown(rec.date, rec.meta);
  }

  static async fromFile(file: string): Promise<DailyMarkdown> {
    const rec = await readWallpaper(file);
    return new DailyMarkdown(rec.date, rec.meta);
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

  get file(): string {
    return wallpaperPath(this.date);
  }

  /**
   * Absolute directory path for the month
   */
  get monthDir(): string {
    return join(DIR_WALLPAPER, this.monthPath);
  }

  /**
   * Format the entry for all.txt or current.txt
   */
  indexLine(): string {
    return `${relative(DIR_WALLPAPER, this.file)} ${this.meta.downloadUrl}`;
  }

  async save(): Promise<string> {
    return saveWallpaper(this.meta, this.date);
  }

  /**
   * Generate markdown content including front matter
   */
  content(): string {
    const body = `# ${this.meta.bing.title}\n\n${this.meta.bing.copyright ?? ''}\n\n` +
      `![${this.meta.bing.title}](${this.meta.previewUrl})\n\n` +
      `Date: ${this.year}-${this.month}-${this.day}\n\n` +
      `Download 4k: [${this.meta.bing.title}](${this.meta.downloadUrl})\n`;
    return matter.stringify(body, this.meta);
  }


  static parseIndexLine(line: string): { date: string; url: string; key: string } {
    const [path, url] = line.split(' ').map((s) => s.trim());
    const date = path.replace(/\.md$/, '');
    const id = url.replace(/.*[?&]id=/, '').replace(/&.*$/, '');
    return { date, url, key: `${date}/${id}` };
  }
}
