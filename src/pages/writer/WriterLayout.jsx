"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  BookOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  Terminal,
  UserCircle2,
  X,
} from "lucide-react";
import { useWriterAuth } from "@/context/WriterAuthContext";

const navigationItems = [
  { label: "Dashboard", href: "/writer/dashboard", icon: LayoutDashboard },
  { label: "Blogs", href: "/writer/blogs", icon: BookOpen },
  { label: "News", href: "/writer/news", icon: Newspaper },
  { label: "My Profile", href: "/writer/profile", icon: UserCircle2 },
];

function getPageTitle(pathname) {
  if (pathname?.includes("/blogs")) return "Blogs";
  if (pathname?.includes("/news")) return "News";
  if (pathname?.includes("/profile")) return "My Profile";
  if (pathname?.includes("/dashboard")) return "Dashboard";
  return "Writer Portal";
}

export default function WriterLayout({ children }) {
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

  const getInitials = (name) => {
    if (!name) return "W";
    return name.substring(0, 2).toUpperCase();
  };

  const pageTitle = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f5ff_0%,#f3f1ff_42%,#ffffff_100%)] lg:flex">
      <div
        className={`fixed inset-0 z-40 bg-slate-950/35 transition lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-[#e6e2ff] bg-[#fcfbff] py-6 shadow-[0_28px_80px_-36px_rgba(124,111,247,0.55)] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5">
          <Link href="/writer/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white shadow-md">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-950 leading-tight">
                   BISSBILL
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7c6ff7]">
                Writer Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#e6e2ff] text-slate-500 lg:hidden"
            aria-label="Close writer navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1 px-3">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "border-l-4 border-[#7c6ff7] bg-[#f0edff] text-[#6a5ce8] shadow-sm ml-[-4px] pl-[15px]"
                    : "text-slate-600 hover:bg-[#f6f5ff] hover:text-[#534AB7] border-l-4 border-transparent"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-[#7c6ff7]" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-5 pt-6 pb-2">
          <div className="rounded-2xl border border-[#e8e4ff] bg-white p-4 shadow-[0_12px_40px_-20px_rgba(124,111,247,0.4)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#efe8ff] text-sm font-bold text-[#7c6ff7]">
                {getInitials(writer?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-950">
                  {writer?.name || "Writer"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {writer?.email || "writer@   BISSBILL.com"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#ece9ff] bg-white/85 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#e6e2ff] bg-white text-slate-600 lg:hidden"
              aria-label="Open writer navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ece8ff] bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600">
              <Bell className="h-5 w-5" />
            </button>
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium text-slate-900">{writer?.name || "Writer"}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
