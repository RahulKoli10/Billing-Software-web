import type { NextConfig } from "next";

const backendUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "https://billing-backend-1-rprc.onrender.com";

const nextConfig: NextConfig = {
  turbopack: {
    root: "C:\\novaPRO\\billingsoftware\\frontend",
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
