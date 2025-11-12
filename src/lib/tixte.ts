import { TixteClient } from "@ultirequiem/tixte";
import { env } from "@/env";

const tixteClient = new TixteClient(env.TIXTE_API_KEY, {
	defaultURL: env.DEFAULT_TIXTE_URL,
});

export const uploadGif = async (buffer: Buffer, filename: string) => {
	try {
		const { data } = await tixteClient.uploadFile(buffer, {
			extension: "gif",
			filename: filename,
		});

		return {
			url: data.url,
			size: buffer.length,
			filename: data.filename,
		};
	} catch (error) {
		console.error("Failed to upload GIF to Tixte:", error);
		console.error("Full error details:", error);
		throw new Error("Failed to upload GIF");
	}
};
