import { Injectable } from "@/utils/di.js";
import { ALL_WALLPAPERS_PATH } from "@/constants.js";
import { IWallpaper } from "@/types/IWallpaper.ts";
import { BingWallpaperIndex } from "@/utils/bing/BingWallpaperIndex.js";
import { readFile, writeFile } from "node:fs/promises";

const enCollator = new Intl.Collator("en");

@Injectable()
export class IndexService {

  private indexesMap: Map<string, BingWallpaperIndex> = new Map();
  private indexKeys: string[] = [];
  private indexValues: BingWallpaperIndex[] = [];

  async loadIndexes(): Promise<BingWallpaperIndex[]> {
    const content = await readFile(ALL_WALLPAPERS_PATH, 'utf8');
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
      this.indexesMap.get(k) as BingWallpaperIndex
    );
  }

  addIndexes(indexes: BingWallpaperIndex[]) {
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
    return this.indexValues.map((index) => {
      return index.getContent();
    }).join("\n");
  }

  async save() {
    await writeFile(ALL_WALLPAPERS_PATH, this.getContent());
  }
}
