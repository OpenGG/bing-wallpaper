import { describe, it, expect, vi } from 'vitest';
import { tmpdir } from 'os';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import { join } from 'path';
import plugin from './legacyNiumoo.js';

const fixture = `## Bing Wallpaper
2025-07-21 | [The moon's surface photographed through a telescope (© Sergey Kuznetsov/Getty Images)](https://cn.bing.com/th?id=OHR.BigMoon_EN-US5436003142_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=3840&h=2160&rs=1&c=4)
`;

describe('legacyNiumoo plugin', () => {
  it('parses markdown list', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'lf-'));
    vi.spyOn(process, 'cwd').mockReturnValue(dir)
    const file = join(dir, 'sample.md');
    await writeFile(file, fixture);
    try {
      const images = await plugin(file);
      expect(images[0].startdate).toBe('20250721');
      expect(images[0].title).toContain('telescope');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
