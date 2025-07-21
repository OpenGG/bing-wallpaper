import { writeFile } from "fs/promises";

export class DownloadService {
  async downloadFile(url: string, filePath: string) {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok || !imageResponse.body) {
      throw new Error(
        `Failed to download image: ${imageResponse.statusText}`,
      );
    }
    const buffer = await imageResponse.arrayBuffer();
    await writeFile(filePath, Buffer.from(buffer));
  }
}
