import { ArchiveService } from "/services/archive/ArchiveService.ts";
import { Inject } from "/utils/di.ts";

export class BuildArchiveCommand {
  @Inject(ArchiveService)
  private archiveService!: ArchiveService;

  async execute() {
    // This command is now functionally identical to build-index
    // as updateReadme handles both parts.
    console.log("Starting: Build archive links...");
    await this.archiveService.updateReadme();
    console.log("Finished: README archive links updated.");
  }
}
