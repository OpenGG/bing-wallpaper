import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BingImage } from "../lib/bing.js";

function isNumeric(s: string) {
  return /^\d+$/.test(s);
}
export default async function wallpaperFolder(root: string): Promise<BingImage[]> {
  const result: BingImage[] = [];
  const years = await readdir(root);
  for (const year of years) {
    if (!isNumeric(year)) continue;
    const yearDir = join(root, year);

    const months = await readdir(yearDir);
    for (const month of months) {
      if (!isNumeric(month)) continue;
      const dir = join(yearDir, month);
      const days = await readdir(dir);
      for (const file of days) {
        if (!file.endsWith(".md")) continue;
        const content = await readFile(join(dir, file), "utf8");
        const titleMatch = content.match(/^#\s*(.*)/m);
        const imageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
        const copyrightMatch = content.split("\n")[2]?.trim();
        const day = file.replace(/\.md$/, "");
        result.push({
          startdate: `${year}${month}${day}`,
          url: imageMatch ? imageMatch[1] : "",
          title: titleMatch ? titleMatch[1] : "",
          copyright: copyrightMatch ?? "",
        });
      }
    }
  }
  return result;
}
