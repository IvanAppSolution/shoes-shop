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
    remotePatterns: [
      {
        hostname: "kk9dabiweejdd0qo.public.blob.vercel-storage.com",
        protocol: "https"
      }
    ]
  },
 
  
};

export default nextConfig;
