import { redirect } from "next/navigation";
import AdminDashboardView from "../AdminDashboardView";
import { getAuthUser } from "../../lib/auth";

export default async function AdminDashboardPage() {
  const auth = await getAuthUser();

  if (!auth?.authenticated) {
    redirect("/login");
  }

  if (auth.user.role !== "superadmin") {
    redirect("/dashboard");
  }

  return <AdminDashboardView />;
}
