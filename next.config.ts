import path from "node:path";
import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
 
const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const fallbackBackendUrl = "https://billing-backend-1-rprc.onrender.com";
if (!backendUrl) {
  throw new Error(
    "❌ NEXT_PUBLIC_API_URL is not set. Add it to your .env or deployment environment variables."
  );
}

const projectRoot = path.dirname(fileURLToPath(import.meta.url)); 
const iconifyDomains = [
  "https://api.iconify.design",
  "https://api.unisvg.com",
  "https://api.simplesvg.com",
].join(" ");
 
const securityHeaders = [ 
  { key: "X-Frame-Options", value: "SAMEORIGIN" }, 
  { key: "X-Content-Type-Options", value: "nosniff" }, 
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  }, 
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
 
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(self)",
  },
 
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'", 
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'", 
      `img-src 'self' data: blob: ${backendUrl}`,
      "font-src 'self'", 
      `connect-src 'self' ${backendUrl} ${iconifyDomains}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'", 
      "frame-ancestors 'self'",
    ].join("; "),
  },
];
 
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
 
  poweredByHeader: false, 
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bissbill.novanectar.co.in",
      },
      {
        protocol: "https", 
        hostname: new URL(backendUrl).hostname,
      },
      {
        protocol: "https",
        hostname: new URL(fallbackBackendUrl).hostname,
      },
    ],
  },
};

export default nextConfig;
