import { redirect } from "next/navigation";
import { getAuthUser } from "../lib/auth";
import DashboardSidebar from "../component/DashboardSidebar";
import DashboardTopbar from "../component/DashboardTopbar";

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
    <div className="flex min-h-screen bg-[#F3F6FB]">
      <DashboardSidebar role={auth.user.role} />
      <div className="flex-1 flex flex-col">
        <DashboardTopbar user={auth.user} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
