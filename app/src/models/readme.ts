import { readFile, writeFile } from "node:fs/promises";
import { PATH_README } from "../lib/config.js";
import { MonthlyArchive } from "./monthlyArchive.js";
import { DailyMarkdown } from "./dailyMarkdown.js";
import type { WallpaperRecord } from "../repositories/wallpaperRepository.js";

function transformBody(body: string): string {
  return `${body.replace(/^# /, "## ")}\n`;
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
    const files = await Promise.all(records.map((r) => DailyMarkdown.fromPath(r.path)));
    const latest = files.map((f: DailyMarkdown) => transformBody(f.content())).join("\n");
    const links = await MonthlyArchive.buildLinks();
    await this.updateLatestSection(latest, links);
  }
}
