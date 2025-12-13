/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'np-snatch-image2.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;

/*

import type { NextConfig } from "next";

/** @type {import('next').NextConfig} 
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

export default nextConfig;*/
