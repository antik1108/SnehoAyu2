import multer from 'multer';
import { createError } from './errorHandler.js';

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp',
  'audio/mpeg', 'audio/ogg', 'audio/mp4',
  'video/mp4', 'video/webm',
]);

export const SIZE_LIMITS: Record<string, number> = {
  'image/': 5 * 1024 * 1024,   // 5 MB
  'audio/': 50 * 1024 * 1024,  // 50 MB
  'video/': 200 * 1024 * 1024, // 200 MB
};

export function getFileSizeLimit(mimeType: string): number {
  for (const prefix of Object.keys(SIZE_LIMITS)) {
    if (mimeType.startsWith(prefix)) return SIZE_LIMITS[prefix]!;
  }
  return 5 * 1024 * 1024; // default 5 MB
}

/**
 * Multer instance configured with memoryStorage and MIME type allowlist.
 * The outer fileSize cap is 200 MB (the video limit).
 * Per-type size validation (image ≤ 5 MB, audio ≤ 50 MB, video ≤ 200 MB)
 * is performed in the controller after multer runs by checking buffer.length.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 }, // outer cap = video limit
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(createError(
        415,
        'INVALID_MIME_TYPE',
        `Unsupported file type: ${file.mimetype}. Accepted types: image/jpeg, image/png, image/webp, audio/mpeg, audio/ogg, audio/mp4, video/mp4, video/webm`
      ) as unknown as null, false);
    }
  },
});
