import { describe, it, expect, vi } from "vitest";

vi.mock("../services/indexService.js", () => ({
  buildIndexes: vi.fn(),
}));

import { buildIndexCommand } from "./buildIndex.js";
import { buildIndexes } from "../services/indexService.js";

describe("buildIndexCommand", () => {
  it("runs buildIndexes", async () => {
    await buildIndexCommand();
    expect(buildIndexes).toHaveBeenCalled();
  });
});
