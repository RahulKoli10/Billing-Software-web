import { buildApiUrl } from "@/lib/api";

const WRITER_TOKEN_STORAGE_KEY = "writer_session_token";

export function getWriterSessionToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(WRITER_TOKEN_STORAGE_KEY);
}

export function setWriterSessionToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(WRITER_TOKEN_STORAGE_KEY, token);
}

export function clearWriterSessionToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(WRITER_TOKEN_STORAGE_KEY);
}

export function withWriterAuthHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  const token = getWriterSessionToken();

  if (token) {
    nextHeaders.set("Authorization", `Bearer ${token}`);
  }

  return nextHeaders;
}

export function writerApiFetch(path: string, init: RequestInit = {}) {
  return fetch(buildApiUrl(path), {
    ...init,
    credentials: "omit",
    headers: withWriterAuthHeaders(init.headers),
  });
}
