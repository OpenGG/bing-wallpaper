import { updateWallpapers } from "../services/wallpaperService.js";

export async function updateCommand() {
  await updateWallpapers();
}
