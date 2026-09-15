import { NextResponse } from 'next/server';
import { getBookingById, updateBooking } from '@/lib/data';
import { storeImage } from '@/lib/storage';

const VALID_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

/**
 * Proof screenshots are compressed in the browser before being sent, so this
 * only needs to be large enough to catch a client that skipped that step --
 * and small enough to stay under the serverless request body limit.
 */
const MAX_BYTES = 4 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const bookingIdRaw = formData.get('bookingId');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // This endpoint is reachable without a login because customers use it right
    // after booking. Tying every upload to a real booking keeps it from being a
    // free, anonymous file host.
    const bookingId = Number(bookingIdRaw);
    if (!bookingIdRaw || !Number.isInteger(bookingId) || bookingId <= 0) {
      return NextResponse.json(
        { error: 'Booking reference is required to upload a payment proof.' },
        { status: 400 },
      );
    }

    const booking = await getBookingById(bookingId);
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
    }

    if (!VALID_MIMES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.' },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'File terlalu besar. Maksimal 4MB.' },
        { status: 413 },
      );
    }

    const stored = await storeImage({
      body: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
      folder: 'payments',
      prefix: `payment-${bookingId}`,
    });

    await updateBooking(bookingId, { paymentProofUrl: stored.url });

    return NextResponse.json({ success: true, ...stored });
  } catch (error: any) {
    console.error('Error handling payment proof upload:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload payment proof' },
      { status: 500 },
    );
  }
}
