"use client";

import { Fragment, useEffect, useState, useMemo } from "react";
import { buildApiUrl } from "@/lib/api";
import { Card, Badge, Button } from "@/components/ui/atoms";
import {
  Users,
  Search,
  Filter,
  Mail,
  ChevronRight,
  UserPlus
} from "lucide-react";

interface Customer {
  user_id: number;
  name?: string;
  email?: string;
  business_name?: string;
  current_plan?: string;
  total_revenue?: number;
  current_status?: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/customer/admin/all"), {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.business_name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = activeOnly
        ? ["active", "pushed"].includes(c.current_status || "")
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, activeOnly]);

  const activeCustomers = customers.filter(c => ["active", "pushed"].includes(c.current_status || "")).length;
  const healthIndex = customers.length ? Math.round((activeCustomers / customers.length) * 100) : 0;
  const totalRevenue = customers.reduce((sum, c) => sum + Number(c.total_revenue || 0), 0);
  const pendingCompliance = customers.filter(c => !c.current_status || c.current_status === "pending" || c.current_status === "expired").length;

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-sm border border-gray-100">
        <p className="text-gray-500 font-medium">Loading customer database...</p>
      </div>
    );

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold font-headline text-gray-900 tracking-tighter sm:text-3xl">Customer Directory</h2>
          <p className="text-gray-500 font-medium">Manage entity relationships and health metrics.</p>
        </div>
        <Button size="sm" className="flex items-center gap-2 self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Onboard Entity
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <Card className="flex flex-col items-center text-center p-8 bg-blue-50/50 shadow-none">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-600/20">
            <Users className="text-white w-8 h-8" />
          </div>
          <h4 className="font-bold font-headline text-xl text-gray-900">{customers.length}</h4>
          <p className="text-sm font-bold text-gray-400 opacity-80 uppercase tracking-widest">Total Entities</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-8 border-none bg-gray-50 shadow-none">
          <h4 className="font-bold font-headline text-xl text-green-600">{healthIndex}%</h4>
          <p className="text-xs font-bold text-gray-400 opacity-80 uppercase tracking-widest">Health Index</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-8 border-none bg-gray-50 shadow-none">
          <h4 className="font-bold font-headline text-xl text-blue-600">₹{totalRevenue.toLocaleString()}</h4>
          <p className="text-xs font-bold text-gray-400 opacity-80 uppercase tracking-widest">Total Revenue</p>
        </Card>
        <Card className="flex flex-col items-center text-center p-8 border-none bg-gray-50 shadow-none">
          <h4 className="font-bold font-headline text-xl text-amber-600">{pendingCompliance}</h4>
          <p className="text-xs font-bold text-gray-400 opacity-80 uppercase tracking-widest">Pending Status</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:w-auto">
             <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Filter entities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-gray-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
              />
            </div>
            <Button
              variant={activeOnly ? "primary" : "outline"}
              size="sm"
              className="flex items-center justify-center gap-2 sm:justify-start"
              onClick={() => setActiveOnly(!activeOnly)}
            >
              <Filter className="w-4 h-4" />
              Active Only
            </Button>
          </div>
          <p className="text-xs font-bold text-gray-400">Showing {filteredCustomers.length} of {customers.length} entities</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-215 w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Identifier</th>
                <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Entity details</th>
                <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Current Plan</th>
                <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Revenue</th>
                <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Health</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <Fragment key={customer.user_id}>
                  <tr
                    className="group hover:bg-gray-50/80 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === customer.user_id ? null : customer.user_id)}
                  >
                    <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">ID-{customer.user_id}</td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-900">{customer.business_name || customer.name || "Unknown Entity"}</p>
                      <div className="flex items-center gap-1.5 opacity-60">
                        <Mail className="w-3 h-3 text-gray-500" />
                        <p className="text-sm font-medium text-gray-600">{customer.email || "No email"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-600">{customer.current_plan || "None"}</td>
                    <td className="px-6 py-5 text-sm font-bold text-gray-900">₹{Number(customer.total_revenue || 0).toLocaleString()}</td>
                    <td className="px-6 py-5">
                      <StatusBadge status={customer.current_status} />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className={`w-5 h-5 transition-transform ${expanded === customer.user_id ? 'rotate-90' : ''}`} />
                      </button>
                    </td>
                  </tr>
                  {expanded === customer.user_id && (
                    <tr className="bg-gray-50/30">
                      <td colSpan={6} className="px-6 py-6 border-b border-gray-100">
                        <ExpandedHistory userId={customer.user_id} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No entities matched your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  if (!status) return <Badge variant="neutral">Unknown</Badge>;

  if (["active", "pushed"].includes(status)) return <Badge variant="success">{status}</Badge>;
  if (status === "expired") return <Badge variant="error">Expired</Badge>;
  if (status === "trial") return <Badge variant="warning">Trial</Badge>;

  return <Badge variant="warning">{status}</Badge>;
}

/* ---------- History Section ---------- */

interface SubscriptionHistory {
  id: number;
  license_key: string;
  plan_name: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: string;
}

function ExpandedHistory({ userId }: { userId: number }) {
  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const res = await fetch(
        buildApiUrl(`/api/customer/admin/history?userId=${userId}`),
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setHistory(data);
      setLoading(false);
    };
    fetchHistory();
  }, [userId]);

  if (loading) {
    return <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Loading history cluster...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
        Subscription Architecture Node
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {history.map((h) => (
          <div
            key={`${h.id}-${h.license_key}`}
            className="flex flex-col gap-2 bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="font-bold text-sm text-gray-900">
                {h.plan_name}
              </div>
              <div className="text-right text-sm">
                <div className="font-bold text-gray-900">
                  ₹{h.amount}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-end mt-2">
              <div className="text-xs text-gray-500 font-medium">
                {new Date(h.start_date).toLocaleDateString()} —{" "}
                {new Date(h.end_date).toLocaleDateString()}
              </div>
              <Badge variant={["active", "pushed"].includes(h.status) ? "success" : "neutral"}>
                {h.status}
              </Badge>
            </div>
            <div className="mt-2 text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block w-fit">
              {h.license_key}
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <p className="text-gray-400 text-sm font-medium">
            No historical protocol records found.
          </p>
        )}
      </div>
    </div>
  );
}
