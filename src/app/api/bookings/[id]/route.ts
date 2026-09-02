import { NextResponse } from "next/server";
import { updateBooking, deleteBooking } from "@/lib/data";
import { getAdminSession } from "@/lib/auth";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PUT(req: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await req.json();
    const admin = await getAdminSession();

    // If changing administrative status (confirmed, completed, cancelled), require admin session
    if (body.status && body.status !== "pending" && !admin) {
      return NextResponse.json(
        { error: "Unauthorized to change booking status" },
        { status: 401 },
      );
    }

    const updated = await updateBooking(parseInt(id), body);
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteProps) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteBooking(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
