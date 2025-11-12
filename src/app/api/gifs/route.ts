import { type NextRequest, NextResponse } from "next/server";
import { getPublicGifs, insertGif } from "@/lib/database";
import { uploadGif } from "@/lib/tixte";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("gif");
		const isPublicValue = formData.get("isPublic");

		if (!(file instanceof File)) {
			throw new Error("No GIF file provided");
		}
		const isPublic = isPublicValue === "true" || isPublicValue === "1";

		const buffer = Buffer.from(await file.arrayBuffer());

		const uploadResult = await uploadGif(buffer, file.name);

		const result = insertGif.run(
			uploadResult.filename,
			uploadResult.url,
			uploadResult.size,
			null, // duration - we'll add this later if needed
			isPublic ? 1 : 0, // Convert boolean to integer for SQLite
		);

		return NextResponse.json({
			id: result.lastInsertRowid,
			...uploadResult,
			is_public: isPublic,
			message: "GIF uploaded successfully",
		});
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json(
			{ error: "Failed to upload GIF" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		const gifs = getPublicGifs.all();
		return NextResponse.json({ gifs });
	} catch (error) {
		console.error("Database error:", error);
		return NextResponse.json(
			{ error: "Failed to fetch GIFs" },
			{ status: 500 },
		);
	}
}
