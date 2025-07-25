import { describe, it, expect, vi } from "vitest";

vi.mock("../services/wallpaperService.js", () => ({
  migrateWallpapers: vi.fn(),
}));

import { migrateCommand } from "./migrate.js";
import { migrateWallpapers } from "../services/wallpaperService.js";

describe("migrateCommand", () => {
  it("passes options to migrateWallpapers", async () => {
    await migrateCommand({ plugin: "p", source: "src", force: true });
    expect(migrateWallpapers).toHaveBeenCalledWith("p", "src", { force: true });
  });
});
