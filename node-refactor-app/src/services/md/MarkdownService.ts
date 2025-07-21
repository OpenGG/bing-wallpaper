import { Injectable } from "@/utils/di.js";
import {
    LATEST_WALLPAPERS_COUNT,
    README_MARK,
    README_PATH,
} from "@/constants.js";
import { IWallpaper } from "@/types/IWallpaper.js";
import { IWallpaperIndex } from "@/types/IWallpaperIndex.ts";
import {
    formatArchiveLinksInReadme,
    formatLatestWallpapersInReadme,
    formatMonth,
} from "@/utils/md/formats.js";
import { DailyMarkdown } from "@/utils/md/daily.ts";
import { readFile, writeFile } from "node:fs/promises";
import { MonthlyMarkdown } from "@/utils/md/monthly.ts";

@Injectable()
export class MarkdownService {
    addDailyMarkdown(wp: IWallpaper) {
        const md = new DailyMarkdown(wp)
        return writeFile(md.path, md.getContent());
    }
    async updateReadme(indexes: IWallpaperIndex[]) {
        const readme = await readFile(README_PATH, 'utf8');
        const latestIndexes = indexes.slice(0, LATEST_WALLPAPERS_COUNT);
        const markdowns = await Promise.all(
            latestIndexes.map((index) => readFile(index.mdPath, 'utf8')),
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
    async updateMonthlyMarkdown(year: string, month: string) {
        const md = new MonthlyMarkdown(year, month)

        return writeFile(md.path, await md.getContent());
    }
}
