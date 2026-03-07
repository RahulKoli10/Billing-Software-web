"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  role: "superadmin" | "user";
};

type NavItem = {
  label: string;
  href: string;
  roles?: ("superadmin" | "user")[];
};

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const commonLinks: NavItem[] = [
    { label: "Overview", href: "/dashboard" },
    { label: "Subscription", href: "/dashboard/subscription" },
    { label: "Invoices", href: "/dashboard/invoices" },
  ];

  const adminLinks: NavItem[] = [
    // {
    //   label: "Users",
    //   href: "/dashboard/admin/users",
    //   roles: ["superadmin"],
    // },
    {
      label: "Customers",
      href: "/dashboard/admin/customers",
      roles: ["superadmin"],
    },
    {
      label: "Software Downloads",
      href: "/dashboard/admin/software-downloads",
      roles: ["superadmin"],
    },
    {
      label: "Pricing Plans",
      href: "/dashboard/admin/pricing",
      roles: ["superadmin"],
    },
  ];

  const renderLink = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`block px-3 py-2 rounded transition ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "hover:bg-gray-100 text-gray-700"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white border-r hidden md:block sticky top-0 h-screen">
      <div className="p-6 font-bold text-xl">Dashboard</div>

      <nav className="px-4 space-y-2 text-sm font-medium">
        {/* Common Links */}
        {commonLinks.map(renderLink)}

        {/* Admin Section */}
        {role === "superadmin" && (
          <>
            <div className="mt-6 px-3 text-xs uppercase text-gray-400">
              Admin
            </div>
            {adminLinks.map(renderLink)}
          </>
        )}
      </nav>
    </aside>
  );
}
