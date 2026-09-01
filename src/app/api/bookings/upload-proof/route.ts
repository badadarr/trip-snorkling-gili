import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bookingId = formData.get('bookingId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Only allow image types
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.' },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production';

    if (!isServerless) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payments');
        await mkdir(uploadDir, { recursive: true });

        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const cleanExt = ext.replace(/[^a-z0-9]/g, '');
        const filename = `payment-${bookingId || 'unknown'}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${cleanExt}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({
          success: true,
          url: `/uploads/payments/${filename}`,
          filename,
        });
      } catch (fsError) {
        // Fallback to base64 if local write fails
      }
    }

    // Serverless fallback: base64 data URL
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
    });
  } catch (error: any) {
    console.error('Error handling payment proof upload:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}
