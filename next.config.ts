import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/products',
      },
    ]
  },
  images: {
    unoptimized: true,
  },
  
};

export default nextConfig;
