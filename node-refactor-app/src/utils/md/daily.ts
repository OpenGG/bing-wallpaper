import { IWallpaper } from "@/types/IWallpaper.ts";
import { formatDailyMarkdown } from "./formats.ts";
import { getDailyMdPath } from "./paths.ts";

export class DailyMarkdown {
    public path: string
    constructor(private wp: IWallpaper) {
        this.path = getDailyMdPath(wp);
    }
    getContent() {
        const { wp } = this;
        return formatDailyMarkdown(wp);
    }
}