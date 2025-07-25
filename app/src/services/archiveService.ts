import { listWallpapers } from '../repositories/wallpaperRepository.js';
import { DIR_WALLPAPER } from '../lib/config.js';
import { MonthlyArchive } from '../models/monthlyArchive.js';
import { ReadmeFile } from '../models/readme.js';

export async function buildArchive() {
  const records = await listWallpapers(DIR_WALLPAPER);
  await MonthlyArchive.writeArchives(records);
  const latest = records.slice(0, 10);
  const latestSection = latest
    .map((r) => MonthlyArchive.transformBody(r.body))
    .join('\n');

  const links = await MonthlyArchive.buildLinks();
  const readme = new ReadmeFile();
  await readme.updateLatestSection(latestSection, links);
}
