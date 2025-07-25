import { describe, it, expect, vi } from 'vitest';
import { fetchBingImages } from './bing.js';

vi.mock('axios');

const sample = {
  startdate: '20250721',
  url: 'https://img.jpg',
  copyright: 'c',
  title: 't'
};

describe('fetchBingImages', () => {
  it('returns images when request succeeds', async () => {
    const axios = await import('axios');
    (axios.default.get as any) = vi.fn(async () => ({ status: 200, data: { images: [sample] } }));
    const res = await fetchBingImages();
    expect(res[0].startdate).toBe('20250721');
  });

  it('throws on invalid response', async () => {
    const axios = await import('axios');
    (axios.default.get as any) = vi.fn(async () => ({ status: 200, data: {} }));
    await expect(fetchBingImages()).rejects.toThrow('invalid response');
  });
});
