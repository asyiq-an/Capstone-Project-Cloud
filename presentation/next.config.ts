import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'np-snatch-image.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
