import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { canAccessEditorialAdmin, getAuthUser } from "@/app/lib/auth";

export default async function AdminNewsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const auth = await getAuthUser();

  if (!auth?.authenticated) {
    redirect("/login");
  }

  if (!canAccessEditorialAdmin(auth.user.role)) {
    redirect("/dashboard");
  }

  return children;
}
