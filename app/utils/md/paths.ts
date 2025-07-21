import type { IWallpaper } from "/types/IWallpaper.ts";
import { ARCHIVE_DIR, WALLPAPERS_DIR } from "/constants.ts";
import { join } from "/utils/path.ts";

export const getDailyMdPath = (wp: IWallpaper): string => {
  return join(ARCHIVE_DIR, wp.year, wp.month, `${wp.date}.md`);
};

export const getMonthMdPathByWallpaper = (wp: IWallpaper): string => {
  return getMonthMdPath(wp.year, wp.month);
};

export const getMonthMdPath = (year: string, month: string): string => {
  return join(ARCHIVE_DIR, year, `${month}.md`);
};

export const getMonthDirPath = (year: string, month: string): string => {
  return join(WALLPAPERS_DIR, year, month);
};
