import { NextResponse } from 'next/server';
import { getTestimonialsList, createTestimonial } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const data = await getTestimonialsList();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const created = await createTestimonial(body);
    return NextResponse.json({ success: true, testimonial: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
