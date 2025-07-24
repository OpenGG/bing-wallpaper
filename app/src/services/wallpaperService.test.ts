import { describe, it, expect, vi } from 'vitest';
import { vol } from 'memfs';

let sampleImage: any;

vi.mock('fs-extra', () => ({
  ensureDir: async (p: string) => vol.promises.mkdir(p, { recursive: true }),
  readFile: vol.promises.readFile,
  writeFile: vol.promises.writeFile,
}));

vi.mock('../lib/bing.js', () => ({
  fetchBingImages: vi.fn(() => Promise.resolve([sampleImage]))
}));

sampleImage = {
  startdate: '20250721',
  url: '/th?id=foo_1920x1080.jpg',
  title: 't',
  copyright: 'c',
};

import { wallpaperPath } from '../repositories/wallpaperRepository.js';
import { updateWallpapers, migrateWallpapers } from './wallpaperService.js';

describe('wallpaperService', () => {
  it('saves images from update', async () => {
    await updateWallpapers();
    const file = wallpaperPath('20250721');
    const text = await vol.promises.readFile(file, 'utf8');
    expect(text).toContain('Download 4k');
  });

  it('saves images from migrate plugin', async () => {
    const fs = await import('fs/promises');
    const dir = await fs.mkdtemp('/tmp-plugin-');
    const pluginPath = `${dir}/p.mjs`;
    await fs.writeFile(pluginPath, 'export default async () => [' + JSON.stringify(sampleImage) + '];');
    await migrateWallpapers(pluginPath, 'src');
    const file = wallpaperPath('20250721');
    const text = await vol.promises.readFile(file, 'utf8');
    expect(text).toContain('Download 4k');
  });
});

