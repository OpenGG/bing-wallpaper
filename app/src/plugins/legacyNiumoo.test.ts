import { describe, it, expect, vi } from "vitest";
import { mockFS, resetMockFs, setupMockFs } from "../lib/testUtils.js";
import { join } from "node:path";
import plugin from "./legacyNiumoo.js";
import { writeFile } from "node:fs/promises";
import { beforeEach } from "node:test";

const fixture = `## Bing Wallpaper
2025-07-21 | [The moon's surface photographed through a telescope (© Sergey Kuznetsov/Getty Images)](https://cn.bing.com/th?id=OHR.BigMoon_EN-US5436003142_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4)
`;

mockFS();

describe("legacyNiumoo plugin", () => {
  beforeEach(() => {
    resetMockFs();
  });
  it("parses markdown list", async () => {
    setupMockFs({
      "sample.md": fixture,
    });
    const file = "sample.md";
    await writeFile(file, fixture);
    const images = await plugin(file);
    expect(images[0].startdate).toBe("20250721");
    expect(images[0].title).toContain("telescope");
  });
});
