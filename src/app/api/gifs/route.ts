import { NextRequest, NextResponse } from "next/server";
import { uploadGif } from "@/lib/tixte";
import { insertGif, getPublicGifs } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("gif") as File;
    const isPublicStr = formData.get("isPublic") as string;
    const isPublic = isPublicStr === 'true';

    if (!file) {
      return NextResponse.json({ error: "No GIF file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Tixte
    const uploadResult = await uploadGif(buffer, file.name);

    // Save to database with privacy setting
    const result = insertGif.run(
      uploadResult.filename,
      uploadResult.url,
      uploadResult.size,
      null, // duration - we'll add this later if needed
      isPublic ? 1 : 0 // Convert boolean to integer for SQLite
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      ...uploadResult,
      is_public: isPublic,
      message: "GIF uploaded successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload GIF" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const gifs = getPublicGifs.all();
    return NextResponse.json({ gifs });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch GIFs" }, { status: 500 });
  }
}