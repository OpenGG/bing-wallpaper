import { describe, it, expect, vi } from "vitest";

vi.mock("../services/uploadService.js", () => ({
  uploadImages: vi.fn(),
}));

import { uploadCommand } from "./upload.js";
import { uploadImages } from "../services/uploadService.js";

describe("uploadCommand", () => {
  it("calls uploadImages with options", async () => {
    await uploadCommand({ bucket: "b", cursor: "c" });
    expect(uploadImages).toHaveBeenCalledWith({ bucket: "b", cursorKey: "c" });
  });
});
