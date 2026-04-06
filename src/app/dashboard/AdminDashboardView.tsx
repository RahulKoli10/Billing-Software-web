"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CreditCard,
  Download,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";
import { buildApiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";

type Customer = {
  user_id: number;
  name?: string;
  email?: string;
  business_name?: string;
  current_plan?: string;
  current_status?: string;
  total_revenue?: number | string;
  total_subscriptions?: number;
};

type PricingPlan = {
  id: number;
  name: string;
  monthly_price: number;
  highlighted: boolean;
  is_active: boolean;
};

type SoftwareItem = {
  id: number;
  platform: string;
  version: string;
  file_name: string;
  release_date: string;
};

type DashboardData = {
  customers: Customer[];
  plans: PricingPlan[];
  downloads: SoftwareItem[];
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "neutral" | "primary";
  className?: string;
}) {
  const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-600",
    primary: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

function Card({
  children,
  className,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        className,
      )}
    >
      {(title || subtitle) && (
        <div className="mb-5">
          {title ? (
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          ) : null}
          {subtitle ? (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      )}
      {children}
    </div>
  );
}

export default function AdminDashboardView() {
  const [data, setData] = useState<DashboardData>({
    customers: [],
    plans: [],
    downloads: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [customersRes, plansRes, downloadsRes] = await Promise.allSettled([
        fetch(buildApiUrl("/api/customer/admin/all"), {
          credentials: "include",
        }),
        fetch(buildApiUrl("/api/pricing/admin"), {
          credentials: "include",
        }),
        fetch(buildApiUrl("/api/downloads"), {
          credentials: "include",
        }),
      ]);

      const customers =
        customersRes.status === "fulfilled" && customersRes.value.ok
          ? ((await customersRes.value.json()) as Customer[])
          : [];
      const plans =
        plansRes.status === "fulfilled" && plansRes.value.ok
          ? ((await plansRes.value.json()) as PricingPlan[])
          : [];
      const downloads =
        downloadsRes.status === "fulfilled" && downloadsRes.value.ok
          ? ((await downloadsRes.value.json()) as SoftwareItem[])
          : [];

      if (
        customersRes.status === "rejected" &&
        plansRes.status === "rejected" &&
        downloadsRes.status === "rejected"
      ) {
        throw new Error("Unable to load admin dashboard data.");
      }

      setData({ customers, plans, downloads });
    } catch (err) {
      console.error("Failed to fetch admin dashboard data:", err);
      setError("Unable to load the admin dashboard right now.");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = data.customers.reduce((sum, customer) => {
    return sum + Number(customer.total_revenue || 0);
  }, 0);
  const activeCustomers = data.customers.filter((customer) =>
    ["active", "pushed"].includes(customer.current_status || ""),
  ).length;
  const pendingCustomers = data.customers.filter(
    (customer) => !customer.current_status || customer.current_status === "pending",
  ).length;
  const activePlans = data.plans.filter((plan) => plan.is_active).length;
  const featuredPlans = data.plans.filter((plan) => plan.highlighted).length;
  const latestDownloads = [...data.downloads]
    .sort((left, right) => {
      return (
        new Date(right.release_date).getTime() -
        new Date(left.release_date).getTime()
      );
    })
    .slice(0, 4);
  const recentCustomers = data.customers.slice(0, 5);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-100 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => void fetchDashboardData()}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Badge variant="primary">Admin Workspace</Badge>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Billing admin dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Live overview of customers, pricing, and software releases from your
            backend data.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/admin/customers"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Manage customers
          </Link>
          <Link
            href="/dashboard/admin/pricing"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Manage pricing
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
        <Card>
          <div className="mb-4 flex items-start justify-between">
            <Users className="h-8 w-8 text-blue-600" />
            <Badge variant="neutral">{data.customers.length} total</Badge>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Active customers
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {activeCustomers}
          </p>
        </Card>

        <Card>
          <div className="mb-4 flex items-start justify-between">
            <CreditCard className="h-8 w-8 text-emerald-600" />
            <Badge variant={featuredPlans > 0 ? "success" : "neutral"}>
              {featuredPlans} featured
            </Badge>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Active pricing plans
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{activePlans}</p>
        </Card>

        <Card>
          <div className="mb-4 flex items-start justify-between">
            <Download className="h-8 w-8 text-violet-600" />
            <Badge variant="primary">{data.downloads.length} files</Badge>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Total revenue
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {currency.format(totalRevenue)}
          </p>
        </Card>

        <Card>
          <div className="mb-4 flex items-start justify-between">
            <ShieldCheck className="h-8 w-8 text-amber-600" />
            <Badge variant={pendingCustomers > 0 ? "warning" : "success"}>
              {pendingCustomers > 0 ? "Needs review" : "Clear"}
            </Badge>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Pending approvals
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {pendingCustomers}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
        <Card
          title="Recent customers"
          subtitle="Latest customer records returned by the admin customer API"
          className="lg:col-span-2"
        >
          {recentCustomers.length ? (
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.user_id}
                  className="flex flex-col gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {customer.business_name || customer.name || "Unnamed customer"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {customer.email || "No email available"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {customer.current_plan || "No plan"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {currency.format(Number(customer.total_revenue || 0))}
                      </p>
                    </div>
                    <Badge
                      variant={
                        ["active", "pushed"].includes(customer.current_status || "")
                          ? "success"
                          : customer.current_status === "expired"
                            ? "error"
                            : "warning"
                      }
                    >
                      {customer.current_status || "pending"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No customer data available yet.</p>
          )}

          <Link
            href="/dashboard/admin/customers"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
          >
            Open customer management
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Card>

        <div className="space-y-6">
          <Card title="Admin modules" subtitle="Working links into each section">
            <div className="space-y-3">
              <AdminLink
                href="/dashboard/admin/customers"
                title="Customers"
                description={`${data.customers.length} customers in the system`}
              />
              <AdminLink
                href="/dashboard/admin/pricing"
                title="Pricing plans"
                description={`${activePlans} active plans, ${featuredPlans} featured`}
              />
              <AdminLink
                href="/dashboard/admin/software-downloads"
                title="Software downloads"
                description={`${data.downloads.length} downloadable builds available`}
              />
            </div>
          </Card>

          <Card
            title="Latest releases"
            subtitle="Most recent software entries from the downloads API"
          >
            {latestDownloads.length ? (
              <div className="space-y-3">
                {latestDownloads.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-gray-900">
                        {item.version}
                      </p>
                      <Badge variant="neutral">{item.platform}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.file_name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No software uploaded yet.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdminLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition hover:border-blue-200 hover:bg-blue-50/50"
    >
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-blue-600" />
    </Link>
  );
}
