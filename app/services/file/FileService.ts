import { ensureDir } from "/utils/fs.ts";
import { dirname } from "/utils/path.ts";

/**
 * 通用的文件系统管理器。
 */
export class FileService {
  ensureDir(path: string) {
    return ensureDir(path);
  }
  async readTextFile(path: string): Promise<string> {
    try {
      return await Deno.readTextFile(path);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) return "";
      throw error;
    }
  }

  async writeTextFile(path: string, content: string): Promise<void> {
    await this.ensureDir(dirname(path));
    await Deno.writeTextFile(path, content);
  }

  async readDir(path: string): Promise<Deno.DirEntry[]> {
    const entries = [];
    try {
      for await (const entry of Deno.readDir(path)) {
        entries.push(entry);
      }
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) throw e;
    }
    return entries;
  }
}
