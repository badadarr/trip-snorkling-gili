import { NextResponse } from 'next/server';
import { getHero, updateHero } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';
import { revalidatePublicData, CACHE_TAGS } from '@/lib/revalidate';

export async function GET() {
  const data = await getHero();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateHero(body);
    revalidatePublicData(CACHE_TAGS.hero);
    return NextResponse.json({ success: true, hero: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
