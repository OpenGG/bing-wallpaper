import { describe, it, expect, beforeEach } from "vitest";
import { vol } from "memfs";
import { mockFS, resetMockFs } from "../lib/testUtils.js";
import { WallpaperIndex } from "./wallpaperIndex.js";
import { DailyMarkdown } from "./dailyMarkdown.js";

mockFS();

const meta = {
  previewUrl: "https://p/prev.jpg",
  downloadUrl: "https://p/dl.jpg?id=foo",
  bing: {
    startdate: "20250721",
    url: "https://p/dl.jpg",
    title: "t",
    copyright: "c",
  },
};

describe("WallpaperIndex", () => {
  beforeEach(() => {
    resetMockFs();
  });

  it("parses index line", () => {
    const line = "2025/07/21.md https://p/dl.jpg?id=foo";
    const entry = WallpaperIndex.parseIndexLine(line);
    expect(entry).toEqual({ date: "2025/07/21", url: "https://p/dl.jpg?id=foo", key: "2025/07/21/foo" });
  });

  it("writes index files", async () => {
    const daily = new DailyMarkdown("20250721", meta);
    await vol.promises.mkdir("idx", { recursive: true });
    const index = new WallpaperIndex("idx/all.txt", "idx/current.txt");
    await index.updateWallpapers([daily]);
    const all = await vol.promises.readFile("idx/all.txt", "utf8");
    const current = await vol.promises.readFile("idx/current.txt", "utf8");
    expect(all).toContain("2025/07/21.md");
    expect(current).toContain("2025/07/21.md");
  });
});
