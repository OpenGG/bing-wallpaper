import { join } from 'node:path';
import { writeFile } from 'node:fs/promises';
import { listWallpapers } from '../repositories/wallpaperRepository.js';
import { ALL_TXT, CURRENT_TXT, DIR_WALLPAPER, PATH_ALL_TXT, PATH_CURRENT_TXT } from '../lib/config.js';

async function collectMarkdown(): Promise<{ file: string; url: string }[]> {
  const records = await listWallpapers(DIR_WALLPAPER);
  return records.map(r => ({ file: r.file, url: r.meta.downloadUrl }));
}

export async function buildIndexCommand() {
  const list = await collectMarkdown();
  await writeFile(PATH_ALL_TXT, list.map(l => `${l.file} ${l.url}`).join('\n') + '\n');
  if (list[0]) {
    await writeFile(PATH_CURRENT_TXT, `${list[0].file} ${list[0].url}\n`);
  }
  const monthMap = new Map<string, { file: string, url: string }[]>();
  for (const item of list) {
    const [year, month] = item.file.split('/');
    const key = join(year, month);
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key)!.push(item);
  }
  for (const [key, items] of monthMap) {
    const dir = join(PATH_CURRENT_TXT, key);
    await writeFile(join(dir, ALL_TXT), items.map(l => `${l.file} ${l.url}`).join('\n') + '\n');
    await writeFile(join(dir, CURRENT_TXT), `${items[0].file} ${items[0].url}\n`);
  }
}
