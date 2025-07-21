import { IWallpaperIndex } from "/types/IWallpaperIndex.ts";

export interface IWallpaper {
  readonly date: string;
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly mdPath: string;
  readonly objectPath: string;
  readonly previewUrl: string;
  readonly downloadUrl: string;
  readonly title: string;
  readonly copyright: string;
  readonly filename: string | null;
}
