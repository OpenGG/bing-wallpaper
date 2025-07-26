import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { BingImage } from "../lib/bing.js";

function isNumeric(s: string) {
  return /^\d+$/.test(s);
}
export default async function wallpaperFolder(root: string): Promise<BingImage[]> {
  const result: BingImage[] = [];
  const years = await readdir(root, { withFileTypes: true });
  for (const year of years) {
    if (!year.isDirectory() || !isNumeric(year.name)) continue;
    const yearDir = join(root, year.name);

    const months = await readdir(yearDir, { withFileTypes: true });
    for (const month of months) {
      if (!month.isDirectory() || !isNumeric(month.name)) continue;
      const dir = join(yearDir, month.name);
      const days = await readdir(dir);
      for (const file of days) {
        if (!file.endsWith(".md")) continue;
        const content = await readFile(join(dir, file), "utf8");
        const titleMatch = content.match(/^#\s*(.*)/m);
        const imageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
        const copyrightMatch = content.split("\n")[2]?.trim();
        const day = file.replace(/\.md$/, "");
        result.push({
          startdate: `${year.name}${month.name}${day}`,
          url: imageMatch ? imageMatch[1] : "",
          title: titleMatch ? titleMatch[1] : "",
          copyright: copyrightMatch ?? "",
        });
      }
    }
  }
  return result;
}
