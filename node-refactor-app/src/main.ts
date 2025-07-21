import "reflect-metadata";
import { container } from "@/utils/di.js";
import { FetchCommand } from "@/commands/FetchCommand.ts";
import { BuildArchiveCommand } from "@/commands/BuildArchiveCommand.ts";
import { BuildIndexCommand } from "@/commands/BuildIndexCommand.ts";
import { UploadImagesCommand } from "@/commands/UploadImagesCommand.ts";
import { join } from "node:path";

const command = process.argv[2];
if (!command) {
  console.error(
    "No command provided. Available: fetch, build-index, build-archives",
  );
  process.exit(1);
}

// make sure run in project root
const dir = join(import.meta.dirname, '../../')
process.chdir(dir)

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

