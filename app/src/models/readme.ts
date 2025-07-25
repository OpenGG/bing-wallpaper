import { readFile, writeFile } from 'node:fs/promises';
import { PATH_README } from '../lib/config.js';

export class ReadmeFile {
  constructor(public path = PATH_README) {}

  async read(): Promise<string> {
    return readFile(this.path, 'utf8');
  }

  async write(content: string) {
    await writeFile(this.path, content);
  }

  async updateLatestSection(latest: string, links: string) {
    const text = await this.read();
    const headerIndex = text.indexOf('# Latest wallpapers');
    const prefix = text.slice(0, headerIndex).trimEnd();
    const body = `# Latest wallpapers\n\n${latest}\n\n# Archives\n\n${links}\n`;
    await this.write(`${prefix}\n${body}`);
  }
}
