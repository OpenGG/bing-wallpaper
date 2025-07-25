import { uploadImages } from '../services/uploadService.js';

export interface UploadOptions {
  bucket: string;
  cursor?: string;
}

export async function uploadCommand(opts: UploadOptions) {
  await uploadImages({ bucket: opts.bucket, cursorKey: opts.cursor });
}
