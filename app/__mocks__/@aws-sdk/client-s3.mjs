import { vi } from "vitest";
const sendMock = vi.fn();

module.exports = {
  __sendMock: sendMock,
  S3Client: vi.fn().mockImplementation(() => ({ send: sendMock })),
  GetObjectCommand: vi.fn((args) => ({
    ...args,
    __type: "GetObjectCommand",
  })),
  PutObjectCommand: vi.fn((args) => ({
    ...args,
    __type: "PutObjectCommand",
  })),
};
