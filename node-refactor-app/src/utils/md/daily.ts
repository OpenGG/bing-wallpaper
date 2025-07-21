import { WALLPAPERS_DIR } from "@/constants.js";
import { IWallpaper } from "@/types/IWallpaper.ts";
import { join } from "node:path";
import { formatDailyMarkdown } from "./formats.ts";

export class DailyMarkdown {
    public path: string
    constructor(private wp: IWallpaper) {
        this.path = join(WALLPAPERS_DIR, wp.year, `${wp.month}.md`);
    }
    getContent() {
        const { wp } = this;
        return formatDailyMarkdown(wp);
    }
}