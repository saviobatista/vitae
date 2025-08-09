import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a minimal standalone server for Docker runner stage
  output: "standalone",
};

export default nextConfig;
