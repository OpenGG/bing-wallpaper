import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockFs, resetMockFs } from "../lib/testUtils.js";
import { wallpaperPath } from "../repositories/wallpaperRepository.js";
import { updateWallpapers, migrateWallpapers } from "./wallpaperService.js";
import { readFile } from "node:fs/promises";

mockFs();

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
    const path = wallpaperPath("20250721");
    await updateWallpapers();
    const text = await readFile(path, "utf8");
    expect(text).toContain("Download 4k");
  });

  it("saves images from migrate plugin", async () => {
    await migrateWallpapers("./src/fixtures/testPlugin.mjs", "src");
    const path = wallpaperPath("20250722");
    const text = await readFile(path, "utf8");
    expect(text).toContain("Download 4k");
  });
});
