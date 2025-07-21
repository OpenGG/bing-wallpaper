import type { IWallpaper } from "@/types/IWallpaper.ts";

export const formatDailyMarkdown = (wallpaper: IWallpaper): string => {
  return `# ${wallpaper.title}

${wallpaper.copyright}

![${wallpaper.title}](${wallpaper.previewUrl})

Date: ${wallpaper.date}

Download 4k: [${wallpaper.title}](${wallpaper.downloadUrl})
`;
};

export const formatMonthlyMarkdown = (
  year: string,
  month: string,
  contents: string[],
) => {
  return `# ${year}-${month}

${contents.join("\n\n")}
`;
};

export const formatLatestWallpapersInReadme = (markdowns: string[]) => {
  return `\n${
    markdowns.map((md) => md.trim()).join(`\n\n---\n\n`)
  }\n`;
};

export const formatMonth = (year: string, month: string) => `${year}-${month}`;

export const formatArchiveLinksInReadme = (linksMap: Map<string, string>) => `\n\n${
  [...linksMap.entries()].map(([name, mdPath]) => `[${name}](${mdPath})`).join(`\n\n---\n\n`)
};\n\n`;
