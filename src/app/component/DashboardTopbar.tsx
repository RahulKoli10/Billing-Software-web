"use client";

import { Bell, Search, ChevronDown, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProp {
  role: string;
  email?: string;
  name?: string;
}

export default function DashboardTopbar({ user }: { user: UserProp }) {
  const isAdmin = user.role === "superadmin";
  const emailUsername = user.email?.split("@")[0]?.trim();
  const displayName =
    user.name?.trim() || emailUsername || user.email || user.role;
  const subLabel = isAdmin
    ? "Super Admin"
    : user.email?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-100 rounded-xl text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 block w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-100" />

        {/* User Badge */}
        <button className="flex items-center gap-3 pl-1 pr-2 py-1.5 rounded-xl hover:bg-gray-50 transition-all group">
          {/* Avatar */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-sm",
              isAdmin
                ? "bg-blue-600 shadow-blue-600/20"
                : "bg-emerald-500 shadow-emerald-500/20"
            )}
          >
            {initial}
          </div>

          {/* Name + Role */}
          <div className="text-left hidden sm:block">
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

          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>
      </div>
    </header>
  );
}
