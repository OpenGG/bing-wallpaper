import { describe, it, expect } from "vitest";
import { mockFS, setupMockFs } from "../lib/testUtils.js";

import { saveWallpaper } from "../repositories/wallpaperRepository.js";
import { buildArchive } from "./archiveService.js";
import { readFile } from "node:fs/promises";
mockFS();

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
    await saveWallpaper(meta, "20250721");
    await buildArchive();
    const updated = await readFile("README.md", "utf8");
    expect(updated).toContain("Title-random");
  });
});
