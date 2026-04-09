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
  BookOpen,
  Newspaper,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildApiUrl } from "@/lib/api";
import { notifyAuthStateChanged } from "@/lib/auth-events";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";

type SidebarProps = {
  role: "superadmin" | "user";
  mobileOpen?: boolean;
  onClose?: () => void;
};

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: ("superadmin" | "user")[];
};

export default function DashboardSidebar({
  role,
  mobileOpen = false,
  onClose,
}: SidebarProps) {
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
    onClose?.();
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
  ];

  const userLinks: NavItem[] =[
    { label: "Sales Report", href: "/dashboard/user/sales", icon: ClipboardMinus },
    { label: "Inventory", href: "/dashboard/user/inventory", icon: Package },
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
    {
      label: "Blogs",
      href: "/dashboard/admin/blogs",
      icon: BookOpen,
      roles: ["superadmin"],
    },
    {
      label: "News",
      href: "/dashboard/admin/news",
      icon: Newspaper,
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
        onClick={() => onClose?.()}
        className={cn(
          "mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-tight transition-all lg:rounded-r-lg lg:rounded-l-none",
          isActive
            ? "border-l-4 border-blue-600 bg-blue-50/50 text-blue-600"
            : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900",
        )}
      >
        <item.icon className="w-5 h-5" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => onClose?.()}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-[86vw] max-w-72 flex-col border-r border-gray-100 bg-white transition-transform duration-300 sm:w-80 lg:sticky lg:top-0 lg:z-40 lg:w-64 lg:max-w-none lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-hidden py-5 lg:py-6">
          <div className="mb-6 flex items-center justify-between px-5 lg:hidden">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-gray-400">
              Navigation
            </p>
            <button
              type="button"
              onClick={() => onClose?.()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50"
              aria-label="Close dashboard navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

        <div className="px-6 mb-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
             <Link href="/"><Wallet className="text-white w-5 h-5" /></Link> 
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
          
          {role === "user" && (
            <>
              <div className="px-4 mt-8 mb-2 text-xs font-bold uppercase tracking-widest text-gray-800">
                User Dashboard
              </div>
              {userLinks.map(renderLink)}
            </> 
          )}
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
            onClick={() => {
              onClose?.();
              window.location.href = "#";
            }}
            className="min-w-auto py-3 px-4 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-sm cursor-pointer text-sm font-bold shadow-lg shadow-blue-600/20 hover:opacity-90 transition-all text-center"
          >
            {role === "superadmin" ? "Generate Report" : "New Invoice"}
          </button>
        </div>

        <div className="mt-auto shrink-0 overflow-hidden border-t border-gray-100 px-4 pt-4">
          <Link
            href="/settings"
            onClick={() => onClose?.()}
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
    </>
  );
}
