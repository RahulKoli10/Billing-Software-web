"use client";

import { useEffect, useState } from "react";
import React from "react";
import { buildApiUrl } from "@/lib/api";
import { cn } from "@/lib/utils";
import AdminDashboardView from "./AdminDashboardView";
import { 
  Activity, 
  ShieldCheck, 
  Clock,
  ArrowUpRight,
  MoreVertical,
  Copy,
  CheckCheck,
  RefreshCw,
  Eye,
  EyeOff,
  IndianRupee,
  CreditCard,
  Package,
  Boxes,
  TrendingUp,
} from "lucide-react";

type DashboardUser = {
  role: string;
  email?: string;
  name?: string;
};

type SubscriptionData = {
  plan_name: string;
  status: string;
  license_key: string;
  end_date: string;
};

type CredentialsData = {
  software_username?: string;
  has_password?: boolean;
};

type SaleItem = {
  id: number;
  invoice_no: string;
  customer_name: string;
  invoice_date: string;
  net_amount: number;
  received_amount: number;
  balance_due: number;
  payment_status: string;
};

type InventoryItem = {
  id: number;
  item_name: string;
  item_code: string | null;
  category: string | null;
  sale_price: number;
  opening_qty: number;
  min_stock: number;
  updated_at: string | null;
};

type BadgeVariant = "success" | "warning" | "error" | "neutral" | "primary";

