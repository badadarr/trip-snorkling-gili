import { NextResponse } from 'next/server';
import { getAbout, updateAbout } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await getAbout();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateAbout(body);
    return NextResponse.json({ success: true, about: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
