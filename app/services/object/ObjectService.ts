import { Inject } from "/utils/di.ts";
import { TempService } from "/services/temp/TempService.ts";

export class ObjectService {
  @Inject(TempService)
  private tempService!: TempService;

  public getObject(
    options: { bucket: string; path: string; type: "text" },
  ): Promise<string>;
  public getObject(
    options: { bucket: string; path: string; type: "binary" },
  ): Promise<Uint8Array>;

  public getObject({
    bucket,
    path,
    type = "text",
  }: {
    bucket: string;
    path: string;
    type: "text" | "binary";
  }): Promise<string | Uint8Array> {
    return this.tempService.withTempFile(async (tempFilePath) => {
      await this.runWrangler([
        "r2",
        "object",
        "get",
        `${bucket}/${path}`,
        "--file",
        tempFilePath,
      ]);
      if (type === "text") {
        return await Deno.readTextFile(tempFilePath);
      } else {
        return await Deno.readFile(tempFilePath);
      }
    });
  }

  public getObjectAsText({
    bucket,
    path,
  }: {
    bucket: string;
    path: string;
  }): Promise<string> {
    return this.getObject({
      bucket,
      path,
      type: "text",
    });
  }

  public getObjectAsFile({
    bucket,
    path,
    filePath,
  }: {
    bucket: string;
    path: string;
    filePath: string;
  }): Promise<void> {
    return this.tempService.withTempFile(async (tempFilePath) => {
      await this.runWrangler([
        "r2",
        "object",
        "get",
        `${bucket}/${path}`,
        "--file",
        tempFilePath,
      ]);
      await Deno.rename(tempFilePath, filePath);
    });
  }

  /**
   * 运行一个 wrangler 命令并处理其输出和错误。
   */
  private async runWrangler(args: string[]): Promise<void> {
    try {
      const command = new Deno.Command("wrangler", {
        args,
        stdout: "piped",
        stderr: "piped",
      });
      const { code, stderr } = await command.output();
      if (code !== 0) {
        throw new Error(
          `Wrangler command failed: ${new TextDecoder().decode(stderr)}`,
        );
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        throw new Error(
          "Fatal: `wrangler` command not found. Please install it and ensure it is in your PATH.",
          {
            cause: error,
          },
        );
      }
      throw error;
    }
  }

  public async putObjectWithFile({
    bucket,
    path,
    filePath,
  }: {
    bucket: string;
    path: string;
    filePath: string;
  }) {
    await this.runWrangler([
      "r2",
      "object",
      "put",
      `${bucket}/${path}`,
      "--file",
      filePath,
    ]);
  }

  public async putObject({
    bucket,
    path,
    data,
  }: {
    bucket: string;
    path: string;
    data: string | Uint8Array;
  }): Promise<void> {
    if (typeof data !== "string" && !(data instanceof Uint8Array)) {
      throw new Error("Unsupported data type for putObject");
    }
    await this.tempService.withTempFile(async (tempFilePath) => {
      if (typeof data === "string") {
        await Deno.writeTextFile(tempFilePath, data);
      } else if (data instanceof Uint8Array) {
        await Deno.writeFile(tempFilePath, data);
      } else {
        throw new Error("Unexpected data type");
      }

      await this.putObjectWithFile({
        bucket,
        path,
        filePath: tempFilePath,
      });
    });
  }
}
