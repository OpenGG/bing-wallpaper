import { describe, it, expect, beforeEach } from "vitest";
import { mockFs, setupMockFs, resetMockFs } from "../lib/testUtils.js";
import { DailyMarkdown } from "../models/dailyMarkdown.js";
import { join } from "node:path";

import { listWallpapers, wallpaperPath } from "./wallpaperRepository.js";

mockFs();

const sampleMeta = {
  previewUrl:
    "https://bing.com/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1024&h=576&rs=1&c=4",
  downloadUrl:
    "https://bing.com/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4",
  bing: {
    title: "Rainforests of the sea",
    startdate: "20250721",
    url: "https://example.com",
    copyright: "Staghorn coral off the island of Bonaire, Caribbean Netherlands (© blue-sea.cz/Shutterstock)",
  },
};

describe("wallpaper repository", () => {
  beforeEach(async () => {
    resetMockFs();
  });

  it("writes and reads markdown with front matter", async () => {
    const md = new DailyMarkdown("20250721", sampleMeta);
    await md.save();
    const rec = await DailyMarkdown.fromPath(md.path);
    expect(rec.meta.previewUrl).toBe(sampleMeta.previewUrl);
    expect(rec.meta.bing.title).toBe("Rainforests of the sea");
    setupMockFs({
      "2025/07/21.md": "",
    });
    const list = await listWallpapers("wallpaper");
    expect(list[0].relPath).toBe(join("2025", "07", "21.md"));
    expect(wallpaperPath("20250721")).toBe(md.path);
  });
});
