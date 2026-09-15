/**
 * Browser-side image compression, shared by every upload form.
 *
 * Two reasons this runs before the file leaves the browser:
 *
 * 1. A serverless function can only receive a request body of a few megabytes,
 *    and a photo straight from a phone camera is routinely larger than that.
 *    Uploading the original would simply fail in production.
 * 2. Smaller files mean less object storage and less bandwidth for every
 *    visitor who later views the image.
 *
 * The result is a binary Blob, not a base64 data URL: base64 inflates the
 * payload by about a third for no benefit, and data URLs are what used to end
 * up stored in the database.
 */

export interface CompressOptions {
  maxWidth: number;
  maxHeight: number;
  /** WebP quality, 0..1 */
  quality: number;
}

/** Photographic content: gallery shots, package headers, avatars. */
export const PHOTO_COMPRESSION: CompressOptions = {
  maxWidth: 1600,
  maxHeight: 1200,
  quality: 0.82,
};

/** QR codes need to stay crisp and square-ish, so less downscaling. */
export const QR_COMPRESSION: CompressOptions = {
  maxWidth: 800,
  maxHeight: 800,
  quality: 0.9,
};

/** Payment proof screenshots: readability matters, fine detail does not. */
export const PROOF_COMPRESSION: CompressOptions = {
  maxWidth: 1400,
  maxHeight: 1400,
  quality: 0.8,
};

function scaleToFit(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) return { width, height };
  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Gambar tidak bisa dibaca. File mungkin rusak.'));
    };
    img.src = objectUrl;
  });
}

/**
 * Downscales and re-encodes `file` to WebP.
 *
 * SVG is returned untouched: it is already small, and rasterising it on a
 * canvas would throw away the thing that makes it useful.
 */
export async function compressImage(
  file: File,
  options: CompressOptions = PHOTO_COMPRESSION,
): Promise<Blob> {
  if (file.type === 'image/svg+xml') return file;

  const img = await loadImage(file);
  const { width, height } = scaleToFit(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    options.maxWidth,
    options.maxHeight,
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Browser ini tidak mendukung pemrosesan gambar (canvas).');
  }
  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', options.quality);
  });

  if (!blob) {
    throw new Error('Gagal mengompres gambar.');
  }
  return blob;
}

/**
 * Compresses `file` and uploads it to `endpoint` as multipart form data.
 * Returns the public URL of the stored image.
 *
 * Any failure throws. Callers must not substitute a data URL on error -- that
 * is what put megabytes of base64 into the database in the first place.
 */
export async function compressAndUpload(
  file: File,
  endpoint: string,
  options: CompressOptions = PHOTO_COMPRESSION,
  extraFields: Record<string, string> = {},
): Promise<string> {
  const compressed = await compressImage(file, options);

  const form = new FormData();
  const name = file.name.replace(/\.[^.]+$/, '') || 'image';
  const extension = compressed.type === 'image/svg+xml' ? 'svg' : 'webp';
  form.append('file', compressed, `${name}.${extension}`);
  for (const [key, value] of Object.entries(extraFields)) {
    form.append(key, value);
  }

  const res = await fetch(endpoint, { method: 'POST', body: form });
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.url) {
    throw new Error(data?.error || 'Upload gagal. Silakan coba lagi.');
  }
  return data.url as string;
}
