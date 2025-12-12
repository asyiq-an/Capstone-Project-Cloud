import type { NextConfig } from "next";

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'np-snatch-image2.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
