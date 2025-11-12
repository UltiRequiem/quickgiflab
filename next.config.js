/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["@t3-oss/env-nextjs", "@t3-oss/env-core"],
	experimental: {
		serverActions: {
			allowedOrigins: ["localhost:3000"],
		},
	},
};

module.exports = nextConfig;
