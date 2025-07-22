import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { ensureDir } from 'fs-extra';
import { listWallpapers, readWallpaper } from '../repositories/wallpaperRepository.js';

function transformMarkdown(body: string): string {
  const lines = body.split(/\r?\n/);
  const updated = lines.map((l, i) => (i === 0 && l.startsWith('# ')) ? `##${l.slice(1)}` : l).join('\n');
  return updated + '\n';
}

export async function buildArchiveCommand(root: string, readmePath: string) {
  const records = await listWallpapers(root);
  const latest = records.slice(0, 10);
  const pieces: string[] = [];
  for (const rec of latest) {
    const loaded = await readWallpaper(join(root, rec.file));
    pieces.push(transformMarkdown(loaded.body));
  }
  const readme = await readFile(readmePath, 'utf8');
  const headerIndex = readme.indexOf('# Latest wallpapers');
  const prefix = readme.slice(0, headerIndex).trimEnd();
  const body = `# Latest wallpapers\n\n` + pieces.join('\n');
  const archivesHeader = '\n# Archives\n\n';
  const archiveLinks = (await readdir(join(root, '..', 'archive')))
    .sort()
    .reverse()
    .flatMap(year => {
      return readdir(join(root, '..', 'archive', year)).then(months =>
        months.sort().reverse().map(m => `[${year}-${m}](./archive/${year}/${m}.md)`));
    })
    .join('\n');
  await writeFile(readmePath, `${prefix}\n${body}\n${archivesHeader}${archiveLinks}\n`);

  // build monthly archives
  const monthMap: Record<string, string[]> = {};
  for (const rec of records) {
    const [year, month] = rec.file.split('/');
    const key = `${year}-${month}`;
    if (!monthMap[key]) monthMap[key] = [];
    const loaded = await readWallpaper(join(root, rec.file));
    monthMap[key].push(transformMarkdown(loaded.body));
  }
  for (const [key, items] of Object.entries(monthMap)) {
    const [y, m] = key.split('-');
    const dir = join(root, '..', 'archive', y);
    await ensureDir(dir);
    await writeFile(join(dir, `${m}.md`), `# ${key}\n\n${items.join('\n')}`);
  }
}
