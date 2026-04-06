import { redirect } from "next/navigation";
import { getAuthUser } from "../lib/auth";
import DashboardShell from "../component/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getAuthUser();

  if (!auth?.authenticated) {
    redirect("/login");
  }

  return (
    <DashboardShell role={auth.user.role} user={auth.user}>
      {children}
    </DashboardShell>
  );
}
