"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Package,
  Users,
  Settings,
  LogOut,
  Wallet,
  Activity,
  ShieldCheck,
  ClipboardMinus,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildApiUrl } from "@/lib/api";
import { notifyAuthStateChanged } from "@/lib/auth-events";
import { toast } from "sonner";

type SidebarProps = {
  role: "superadmin" | "user";
};

type NavItem = {
  label: string;
  href: string;
  icon: any;
  roles?: ("superadmin" | "user")[];
};

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const performLogout = async () => {
    try {
      await fetch(buildApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    notifyAuthStateChanged();
    router.push("/login");
    router.refresh();
  };

  const handleLogout = () => {
    toast("Do you want to log out?", {
      description: "You will need to sign in again to access the dashboard.",
      action: {
        label: "Logout",
        onClick: () => {
          void performLogout();
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
      duration: 8000,
    });
  };

  const commonLinks: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Subscription", href: "/dashboard/subscription", icon: Activity },
    { label: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { label: "Payments", href: "/dashboard/payments", icon: ClipboardMinus },
  ];

  const userLinks: NavItem[] =[
    { label: "sales", href: "/dashboard/sales", icon: ClipboardMinus },
    { label: "sales", href: "/dashboard/invoice", icon: ClipboardMinus },
  ]

  const adminLinks: NavItem[] = [
    {
      label: "Admin Overview",
      href: "/dashboard/admin",
      icon: ShieldCheck,
      roles: ["superadmin"],
    },
    {
      label: "Customers",
      href: "/dashboard/admin/customers",
      icon: Users,
      roles: ["superadmin"],
    },
    {
      label: "Software Downloads",
      href: "/dashboard/admin/software-downloads",
      icon: Package,
      roles: ["superadmin"],
    },
    {
      label: "Pricing Plans",
      href: "/dashboard/admin/pricing",
      icon: List,
      roles: ["superadmin"],
    },
  ];

  const renderLink = (item: NavItem) => {
    const isActive =
      pathname === item.href ||
      (pathname.startsWith(item.href + "/") &&
        item.href !== "/dashboard" &&
        item.href !== "/dashboard/admin");

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight transition-all rounded-r-lg mb-1",
          isActive
            ? "text-blue-600 bg-blue-50/50 border-l-4 border-blue-600"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent",
        )}
      >
        <item.icon className="w-5 h-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 left-0 z-40 h-screen w-64 border-r border-gray-100 bg-white">
      <div className="flex h-full flex-col overflow-hidden py-6">
        <div className="px-6 mb-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-600 tracking-tighter">
                BissBill
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 opacity-80">
                Smart Billing{" "}
              </p>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 opacity-80">
                for Smart Business
              </p>
            </div>
          </div>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto px-2 space-y-1">
          <div className="px-4 mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            Main
          </div>
          {commonLinks.map(renderLink)}

          {role === "superadmin" && (
            <>
              <div className="px-4 mt-8 mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                Admin
              </div>
              {adminLinks.map(renderLink)}
            </>
          )}
        </nav>

        <div className="px-6 mb-6 mt-8 shrink-0">
          <button
            onClick={() => (window.location.href = "#")}
            className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:opacity-90 transition-all text-center"
          >
            {role === "superadmin" ? "Generate Report" : "New Invoice"}
          </button>
        </div>

        <div className="mt-auto shrink-0 overflow-hidden border-t border-gray-100 px-4 pt-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-gray-500 text-sm font-semibold tracking-tight hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 text-sm font-semibold tracking-tight hover:bg-gray-50 hover:text-red-600 rounded-lg transition-colors"
          onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
