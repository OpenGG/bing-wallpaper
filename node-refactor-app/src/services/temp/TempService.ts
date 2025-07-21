import { promises as fs } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { Injectable } from "../../utils/di.js";

@Injectable()
export class TempService {
  private tempDir!: string;

  async initTempFolder(): Promise<string> {
    if (this.tempDir) {
      throw new Error("Temp folder already initialized.");
    }

    this.tempDir = await fs.mkdtemp(join(tmpdir(), "my-prefix-"));
    return this.tempDir;
  }

  async removeTempFolder(): Promise<void> {
    if (!this.tempDir) {
      throw new Error("Temp folder not initialized.");
    }

    await fs.rm(this.tempDir, { recursive: true, force: true });
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
        await fs.rm(tempFilePath, { force: true });
      } catch (error) {
        // ignore
      }
    }
  }
}
