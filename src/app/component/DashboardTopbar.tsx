"use client";

import { Bell, Menu, Search, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProp {
  role: string;
  email?: string;
  name?: string;
}

export default function DashboardTopbar({
  user,
  onMenuToggle,
}: {
  user: UserProp;
  onMenuToggle: () => void;
}) {
  const isAdmin = user.role === "superadmin";
  const emailUsername = user.email?.split("@")[0]?.trim();
  const displayName =
    user.name?.trim() || emailUsername || user.email || user.role;
  const subLabel = isAdmin
    ? "Super Admin"
    : user.email?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 lg:hidden"
          aria-label="Open dashboard navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

      {/* Left: Search */}
        <div className="flex min-w-0 flex-1 items-center gap-3 lg:max-w-md">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 sm:hidden"
            aria-label="Search dashboard"
          >
            <Search className="h-4 w-4" />
          </button>
          <div className="relative hidden w-full sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-700 transition-all placeholder:text-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

      {/* Right: Notifications + User */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* Divider */}
          <div className="hidden h-8 w-px bg-gray-100 sm:block" />

        {/* User Badge */}
          <button className="group flex items-center gap-2 rounded-xl py-1.5 pl-1 pr-1 transition-all hover:bg-gray-50 sm:gap-3 sm:pr-2">
          {/* Avatar */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm",
              isAdmin
                ? "bg-blue-600 shadow-blue-600/20"
                : "bg-emerald-500 shadow-emerald-500/20"
            )}
          >
            {initial}
          </div>

          {/* Name + Role */}
            <div className="hidden text-left md:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {displayName}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              {isAdmin ? (
                <Shield className="w-3 h-3 text-blue-500" />
              ) : (
                <User className="w-3 h-3 text-emerald-500" />
              )}
              <span
                className={cn(
                  "text-[10px] font-bold   tracking-widest",
                  isAdmin ? "text-blue-500" : "text-emerald-500"
                )}
              >
                {subLabel}
              </span>
            </div>
          </div>

          {/* <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" /> */}
        </button>
      </div>
      </div>
    </header>
  );
}
