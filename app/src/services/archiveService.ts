import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureDir } from 'fs-extra';

import { listWallpapers, type WallpaperRecord } from '../repositories/wallpaperRepository.js';
import { DIR_ARCHIVE, DIR_WALLPAPER, PATH_README } from '../lib/config.js';

function transform(body: string): string {
  const lines = body.split(/\r?\n/);
  const updated = lines.map((l, i) =>
    i === 0 && l.startsWith('# ') ? `##${l.slice(1)}` : l,
  ).join('\n');
  return updated + '\n';
}

function groupByMonth(records: WallpaperRecord[]): Map<string, WallpaperRecord[]> {
  const map = new Map<string, WallpaperRecord[]>();
  for (const r of records) {
    const [year, month] = r.file.split('/');
    const key = `${year}-${month}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return map;
}

async function buildArchiveLinks(): Promise<string> {
  const years = await readdir(DIR_ARCHIVE);
  const links: string[] = [];
  for (const y of years.sort().reverse()) {
    const months = await readdir(join(DIR_ARCHIVE, y));
    months
      .sort()
      .reverse()
      .forEach((m) => links.push(`[${y}-${m}](./archive/${y}/${m}.md)`));
  }
  return links.join('\n');
}

async function writeMonthlyArchives(records: WallpaperRecord[]) {
  const map = groupByMonth(records);
  for (const [key, items] of map) {
    const [y, m] = key.split('-');
    const dir = join(DIR_ARCHIVE, y);
    await ensureDir(dir);
    const content = `# ${key}\n\n` + items.map((r) => transform(r.body)).join('\n');
    await writeFile(join(dir, `${m}.md`), content);
  }
}

export async function buildArchive() {
  const records = await listWallpapers(DIR_WALLPAPER);
  const latest = records.slice(0, 10);
  const latestSection = latest.map((r) => transform(r.body)).join('\n');

  const readme = await readFile(PATH_README, 'utf8');
  const headerIndex = readme.indexOf('# Latest wallpapers');
  const prefix = readme.slice(0, headerIndex).trimEnd();
  const links = await buildArchiveLinks();
  const body = `# Latest wallpapers\n\n${latestSection}\n\n# Archives\n\n${links}\n`;
  await writeFile(PATH_README, `${prefix}\n${body}`);

  await writeMonthlyArchives(records);
}

