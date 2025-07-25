import { readFile } from "node:fs/promises";
import type { BingImage } from "../lib/bing.js";

export default async function archiveMonth(file: string): Promise<BingImage[]> {
  const text = await readFile(file, "utf8");
  const regex =
    /##\s*(?<title>[^\n]+)\n\n(?<copy>[^\n]+)\n\n!\[[^\]]*\]\([^)]+\)\n\nDate:\s*(?<date>\d{4}-\d{2}-\d{2})\n\nDownload 4k: \[[^\]]+\]\((?<url>[^)]+)\)/g;
  const images: BingImage[] = [];
  for (;;) {
    const m = regex.exec(text);
    if (!m || !m.groups) break;
    const groups = m.groups;
    images.push({
      startdate: groups.date.replace(/-/g, ""),
      url: groups.url,
      title: groups.title,
      copyright: groups.copy,
    });
  }
  return images;
}
