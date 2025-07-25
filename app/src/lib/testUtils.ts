import { vi } from "vitest";
import { vol } from "memfs";
import type fs from "node:fs/promises";
import fsExtra, * as fsExtraModule from "fs-extra";
// tell vitest to use fs mock from __mocks__ folder
// this can be done in a setup file if fs should always be mocked

export const mockFS = () => {
  vi.mock("node:fs");
  vi.mock("node:fs/promises");
  vi.mock("fs-extra");

  const ensureDir = vi.spyOn(fsExtra, "ensureDir");
  const moduleEnsureDir = vi.spyOn(fsExtraModule, "ensureDir");

  const mockedEnsureDir = async (p: string) => {
    await vol.promises.mkdir(p, { recursive: true });
  };

  ensureDir.mockImplementation(mockedEnsureDir);
  moduleEnsureDir.mockImplementation(mockedEnsureDir);
};

export const resetMockFs = () => {
  vol.reset();
};

export const setupMockFs = (fixtures: Record<string, string>) => {
  vol.fromJSON(fixtures);
};

export const realReadFile = async <T extends "utf8" | undefined>(
  path: string,
  encoding?: T,
): Promise<T extends "utf8" ? string : Buffer<ArrayBufferLike>> => {
  const realFs = await vi.importActual<typeof fs>("node:fs/promises");
  const content = await realFs.readFile(path, encoding);

  return content as never;
};
