import { readFile, writeFile } from 'node:fs/promises';
import { PATH_README } from '../lib/config.js';
import { MonthlyArchive } from './monthlyArchive.js';
import type { WallpaperRecord } from '../repositories/wallpaperRepository.js';

export function transformBody(body: string): string {
  const lines = body.split(/\r?\n/);
  const updated = lines
    .map((l, i) => (i === 0 && l.startsWith('# ') ? `##${l.slice(1)}` : l))
    .join('\n');
  return updated + '\n';
}

export class ReadmeFile {
  constructor(public path = PATH_README) {}

  async read(): Promise<string> {
    return readFile(this.path, "utf8");
  }

  async write(content: string) {
    await writeFile(this.path, content);
  }

  async updateLatestSection(latest: string, links: string) {
    const text = await this.read();
    const headerIndex = text.indexOf("# Latest wallpapers");
    const prefix = text.slice(0, headerIndex).trimEnd();
    const body = `# Latest wallpapers\n\n${latest}\n\n# Archives\n\n${links}\n`;
    await this.write(`${prefix}\n${body}`);
  }

  async updateLatestWallpaper(records: WallpaperRecord[]) {
    const latest = records.map((r) => transformBody(r.body)).join('\n');
    const links = await MonthlyArchive.buildLinks();
    await this.updateLatestSection(latest, links);
  }
}
