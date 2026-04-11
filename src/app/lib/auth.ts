import { cookies } from "next/headers";
import { buildApiUrl } from "@/lib/api";

const EDITORIAL_ROLES = [
  "superadmin",
  "content-writer",
  "content_writer",
  "content writer",
  "writer",
  "admin",
] as const;

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) return null;

  const res = await fetch(buildApiUrl("/api/auth/me"), {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json(); // { authenticated, user }
}

export function canAccessEditorialAdmin(role?: string | null) {
  const normalizedRole = role?.trim().toLowerCase();

  return normalizedRole ? EDITORIAL_ROLES.includes(normalizedRole as (typeof EDITORIAL_ROLES)[number]) : false;
}
