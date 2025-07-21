import { Injectable } from "@/utils/di.js";
import { IWallpaper } from "@/types/IWallpaper.js";
import { IWallpaperIndex } from "@/types/IWallpaperIndex.ts";

import { DailyMarkdown } from "@/utils/md/daily.ts";
import { writeFile } from "node:fs/promises";
import { MonthlyMarkdown } from "@/utils/md/monthly.ts";
import { ProjectMarkdown } from "@/utils/md/project.ts";

@Injectable()
export class MarkdownService {
    addDailyMarkdown(wp: IWallpaper) {
        const md = new DailyMarkdown(wp)
        return writeFile(md.path, md.getContent());
    }
    async updateReadme(indexes: IWallpaperIndex[]) {
        const md = new ProjectMarkdown(indexes)
        return writeFile(md.path, await md.getContent());
    }
    async updateMonthlyMarkdown(year: string, month: string) {
        const md = new MonthlyMarkdown(year, month)

        return writeFile(md.path, await md.getContent());
    }
}
