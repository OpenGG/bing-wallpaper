import { describe, it, expect, vi, beforeEach } from "vitest";

import * as imageSvc from "./imageService.js";

const originalFetch = global.fetch;

const validPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
  "base64",
);

function mockFetch(res: { ok: boolean; status: number; contentType: string; data?: Uint8Array | Buffer }) {
  global.fetch = vi.fn(async () => ({
    ok: res.ok,
    status: res.status,
    headers: new Headers({ "content-type": res.contentType }),
    arrayBuffer: async () => (res.data ? Uint8Array.from(res.data).buffer : new Uint8Array().buffer),
  })) as unknown as typeof fetch;
}

describe("imageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = originalFetch;
  });

  it("validate succeeds", async () => {
    await expect(imageSvc.ensureImageValid(validPng)).resolves.toBeUndefined();
  });

  it("validate fails when corrupt", async () => {
    await expect(imageSvc.ensureImageValid(Buffer.from([0x00, 0x01]))).rejects.toThrow("image corrupt");
  });

  it("fetchBingImage happy path", async () => {
    mockFetch({ ok: true, status: 200, contentType: "image/png", data: validPng });
    const buf = await imageSvc.fetchBingImage("https://img.png");
    expect(buf.length).toBe(validPng.length);
  });

  it("fetchBingImage bad status", async () => {
    mockFetch({ ok: false, status: 404, contentType: "image/jpeg" });
    await expect(imageSvc.fetchBingImage("https://img.jpg")).rejects.toThrow("status=404");
  });

  it("fetchBingImage bad content-type", async () => {
    mockFetch({ ok: true, status: 200, contentType: "text/html" });
    await expect(imageSvc.fetchBingImage("https://img.jpg")).rejects.toThrow("content type");
  });
});
