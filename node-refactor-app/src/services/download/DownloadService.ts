export class DownloadService {
  async downloadFile(url: string, filePath: string) {
    const imageResponse = await fetch(url);
    if (!imageResponse.ok || !imageResponse.body) {
      throw new Error(
        `Failed to download image: ${imageResponse.statusText}`,
      );
    }
    await Deno.writeFile(filePath, imageResponse.body);
  }
}
