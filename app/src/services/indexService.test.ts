import { describe, it, expect } from "vitest";
import { mockFs } from "../lib/testUtils.js";
import { buildIndexes } from "./indexService.js";
import { readFile } from "node:fs/promises";
import { DailyMarkdown } from "../models/dailyMarkdown.js";

mockFs();

const meta = {
  previewUrl: "https://p/prev.jpg",
  downloadUrl: "https://p/dl.jpg",
  bing: { startdate: "20250721", url: "https://p/dl.jpg", title: "t", copyright: "c" },
};

describe("indexService", () => {
  it("writes index files", async () => {
    const md = new DailyMarkdown("20250721", meta);
    await md.save();
    await buildIndexes();
    const all = await readFile("wallpaper/all.txt", "utf8");
    expect(all).toMatch(/^2025\/07\/21\.md/);
    const yearAll = await readFile("wallpaper/2025/all.txt", "utf8");
    expect(yearAll).toMatch(/^07\/21\.md/);
  });
});
