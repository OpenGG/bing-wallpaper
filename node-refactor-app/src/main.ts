import "reflect-metadata";
import { container } from "./utils/di.js";
import { FileService } from "./services/file/FileService.js";
import { ObjectService } from "./services/object/ObjectService.js";
import { BingService } from "./services/bing/BingService.js";
import { IndexService } from "./services/indexes/IndexService.js";
import { ArchiveService } from "./services/archive/ArchiveService.js";
import { FetchCommand } from "./commands/fetch.js";
import { join } from "node:path";
import { BuildArchiveCommand } from "./commands/buildArchives.js";
import { BuildIndexCommand } from "./commands/buildIndex.js";
import { UploadImagesCommand } from "./commands/uploadImages.js";
import { TempService } from "./services/temp/TempService.js";
import { MarkdownService } from "./services/md/MarkdownService.js";

const command = process.argv[2];
if (!command) {
  console.error(
    "No command provided. Available: fetch, build-index, build-archives",
  );
  process.exit(1);
}

const dir = join(import.meta.dirname, '../')
// make sure run in project root
process.chdir(dir)

container.registerSingleton(FileService);
container.registerSingleton(ObjectService);
container.registerSingleton(BingService);
container.registerSingleton(IndexService);
container.registerSingleton(ArchiveService);
container.registerSingleton(TempService);
container.registerSingleton(MarkdownService);

try {
  switch (command) {
    case "fetch":
      await container.resolve(FetchCommand).execute();
      break;
    case "build-index":
      await container.resolve(BuildIndexCommand).execute();
      break;
    case "build-archives":
      await container.resolve(BuildArchiveCommand).execute();
      break;
    case "upload-images":
      await container.resolve(UploadImagesCommand).execute();
      break;
    default:
      throw new Error(`Unknown command`);
  }
  console.log(`Command "${command}" executed successfully.`);
  process.exit(0);
} catch (error) {
  console.error(`Error executing command "${command}":`, error);
  process.exit(1);
}

