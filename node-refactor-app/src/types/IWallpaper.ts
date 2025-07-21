import { IWallpaperIndex } from "./IWallpaperIndex.js";

export interface IWallpaper {
  readonly date: string;
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly previewUrl: string;
  readonly downloadUrl: string;
  readonly title: string;
  readonly copyright: string;
  readonly filename: string | null;
}
