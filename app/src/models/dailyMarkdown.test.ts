import { describe, it, expect, vi } from 'vitest';
import { vol } from 'memfs';

vi.mock('fs-extra', () => ({
  ensureDir: async (p: string) => vol.promises.mkdir(p, { recursive: true }),
  readFile: vol.promises.readFile,
  writeFile: vol.promises.writeFile,
}));
vi.mock('node:fs/promises', () => vol.promises);

import { DailyMarkdown } from './dailyMarkdown.js';
import type { WallpaperMeta } from '../repositories/wallpaperRepository.js';

const meta: WallpaperMeta = {
  previewUrl: 'https://p/prev.jpg',
  downloadUrl: 'https://p/dl.jpg?id=foo',
  bing: { startdate: '20250721', url: 'https://p/dl.jpg', title: 't', copyright: 'c' },
};

describe('DailyMarkdown', () => {
  it('computes paths and index lines', async () => {
    const daily = new DailyMarkdown('20250721', meta);
    expect(daily.year).toBe('2025');
    expect(daily.month).toBe('07');
    expect(daily.day).toBe('21');
    expect(daily.monthKey).toBe('2025-07');
    expect(daily.monthPath).toBe('2025/07');
    expect(daily.monthDir).toBe('wallpaper/2025/07');
    expect(daily.file).toMatch('2025/07/21.md');
    const line = daily.indexLine();
    expect(line).toContain('2025/07/21.md');
    expect(line).toContain(meta.downloadUrl);
    await daily.save();
    const saved = await vol.promises.readFile(daily.file, 'utf8');
    expect(saved).toContain('Download 4k');
  });

  it('parses index lines', () => {
    const res = DailyMarkdown.parseIndexLine('2025/07/21.md https://x?id=foo');
    expect(res.key).toBe('2025/07/21/foo');
    expect(res.date).toBe('2025/07/21');
  });
});
