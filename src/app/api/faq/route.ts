import { NextResponse } from 'next/server';
import { getFaqList, createFaq } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await getFaqList();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const created = await createFaq(body);
    return NextResponse.json({ success: true, faq: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
