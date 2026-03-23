"use client";

import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch(buildApiUrl("/api/subscription/history"), {
      credentials: "include",
    });
    const data = await res.json();
    setSubscriptions(data);
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  if (!subscriptions.length)
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold">
          No subscription history
        </h2>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Subscription History
      </h1>

      <div className="bg-white rounded-xl shadow divide-y">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="p-6 space-y-2">

            <div className="flex justify-between">
              <span className="font-semibold">
                {sub.plan_name}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  sub.status === "active"
                    ? "bg-green-100 text-green-600"
                    : sub.status === "expired"
                    ? "bg-red-100 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {sub.status}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              Billing: {sub.billing_cycle}
            </div>

            <div className="text-sm text-gray-600">
              Start:{" "}
              {new Date(sub.start_date).toLocaleDateString()}
            </div>

            <div className="text-sm text-gray-600">
              End:{" "}
              {new Date(sub.end_date).toLocaleDateString()}
            </div>

            <div className="text-sm text-gray-600">
              License: {sub.license_key}
            </div>

            <div className="text-sm text-gray-600">
              Paid: ₹{sub.amount || 0}
            </div>

            <div className="text-xs text-gray-400">
              Payment Date:{" "}
              {sub.payment_date
                ? new Date(sub.payment_date).toLocaleDateString()
                : "N/A"}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
