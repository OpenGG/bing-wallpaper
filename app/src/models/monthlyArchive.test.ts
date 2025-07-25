import { describe, it, expect, vi } from 'vitest';
import { vol } from 'memfs';

vi.mock('fs-extra', () => ({
  ensureDir: async (p: string) => vol.promises.mkdir(p, { recursive: true }),
  readFile: vol.promises.readFile,
  writeFile: vol.promises.writeFile,
}));
vi.mock('node:fs/promises', () => vol.promises);

import { saveWallpaper, listWallpapers } from '../repositories/wallpaperRepository.js';
import { DailyMarkdown } from './dailyMarkdown.js';
import { MonthlyArchive } from './monthlyArchive.js';

const meta = {
  previewUrl: 'https://p/prev.jpg',
  downloadUrl: 'https://p/dl.jpg',
  bing: { startdate: '20250721', url: 'https://p/dl.jpg', title: 't', copyright: 'c' },
};

describe('MonthlyArchive', () => {
  it('computes paths from daily', () => {
    const daily = new DailyMarkdown('20250721', meta);
    const month = MonthlyArchive.fromDaily(daily);
    expect(month.key).toBe('2025-07');
    expect(month.dir).toBe('archive/2025');
    expect(month.file).toBe('archive/2025/07.md');
  });

  it('writes archives and links', async () => {
    await saveWallpaper(meta, '20250721');
    const records = await listWallpapers('wallpaper');
    await MonthlyArchive.writeArchives(records);
    const text = await vol.promises.readFile('archive/2025/07.md', 'utf8');
    expect(text).toContain('# 2025-07');
    const links = await MonthlyArchive.buildLinks();
    expect(links).toContain('[2025-07](./archive/2025/07.md)');
  });

  it('transforms body', () => {
    const res = MonthlyArchive.transformBody('# Title\nfoo');
    expect(res.startsWith('## Title')).toBe(true);
  });
});
