import { describe, it, expect, beforeEach } from "vitest";
import { mockFs, resetMockFs } from "../lib/testUtils.js";
import { DailyMarkdown, type WallpaperMeta } from "./dailyMarkdown.js";
import { readFile } from "node:fs/promises";

mockFs();

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
    expect(daily.path).toMatch("2025/07/21.md");
    await daily.save();
    const saved = await readFile(daily.path, "utf8");
    expect(saved).toContain("Download 4k");
  });
});
