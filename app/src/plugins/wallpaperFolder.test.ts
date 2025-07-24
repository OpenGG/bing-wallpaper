import { describe, it, expect, vi } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { vol } from 'memfs';


const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = join(__dirname, '../fixtures/wallpaper/2025/07/10.md');

describe('wallpaperFolder plugin', () => {
  it('reads existing wallpaper markdown', async () => {
    const content = await readFile(fixture, 'utf8');
    vol.fromJSON({ '/wallpaper/2025/07/10.md': content });
    vi.doMock('node:fs/promises', () => vol.promises);

    try {
      const { default: plugin } = await import('./wallpaperFolder.js');
      const images = await plugin('/wallpaper');
      const found = images.find(i => i.startdate === '20250710');
      expect(found?.title).toContain('freedom');
    } finally {
      vi.resetModules();
      vol.reset();
    }
  });
});
