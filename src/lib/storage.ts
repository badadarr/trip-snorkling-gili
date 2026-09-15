/**
 * Where uploaded images are kept.
 *
 * Images used to be inlined into Postgres as base64 data URLs. That made every
 * row enormous, so each public page render dragged megabytes out of the
 * database and burned through its data-transfer quota. Images now go to object
 * storage and only their URL is stored in a column.
 *
 * There is deliberately no base64 fallback here. Falling back silently is what
 * hid the original problem: an upload appeared to succeed while quietly
 * bloating the database again. If storage is not reachable the upload fails
 * loudly instead.
 */
import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

export interface StoredFile {
  /** Public URL to persist in the database and render in <img>/next/image. */
  url: string;
  /** Final object name, for logging and debugging. */
  filename: string;
}

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
};

export function extensionForMime(mime: string, fallback = 'webp'): string {
  return EXTENSION_BY_MIME[mime] ?? fallback;
}

/** Blob is considered configured whenever its token is present. */
export function isObjectStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function buildName(prefix: string, extension: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${random}.${extension}`;
}

export interface StoreImageOptions {
  /** Raw bytes of the image. */
  body: Buffer;
  /** MIME type, used for the extension and the stored content-type. */
  contentType: string;
  /** Folder inside the store, e.g. "content" or "payments". */
  folder: string;
  /** Filename prefix, e.g. "trip" or "payment-12". */
  prefix: string;
}

export async function storeImage({
  body,
  contentType,
  folder,
  prefix,
}: StoreImageOptions): Promise<StoredFile> {
  const filename = buildName(prefix, extensionForMime(contentType));

  if (isObjectStorageConfigured()) {
    const blob = await put(`${folder}/${filename}`, body, {
      access: 'public',
      contentType,
      // Guards against two uploads in the same millisecond colliding, which
      // would otherwise reject the second one.
      addRandomSuffix: true,
    });
    return { url: blob.url, filename: blob.pathname };
  }

  // Local development without a Blob token: keep writing into public/ so the
  // dev workflow does not require Vercel credentials.
  if (!process.env.VERCEL) {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), body);
    return { url: `/uploads/${folder}/${filename}`, filename };
  }

  throw new Error(
    'Image storage is not configured: BLOB_READ_WRITE_TOKEN is missing. ' +
      'Connect a Blob store to this project in the Vercel dashboard (Storage tab) and redeploy.',
  );
}
