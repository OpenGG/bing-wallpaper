import { IWallpaper } from "../../types/IWallpaper.ts";
import { getDailyMdPath } from "../md/paths.ts";
import { getDailyObjectPath } from "../object/paths.ts";
import { parseBingWalpaperUrl } from "./parsers.ts";
import type { IWallpaperIndex } from "/types/IWallpaperIndex.ts";

const parseMdPath = (mdPath: string) => {
  const matches = mdPath.match(/^(\d+)\/(\d+)\/(\d+)\.md$/);
  if (!matches) {
    throw new Error("Invalid mdPath");
  }
  const [year, month, day] = mdPath.split("/").filter((a) => a);
  return {
    year,
    month,
    day,
    date: `${year}/${month}/${day}`,
  };
};

export class BingWallpaperIndex implements IWallpaperIndex {
  public readonly date: string;
  public readonly year: string;
  public readonly month: string;
  public readonly day: string;
  public readonly mdPath: string;
  public readonly objectPath: string;
  public readonly url: string;
  public readonly filename: string | null;

  static fromBingWallpaper(wp: IWallpaper) {
    return new BingWallpaperIndex({
      year: wp.year,
      month: wp.month,
      day: wp.day,
      date: wp.date,
      mdPath: getDailyMdPath(wp),
      objectPath: wp.objectPath,
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

    const dateProps = parseMdPath(mdPath);

    const { filename } = parseBingWalpaperUrl(url);

    return new BingWallpaperIndex({
      ...dateProps,
      mdPath,
      objectPath: getDailyObjectPath({
        ...dateProps,
        filename,
      }),
      url,
      filename,
    });
  }

  constructor(args: IWallpaperIndex) {
    this.date = args.date;
    this.year = args.year;
    this.month = args.month;
    this.day = args.day;
    this.mdPath = args.mdPath;
    this.objectPath = args.objectPath;
    this.url = args.url;
    this.filename = args.filename;
  }
}
