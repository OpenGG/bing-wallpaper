import type { IBingImageDTO } from "../../types/IBingImageDTO.ts";
import type { IWallpaper } from "../../types/IWallpaper.ts";
import { getDailyMdPath } from "../md/paths.js";
import { parseBingWalpaperUrl } from "./parsers.js";
import { getDailyObjectPath } from "../object/paths.js";

/**
 * 代表一张壁纸的纯数据模型。
 */
export class BingWallpaper implements IWallpaper {
  public readonly date: string;
  public readonly year: string;
  public readonly month: string;
  public readonly day: string;
  public readonly mdPath: string;
  public readonly objectPath: string;
  public readonly previewUrl: string;
  public readonly downloadUrl: string;
  public readonly title: string;
  public readonly copyright: string;
  public readonly filename: string | null;

  constructor(data: IBingImageDTO) {
    this.title = data.title;
    this.copyright = data.copyright;
    this.year = data.startdate.slice(0, 4);
    this.month = data.startdate.slice(4, 6);
    this.day = data.startdate.slice(6, 8);
    this.date = `${this.year}-${this.month}-${this.day}`;

    const { previewUrl, downloadUrl, filename } = parseBingWalpaperUrl(
      data.url,
    );
    this.previewUrl = previewUrl;
    this.downloadUrl = downloadUrl;

    this.filename = filename;
    this.mdPath = getDailyMdPath(this);
    this.objectPath = getDailyObjectPath(this);
  }
}
