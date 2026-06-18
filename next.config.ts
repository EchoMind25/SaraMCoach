import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack ignores unrelated lockfiles
  // elsewhere on the machine (e.g. a stray package-lock.json in $HOME).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
