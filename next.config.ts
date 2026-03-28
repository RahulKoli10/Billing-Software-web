import path from "node:path";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://billing-backend-1-rprc.onrender.com";
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
