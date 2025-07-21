import { LATEST_WALLPAPERS_COUNT, README_MARK, README_PATH } from "@/constants.ts";
import { IWallpaperIndex } from "@/types/IWallpaperIndex.ts";
import { readFile } from "node:fs/promises";
import { getDailyMdPath } from "./paths.ts";
import { formatArchiveLinksInReadme, formatLatestWallpapersInReadme, formatMonth } from "./formats.ts";

export class ProjectMarkdown {
    path = README_PATH;
    constructor(private indexes: IWallpaperIndex[]) {

    }
    async getContent() {
        const { indexes } = this;
        const readme = await readFile(README_PATH, 'utf8')

        const latestWallpapers = indexes.slice(0, LATEST_WALLPAPERS_COUNT)
        const wallpaperContents = await Promise.all(
            latestWallpapers
                .map(wp => {
                    return getDailyMdPath(wp)
                })
                .map(f => readFile(f, 'utf8'))
        )

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
}