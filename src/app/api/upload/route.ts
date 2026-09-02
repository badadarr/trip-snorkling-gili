import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    const isServerless =
      process.env.VERCEL === "1" ||
      !!process.env.VERCEL ||
      !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NODE_ENV === "production";

    // 1. Handle JSON (Base64 data URL)
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { dataUrl, fileName, mimeType } = body;

      if (!dataUrl) {
        return NextResponse.json(
          { error: "No image data provided" },
          { status: 400 },
        );
      }

      // If running locally in development (not Vercel)
      if (!isServerless && process.env.NODE_ENV === "development") {
        try {
          const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            const buffer = Buffer.from(matches[2], "base64");
            const uploadDir = path.join(process.cwd(), "public", "uploads");
            await mkdir(uploadDir, { recursive: true });

            const ext = mimeType?.split("/")[1] || "webp";
            const filename = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
            const filePath = path.join(uploadDir, filename);

            await writeFile(filePath, buffer);
            return NextResponse.json({
              success: true,
              url: `/uploads/${filename}`,
              filename,
            });
          }
        } catch (fsErr) {
          console.warn(
            "Local FS write skipped, returning dataUrl directly:",
            fsErr,
          );
        }
      }

      // On Vercel / Production: Return the Base64 Data URI directly
      // This is saved permanently in Neon PostgreSQL and works 100% reliably anywhere without external storage!
      return NextResponse.json({
        success: true,
        url: dataUrl,
        filename: fileName || "image.webp",
      });
    }

    // 2. Handle Multipart FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const validMimes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
      "image/svg+xml",
    ];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Please upload a JPEG, PNG, WebP, GIF, or SVG image.",
        },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If running in development locally (and not Vercel)
    if (!isServerless && process.env.NODE_ENV === "development") {
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
        const cleanExt = ext.replace(/[^a-z0-9]/g, "");
        const filename = `trip-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({
          success: true,
          url: `/uploads/${filename}`,
          filename,
        });
      } catch (fsError) {
        console.warn("Local FS write error, fallback to Base64:", fsError);
      }
    }

    // In Vercel / Serverless production: return Base64 data URL
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      filename: file.name,
    });
  } catch (error: any) {
    console.error("Error handling file upload:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 },
    );
  }
}
