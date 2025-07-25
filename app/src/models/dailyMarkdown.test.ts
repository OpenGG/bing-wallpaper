import { describe, it, expect } from "vitest";
import { mockFS, resetMockFs } from "../lib/testUtils.js";
import { DailyMarkdown } from "./dailyMarkdown.js";
import { parseIndexLine, indexLine } from "./wallpaperIndex.js";
import type { WallpaperMeta } from "../repositories/wallpaperRepository.js";
import { readFile } from "node:fs/promises";
import { beforeEach } from "node:test";

mockFS();

const meta: WallpaperMeta = {
  previewUrl: "https://p/prev.jpg",
  downloadUrl: "https://p/dl.jpg?id=foo",
  bing: {
    startdate: "20250721",
    url: "https://p/dl.jpg",
    title: "t",
    copyright: "c",
  },
};

describe("DailyMarkdown", () => {
  beforeEach(() => {
    resetMockFs();
  });
  it("computes paths and index lines", async () => {
    const daily = new DailyMarkdown("20250721", meta);
    expect(daily.year).toBe("2025");
    expect(daily.month).toBe("07");
    expect(daily.day).toBe("21");
    expect(daily.monthKey).toBe("2025-07");
    expect(daily.monthPath).toBe("2025/07");
    expect(daily.monthDir).toBe("wallpaper/2025/07");
    expect(daily.file).toMatch("2025/07/21.md");
    const line = indexLine(daily);
    expect(line).toContain("2025/07/21.md");
    expect(line).toContain(meta.downloadUrl);
    await daily.save();
    const saved = await readFile(daily.file, "utf8");
    expect(saved).toContain("Download 4k");
  });

  it("parses index lines", () => {
    const res = parseIndexLine("2025/07/21.md https://x?id=foo");
    expect(res.key).toBe("2025/07/21/foo");
    expect(res.date).toBe("2025/07/21");
  });
});
