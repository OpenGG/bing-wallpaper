import type { IWallpaper } from "@/types/IWallpaper.js";
import { ARCHIVE_DIR, WALLPAPERS_DIR } from "@/constants.js";
import { join } from "path";

export const getDailyMdPath = (wp: {
  year: string;
  month: string;
  day: string;
}): string => {
  return join(WALLPAPERS_DIR, wp.year, wp.month, `${wp.day}.md`);
};

export const getMonthMdPath = (wp: {
  year: string;
  month: string;
}): string => {
  return join(ARCHIVE_DIR, wp.year, `${wp.month}.md`);
};

export const getMonthDirPath = (wp: {
  year: string;
  month: string;
}): string => {
  return join(WALLPAPERS_DIR, wp.year, wp.month);
};
