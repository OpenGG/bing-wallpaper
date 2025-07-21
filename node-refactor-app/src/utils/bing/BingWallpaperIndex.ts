import { IWallpaper } from "@/types/IWallpaper.ts";
import { parseBingWalpaperUrl } from "./parsers.js";
import type { IWallpaperIndex } from "@/types/IWallpaperIndex.ts";
import { getDailyMdPath, parseDailyMdPath } from "../md/paths.ts";
import { relative } from "node:path";
import { WALLPAPERS_DIR } from "@/constants.ts";


export class BingWallpaperIndex implements IWallpaperIndex {
  public readonly year: string;
  public readonly month: string;
  public readonly day: string;
  public readonly url: string;

  static fromBingWallpaper(wp: IWallpaper) {
    return new BingWallpaperIndex({
      year: wp.year,
      month: wp.month,
      day: wp.day,
      url: wp.downloadUrl,
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

    return new BingWallpaperIndex({
      ...dateProps,
      url,
    });
  }

  constructor(args: IWallpaperIndex) {
    this.year = args.year;
    this.month = args.month;
    this.day = args.day;
    this.url = args.url;
  }

  getContent() {
    const relPath = relative(WALLPAPERS_DIR, getDailyMdPath(this));
    return `${relPath} ${this.url}`
  }
}
