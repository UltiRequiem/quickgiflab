import { NextRequest, NextResponse } from "next/server";
import { uploadGif } from "@/lib/tixte";
import { insertGif, getAllGifs } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("gif") as File;

    if (!file) {
      return NextResponse.json({ error: "No GIF file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Tixte
    const uploadResult = await uploadGif(buffer, file.name);

    // Save to database
    const result = insertGif.run(
      uploadResult.filename,
      uploadResult.url,
      uploadResult.size,
      null // duration - we'll add this later if needed
    );

    return NextResponse.json({
      id: result.lastInsertRowid,
      ...uploadResult,
      message: "GIF uploaded successfully"
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload GIF" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const gifs = getAllGifs.all();
    return NextResponse.json({ gifs });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch GIFs" }, { status: 500 });
  }
}