"use client";

import { useEffect, useState, useMemo } from "react";
import { buildApiUrl } from "@/lib/api";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
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
        c.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = activeOnly
        ? c.current_status === "active"
        : true;

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, activeOnly]);

  if (loading)
    return (
      <div className="bg-white rounded-2xl shadow p-8">
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Customers
        </h2>

        <div className="flex items-center gap-4">
          <input
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={() => setActiveOnly(!activeOnly)}
            />
            Active only
          </label>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredCustomers.map((c) => {
          const isExpanded = expanded === c.user_id;

          return (
            <div
              key={c.user_id}
              className="border rounded-xl p-6 transition hover:shadow-md"
            >
              {/* Top Row */}
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() =>
                  setExpanded(isExpanded ? null : c.user_id)
                }
              >
                <div>
                  <div className="text-lg font-medium">
                    {c.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {c.email}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium">
                    {c.current_plan || "No Subscription"}
                  </div>

                  <StatusBadge status={c.current_status} />
                </div>
              </div>

              {/* Stats Row */}
              <div className="mt-5 grid grid-cols-3 gap-6 text-sm">
                <Stat label="Subscriptions" value={c.total_subscriptions} />
                <Stat
                  label="Revenue"
                  value={`₹${Number(c.total_revenue || 0).toLocaleString()}`}

                />
                <Stat
                  label="Business"
                  value={c.business_name || "—"}
                />
              </div>

              {/* Expand Section */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isExpanded ? "max-h-96 mt-6" : "max-h-0"
                }`}
              >
                {isExpanded && (
                  <ExpandedHistory userId={c.user_id} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No customers found
        </p>
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-gray-500 text-xs uppercase tracking-wide">
        {label}
      </div>
      <div className="font-semibold text-base mt-1">
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (!status)
    return <span className="text-xs text-gray-400">—</span>;

  const color =
    status === "active"
      ? "bg-green-100 text-green-700"
      : status === "expired"
      ? "bg-gray-100 text-gray-600"
      : status === "trial"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${color}`}
    >
      {status}
    </span>
  );
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

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await fetch(
        buildApiUrl(`/api/customer/admin/history?userId=${userId}`),
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) setHistory(data);
    };
    fetchHistory();
  }, [userId]);

  return (
    <div className="border-t pt-6">
      <div className="text-sm font-medium mb-4">
        Subscription History
      </div>

      <div className="space-y-3">
        {history.map((h) => (
          <div
            key={`${h.id}-${h.license_key}`}
            className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
          >
            <div>
              <div className="font-medium text-sm">
                {h.plan_name}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(
                  h.start_date
                ).toLocaleDateString()} —{" "}
                {new Date(h.end_date).toLocaleDateString()}
              </div>
            </div>

            <div className="text-right text-sm">
              <div className="font-medium">
                ₹{h.amount}
              </div>
              <div className="text-xs text-gray-500">
                {h.status}
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <p className="text-gray-400 text-sm">
            No subscription history
          </p>
        )}
      </div>
    </div>
  );
}
