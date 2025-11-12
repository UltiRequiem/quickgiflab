import { NextRequest, NextResponse } from "next/server";
import { getGifById } from "@/lib/database";

export async function GET(
	_request: NextRequest,
	{ params }: { params: { id: string } },
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
