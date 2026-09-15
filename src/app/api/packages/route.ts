import { NextResponse } from 'next/server';
import { getPackagesList, createPackage } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';
import { revalidatePublicData, CACHE_TAGS } from '@/lib/revalidate';

export async function GET() {
  const data = await getPackagesList();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const created = await createPackage(body);
    revalidatePublicData(CACHE_TAGS.packages);
    return NextResponse.json({ success: true, package: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
