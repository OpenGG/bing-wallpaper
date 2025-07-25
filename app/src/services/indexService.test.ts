import { describe, it, expect, vi } from "vitest";
import { vol } from "memfs";

vi.mock("fs-extra", () => ({
  ensureDir: async (p: string) => vol.promises.mkdir(p, { recursive: true }),
  readFile: vol.promises.readFile,
  writeFile: vol.promises.writeFile,
}));
vi.mock("node:fs/promises", () => vol.promises);

import { saveWallpaper } from "../repositories/wallpaperRepository.js";
import { buildIndexes } from "./indexService.js";

const meta = {
  previewUrl: "https://p/prev.jpg",
  downloadUrl: "https://p/dl.jpg",
  bing: { startdate: "20250721", url: "https://p/dl.jpg", title: "t", copyright: "c" },
};

describe("indexService", () => {
  it("writes index files", async () => {
    await saveWallpaper(meta, "20250721");
    await buildIndexes();
    const all = await vol.promises.readFile("wallpaper/all.txt", "utf8");
    expect(all).toContain("2025/07/21.md");
    const yearAll = await vol.promises.readFile("archive/2025/all.txt", "utf8");
    expect(yearAll).toContain("2025/07/21.md");
  });
});
