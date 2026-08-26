import { NextResponse } from 'next/server';
import { getGalleryList, createGalleryItem } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await getGalleryList();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const created = await createGalleryItem(body);
    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
