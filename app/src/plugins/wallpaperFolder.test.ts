import { describe, it, expect, afterEach, beforeEach } from "vitest";

import { mockFs, realReadFile, resetMockFs, setupMockFs } from "../lib/testUtils.js";

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import plugin from "./wallpaperFolder.js";

mockFs();

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = join(__dirname, "../fixtures/wallpaper/2025/07/10.md");

describe("wallpaperFolder plugin", () => {
  beforeEach(async () => {
    const content = await realReadFile(fixture, "utf8");
    setupMockFs({
      "/wallpaper/2025/07/10.md": content,
    });
  });

  afterEach(() => {
    resetMockFs();
  });

  it("reads existing wallpaper markdown", async () => {
    const images = await plugin("/wallpaper");
    const found = images.find((i) => i.startdate === "20250710");
    expect(found?.title).toContain("freedom");
  });
});
