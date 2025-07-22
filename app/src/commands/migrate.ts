import { join } from 'path';
import { readdir, readFile } from 'fs/promises';
import { saveWallpaper } from '../repositories/wallpaperRepository.js';

export async function migrateCommand(srcRoot: string, destRoot: string) {
  const years = await readdir(srcRoot);
  for (const year of years) {
    const months = await readdir(join(srcRoot, year));
    for (const month of months) {
      const dir = join(srcRoot, year, month);
      const days = await readdir(dir);
      for (const file of days) {
        if (!file.endsWith('.md')) continue;
        const content = await readFile(join(dir, file), 'utf8');
        const lines = content.split(/\n/).map((l) => l.trim());
        const title = lines[0].replace(/^#\s*/, '');
        const previewMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
        const downloadMatch = content.match(/Download 4k: \[[^\]]*\]\(([^)]+)\)/);
        const date = `${year}${month}${file.replace(/\.md$/, '')}`;
        await saveWallpaper(destRoot, {
          previewUrl: previewMatch ? previewMatch[1] : '',
          downloadUrl: downloadMatch ? downloadMatch[1] : '',
          bing: { title, startdate: date },
        }, date);
      }
    }
  }
}
