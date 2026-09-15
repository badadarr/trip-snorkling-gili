import { NextResponse } from 'next/server';
import { deleteGalleryItem } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';
import { revalidatePublicData, CACHE_TAGS } from '@/lib/revalidate';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(req: Request, { params }: RouteProps) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteGalleryItem(parseInt(id));
    revalidatePublicData(CACHE_TAGS.gallery);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
