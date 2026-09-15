import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { storeImage } from '@/lib/storage';

const VALID_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml',
];

/**
 * Serverless request bodies are capped by the platform at a few megabytes, so
 * anything approaching that never had a chance of arriving. Uploads are
 * compressed in the browser first and land far below this.
 */
const MAX_BYTES = 4 * 1024 * 1024;

interface Incoming {
  body: Buffer;
  contentType: string;
}

/** Accepts a `data:<mime>;base64,<payload>` URL from older client bundles. */
function decodeDataUrl(dataUrl: string): Incoming | null {
  const match = /^data:([\w.+-]+\/[\w.+-]+);base64,([\s\S]+)$/.exec(dataUrl);
  if (!match) return null;
  return { contentType: match[1], body: Buffer.from(match[2], 'base64') };
}

async function readUpload(req: Request): Promise<Incoming> {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const { dataUrl } = await req.json();
    if (typeof dataUrl !== 'string') {
      throw new Error('No image data provided');
    }
    const decoded = decodeDataUrl(dataUrl);
    if (!decoded) throw new Error('Image data is not a valid data URL');
    return decoded;
  }

  const formData = await req.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('No file uploaded');
  }
  return {
    contentType: file.type,
    body: Buffer.from(await file.arrayBuffer()),
  };
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let incoming: Incoming;
  try {
    incoming = await readUpload(req);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Could not read the uploaded image' },
      { status: 400 },
    );
  }

  if (!VALID_MIMES.includes(incoming.contentType)) {
    return NextResponse.json(
      { error: 'Format tidak didukung. Gunakan JPEG, PNG, WebP, GIF, AVIF, atau SVG.' },
      { status: 400 },
    );
  }

  if (incoming.body.byteLength > MAX_BYTES) {
    return NextResponse.json(
      { error: 'Gambar terlalu besar. Maksimal 4MB setelah dikompres.' },
      { status: 413 },
    );
  }

  try {
    const stored = await storeImage({
      body: incoming.body,
      contentType: incoming.contentType,
      folder: 'content',
      prefix: 'trip',
    });
    return NextResponse.json({ success: true, ...stored });
  } catch (error: any) {
    // Deliberately a hard failure: storing the image in the database as base64
    // instead is what exhausted the database's quota previously.
    console.error('Image upload failed:', error);
    return NextResponse.json(
      { error: error?.message || 'Gagal menyimpan gambar.' },
      { status: 500 },
    );
  }
}
