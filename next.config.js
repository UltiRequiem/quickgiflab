/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost:3000"],
		},
	},
	images: {
		remotePatterns: [new URL("https://ultigifs.tixte.co/r/**")],
	},
};

module.exports = nextConfig;
