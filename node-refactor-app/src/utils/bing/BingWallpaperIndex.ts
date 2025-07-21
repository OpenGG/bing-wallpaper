import { IWallpaper } from "@/types/IWallpaper.ts";
import { parseBingWalpaperUrl } from "./parsers.js";
import type { IWallpaperIndex } from "@/types/IWallpaperIndex.ts";
import { getDailyMdPath, parseDailyMdPath } from "../md/paths.ts";
import { relative } from "node:path";
import { WALLPAPERS_DIR } from "@/constants.ts";


export class BingWallpaperIndex implements IWallpaperIndex {
  public readonly date: string;
  public readonly year: string;
  public readonly month: string;
  public readonly day: string;
  public readonly url: string;
  public readonly filename: string | null;

  static fromBingWallpaper(wp: IWallpaper) {
    return new BingWallpaperIndex({
      year: wp.year,
      month: wp.month,
      day: wp.day,
      date: wp.date,
      url: wp.downloadUrl,
      filename: wp.filename,
    });
  }

  static fromIndexLine(content: string) {
    const line = content.trim();
    const parts = line.split(" ");
    if (parts.length !== 2) {
      return null;
    }
    const [mdPath, url] = line.split(" ");

    const dateProps = parseDailyMdPath(mdPath);

    const { filename } = parseBingWalpaperUrl(url);

    return new BingWallpaperIndex({
      ...dateProps,
      url,
      filename,
    });
  }

  constructor(args: IWallpaperIndex) {
    this.date = args.date;
    this.year = args.year;
    this.month = args.month;
    this.day = args.day;
    this.url = args.url;
    this.filename = args.filename;
  }

  getContent() {
    const relPath = relative(WALLPAPERS_DIR, getDailyMdPath(this));
    return `${relPath} ${this.url}`
  }
}
