import { ALL_WALLPAPERS_PATH } from "/constants.ts";
import { Inject } from "/utils/di.ts";
import { IWallpaper } from "/types/IWallpaper.ts";
import { FileService } from "/services/file/FileService.ts";
import { IWallpaperIndex } from "/types/IWallpaperIndex.ts";
import { BingWallpaperIndex } from "../../utils/bing/BingWallpaperIndex.ts";

const enCollator = new Intl.Collator("en");

const formatLine = (index: IWallpaperIndex): string => {
  return `${index.mdPath} ${index.url}`;
};

export class IndexService {
  @Inject(FileService)
  private fs!: FileService;

  private indexesMap: Map<string, IWallpaperIndex> = new Map();
  private indexKeys: string[] = [];
  private indexValues: IWallpaperIndex[] = [];

  async loadIndexes(): Promise<IWallpaperIndex[]> {
    const content = await this.fs.readTextFile(ALL_WALLPAPERS_PATH);
    content.split("\n").filter(Boolean)
      .filter((line) => line)
      .forEach((line) => {
        try {
          const index = BingWallpaperIndex.fromIndexLine(line);
          if (index) {
            this.indexesMap.set(index.date, index);
          }
        } catch (e) {
          console.warn("Index error", e);
          // ignore
        }
      });

    this.updateIndexes();

    return this.indexValues;
  }

  private updateIndexes() {
    this.indexKeys = [...this.indexesMap.keys()].sort(enCollator.compare)
      .reverse();

    this.indexValues = this.indexKeys.map((k) =>
      this.indexesMap.get(k) as IWallpaperIndex
    );
  }

  addIndexes(indexes: IWallpaperIndex[]) {
    let addCount = 0;
    indexes.forEach((index) => {
      if (
        this.indexesMap.has(index.date) &&
        this.indexesMap.get(index.date)?.url === index.url
      ) {
        return;
      }
      addCount += 1;
      this.indexesMap.set(index.date, index);
    });

    if (addCount > 0) {
      this.updateIndexes();
    }

    return addCount;
  }

  addWallpapers(wallpapers: IWallpaper[]) {
    const indexes = wallpapers.map((wp) =>
      BingWallpaperIndex.fromBingWallpaper(wp)
    );

    return this.addIndexes(indexes);
  }

  private getContent() {
    return this.indexValues.map(formatLine).join("\n");
  }

  async save() {
    await this.fs.writeTextFile(ALL_WALLPAPERS_PATH, this.getContent());
  }
}
