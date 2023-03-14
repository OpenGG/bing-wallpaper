import type { DayConfig } from './DayConfig'

export const template = ({
    previewUrl,
    downloadUrl,
    year,
    month,
    date,
    title,
    copyright,
}: DayConfig) => `# ${title}

${copyright}

![${title}](${previewUrl})

Date: ${year}-${month}-${date}

Download 4k: [${title}](${downloadUrl})

`
