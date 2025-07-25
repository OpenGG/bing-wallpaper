import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFS, resetMockFs } from "../lib/testUtils.js";
import { wallpaperPath } from "../repositories/wallpaperRepository.js";
import { updateWallpapers, migrateWallpapers } from "./wallpaperService.js";
import { readFile } from "node:fs/promises";

mockFS();

const sampleImage = {
  startdate: "20250721",
  url: "/th?id=foo_1920x1080.jpg",
  title: "t",
  copyright: "c",
};

vi.mock("../lib/bing.js", () => ({
  fetchBingImages: vi.fn(() => Promise.resolve([sampleImage])),
}));

describe("wallpaperService", () => {
  beforeEach(() => {
    resetMockFs();
  });
  it("saves images from update", async () => {
    await updateWallpapers();
    const file = wallpaperPath("20250721");
    const text = await readFile(file, "utf8");
    expect(text).toContain("Download 4k");
  });

  it("saves images from migrate plugin", async () => {
    await migrateWallpapers("./src/fixtures/testPlugin.mjs", "src");
    const file = wallpaperPath("20250721");
    const text = await readFile(file, "utf8");
    expect(text).toContain("Download 4k");
  });
});
