import { describe, it, expect } from 'vitest';
import { tmpdir } from 'os';
import { mkdtemp, readFile, rm } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { saveWallpaper } from './wallpaperRepository.js';

const sampleMeta = {
  previewUrl:
    'https://bing.com/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=1024&h=576&rs=1&c=4',
  downloadUrl:
    'https://bing.com/th?id=OHR.AcroporaReef_EN-US5567789372_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4',
  bing: {
    title: 'Rainforests of the sea',
    startdate: '20250721',
    url: 'https://example.com',
    copyright:
      'Staghorn coral off the island of Bonaire, Caribbean Netherlands (© blue-sea.cz/Shutterstock)',
  },
};

describe('saveWallpaper', () => {
  it('writes markdown with front matter', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'wp-'));
    try {
      const file = await saveWallpaper(dir, sampleMeta, '20250721');
      const content = await readFile(file, 'utf8');
      const parsed = matter(content);
      expect(parsed.data.previewUrl).toBe(sampleMeta.previewUrl);
      expect(parsed.content).toContain('# Rainforests of the sea');
      expect(parsed.content).toContain('Download 4k');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
