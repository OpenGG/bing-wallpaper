import { describe, it, expect } from 'vitest';
import { tmpdir } from 'os';
import { mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import { saveWallpaper, readWallpaper, listWallpapers, wallpaperPath } from './wallpaperRepository.js';

const sampleMeta = {
  previewUrl: 'https://bing.com/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1024&h=576&rs=1&c=4',
  downloadUrl: 'https://bing.com/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4',
  bing: {
    title: 'Rainforests of the sea',
    startdate: '20250721',
    url: 'https://example.com',
    copyright: 'Staghorn coral off the island of Bonaire, Caribbean Netherlands (© blue-sea.cz/Shutterstock)',
  },
};

describe('wallpaper repository', () => {
  it('writes and reads markdown with front matter', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'wp-'));
    try {
      const file = await saveWallpaper(dir, sampleMeta, '20250721');
      const rec = await readWallpaper(file);
      expect(rec.meta.previewUrl).toBe(sampleMeta.previewUrl);
      expect(rec.meta.bing.title).toBe('Rainforests of the sea');
      const list = await listWallpapers(dir);
      expect(list[0].file).toBe(join('2025', '07', '21.md'));
      expect(wallpaperPath(dir, '20250721')).toBe(file);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
