import { describe, it, expect, beforeEach } from "vitest";
import { mockFS, resetMockFs } from "../lib/testUtils.js";
import { join } from "node:path";

import { saveWallpaper, readWallpaper, listWallpapers, wallpaperPath } from "./wallpaperRepository.js";

mockFS();

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
    const file = await saveWallpaper(sampleMeta, "20250721");
    const rec = await readWallpaper(file);
    expect(rec.meta.previewUrl).toBe(sampleMeta.previewUrl);
    expect(rec.meta.bing.title).toBe("Rainforests of the sea");
    const list = await listWallpapers("wallpaper");
    expect(list[0].file).toBe(join("2025", "07", "21.md"));
    expect(wallpaperPath("20250721")).toBe(file);
  });
});
