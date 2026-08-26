import { NextResponse } from 'next/server';
import { updateTestimonial, deleteTestimonial } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteProps) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateTestimonial(parseInt(id), body);
    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteProps) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteTestimonial(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
