import { Inject, Injectable } from "../utils/di.js";
import { BingService } from "../services/bing/BingService.js";
import { retry } from "../utils/retry.ts";
import { BingWallpaper } from "../utils/bing/BingWallpaper.js";
import { ArchiveService } from "../services/archive/ArchiveService.js";

@Injectable()
export class FetchCommand {
  constructor(
    @Inject(BingService) private bingService: BingService,
    @Inject(ArchiveService) private archiveService: ArchiveService,
  ) {}

  async execute() {
    console.log("Starting: Fetch and archive new wallpapers...");
    const rawImages = await retry(() => this.bingService.fetchLatestImages());

    const newWallpapers = rawImages
      .map((img) => new BingWallpaper(img));

    console.log(`Found ${newWallpapers.length} new wallpapers. Archiving...`);
    await this.archiveService.archiveWallpapers(newWallpapers);
    console.log("Finished: Fetch and archive process complete.");
  }
}
