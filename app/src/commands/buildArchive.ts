import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { ensureDir } from 'fs-extra';

async function readLines(file: string): Promise<string[]> {
  const content = await readFile(file, 'utf8');
  return content.split(/\r?\n/).filter(Boolean);
}

async function loadMarkdown(path: string): Promise<string> {
  const lines = await readLines(path);
  // change header to ##
  const updated = lines.map((l, i) => (i === 0 && l.startsWith('# ')) ? `##${l.slice(1)}` : l).join('\n');
  return updated + '\n';
}

export async function buildArchiveCommand(root: string, readmePath: string) {
  const allFile = join(root, 'all.txt');
  const lines = await readLines(allFile);
  const latest = lines.slice(0, 10);
  const pieces: string[] = [];
  for (const line of latest) {
    const [file] = line.split(' ');
    pieces.push(await loadMarkdown(join(root, file)));
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
  for (const line of lines) {
    const [file] = line.split(' ');
    const [year, month] = file.split('/');
    const key = `${year}-${month}`;
    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push(await loadMarkdown(join(root, file)));
  }
  for (const [key, items] of Object.entries(monthMap)) {
    const [y, m] = key.split('-');
    const dir = join(root, '..', 'archive', y);
    await ensureDir(dir);
    await writeFile(join(dir, `${m}.md`), `# ${key}\n\n${items.join('\n')}`);
  }
}
