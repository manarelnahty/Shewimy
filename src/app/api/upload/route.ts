import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle JSON body with Base64 payload
    if (contentType.includes("application/json")) {
      const body = await req.json();
      const { base64, name = "upload" } = body;

      if (!base64 || typeof base64 !== "string") {
        return NextResponse.json(
          { success: false, error: "No base64 data provided" },
          { status: 400 }
        );
      }

      // Extract raw base64 data after data:image/...;base64,
      const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      const buffer = matches
        ? Buffer.from(matches[2], "base64")
        : Buffer.from(base64, "base64");

      const timestamp = Date.now();
      const cleanName = name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
      const fileName = `${timestamp}_${cleanName}.webp`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      try {
        await sharp(buffer)
          .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(filePath);
      } catch (sharpErr) {
        // Fallback to raw buffer if sharp fails
        fs.writeFileSync(filePath, buffer);
      }

      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    // 2. Handle multipart/form-data with File payload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file attached" },
          { status: 400 }
        );
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const rawName = path.parse(file.name).name || "image";
      const cleanName = rawName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);
      const fileName = `${timestamp}_${cleanName}.webp`;
      const filePath = path.join(UPLOADS_DIR, fileName);

      try {
        await sharp(buffer)
          .resize(2048, 2048, { fit: "inside", withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(filePath);
      } catch (sharpErr) {
        // Fallback: save original extension
        const ext = path.extname(file.name) || ".png";
        const fallbackName = `${timestamp}_${cleanName}${ext}`;
        const fallbackPath = path.join(UPLOADS_DIR, fallbackName);
        fs.writeFileSync(fallbackPath, buffer);
        return NextResponse.json({
          success: true,
          url: `/uploads/${fallbackName}`,
        });
      }

      const publicUrl = `/uploads/${fileName}`;
      return NextResponse.json({ success: true, url: publicUrl });
    }

    return NextResponse.json(
      { success: false, error: "Unsupported Content-Type" },
      { status: 415 }
    );
  } catch (error: any) {
    console.error("API /api/upload error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
