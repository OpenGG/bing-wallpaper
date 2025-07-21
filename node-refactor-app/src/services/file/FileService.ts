import { promises as fs } from "fs";
import { dirname } from "path";
import { Injectable } from "../../utils/di.js";

@Injectable()
export class FileService {
  async ensureDir(path: string): Promise<void> {
    await fs.mkdir(dirname(path), { recursive: true });
  }

  async readTextFile(path: string): Promise<string> {
    try {
      return await fs.readFile(path, "utf-8");
    } catch (error: any) {
      if (error.code === "ENOENT") return "";
      throw error;
    }
  }

  async writeTextFile(path: string, content: string): Promise<void> {
    await this.ensureDir(path);
    await fs.writeFile(path, content);
  }

  async readDir(path: string): Promise<string[]> {
    try {
      return await fs.readdir(path);
    } catch (error: any) {
      if (error.code === "ENOENT") return [];
      throw error;
    }
  }
}
