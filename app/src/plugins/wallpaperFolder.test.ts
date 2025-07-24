import { describe, it, expect } from 'vitest';
import { join } from 'path';
import plugin from './wallpaperFolder.js';
import { tmpdir } from 'os';
import { mkdtemp, rm } from 'fs/promises';

describe('wallpaperFolder plugin', () => {
  it('reads existing wallpaper markdown', async () => {
    const root = await mkdtemp(join(tmpdir(), 'lf-'));

    try {
      const images = await plugin(root);
      const found = images.find(i => i.startdate === '20250710');
      expect(found?.title).toContain('freedom');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