type OverviewStat = {
  title: string;
  value: string;
  change: string;
  trend: BadgeVariant;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

export default function DashboardHome() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [credentials, setCredentials] = useState<CredentialsData | null>(null);
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedItems, setCopiedItems] = useState<{ [key: string]: boolean }>({});
  const [plainPassword, setPlainPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      // 1. Fetch User Profile to determine role
      const userRes = await fetch(buildApiUrl("/api/auth/me"), { credentials: "include" });
      const userData = await userRes.json();
      setUser(userData.user);

      // 2. If regular user, fetch their personal subscription & credentials
      if (userData.user?.role !== "superadmin") {
        const subRes = await fetch(buildApiUrl("/api/subscription/my"), { credentials: "include" });
        const subData = await subRes.json();
        setSubscription(subData);

        const credRes = await fetch(buildApiUrl("/api/subscription/credentials"), { credentials: "include" });
        if (credRes.ok) {
          const credData = await credRes.json();
          setCredentials(credData);
        }

        const [salesRes, inventoryRes] = await Promise.all([
          fetch(buildApiUrl("/api/sales"), { credentials: "include" }),
          fetch(buildApiUrl("/api/items"), { credentials: "include" }),
        ]);

        if (salesRes.ok) {
          const salesData = await salesRes.json();
          setSales(Array.isArray(salesData) ? salesData : []);
        }

        if (inventoryRes.ok) {
          const inventoryData = await inventoryRes.json();
          setInventoryItems(Array.isArray(inventoryData) ? inventoryData : []);
        }
      }
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedItems((prev) => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedItems((prev) => ({ ...prev, [key]: false }));
    }, 2000);
  };

  const handleResetPassword = async () => {
    if (!confirm("Are you sure you want to generate a new software password? You will need to update your software client immediately.")) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch(buildApiUrl("/api/subscription/credentials/reset"), { 
        method: "POST", 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Reset failed");
      const data = await res.json();
      setCredentials((prev) => ({
        ...prev,
        software_username: data.software_username,
        has_password: true
      }));
      setPlainPassword(data.plainPassword);
      setShowPassword(true);
    } catch {
      alert("Failed to reset software credentials.");
    } finally {
      setIsResetting(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  // --- Admin View ---
  if (user?.role === "superadmin") {
    return <AdminDashboardView />;
  }

  // --- User View ---
  if (!subscription)
    return (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
           <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No Active Subscription</h2>
        <p className="text-gray-500 mb-6 max-w-xs">You currently do not have an active plan. Choose a plan to start using the software.</p>
        <a
          href="/plans-price"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
        >
          Choose Plan
        </a>
      </div>
    );

  const endDate = new Date(subscription.end_date);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const totalRevenue = sales.reduce((sum, sale) => sum + Number(sale.net_amount || 0), 0);
  const totalReceived = sales.reduce((sum, sale) => sum + Number(sale.received_amount || 0), 0);
  const totalPending = sales.reduce((sum, sale) => sum + Number(sale.balance_due || 0), 0);
  const invoiceCount = sales.length;
  const inventoryCount = inventoryItems.length;
  const lowStockItems = inventoryItems.filter((item) => item.opening_qty <= item.min_stock);
  const lowStockCount = lowStockItems.length;
  const inventoryValue = inventoryItems.reduce(
    (sum, item) => sum + Number(item.sale_price || 0) * Number(item.opening_qty || 0),
    0
  );
  const recentSales = sales.slice(0, 5);
  const recentInventory = [...inventoryItems]
    .sort((a, b) => {
      const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  const stats: OverviewStat[] = [
    {
      title: "Active Protocol",
      value: subscription.plan_name,
      change: subscription.status,
      trend: subscription.status === "active" ? "success" : "neutral",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "License Key",
      value: subscription.license_key,
      change: "Active",
      trend: "neutral",
      icon: ShieldCheck,
      color: "text-green-600",
    },
    {
      title: "Days Remaining",
      value: `${daysRemaining} Days`,
      change: new Date(subscription.end_date).toLocaleDateString(),
      trend: "primary",
      icon: Clock,
      color: "text-blue-600",
    },
  ];

  const businessStats = [
    {
      title: "Sales Revenue",
      value: formatCurrency(totalRevenue),
      helper: `${invoiceCount} invoices`,
      icon: IndianRupee,
      tone: "text-blue-600",
    },
    {
      title: "Amount Received",
      value: formatCurrency(totalReceived),
      helper: `${formatCurrency(totalPending)} pending`,
      icon: CreditCard,
      tone: "text-emerald-600",
    },
    {
      title: "Inventory Items",
      value: inventoryCount,
      helper: `${lowStockCount} low stock`,
      icon: Boxes,
      tone: "text-violet-600",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(inventoryValue),
      helper: "Based on sale price x stock",
      icon: Package,
      tone: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl text-black font-bold font-headline tracking-tighter sm:text-3xl">Dashboard Overview</h2>
          <p className="text-gray-500 font-medium">Subscription status plus important sales and inventory highlights in one place.</p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <a href="/plans-price">
            <Button size="sm">Upgrade Architecture</Button>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <div className={stat.color}>
                <stat.icon className="w-8 h-8" />
              </div>
              <Badge variant={stat.trend}>{stat.change}</Badge>
            </div>
            <h4 className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-widest">{stat.title}</h4>
            <div className="flex items-center gap-3">
              <p className="text-2xl text-black font-bold font-headline truncate" title={stat.value}>{stat.value}</p>
              {stat.title === "License Key" && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleCopy(stat.value, 'license_stat'); }} 
                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors z-10"
                  title="Copy License"
                >
                  {copiedItems['license_stat'] ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
              <stat.icon className="w-24 h-24" />
            </div>
          </Card>
        ))}
      </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:col-span-2 xl:col-span-4">Business Performance</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {businessStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <div className="mb-4 flex items-start justify-between">
              <div className={stat.tone}>
                <stat.icon className="w-7 h-7" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">{stat.title}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-2 text-xs font-medium text-gray-500">{stat.helper}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="space-y-6 lg:col-span-2 lg:space-y-8">
          <Card title="Subscription Details" subtitle="Full overview of your current plan">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 pt-2 font-headline text-xs font-bold uppercase tracking-widest text-gray-400">Plan Name</th>
                    <th className="pb-4 pt-2 font-headline text-xs font-bold uppercase tracking-widest text-gray-400">End Date</th>
                    <th className="pb-4 pt-2 font-headline text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                    <th className="pb-4 pt-2 font-headline text-xs font-bold uppercase tracking-widest text-gray-400">Key</th>
                    <th className="pb-4 pt-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="group hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 text-sm font-bold text-gray-900">{subscription.plan_name}</td>
                    <td className="py-4 text-sm font-medium text-gray-500">{new Date(subscription.end_date).toLocaleDateString()}</td>
                    <td className="py-4">
                      <Badge variant={subscription.status === "active" ? "success" : "error"}>
                        {subscription.status}
                      </Badge>
                    </td>
                    <td className="py-4 font-mono text-xs font-bold text-blue-600 truncate max-w-30" title={subscription.license_key}>
                      <div className="flex items-center gap-2">
                        <span className="truncate">{subscription.license_key}</span>
                        <button 
                          onClick={() => handleCopy(subscription.license_key, 'license_table')} 
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                          title="Copy to clipboard"
                        >
                          {copiedItems['license_table'] ? <CheckCheck className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {credentials && (
            <Card title="Software Credentials" subtitle="Authentication details for your client binary">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1">Software Username</p>
                  <div className="flex justify-between items-center">
                    <p className="font-mono text-sm font-bold text-gray-900">{credentials.software_username || "Not assigned"}</p>
                    {credentials.software_username && (
                      <button 
                        onClick={() => handleCopy(credentials.software_username!, 'username')} 
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copiedItems['username'] ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col justify-center relative">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-1">Software Password</p>
                  <div className="flex justify-between items-center">
                    {plainPassword ? (
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-sm font-bold text-blue-900">
                          {showPassword ? plainPassword : "••••••••"}
                        </p>
                        <button onClick={() => setShowPassword(!showPassword)} className="text-blue-400 hover:text-blue-600">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleCopy(plainPassword, 'password')} 
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                        >
                          {copiedItems['password'] ? <CheckCheck className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ) : (
                      <p className="font-mono text-sm font-bold text-blue-900 opacity-50">
                        {credentials.has_password ? "••••••••" : "Not set"}
                      </p>
                    )}
                  </div>

                  {!plainPassword && (
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline" className="text-xs py-1 px-2 border-blue-200 text-blue-700 bg-white" onClick={handleResetPassword} disabled={isResetting}>
                        <RefreshCw className={cn("w-3 h-3 mr-1.5", isResetting && "animate-spin")} />
                        {credentials.has_password ? "Generate New Password" : "Generate Password"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {plainPassword && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800 border border-amber-200 flex items-start gap-2">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-amber-600" />
                  <p><strong>Store this password securely!</strong> It will not be shown again once you leave this page. You must update your software client using these new credentials.</p>
                </div>
              )}
            </Card>
          )}

          <Card title="Recent Sales" subtitle="Latest invoice activity from your sales report">
            {recentSales.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500">
                No sales available yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 pt-2 text-xs font-bold uppercase tracking-widest text-gray-400">Invoice</th>
                      <th className="pb-4 pt-2 text-xs font-bold uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="pb-4 pt-2 text-xs font-bold uppercase tracking-widest text-gray-400">Amount</th>
                      <th className="pb-4 pt-2 text-xs font-bold uppercase tracking-widest text-gray-400">Due</th>
                      <th className="pb-4 pt-2 text-xs font-bold uppercase tracking-widest text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentSales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="py-4 text-sm font-bold text-gray-900">{sale.invoice_no}</td>
                        <td className="py-4 text-sm text-gray-600">{sale.customer_name}</td>
                        <td className="py-4 text-sm font-semibold text-gray-900">{formatCurrency(sale.net_amount)}</td>
                        <td className="py-4 text-sm font-medium text-rose-600">{formatCurrency(sale.balance_due)}</td>
                        <td className="py-4">
                          <Badge variant={getPaymentBadgeVariant(sale.payment_status)}>
                            {sale.payment_status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Direct Actions" subtitle="High-priority system tasks">
            <div className="space-y-3">
              <button 
                className="w-full text-left p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group"
                onClick={() => window.location.href = '/plans-price'}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">Renew Subscription</p>
                  <p className="text-xs text-gray-500 italic">Extend access today</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
              <button 
                className="w-full text-left p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group"
                onClick={() => window.location.href = '/dashboard/user/sales'}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">Open Sales Report</p>
                  <p className="text-xs text-gray-500 italic">Track invoices and dues</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
              <button 
                className="w-full text-left p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-all flex items-center justify-between group"
                onClick={() => window.location.href = '/dashboard/user/inventory'}
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">Open Inventory Report</p>
                  <p className="text-xs text-gray-500 italic">Review items and stock alerts</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </button>
            </div>
          </Card>

          <Card title="Inventory Alerts" subtitle="Items that need attention soon">
            {lowStockItems.length === 0 ? (
              <div className="rounded-xl bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-700">
                Stock levels look healthy right now.
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.item_name}</p>
                      <p className="text-xs text-gray-500">
                        {item.item_code || "No code"} • {item.category || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-rose-600">{item.opening_qty}</p>
                      <p className="text-[11px] text-gray-500">Min {item.min_stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Recently Updated Items" subtitle="Latest changes from your inventory report">
            {recentInventory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
                No inventory updates available yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentInventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.item_name}</p>
                      <p className="text-xs text-gray-500">
                        {item.category || "Uncategorized"} • {item.item_code || "No code"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.sale_price)}</p>
                      <p className="text-[11px] text-gray-500">{formatShortDate(item.updated_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="p-6 rounded-2xl bg-linear-to-br from-blue-600 to-blue-800 text-white shadow-xl shadow-blue-600/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-80 mb-2">Protocol Status</p>
              <h4 className="text-lg font-bold font-headline leading-tight mb-4">
                You have {daysRemaining} days of unlimited access remaining.
              </h4>
              <a
                href="/plans-price" 
                className="inline-block px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold transition-all border border-white/20"
              >
                View Plans
              </a>
            </div>
            <Clock className="absolute -right-8 -bottom-8 w-32 h-32 opacity-10 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatShortDate(value?: string | null) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-IN");
}

function getPaymentBadgeVariant(status?: string): "success" | "warning" | "error" | "neutral" {
  const normalized = String(status || "").toLowerCase();

  if (normalized === "paid") {
    return "success";
  }

  if (normalized === "partial") {
    return "warning";
  }

  if (normalized === "pending") {
    return "error";
  }

  return "neutral";
}

// Re-using local badge logic to avoid circular deps or extra files for simple atoms
const Badge = ({ children, variant = "neutral", className }: { children: React.ReactNode, variant?: "success" | "warning" | "error" | "neutral" | "primary", className?: string }) => {
  const variants = {
    success: "bg-green-100 text-green-700",
    warning: "bg-amber-100 text-amber-700",
    error: "bg-red-100 text-red-700",
    neutral: "bg-gray-100 text-gray-600",
    primary: "bg-blue-100 text-blue-700",
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", variants[variant], className)}>
      {children}
    </span>
  );
};

// Extracted from billing-nextjs UI
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: "bg-transparent text-gray-500 hover:bg-gray-50",
      outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-headline font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const Card = ({ children, className, title, subtitle }: { children: React.ReactNode, className?: string, title?: string, subtitle?: string }) => {
  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-sm border border-gray-100", className)}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h3 className="text-lg font-bold font-headline text-gray-900 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-500 font-body">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};
