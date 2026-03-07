import { cookies } from "next/headers";

export async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  if (!token) return null;

  const res = await fetch("http://localhost:5000/api/auth/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json(); // { authenticated, user }
}
