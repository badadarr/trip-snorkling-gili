import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON (Base64 data URL)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { dataUrl, fileName, mimeType } = body;

      if (!dataUrl) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      // Check if we are running in local environment where public/uploads can be written
      const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';

      if (!isServerless) {
        try {
          const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const buffer = Buffer.from(matches[2], 'base64');
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');
            await mkdir(uploadDir, { recursive: true });

            const ext = mimeType?.split('/')[1] || 'webp';
            const filename = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);
            return NextResponse.json({
              success: true,
              url: `/uploads/${filename}`,
              filename,
            });
          }
        } catch (fsErr) {
          console.warn('Local FS write skipped or failed, falling back to dataUrl:', fsErr);
        }
      }

      // On Vercel / Serverless or fallback: Return the optimized WebP Data URI
      // This gets saved into Neon Database and displays reliably anywhere without external storage!
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: fileName || 'image.webp',
      });
    }

    // Handle Multipart FormData
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or AVIF image.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if writable
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });

      const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const cleanExt = ext.replace(/[^a-z0-9]/g, '');
      const filename = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
      const filePath = path.join(uploadDir, filename);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename,
      });
    } catch (fsError) {
      // In serverless read-only filesystem, convert to Base64 data URL
      const base64 = buffer.toString('base64');
      const dataUrl = `data:${file.type};base64,${base64}`;

      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: file.name,
      });
    }
  } catch (error: any) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
