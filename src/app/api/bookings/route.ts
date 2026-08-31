import { NextResponse } from 'next/server';
import { getBookingsList, createBooking } from '@/lib/data';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getBookingsList();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.customerName || !body.customerPhone || !body.tripDate) {
      return NextResponse.json({ error: 'Missing required reservation fields (customerName, customerPhone, tripDate)' }, { status: 400 });
    }

    const created = await createBooking(body);
    return NextResponse.json({ success: true, booking: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
