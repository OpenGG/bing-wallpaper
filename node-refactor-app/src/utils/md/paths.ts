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


export const parseDailyMdPath = (mdPath: string) => {
  const matches = mdPath.match(/^(\d+)\/(\d+)\/(\d+)\.md$/);
  if (!matches) {
    throw new Error(`Invalid mdPath: ${mdPath}`);
  }
  const [,year, month, day] = matches;
  return {
    year,
    month,
    day,
  };
};
