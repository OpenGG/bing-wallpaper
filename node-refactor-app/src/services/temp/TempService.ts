import { tmpdir } from "node:os";
import { join } from "node:path";
import { Injectable } from "@/utils/di.js";
import { mkdtemp, rm } from "node:fs/promises";

@Injectable()
export class TempService {
  private tempDir!: string;

  async initTempFolder(): Promise<string> {
    if (this.tempDir) {
      throw new Error("Temp folder already initialized.");
    }

    this.tempDir = await mkdtemp(join(tmpdir(), "bw-"));
    return this.tempDir;
  }

  async removeTempFolder(): Promise<void> {
    if (!this.tempDir) {
      throw new Error("Temp folder not initialized.");
    }

    await rm(this.tempDir, { recursive: true, force: true });
  }

  async withTempFile<T>(
    transaction: (tempFilePath: string) => Promise<T>,
    {
      prefix = "temp-",
      suffix = ".tmp",
    }: {
      prefix?: string;
      suffix?: string;
    } = {},
  ): Promise<T> {
    if (!this.tempDir) {
      await this.initTempFolder();
    }
    const tempFilePath = join(this.tempDir, `${prefix}${Date.now()}${suffix}`);

    try {
      return await transaction(tempFilePath);
    } finally {
      try {
        await rm(tempFilePath, { force: true });
      } catch (error) {
        // ignore
      }
    }
  }
}
