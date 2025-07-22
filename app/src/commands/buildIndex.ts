import { join } from 'path';
import { writeFile } from 'fs/promises';
import { listWallpapers } from '../repositories/wallpaperRepository.js';

async function collectMarkdown(root: string): Promise<{file: string; url: string}[]> {
  const records = await listWallpapers(root);
  return records.map(r => ({ file: r.file, url: r.meta.downloadUrl }));
}

export async function buildIndexCommand(root: string) {
  const list = await collectMarkdown(root);
  await writeFile(join(root, 'all.txt'), list.map(l => `${l.file} ${l.url}`).join('\n') + '\n');
  if (list[0]) {
    await writeFile(join(root, 'current.txt'), `${list[0].file} ${list[0].url}\n`);
  }
  const monthMap = new Map<string, {file: string, url: string}[]>();
  for (const item of list) {
    const [year, month] = item.file.split('/');
    const key = join(year, month);
    if (!monthMap.has(key)) monthMap.set(key, []);
    monthMap.get(key)!.push(item);
  }
  for (const [key, items] of monthMap) {
    const dir = join(root, key);
    await writeFile(join(dir, 'all.txt'), items.map(l => `${l.file} ${l.url}`).join('\n') + '\n');
    await writeFile(join(dir, 'current.txt'), `${items[0].file} ${items[0].url}\n`);
  }
}
