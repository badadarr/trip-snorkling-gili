import { NextResponse } from 'next/server';
import { getGalleryCategories, createGalleryCategory } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const data = await getGalleryCategories();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.key || !body.labelId || !body.labelEn) {
      return NextResponse.json({ error: 'key, labelId, and labelEn are required' }, { status: 400 });
    }

    // Sanitize key to slug format
    const sanitizedKey = body.key
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');

    const created = await createGalleryCategory({
      key: sanitizedKey,
      labelId: body.labelId,
      labelEn: body.labelEn,
      orderIndex: body.orderIndex || 0,
    });
    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
