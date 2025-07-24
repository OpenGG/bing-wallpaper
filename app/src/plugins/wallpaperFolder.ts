import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { BingImage } from '../lib/bing.js';

export default async function wallpaperFolder(root: string): Promise<BingImage[]> {
  const result: BingImage[] = [];
  const years = await readdir(root);
  for (const year of years) {
    const yearDir = join(root, year);
    try {
      const months = await readdir(yearDir);
      for (const month of months) {
        const dir = join(yearDir, month);
        const days = await readdir(dir);
        for (const file of days) {
          if (!file.endsWith('.md')) continue;
          const content = await readFile(join(dir, file), 'utf8');
          const titleMatch = content.match(/^#\s*(.*)/m);
          const imageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
          const copyrightMatch = content.split('\n')[2]?.trim();
          const day = file.replace(/\.md$/, '');
          result.push({
            startdate: `${year}${month}${day}`,
            url: imageMatch ? imageMatch[1] : '',
            title: titleMatch ? titleMatch[1] : '',
            copyright: copyrightMatch ?? '',
          });
        }
      }
    } catch {
      // skip files that are not directories
    }
  }
  return result;
}
