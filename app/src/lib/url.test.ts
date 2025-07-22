import { describe, it, expect } from 'vitest';
import { processImageUrl } from './url.js';

describe('processImageUrl', () => {
  it('converts preview and download urls', () => {
    const result = processImageUrl('/th?id=test_1920x1080.jpg&rf=ref_1920x1080.jpg');
    expect(result.downloadUrl).toContain('UHD');
    expect(result.previewUrl).toContain('1024');
  });
});
