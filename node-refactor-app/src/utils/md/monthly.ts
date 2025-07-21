import { ARCHIVE_DIR } from "@/constants.js";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { getMonthDirPath } from "./paths.ts";
import { formatMonthlyMarkdown } from "./formats.ts";

const collator = Intl.Collator('en')

export class MonthlyMarkdown {
    public path: string
    constructor(private year: string, private month: string) {
        this.path = join(ARCHIVE_DIR, year, `${month}.md`);
    }
    async getContent() {
        const monthDir = getMonthDirPath({year: this.year, month: this.month})
        const dailyMarkdowns = (await readdir(monthDir))
            .filter(f => /^\d+\.md$/.test(f))
            .sort(collator.compare)
            .reverse()

        const contents = await Promise.all(dailyMarkdowns.map(f => readFile(
            join(monthDir, f),
            'utf8'
        )))

        return formatMonthlyMarkdown(this.year, this.month, contents)
    }
}