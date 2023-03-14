import type { DayConfig } from './DayConfig.ts'
import { outputFile } from './outputFile.ts'
import { template } from './template.ts'

export const output = async (base: string, {
    previewUrl,
    downloadUrl,
    year,
    month,
    date,
    title,
    copyright,
}: DayConfig) => {
    const path = `${base}/${year}/${month}/${date}.md`

    await outputFile(path, template({
        previewUrl,
        downloadUrl,
        year,
        month,
        date,
        title,
        copyright,
    }))

    return path
}
