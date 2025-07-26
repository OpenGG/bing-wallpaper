import { join } from "node:path";
export const DIR_WALLPAPER = "wallpaper";
export const DIR_ARCHIVE = "archive";

export const ALL_TXT = "all.txt";
export const CURRENT_TXT = "current.txt";

export const PATH_ALL_TXT = join(DIR_WALLPAPER, ALL_TXT);
export const PATH_CURRENT_TXT = join(DIR_WALLPAPER, CURRENT_TXT);

export const PATH_README = "./README.md";

export const BING_WALLPAPER_API =
  "https://bing.com/HPImageArchive.aspx?format=js&idx=0&n=10&uhd=1&uhdwidth=3840&uhdheight=2160&mkt=en-US";
