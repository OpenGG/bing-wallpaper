import { migrateWallpapers } from "../services/wallpaperService.js";

export interface MigrateOptions {
  plugin: string;
  source: string;
  force?: boolean;
}

export async function migrateCommand(opts: MigrateOptions) {
  await migrateWallpapers(opts.plugin, opts.source, { force: opts.force });
}
