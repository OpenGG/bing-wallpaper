import { describe, it, expect } from "vitest";
import { mockFS } from "../lib/testUtils.js";

import {
  saveWallpaper,
  listWallpapers,
} from "../repositories/wallpaperRepository.js";
import { DailyMarkdown } from "./dailyMarkdown.js";
import { MonthlyArchive } from "./monthlyArchive.js";
import { transformBody } from "./readme.js";
import { readFile } from "node:fs/promises";

mockFS();

const meta = {
  previewUrl: "https://p/prev.jpg",
  downloadUrl: "https://p/dl.jpg",
  bing: {
    startdate: "20250721",
    url: "https://p/dl.jpg",
    title: "t",
    copyright: "c",
  },
};

describe("MonthlyArchive", () => {
  it("computes paths from daily", () => {
    const daily = new DailyMarkdown("20250721", meta);
    const month = MonthlyArchive.fromDaily(daily);
    expect(month.key).toBe("2025-07");
    expect(month.dir).toBe("archive/2025");
    expect(month.file).toBe("archive/2025/07.md");
  });

  it("writes archives and links", async () => {
    await saveWallpaper(meta, "20250721");
    const records = await listWallpapers("wallpaper");
    await MonthlyArchive.writeArchives(records);
    const text = await readFile("archive/2025/07.md", "utf8");
    expect(text).toContain("# 2025-07");
    const links = await MonthlyArchive.buildLinks();
    expect(links).toContain("[2025-07](./archive/2025/07.md)");
  });

  it("transforms body", () => {
    const res = transformBody("# Title\nfoo");
    expect(res.startsWith("## Title")).toBe(true);
  });
});
