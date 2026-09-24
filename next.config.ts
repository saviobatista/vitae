import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Disable static generation for pages that use dynamic content
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
