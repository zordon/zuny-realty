import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.CF_PAGES === '1' ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Disable server-side features for static export
  experimental: {
    esmExternals: true,
  },
};

export default nextConfig;
