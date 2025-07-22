import { join, relative } from 'path';
import { readdir, readFile, writeFile } from 'fs/promises';

async function collectMarkdown(root: string): Promise<{file: string, url: string}[]> {
  const years = await readdir(root);
  const results: {file: string, url: string}[] = [];
  for (const year of years) {
    const ydir = join(root, year);
    const months = await readdir(ydir);
    for (const month of months) {
      const mdir = join(ydir, month);
      const days = await readdir(mdir);
      for (const file of days) {
        if (!file.endsWith('.md')) continue;
        const content = await readFile(join(mdir, file), 'utf8');
        const match = content.match(/Download 4k: \[[^\]]+\]\(([^)]+)\)/);
        if (!match) continue;
        const rel = relative(root, join(mdir, file));
        results.push({file: rel, url: match[1]});
      }
    }
  }
  return results.sort().reverse();
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
