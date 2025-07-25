import { describe, it, expect, vi } from "vitest";

vi.mock("../services/wallpaperService.js", () => ({
  updateWallpapers: vi.fn(),
}));

import { updateCommand } from "./update.js";
import { updateWallpapers } from "../services/wallpaperService.js";

describe("updateCommand", () => {
  it("calls updateWallpapers", async () => {
    await updateCommand();
    expect(updateWallpapers).toHaveBeenCalled();
  });
});
