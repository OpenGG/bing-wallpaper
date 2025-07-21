import { container } from "./utils/di.js";
import { FileService } from "./services/file/FileService.js";
import { ObjectService } from "./services/object/ObjectService.js";
import { BingService } from "./services/bing/BingService.js";
import { IndexService } from "./services/indexes/IndexService.js";
import { ArchiveService } from "./services/archive/ArchiveService.js";
import { FetchCommand } from "./commands/fetch.js";
import { join } from "node:path";

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

container.register("FileService", { useClass: FileService });
container.register("ObjectService", { useClass: ObjectService });
container.register("BingService", { useClass: BingService });
container.register("IndexService", { useClass: IndexService });
container.register("ArchiveService", { useClass: ArchiveService });
container.register("FetchCommand", { useClass: FetchCommand });

try {
  switch (command) {
    case "fetch":
      await container.resolve(FetchCommand).execute();
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
  process.exit(0);
} catch (error) {
  console.error(`Error executing command "${command}":`, error);
  process.exit(1);
}

