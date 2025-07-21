import { spawn } from "child_process";
import { Inject, Injectable } from "@/utils/di.js";
import { TempService } from "@/services/temp/TempService.js";
import { readFile, rename, writeFile } from "node:fs/promises";

@Injectable()
export class ObjectService {
  constructor(@Inject(TempService) private tempService: TempService) { }

  public getObject(
    options: { bucket: string; path: string; type: "text" },
  ): Promise<string>;
  public getObject(
    options: { bucket: string; path: string; type: "binary" },
  ): Promise<Uint8Array>;

  public async getObject({ bucket, path, type = "text" }: {
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
        return await readFile(tempFilePath, "utf-8");
      } else {
        return await readFile(tempFilePath);
      }
    });
  }

  public getObjectAsText({ bucket, path }: { bucket: string; path: string }): Promise<string> {
    return this.getObject({ bucket, path, type: "text" });
  }

  public async getObjectAsFile({ bucket, path, filePath }: { bucket: string; path: string; filePath: string }): Promise<void> {
    return this.tempService.withTempFile(async (tempFilePath) => {
      await this.runWrangler([
        "r2",
        "object",
        "get",
        `${bucket}/${path}`,
        "--file",
        tempFilePath,
      ]);
      await rename(tempFilePath, filePath);
    });
  }

  private runWrangler(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = spawn("wrangler", args, {
        stdio: ["pipe", "pipe", "pipe"],
      });

      let stderr = "";
      command.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      command.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Wrangler command failed: ${stderr}`));
        } else {
          resolve();
        }
      });

      command.on("error", (err: any) => {
        if (err.code === 'ENOENT') {
          reject(new Error(
            "Fatal: `wrangler` command not found. Please install it and ensure it is in your PATH.",
            { cause: err }
          ));
        } else {
          reject(err);
        }
      });
    });
  }

  public async putObjectWithFile({ bucket, path, filePath }: { bucket: string; path: string; filePath: string }) {
    await this.runWrangler([
      "r2",
      "object",
      "put",
      `${bucket}/${path}`,
      "--file",
      filePath,
    ]);
  }

  public async putObject({ bucket, path, data }: { bucket: string; path: string; data: string | Uint8Array }): Promise<void> {
    if (typeof data !== "string" && !(data instanceof Uint8Array)) {
      throw new Error("Unsupported data type for putObject");
    }
    await this.tempService.withTempFile(async (tempFilePath) => {
      // if (typeof data === "string") {
      //   await writeFile(tempFilePath, data);
      // } else { // data is Uint8Array
      await writeFile(tempFilePath, data);
      // }

      await this.putObjectWithFile({
        bucket,
        path,
        filePath: tempFilePath,
      });
    });
  }
}
