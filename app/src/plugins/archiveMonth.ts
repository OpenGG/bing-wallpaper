import { readFile } from 'fs/promises';
import { BingImage } from '../lib/bing.js';

export default async function archiveMonth(file: string): Promise<BingImage[]> {
  const text = await readFile(file, 'utf8');
  const regex = /##\s*(?<title>[^\n]+)\n\n(?<copy>[^\n]+)\n\n!\[[^\]]*\]\([^\)]+\)\n\nDate:\s*(?<date>\d{4}-\d{2}-\d{2})\n\nDownload 4k: \[[^\]]+\]\((?<url>[^)]+)\)/g;
  const images: BingImage[] = [];
  for (;;) {
    const m = regex.exec(text);
    if (!m) break;
    images.push({
      startdate: m.groups!.date.replace(/-/g, ''),
      url: m.groups!.url,
      title: m.groups!.title,
      copyright: m.groups!.copy,
    });
  }
  return images;
}
