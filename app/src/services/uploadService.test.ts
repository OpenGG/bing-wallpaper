import { describe, it, expect, vi, type Mock } from "vitest";
import { mockFs, setupMockFs } from "../lib/testUtils.js";
import { uploadImages, type UploadOptions } from "./uploadService.js";
import * as s3Module from "@aws-sdk/client-s3";

const s3 = s3Module as unknown as {
  __sendMock: Mock;
};

mockFs();

vi.mock("@aws-sdk/client-s3");

const sampleBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

describe("uploadImages", () => {
  it("uploads new images and updates cursor", async () => {
    setupMockFs({ "wallpaper/all.txt": "2025/07/21.md https://img.jpg\n" });
    const axios = await import("axios");
    (axios.default.get as Mock) = vi.fn(async () => ({
      status: 200,
      data: sampleBuffer,
      headers: { "content-type": "image/jpeg" },
    }));
    s3.__sendMock.mockRejectedValueOnce(new Error("not found")); // cursor not exist
    await uploadImages({
      bucket: "test",
      client: new (await import("@aws-sdk/client-s3")).S3Client({}),
    });
    expect(s3.__sendMock).toHaveBeenCalledWith(expect.objectContaining({ __type: "PutObjectCommand", Bucket: "test" }));
  });

  it("throws on invalid image response", async () => {
    setupMockFs({ "wallpaper/all.txt": "2025/07/21.md https://img.jpg\n" });
    const axios = await import("axios");
    (axios.default.get as Mock) = vi.fn(async () => ({
      status: 404,
      data: Buffer.from([]),
      headers: { "content-type": "text/html" },
    }));
    await expect(
      uploadImages({ bucket: "b", client: new (await import("@aws-sdk/client-s3")).S3Client({}) }),
    ).rejects.toThrow("invalid image");
  });

  it("requires bucket option", async () => {
    await expect(uploadImages({} as unknown as UploadOptions)).rejects.toThrow("bucket required");
  });
});
