const FALLBACK_API_URL = "https://billing-backend-1-rprc.onrender.com";
const CLIENT_PROXY_PREFIX = "/backend";

export function getApiBaseUrl() {
  const rawValue = process.env.NEXT_PUBLIC_API_URL?.trim() || FALLBACK_API_URL;
  const matches = rawValue.match(/https?:\/\/[^\s"'`]+/g);
  const candidate = matches?.length ? matches[matches.length - 1] : rawValue;

  return candidate.replace(/\/+$/, "");
}

export function buildApiUrl(path = "") {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (typeof window !== "undefined") {
    return `${CLIENT_PROXY_PREFIX}${normalizedPath}`;
  }

  return `${getApiBaseUrl()}${normalizedPath}`;
}
