import { buildArchive } from "../services/archiveService.js";

export async function buildArchiveCommand() {
  await buildArchive();
}
