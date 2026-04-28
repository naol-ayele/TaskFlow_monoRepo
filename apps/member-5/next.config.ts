import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  transpilePackages: ["@taskflow/ui", "@taskflow/feature-x", "@taskflow/feature-y", "@taskflow/feature-z"],
};
export default nextConfig;
