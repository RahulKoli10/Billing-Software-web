"use client";

import { Icon } from "@iconify/react";

interface User {
  role: string;
}

export default function DashboardTopbar({ user }: { user: User }) {
  return (
    <header className="h-14 bg-white flex items-center justify-between px-6">
      <span className="font-medium text-gray-700">
        Welcome, {user.role}
      </span>

      <Icon icon="qlementine-icons:user-24" width={22} />
    </header>
  );
}
