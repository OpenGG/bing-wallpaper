import { describe, it, expect, vi, type Mock } from "vitest";
import { mockFs, setupMockFs } from "../lib/testUtils.js";
import { uploadImages, type UploadOptions } from "./uploadService.js";
import * as imageSvc from "./imageService.js";
import * as s3Module from "@aws-sdk/client-s3";

const s3 = s3Module as unknown as {
  sendMock: Mock;
};

const ensureMock = imageSvc.ensureImageValid as unknown as Mock;
const fetchMock = imageSvc.fetchBingImage as unknown as Mock;

mockFs();

vi.mock("@aws-sdk/client-s3");
vi.mock("./imageService.js", () => ({
  ensureImageValid: vi.fn(),
  fetchBingImage: vi.fn(),
}));

const sampleBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAJ+cNfoAAAAASUVORK5CYII=",
  "base64",
);

describe("uploadImages", () => {
  it("uploads new images and updates cursor", async () => {
    s3.sendMock.mockClear();
    ensureMock.mockClear();
    ensureMock.mockResolvedValueOnce(undefined);
    setupMockFs({ "wallpaper/all.txt": "2025/07/21.md https://img.jpg\n" });
    fetchMock.mockImplementationOnce(async () => {
      await ensureMock(sampleBuffer);
      return sampleBuffer;
    });
    const err = new Error("not found");
    // mimic S3's NoSuchKey error
    (err as unknown as Record<string, unknown>).Code = "NoSuchKey";
    s3.sendMock.mockRejectedValueOnce(err); // cursor not exist
    await uploadImages({
      bucket: "test",
      client: new (await import("@aws-sdk/client-s3")).S3Client({}),
    });
    expect(s3.sendMock).toHaveBeenCalledWith(expect.objectContaining({ __type: "PutObjectCommand", Bucket: "test" }));
  });

  it("throws on invalid image response", async () => {
    s3.sendMock.mockClear();
    ensureMock.mockClear();
    s3.sendMock.mockResolvedValueOnce({}); // cursor missing
    setupMockFs({ "wallpaper/all.txt": "2025/07/21.md https://img.jpg\n" });
    fetchMock.mockRejectedValue(new Error("invalid image"));
    await expect(
      uploadImages({ bucket: "b", client: new (await import("@aws-sdk/client-s3")).S3Client({}) }),
    ).rejects.toThrow("invalid image");
    expect(ensureMock).not.toHaveBeenCalled();
  });

  it("requires bucket option", async () => {
    s3.sendMock.mockClear();
    ensureMock.mockClear();
    await expect(uploadImages({} as unknown as UploadOptions)).rejects.toThrow("bucket required");
    expect(ensureMock).not.toHaveBeenCalled();
  });

  it("skips already uploaded images", async () => {
    s3.sendMock.mockClear();
    ensureMock.mockClear();
    ensureMock.mockResolvedValueOnce(undefined);
    setupMockFs({
      "wallpaper/all.txt": "2025/07/20.md https://img1.jpg\n2025/07/21.md https://img2.jpg\n",
    });
    fetchMock.mockImplementation(async () => {
      await ensureMock(sampleBuffer);
      return sampleBuffer;
    });
    const cursorBody = {
      async *[Symbol.asyncIterator]() {
        yield Buffer.from("2025/07/20");
      },
    };
    s3.sendMock.mockResolvedValueOnce({ Body: cursorBody });
    await uploadImages({ bucket: "t", client: new (await import("@aws-sdk/client-s3")).S3Client({}) });
    // only one image uploaded
    const putCalls = s3.sendMock.mock.calls.filter((c) => c[0].__type === "PutObjectCommand");
    expect(putCalls.length).toBe(2); // image + cursor write
    expect(ensureMock).toHaveBeenCalledTimes(1);
  });

  it("throws when image is corrupt", async () => {
    s3.sendMock.mockClear();
    ensureMock.mockClear();
    ensureMock.mockImplementation(() => {
      throw new Error("image corrupt");
    });
    setupMockFs({ "wallpaper/all.txt": "2025/07/22.md https://img.jpg\n" });
    fetchMock.mockImplementation(async () => {
      const buf = Buffer.from([0x01, 0x02]);
      await ensureMock(buf);
      return buf;
    });
    const err2 = new Error("not found");
    (err2 as unknown as Record<string, unknown>).Code = "NoSuchKey";
    s3.sendMock.mockRejectedValueOnce(err2);
    await expect(
      uploadImages({ bucket: "b", client: new (await import("@aws-sdk/client-s3")).S3Client({}) }),
    ).rejects.toThrow("image corrupt");
    expect(ensureMock).toHaveBeenCalledTimes(3);
  });
});
