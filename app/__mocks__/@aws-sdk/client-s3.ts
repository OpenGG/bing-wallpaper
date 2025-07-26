import { vi } from "vitest";

export const sendMock = vi.fn();
export const S3Client = vi.fn().mockImplementation(() => ({ send: sendMock }));
export const GetObjectCommand = vi.fn((args) => ({
  ...args,
  __type: "GetObjectCommand",
}));
export const PutObjectCommand = vi.fn((args) => ({
  ...args,
  __type: "PutObjectCommand",
}));
