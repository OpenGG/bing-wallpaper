import {
  LATEST_WALLPAPERS_COUNT,
  README_MARK,
  README_PATH,
} from "/constants.ts";
import { Inject } from "/utils/di.ts";
import { IWallpaper } from "/types/IWallpaper.ts";
import { FileService } from "/services/file/FileService.ts";
import { IWallpaperIndex } from "/types/IWallpaperIndex.ts";
import {
  formatArchiveLinksInReadme,
  formatDailyMarkdown,
  formatLatestWallpapersInReadme,
  formatMonth,
  formatMonthlyMarkdown,
} from "/utils/md/formats.ts";
import {
  getDailyMdPath,
  getMonthDirPath,
  getMonthMdPath,
} from "/utils/md/paths.ts";

export class MarkdownService {
  @Inject(FileService)
  private fs!: FileService;

  addWallpaper(wp: IWallpaper) {
    const dailyMdPath = getDailyMdPath(wp);
    return this.fs.writeTextFile(dailyMdPath, formatDailyMarkdown(wp));
  }

  async updateReadme(indexes: IWallpaperIndex[]) {
    const readme = await this.fs.readTextFile(README_PATH);

    const latestIndexes = indexes.slice(0, LATEST_WALLPAPERS_COUNT);

    const markdowns = await Promise.all(
      latestIndexes.map((index) => this.fs.readTextFile(index.mdPath)),
    );

    const linksMap = new Map<string, string>();

    indexes.forEach((index) => {
      const name = formatMonth(index.year, index.month);
      if (linksMap.has(name)) {
        return;
      }
      linksMap.set(name, index.mdPath);
    });

    const latestContent = formatLatestWallpapersInReadme(markdowns);
    const linksContent = formatArchiveLinksInReadme(linksMap);

    const index = readme.indexOf(README_MARK);

    if (index === -1) {
      throw new Error("Readme format invalid");
    }

    return `${readme.slice(0, index + README_MARK.length)}

${latestContent}

${linksContent}
`;
  }

  async updateMonthlyMarkdown(
    year: string,
    month: string,
  ) {
    const path = getMonthMdPath(year, month);

    const dir = getMonthDirPath(year, month);

    const files = (await this.fs.readDir(dir)).filter((e) =>
      e.isFile && e.name.endsWith(".md")
    ).map((e) => e.name).sort().reverse();

    const allMdContents = await Promise.all(
      files.map((f) => this.fs.readTextFile(f)),
    );

    await this.fs.writeTextFile(
      path,
      formatMonthlyMarkdown(year, month, allMdContents),
    );
  }
}
