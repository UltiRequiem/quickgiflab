import { NextRequest, NextResponse } from "next/server";
import { getGifById, deleteGif } from "@/lib/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gif = getGifById.get(params.id);

    if (!gif) {
      return NextResponse.json({ error: "GIF not found" }, { status: 404 });
    }

    return NextResponse.json({ gif });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch GIF" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = deleteGif.run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: "GIF not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "GIF deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to delete GIF" }, { status: 500 });
  }
}