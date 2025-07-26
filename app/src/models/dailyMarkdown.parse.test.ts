import { describe, it, expect, beforeEach } from "vitest";
import { mockFs, resetMockFs, setupMockFs, realReadFile } from "../lib/testUtils.js";
import { DailyMarkdown } from "./dailyMarkdown.js";

mockFs();

describe("DailyMarkdown.fromPath", () => {
  beforeEach(() => {
    resetMockFs();
  });

  it("parses legacy markdown", async () => {
    const content = await realReadFile("src/fixtures/wallpaper/2025/07/10.md", "utf8");
    setupMockFs({ "/legacy.md": content });
    const daily = await DailyMarkdown.fromPath("/legacy.md");
    expect(daily.date).toBe("20250710");
    expect(daily.meta.bing.title).toContain("freedom");
  });

  it("parses front-matter markdown", async () => {
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
    const daily = new DailyMarkdown("20250721", meta);
    await daily.save();
    const loaded = await DailyMarkdown.fromPath(daily.path);
    expect(loaded.meta.previewUrl).toBe(meta.previewUrl);
    expect(loaded.date).toBe("20250721");
  });
});
