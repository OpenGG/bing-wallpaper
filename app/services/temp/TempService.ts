const removeTempFile = async (tempFilePath: string): Promise<void> => {
  if (!tempFilePath) {
    return;
  }
  try {
    await Deno.remove(tempFilePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      // ignore
      return;
    }
    throw new Error(`Failed to remove temp file: ${tempFilePath}`, {
      cause: error,
    });
  }
};

export class TempService {
  private tempDir!: string;

  async initTempFolder() {
    if (this.tempDir) {
      throw new Error("Temp folder already initialized.");
    }

    this.tempDir = await Deno.makeTempDir({ prefix: `my-prefix-` });

    return this.tempDir;
  }

  async removeTempFolder() {
    if (!this.tempDir) {
      throw new Error("Temp folder not initialized.");
    }

    await Deno.remove(this.tempDir, { recursive: true });
  }

  async withTempFile<T>(
    transaction: (tempFilePath: string) => Promise<T>,
    {
      prefix,
      suffix,
    }: {
      prefix?: string;
      suffix?: string;
    } = {},
  ): Promise<T> {
    let tempFilePath = "";
    try {
      if (!this.tempDir) {
        throw new Error(
          "Temp folder not initialized. Call initTempFolder first.",
        );
      }
      tempFilePath = await Deno.makeTempFile({
        dir: this.tempDir,
        prefix: prefix || "temp-",
        suffix: suffix || ".tmp",
      });

      return await transaction(tempFilePath);
    } finally {
      await removeTempFile(tempFilePath);
    }
  }
}
