import { buildIndexes } from '../services/indexService.js';

export async function buildIndexCommand() {
  await buildIndexes();
}

