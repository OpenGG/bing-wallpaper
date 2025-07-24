import { describe, it, expect } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import plugin from './archiveMonth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('archiveMonth plugin', () => {
  it('parses monthly archive file', async () => {
    const file = join(__dirname, '../fixtures/archive/2025/07.md');
    const images = await plugin(file);
    expect(images[0].startdate).toBe('20250721');
    expect(images[0].title).toContain('Rainforests');
  });
});
