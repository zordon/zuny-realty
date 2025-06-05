import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // REMOVED to allow OpenNext to handle the build correctly
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
