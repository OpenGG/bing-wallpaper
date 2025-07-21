import { BUCKET, CURSOR_PATH } from "/constants.ts";
import { TempService } from "/services/temp/TempService.ts";
import { retry } from "/utils/retry.ts";
import { IndexService } from "/services/indexes/IndexService.ts";
import { ObjectService } from "/services/object/ObjectService.ts";
import { DownloadService } from "/services/download/DownloadService.ts";
import { ImageService } from "/services/image/ImageService.ts";
import { Inject } from "/utils/di.ts";

export class UploadImagesCommand {
  @Inject(IndexService)
  private indexService!: IndexService;

  @Inject(ObjectService)
  private objectService!: ObjectService;

  @Inject(TempService)
  private tempService!: TempService;

  @Inject(DownloadService)
  private downloadService!: DownloadService;

  @Inject(ImageService)
  private imageService!: ImageService;

  /**
   * 增量式地上传新的壁纸图片到 R2 云存储。
   * 这段代码是 uploadImage.sh 脚本的 Deno/TypeScript 实现。
   */
  public async execute(): Promise<void> {
    // 1. 准备工作
    const indexes = await this.indexService.loadIndexes();

    // 2. 获取光标
    const cursor = await this._getCursorFromR2();
    console.log(`Starting upload process. Current cursor: ${cursor}`);

    let lastSuccessfulCursor = cursor;

    try {
      // 3. 核心处理循环
      for (const index of indexes) {
        const { date, url } = index;

        // 4. 增量检查
        if (date > cursor) {
          console.log(`Dealing with new wallpaper: ${date}`);

          try {
            await this.tempService.withTempFile(async (tempFilePath) => {
              // 5. 下载
              console.log(`  Downloading from ${url}`);
              await retry(async () => {
                await this.downloadService.downloadFile(url, tempFilePath);
              });

              // 6. 校验
              console.log(`  Validating image: ${tempFilePath}`);
              if (!(await this.imageService.validateImage(tempFilePath))) {
                throw new Error("Corrupt image detected");
              }

              const targetPath = index.objectPath;

              // 7. 上传
              console.log(
                `  Image valid. Uploading to R2: ${BUCKET}/${targetPath}`,
              );
              await this.objectService.putObjectWithFile({
                bucket: BUCKET,
                path: targetPath,
                filePath: tempFilePath,
              });
            });

            // 8. 更新光标
            lastSuccessfulCursor = date;
            console.log(
              `  Successfully processed. New cursor position: ${lastSuccessfulCursor}`,
            );
          } catch (error) {
            console.error(`Failed to process ${date}:`, error);
            throw error; // 中断整个循环
          }
        }
      }
    } catch (error) {
      console.error(
        "An error occurred during the upload process. The process will stop.",
        error,
      );
    } finally {
      // 9. 最后保存光标
      if (lastSuccessfulCursor > cursor) {
        console.log(`Saving final cursor to R2: ${lastSuccessfulCursor}`);
        await this.objectService.putObject({
          bucket: BUCKET,
          path: CURSOR_PATH,
          data: lastSuccessfulCursor,
        });
      } else {
        console.log(
          "No new wallpapers were uploaded. Cursor remains unchanged.",
        );
      }
      console.log("Upload process finished.");
    }
  }

  private async _getCursorFromR2(): Promise<string> {
    try {
      // 模仿 shell 脚本中的 `|| true`，我们只管尝试执行，如果失败（比如文件不存在），就在 catch 块中处理
      const cursor = await this.objectService.getObjectAsText({
        bucket: BUCKET,
        path: CURSOR_PATH,
      });
      return cursor.trim();
    } catch {
      // 任何错误（命令失败、文件读不到等）都视为光标不存在
      console.log("Cursor not found on R2. Starting from scratch.");
      return "1970/01/01";
    }
  }
}
