import { ArchiveService } from "/services/archive/ArchiveService.ts";
import { Inject } from "/utils/di.ts";

export class BuildIndexCommand {
  @Inject(ArchiveService)
  private archiveService!: ArchiveService;

  async execute() {
    console.log("Starting: Build index...");
    await this.archiveService.updateReadme();
    console.log("Finished: README index and archives updated.");
  }
}
