import { describe, it, expect, vi } from 'vitest';
import { vol } from 'memfs';

vi.mock('node:fs/promises', () => vol.promises);
vi.mock('axios');

const sendMock = vi.fn();

vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: vi.fn().mockImplementation(() => ({ send: sendMock })),
    GetObjectCommand: vi.fn((args) => ({ ...args, __type: 'GetObjectCommand' })),
    PutObjectCommand: vi.fn((args) => ({ ...args, __type: 'PutObjectCommand' })),
  };
});

import { uploadImages } from './uploadService.js';

const sampleBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);

describe('uploadImages', () => {
  it('uploads new images and updates cursor', async () => {
    vol.fromJSON({ 'wallpaper/all.txt': '2025/07/21.md https://img.jpg\n' });
    const axios = await import('axios');
    (axios.default.get as any) = vi.fn(async () => ({
      status: 200,
      data: sampleBuffer,
      headers: { 'content-type': 'image/jpeg' },
    }));
    sendMock.mockRejectedValueOnce(new Error('not found')); // cursor not exist
    await uploadImages({ bucket: 'test', client: new (await import('@aws-sdk/client-s3')).S3Client({}) });
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ __type: 'PutObjectCommand', Bucket: 'test' }));
  });
});
