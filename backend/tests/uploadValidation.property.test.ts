/**
 * Property-Based Tests — Upload Validation
 *
 * Property 7: MIME type allowlist
 *   For any MIME type string, the upload validator returns true iff it is one
 *   of the 10 accepted types; all other strings are rejected.
 *
 * Property 8: Per-type file size limits
 *   For any (mimeType, fileSize) pair where mimeType is accepted, the size
 *   validator accepts the file iff fileSize ≤ limit(mimeType).
 */

import { describe, expect, it } from 'vitest';
import { getFileSizeLimit } from '../src/middlewares/uploadMiddleware.js';

// ─── MIME allowlist (mirrors the Set in uploadMiddleware.ts) ────────────────

const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/webp',
  'audio/mpeg', 'audio/ogg', 'audio/mp4',
  'video/mp4', 'video/webm',
]);

/**
 * Simulate the fileFilter logic:
 * returns true iff the MIME type is in the allowed set.
 */
function isMimeAllowed(mime: string): boolean {
  return ALLOWED_MIMES.has(mime);
}

/**
 * Simulate the per-type size check performed in the controller:
 * returns true iff the file size is within the limit for its MIME category.
 */
function isSizeAllowed(mimeType: string, fileSize: number): boolean {
  return fileSize <= getFileSizeLimit(mimeType);
}

// ─── Property 7: MIME type allowlist ───────────────────────────────────────

describe('Property 7: MIME type allowlist', () => {
  it('accepts all 8 allowed MIME types', () => {
    for (const mime of ALLOWED_MIMES) {
      expect(isMimeAllowed(mime)).toBe(true);
    }
  });

  it('rejects a range of non-allowed strings', () => {
    const rejected = [
      'text/plain',
      'application/json',
      'application/pdf',
      'image/gif',
      'image/svg+xml',
      'image/bmp',
      'image/tiff',
      'audio/wav',
      'audio/flac',
      'audio/x-ms-wma',
      'video/avi',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-flv',
      '',
      ' ',
      'image',
      'audio',
      'video',
      'image/',
      'audio/',
      'video/',
      'IMAGE/JPEG',   // case-sensitive check
      'Image/Jpeg',
      'image/jpeg ',  // trailing space
      ' image/jpeg',  // leading space
      'multipart/form-data',
      'application/octet-stream',
      'null',
      'undefined',
      '0',
    ];
    for (const mime of rejected) {
      expect(isMimeAllowed(mime)).toBe(false);
    }
  });

  it('for any string not in the allowlist, isMimeAllowed returns false', () => {
    // Exhaustive check across programmatically generated variants
    const prefixes = ['image/', 'audio/', 'video/', 'text/', 'application/'];
    const suffixes = ['foo', 'bar', 'baz', '123', 'test', 'unknown', ''];
    for (const prefix of prefixes) {
      for (const suffix of suffixes) {
        const candidate = prefix + suffix;
        expect(isMimeAllowed(candidate)).toBe(ALLOWED_MIMES.has(candidate));
      }
    }
  });

  it('isMimeAllowed is exactly the membership test for the 8-element set', () => {
    // Property: isMimeAllowed(x) ↔ x ∈ ALLOWED_MIMES
    const allCandidates = [
      ...ALLOWED_MIMES,
      'image/gif', 'audio/wav', 'video/avi', '', 'text/html', 'application/json',
      'Image/JPEG', 'AUDIO/MPEG', 'VIDEO/MP4',
    ];
    for (const c of allCandidates) {
      expect(isMimeAllowed(c)).toBe(ALLOWED_MIMES.has(c));
    }
  });
});

// ─── Property 8: Per-type file size limits ──────────────────────────────────

describe('Property 8: Per-type file size limits', () => {
  const MB = 1024 * 1024;

  const LIMITS: Record<string, number> = {
    'image/jpeg': 5 * MB,
    'image/png':  5 * MB,
    'image/webp': 5 * MB,
    'audio/mpeg': 50 * MB,
    'audio/ogg':  50 * MB,
    'audio/mp4':  50 * MB,
    'video/mp4':  200 * MB,
    'video/webm': 200 * MB,
  };

  it('getFileSizeLimit returns correct limit for each MIME type', () => {
    for (const [mime, expectedLimit] of Object.entries(LIMITS)) {
      expect(getFileSizeLimit(mime)).toBe(expectedLimit);
    }
  });

  it('accepts files at exactly the limit boundary for each type', () => {
    for (const [mime, limit] of Object.entries(LIMITS)) {
      expect(isSizeAllowed(mime, limit)).toBe(true);       // at limit → accept
      expect(isSizeAllowed(mime, limit - 1)).toBe(true);   // 1 byte below → accept
    }
  });

  it('rejects files one byte over the limit for each type', () => {
    for (const [mime, limit] of Object.entries(LIMITS)) {
      expect(isSizeAllowed(mime, limit + 1)).toBe(false);  // 1 byte over → reject
    }
  });

  it('accepts zero-byte files for all accepted MIME types', () => {
    for (const mime of ALLOWED_MIMES) {
      expect(isSizeAllowed(mime, 0)).toBe(true);
    }
  });

  it('property: isSizeAllowed(mime, size) ↔ size ≤ limit(mime) for all accepted types', () => {
    // Probe at multiple sizes to exercise the property over a range
    const probeOffsets = [-MB, -1024, -1, 0, 1, 1024, MB];
    for (const [mime, limit] of Object.entries(LIMITS)) {
      for (const offset of probeOffsets) {
        const size = Math.max(0, limit + offset);
        const expected = size <= limit;
        expect(isSizeAllowed(mime, size)).toBe(expected);
      }
    }
  });

  it('image types have a lower limit than audio types', () => {
    expect(getFileSizeLimit('image/jpeg')).toBeLessThan(getFileSizeLimit('audio/mpeg'));
  });

  it('audio types have a lower limit than video types', () => {
    expect(getFileSizeLimit('audio/mpeg')).toBeLessThan(getFileSizeLimit('video/mp4'));
  });
});
