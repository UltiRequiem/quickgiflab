if (!process.env.TIXTE_API_KEY) {
	throw new Error("TIXTE_API_KEY is not defined in environment variables");
}

if (!process.env.DEFAULT_TIXTE_DOMAIN) {
	throw new Error(
		"DEFAULT_TIXTE_DOMAIN is not defined in environment variables",
	);
}

export const env = {
	TIXTE_API_KEY: process.env.TIXTE_API_KEY,
	DEFAULT_TIXTE_DOMAIN: process.env.DEFAULT_TIXTE_DOMAIN,
	NEXT_PUBLIC_APP_URL:
		process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
	NODE_ENV: process.env.NODE_ENV ?? "dev",
};
