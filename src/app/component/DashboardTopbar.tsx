"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Menu, Search, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildApiUrl } from "@/lib/api";

interface UserProp {
  role: string;
  email?: string;
  name?: string;
}

type NotificationItem = {
  id: number;
  type: string;
  title: string;
  message: string;
  created_at: string;
};

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
  const normalizedRole = user.role.trim().toLowerCase();
  const subLabel = isAdmin
    ? "Super Admin"
    : ["content-writer", "content_writer", "content writer", "writer", "admin"].includes(normalizedRole)
      ? "Content Writer"
    : user.email?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const unreadCount = notifications.length;

  const fetchNotifications = useCallback(async () => {
    try {
      setNotificationsLoading(true);
      const res = await fetch(buildApiUrl("/api/notifications"), {
        credentials: "include",
      });

      if (!res.ok) {
        setNotifications([]);
        return;
      }

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const intervalId = window.setInterval(fetchNotifications, 150000);

    return () => window.clearInterval(intervalId);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [notificationsOpen]);

  const markNotificationRead = async (notificationId: number) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== notificationId)
    );

    try {
      await fetch(buildApiUrl(`/api/notifications/${notificationId}/read`), {
        method: "PATCH",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to mark notification read:", err);
      fetchNotifications();
    }
  };

  const markAllNotificationsRead = async () => {
    const previous = notifications;
    setNotifications([]);

    try {
      await fetch(buildApiUrl("/api/notifications/read-all"), {
        method: "PATCH",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
      setNotifications(previous);
    }
  };

  const formatNotificationDate = (value: string) => {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen((current) => !current)}
            className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
            aria-label="Open notifications"
            aria-expanded={notificationsOpen}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold leading-none text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl shadow-gray-900/10">
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Notifications
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {unreadCount} unread
                  </p>
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="rounded-lg px-2 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notificationsLoading && unreadCount === 0 ? (
                  <div className="px-4 py-6 text-center text-sm font-medium text-gray-500">
                    Loading notifications...
                  </div>
                ) : unreadCount === 0 ? (
                  <div className="px-4 py-6 text-center text-sm font-medium text-gray-500">
                    No unread notifications.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => markNotificationRead(notification.id)}
                      className="block w-full border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-bold text-gray-900">
                          {notification.title}
                        </p>
                        <span className="shrink-0 text-[10px] font-bold uppercase text-blue-500">
                          {notification.type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-2 text-xs font-medium text-gray-400">
                        {formatNotificationDate(notification.created_at)}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

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
