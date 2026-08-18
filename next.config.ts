import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "jzqhcopfzejewhqjaisp.supabase.co",
      },
    ],
  },
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/products',
        has: [
          {
            type: 'query',
            key: 'category',
            value: '(?<slug>.*)',
          },
        ],
        destination: '/kategori/:slug',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
