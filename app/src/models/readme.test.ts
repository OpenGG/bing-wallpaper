import { describe, it, expect, beforeEach } from "vitest";
import { mockFS, resetMockFs, setupMockFs } from "../lib/testUtils.js";
import { ReadmeFile } from "./readme.js";
import { readFile } from "node:fs/promises";

mockFS();

describe("ReadmeFile", () => {
  beforeEach(() => {
    resetMockFs();
  });
  it("updates latest section", async () => {
    setupMockFs({
      "README.md": "# Intro\n\n# Latest wallpapers\n\nold\n\n# Archives\n\nold",
    });
    const r = new ReadmeFile("README.md");
    await r.updateLatestSection("latest", "links");
    const text = await readFile("README.md", "utf8");
    expect(text).toContain("latest");
    expect(text).toContain("links");
  });
});
