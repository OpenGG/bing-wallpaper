import { createContainer } from "/utils/di.ts";
import { FileService } from "/services/file/FileService.ts";
import { ObjectService } from "/services/object/ObjectService.ts";
import { BingService } from "/services/bing/BingService.ts";
import { IndexService } from "/services/indexes/IndexService.ts";
import { ArchiveService } from "/services/archive/ArchiveService.ts";
import { FetchCommand } from "/commands/fetch.ts";

async function main() {
  const command = Deno.args[0];
  if (!command) {
    console.error(
      "No command provided. Available: fetch, build-index, build-archives",
    );
    Deno.exit(1);
  }

  const container = createContainer();
  container.bind(FileService, FileService);
  container.bind(ObjectService, ObjectService);
  container.bind(BingService, BingService);
  container.bind(IndexService, IndexService);
  container.bind(IndexService, IndexService);
  container.bind(ArchiveService, ArchiveService);
  container.bind(FetchCommand, FetchCommand);

  try {
    switch (command) {
      case "fetch":
        await container.get(FetchCommand).execute();
        break;
      // case "build-index":
      //   await service.buildIndex();
      //   break;
      // case "build-archives":
      //   await service.buildArchives();
      //   break;
      default:
        throw new Error(`Unknown command`);
    }
    console.log(`Command "${command}" executed successfully.`);
    Deno.exit(0);
  } catch (error) {
    console.error(`Error executing command "${command}":`, error);
    Deno.exit(1);
  }
}

// 运行
await main();
