import { TixteClient } from "@ultirequiem/tixte";
import { env } from "@/env";

const tixteClient = new TixteClient(env.TIXTE_API_KEY, {
  defaultDomain: "sergif.likes.cash",
});

export interface UploadResult {
  url: string;
  size: number;
  filename: string;
}

export const uploadGif = async (buffer: Buffer, filename?: string): Promise<UploadResult> => {
  try {
    const { data } = await tixteClient.uploadFile(buffer, {
      extension: "gif",
      filename: filename || `gif-${Date.now()}`,
    });

    return {
      url: data.url,
      size: data.size || buffer.length,
      filename: data.filename || `${filename || 'gif'}.gif`,
    };
  } catch (error) {
    console.error("Failed to upload GIF to Tixte:", error);
    throw new Error("Failed to upload GIF");
  }
};