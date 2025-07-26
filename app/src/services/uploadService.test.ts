import { describe, it, expect, vi, type Mock } from "vitest";
import { mockFs, setupMockFs } from "../lib/testUtils.js";
import { uploadImages, type UploadOptions } from "./uploadService.js";
import * as imageSvc from "./imageService.js";
import * as s3Module from "@aws-sdk/client-s3";

const s3 = s3Module as unknown as {
  __sendMock: Mock;
};

const ensureMock = imageSvc.ensureImageValid as unknown as Mock;

mockFs();

vi.mock("@aws-sdk/client-s3");
vi.mock("./imageService.js");

const sampleBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ+cNfoAAAAASUVORK5CYII=",
  "base64",
);

describe("uploadImages", () => {
  it("uploads new images and updates cursor", async () => {
    s3.__sendMock.mockClear();
    ensureMock.mockClear();
    ensureMock.mockResolvedValueOnce(undefined);
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
    s3.__sendMock.mockClear();
    ensureMock.mockClear();
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
    expect(ensureMock).not.toHaveBeenCalled();
  });

  it("requires bucket option", async () => {
    s3.__sendMock.mockClear();
    ensureMock.mockClear();
    await expect(uploadImages({} as unknown as UploadOptions)).rejects.toThrow("bucket required");
    expect(ensureMock).not.toHaveBeenCalled();
  });

  it("skips already uploaded images", async () => {
    s3.__sendMock.mockClear();
    ensureMock.mockClear();
    ensureMock.mockResolvedValueOnce(undefined);
    setupMockFs({
      "wallpaper/all.txt": "2025/07/20.md https://img1.jpg\n2025/07/21.md https://img2.jpg\n",
    });
    const axios = await import("axios");
    (axios.default.get as Mock) = vi.fn(async () => ({
      status: 200,
      data: sampleBuffer,
      headers: { "content-type": "image/jpeg" },
    }));
    const cursorBody = {
      async *[Symbol.asyncIterator]() {
        yield Buffer.from("2025/07/20");
      },
    };
    s3.__sendMock.mockResolvedValueOnce({ Body: cursorBody });
    await uploadImages({ bucket: "t", client: new (await import("@aws-sdk/client-s3")).S3Client({}) });
    // only one image uploaded
    const putCalls = s3.__sendMock.mock.calls.filter((c) => c[0].__type === "PutObjectCommand");
    expect(putCalls.length).toBe(3); // image + two cursor writes
    expect(ensureMock).toHaveBeenCalledTimes(1);
  });

  it("throws when image is corrupt", async () => {
    s3.__sendMock.mockClear();
    ensureMock.mockClear();
    ensureMock.mockImplementationOnce(() => {
      throw new Error("image corrupt");
    });
    setupMockFs({ "wallpaper/all.txt": "2025/07/22.md https://img.jpg\n" });
    const axios = await import("axios");
    (axios.default.get as Mock) = vi.fn(async () => ({
      status: 200,
      data: Buffer.from([0x01, 0x02]),
      headers: { "content-type": "image/jpeg" },
    }));
    s3.__sendMock.mockRejectedValueOnce(new Error("not found"));
    await expect(
      uploadImages({ bucket: "b", client: new (await import("@aws-sdk/client-s3")).S3Client({}) }),
    ).rejects.toThrow("image corrupt");
    expect(ensureMock).toHaveBeenCalledTimes(1);
  });
});
