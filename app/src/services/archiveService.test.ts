import { describe, it, expect } from "vitest";
import { mockFs, setupMockFs } from "../lib/testUtils.js";
import { DailyMarkdown } from "../models/dailyMarkdown.js";
import { buildArchive } from "./archiveService.js";
import { readFile } from "node:fs/promises";

mockFs();

const meta = {
  previewUrl: "https://p/prev.jpg",
  downloadUrl: "https://p/dl.jpg",
  bing: {
    startdate: "20250721",
    url: "https://p/dl.jpg",
    title: "Title-random",
    copyright: "c",
  },
};

describe("archiveService", () => {
  it("updates README", async () => {
    setupMockFs({
      "README.md": "# Latest wallpapers\n\nold",
    });
    const md = new DailyMarkdown("20250721", meta);
    await md.save();
    await buildArchive();
    const updated = await readFile("README.md", "utf8");
    expect(updated).toContain("Title-random");
  });
});
