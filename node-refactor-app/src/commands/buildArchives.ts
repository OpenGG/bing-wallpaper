import { ArchiveService } from "../services/archive/ArchiveService.ts";
import { Inject, Injectable } from "../utils/di.ts";

@Injectable()
export class BuildArchiveCommand {
  constructor(@Inject(ArchiveService) private archiveService: ArchiveService) {}

  async execute() {
    // This command is now functionally identical to build-index
    // as updateReadme handles both parts.
    console.log("Starting: Build archive links...");
    await this.archiveService.updateReadme();
    console.log("Finished: README archive links updated.");
  }
}
