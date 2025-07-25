import { describe, it, expect, beforeEach } from "vitest";
import { mockFs, resetMockFs, setupMockFs } from "./testUtils.js";
import { checkFileExists } from "./checkFileExists.js";

mockFs();

describe("checkFileExists", () => {
  beforeEach(() => {
    resetMockFs();
  });

  it("returns true when file exists", async () => {
    setupMockFs({ "/tmp/foo.txt": "hello" });
    const result = await checkFileExists("/tmp/foo.txt");
    expect(result).toBe(true);
  });

  it("returns false when file is missing", async () => {
    const result = await checkFileExists("/tmp/missing.txt");
    expect(result).toBe(false);
  });
});
