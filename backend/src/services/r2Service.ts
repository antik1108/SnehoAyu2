import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { createError } from '../middlewares/errorHandler.js';

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
}

function getR2Config(): R2Config {
  const vars = ['R2_ACCOUNT_ID','R2_ACCESS_KEY_ID','R2_SECRET_ACCESS_KEY',
                 'R2_BUCKET_NAME','R2_PUBLIC_URL'];
  const missing = vars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    throw createError(503, 'R2_NOT_CONFIGURED',
      `R2 storage is not configured. Missing: ${missing.join(', ')}`);
  }
  return {
    accountId: process.env['R2_ACCOUNT_ID']!,
    accessKeyId: process.env['R2_ACCESS_KEY_ID']!,
    secretAccessKey: process.env['R2_SECRET_ACCESS_KEY']!,
    bucketName: process.env['R2_BUCKET_NAME']!,
    publicUrl: process.env['R2_PUBLIC_URL']!,
  };
}

export async function uploadToR2(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<{ url: string; filename: string; mimeType: string; sizeBytes: number }> {
  const config = getR2Config();
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filename = `${randomUUID()}-${sanitized}`;
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  try {
    await client.send(new PutObjectCommand({
      Bucket: config.bucketName,
      Key: filename,
      Body: buffer,
      ContentType: mimeType,
    }));
  } catch (err) {
    throw createError(502, 'R2_UPLOAD_FAILED',
      'Failed to upload file to storage. Please try again.');
  }
  return {
    url: `${config.publicUrl}/${filename}`,
    filename,
    mimeType,
    sizeBytes: buffer.length,
  };
}
