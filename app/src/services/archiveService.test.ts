import { describe, it, expect, vi } from 'vitest';
import { vol } from 'memfs';

vi.mock('fs-extra', () => ({
  ensureDir: async (p: string) => vol.promises.mkdir(p, { recursive: true }),
  readFile: vol.promises.readFile,
  writeFile: vol.promises.writeFile,
}));
vi.mock('node:fs/promises', () => vol.promises);

import { saveWallpaper } from '../repositories/wallpaperRepository.js';
import { buildArchive } from './archiveService.js';

const meta = {
  previewUrl: 'https://p/prev.jpg',
  downloadUrl: 'https://p/dl.jpg',
  bing: { startdate: '20250721', url: 'https://p/dl.jpg', title: 'Title', copyright: 'c' }
};

describe('archiveService', () => {
  it('updates README', async () => {
    await saveWallpaper(meta, '20250721');
    await vol.promises.writeFile('README.md', '# Latest wallpapers\n\nold');
    await vol.promises.mkdir('archive', { recursive: true });
    await buildArchive();
    const updated = await vol.promises.readFile('README.md', 'utf8');
    expect(updated).toContain('Title');
  });
});

