import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint errors during production builds (e.g., on Vercel)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
