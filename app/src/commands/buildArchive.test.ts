import { describe, it, expect, vi } from "vitest";

vi.mock("../services/archiveService.js", () => ({
  buildArchive: vi.fn(),
}));

import { buildArchiveCommand } from "./buildArchive.js";
import { buildArchive } from "../services/archiveService.js";

describe("buildArchiveCommand", () => {
  it("runs buildArchive", async () => {
    await buildArchiveCommand();
    expect(buildArchive).toHaveBeenCalled();
  });
});
