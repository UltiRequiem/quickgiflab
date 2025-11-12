import { TixteClient } from "@ultirequiem/tixte";
import { env } from "@/env";

const tixteClient = new TixteClient(env.TIXTE_API_KEY, {
	defaultURL: env.DEFAULT_TIXTE_URL,
});

export interface UploadResult {
	url: string;
	size: number;
	filename: string;
}

export const uploadGif = async (
	buffer: Buffer,
	filename?: string,
): Promise<UploadResult> => {
	try {
		const cleanFilename = filename
			? filename.replace(/\.gif$/, "")
			: `gif-${Date.now()}`;

		const { data } = await tixteClient.uploadFile(buffer, {
			extension: "gif",
			filename: cleanFilename,
			domain: "",
		});

		return {
			url: data.url,
			size: data.size || buffer.length,
			filename: data.filename || `${cleanFilename}.gif`,
		};
	} catch (error) {
		console.error("Failed to upload GIF to Tixte:", error);
		console.error("Full error details:", error);
		throw new Error("Failed to upload GIF");
	}
};
