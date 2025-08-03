import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // For Cloudflare Workers, we want full Next.js functionality
  // Only use static export if explicitly deploying to Cloudflare Pages
  output: process.env.STATIC_EXPORT === 'true' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
