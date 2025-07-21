import { ArchiveService } from "@/services/archive/ArchiveService.ts";
import { Inject, Injectable } from "@/utils/di.ts";

@Injectable()
export class BuildIndexCommand {
  constructor(@Inject(ArchiveService) private archiveService: ArchiveService) {}

  async execute() {
    console.log("Starting: Build index...");
    await this.archiveService.updateReadme();
    console.log("Finished: README index and archives updated.");
  }
}
