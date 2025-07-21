import type { IWallpaper } from "@/types/IWallpaper.js";
import { ARCHIVE_DIR, WALLPAPERS_DIR } from "@/constants.js";
import { join } from "path";

export const getDailyMdPath = (wp: IWallpaper): string => {
  return join(WALLPAPERS_DIR, wp.year, wp.month, `${wp.day}.md`);
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
