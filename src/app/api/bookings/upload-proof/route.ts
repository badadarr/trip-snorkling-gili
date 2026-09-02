import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { updateBooking } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const bookingId = formData.get("bookingId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Only allow image types
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
        },
        { status: 400 },
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isServerless =
      process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NODE_ENV === "production";
    let finalUrl = "";
    let finalFilename = file.name;

    if (!isServerless) {
      try {
        const uploadDir = path.join(
          process.cwd(),
          "public",
          "uploads",
          "payments",
        );
        await mkdir(uploadDir, { recursive: true });

        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const cleanExt = ext.replace(/[^a-z0-9]/g, "");
        const filename = `payment-${bookingId || "unknown"}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}.${cleanExt}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        finalUrl = `/uploads/payments/${filename}`;
        finalFilename = filename;
      } catch (fsError) {
        // Fallback to base64 if local write fails
      }
    }

    if (!finalUrl) {
      // Serverless fallback: base64 data URL
      const base64 = buffer.toString("base64");
      finalUrl = `data:${file.type};base64,${base64}`;
    }

    // Automatically update DB record if bookingId is provided
    if (bookingId && !isNaN(parseInt(bookingId))) {
      try {
        await updateBooking(parseInt(bookingId), { paymentProofUrl: finalUrl });
      } catch (dbErr) {
        console.warn("Could not auto-save payment proof in DB:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      filename: finalFilename,
    });
  } catch (error: any) {
    console.error("Error handling payment proof upload:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload payment proof" },
      { status: 500 },
    );
  }
}
