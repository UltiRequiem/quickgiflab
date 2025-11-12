import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		TIXTE_API_KEY: z.string().min(1, "Tixte API key is required"),
		DEFAULT_TIXTE_URL: z.url().min(1, "Default Tixte URL is required"),
		NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
	},

	client: {
		NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3000"),
	},

	experimental__runtimeEnv: {
		NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
	},
});
