import { NextResponse } from 'next/server';
import { updateBookingStatus, deleteBooking } from '@/lib/data';
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
    const { status } = await req.json();
    const updated = await updateBookingStatus(parseInt(id), status);
    return NextResponse.json({ success: true, booking: updated });
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
    await deleteBooking(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
