import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@taskflow/ui",
    "@taskflow/feature-x",
    "@taskflow/feature-y",
    "@taskflow/feature-z",
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3005/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
