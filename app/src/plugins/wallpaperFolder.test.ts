import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import plugin from './wallpaperFolder.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('wallpaperFolder plugin', () => {
  it('reads existing wallpaper markdown', async () => {
    const root = join(__dirname, '../../../wallpaper');
    const images = await plugin(root);
    const found = images.find(i => i.startdate === '20250710');
    expect(found?.title).toContain('freedom');
  });
});
