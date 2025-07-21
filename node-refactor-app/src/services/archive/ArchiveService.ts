import { Inject, Injectable } from "../../utils/di.js";
import { IWallpaper } from "../../types/IWallpaper.ts";
import { FileService } from "../file/FileService.js";
import { IndexService } from "../indexes/IndexService.js";
import { MarkdownService } from "../md/MarkdownService.js";

@Injectable()
export class ArchiveService {
  constructor(
    @Inject(FileService) private fs: FileService,
    @Inject(IndexService) private index: IndexService,
    @Inject(MarkdownService) private md: MarkdownService,
  ) {}

  public async archiveWallpapers(newWallpapers: IWallpaper[]): Promise<void> {
    // 写入每日文件
    await Promise.all(newWallpapers.map((wp) => {
      return this.md.addWallpaper(wp);
    }));

    // 更新每月归档
    await this.updateMonthlyArchives(newWallpapers);

    await this.index.loadIndexes();

    // 新增图片
    this.index.addWallpapers(newWallpapers);

    // 保存
    await this.index.save();
  }

  private async updateMonthlyArchives(wallpapers: IWallpaper[]) {
    // only update those affected months
    const monthlyUpdates = new Map<string, [string, string]>();
    for (const wp of wallpapers) {
      const monthKey = `${wp.year}:${wp.month}`;
      if (!monthlyUpdates.has(monthKey)) {
        monthlyUpdates.set(monthKey, [wp.year, wp.month]);
      }
    }
    await Promise.all(
      Array.from(monthlyUpdates.values()).map(async ([year, month]) => {
        await this.md.updateMonthlyMarkdown(year, month);
      }),
    );
  }

  public async updateReadme(): Promise<void> {
    // 读取索引 all.txt
    const indexes = await this.index.loadIndexes();

    await this.md.updateReadme(indexes);
  }
}
