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
    if (headerIndex === -1) {
      throw new Error("Could not find '# Latest wallpapers' section in README");
    }
    const prefix = text.slice(0, headerIndex).trimEnd();
    const body = `\n# Latest wallpapers\n\n${latest.trim()}\n\n# Archives\n\n${links.trim()}\n\n`;
    await this.write(`${prefix}\n${body}`);
  }

  async updateLatestWallpaper(records: WallpaperRecord[]) {
    const files = await Promise.all(records.map((r) => DailyMarkdown.fromPath(r.path)));
    const latest = files.map((f: DailyMarkdown) => transformBody(f.body).trim()).join("\n\n");
    const links = await MonthlyArchive.buildLinks();
    await this.updateLatestSection(latest, links);
  }
}
