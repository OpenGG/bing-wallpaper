import { describe, it, expect, vi } from 'vitest';
import { vol } from 'memfs';

vi.mock('node:fs/promises', () => vol.promises);

import { ReadmeFile } from './readme.js';

describe('ReadmeFile', () => {
  it('updates latest section', async () => {
    vol.fromJSON({ 'README.md': '# Intro\n\n# Latest wallpapers\n\nold\n\n# Archives\n\nold' });
    const r = new ReadmeFile('README.md');
    await r.updateLatestSection('latest', 'links');
    const text = await vol.promises.readFile('README.md', 'utf8');
    expect(text).toContain('latest');
    expect(text).toContain('links');
  });
});
