"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bell } from "lucide-react";
import { Icon } from "@iconify/react";
import { Toaster } from "sonner";
import { useWriterAuth } from "@/context/WriterAuthContext";
import type { WriterLayoutProps } from "@/types/writer";

const navigationItems = [
  { label: "Dashboard", href: "/writer/dashboard", icon: "lucide:layout-dashboard" },
  { label: "Blogs", href: "/writer/blogs", icon: "lucide:book-open" },
  { label: "News", href: "/writer/news", icon: "lucide:newspaper" },
  { label: "My Profile", href: "/writer/profile", icon: "lucide:user-circle" },
];

function getPageTitle(pathname?: string | null) {
  if (pathname?.includes("/blogs")) return "Blogs";
  if (pathname?.includes("/news")) return "News";
  if (pathname?.includes("/profile")) return "My Profile";
  if (pathname?.includes("/dashboard")) return "Dashboard";
  return "Writer Portal";
}

export default function WriterLayout({ children }: WriterLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { writer, logout } = useWriterAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  async function handleLogout() {
    await logout();
    router.replace("/writer/login");
    router.refresh();
  }

  const getInitials = (name?: string) => {
    if (!name) return "W";
    const parts = name.split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-[#fafaf8] lg:flex">
      <Toaster position="top-right" expand={false} richColors />
      
      <div
        className={`fixed inset-0 z-40 bg-slate-950/20 transition lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-[#ebebeb] bg-[#ffffff] py-8 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6">
          <Link href="/writer/dashboard" className="block">
            <h1 className="text-xl font-bold tracking-tight text-[#1a1a1a]">
              BISSBILL
            </h1>
            <p className="mt-0.5 text-[10px] font-semibold tracking-[0.2em] text-[#9a9a9a] uppercase">
              Writer
            </p>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-12 flex-1 space-y-1">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? "border-l-[3px] border-[#5b4ced] bg-[#ede9fe] text-[#5b4ced]"
                    : "border-l-[3px] border-transparent text-[#888] hover:bg-[#f5f5f5]"
                }`}
              >
                <Icon 
                  icon={item.icon} 
                  width={18} 
                  className={isActive ? "text-[#5b4ced]" : "text-[#888]"} 
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6">
          <div className="flex items-center gap-3 py-6 border-t border-[#ebebeb]">
            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#5b4ced] text-xs font-bold text-white">
              {getInitials(writer?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#1a1a1a]">
                {writer?.name || "Writer"}
              </p>
              <p className="truncate text-[11px] text-[#9a9a9a]">
                {writer?.email || "writer@bissbill.com"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#9a9a9a] transition hover:bg-rose-50 hover:text-rose-500"
              title="Logout"
            >
              <Icon icon="lucide:log-out" width={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-[#fafaf8]/80 px-6 py-6 backdrop-blur lg:px-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#ebebeb] bg-white text-slate-600 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#9a9a9a] transition hover:text-[#1a1a1a]">
              <Bell className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-6 pb-12 lg:px-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

