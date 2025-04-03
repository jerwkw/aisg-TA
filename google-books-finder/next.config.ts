import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Or whatever other configs you have
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        pathname: '/books/**',
      },
    ],
  },
};

export default nextConfig;
