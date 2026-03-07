"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardHome() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

   const backgrounds = [
    "/bg1.jpg",
    "/bg2.jpg",
    "/bg3.jpg",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    const res = await fetch(
      `${API_URL}/api/subscription/my`,
      { credentials: "include" }
    );
    const data = await res.json();
    setSubscription(data);
    setLoading(false);
  };

  if (loading) return <p>Loading...</p>;

  if (!subscription)
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">
          No Active Subscription
        </h2>
        <a
          href="/pricing"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Choose Plan
        </a>
      </div>
    );

  const endDate = new Date(subscription.end_date);
  const today = new Date();

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (endDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-xl font-bold">
        Current Plan: {subscription.plan_name}
      </h2>

      <p>Status: {subscription.status}</p>
      <p>License Key: {subscription.license_key}</p>
      <p>
        Expires on:{" "}
        {new Date(subscription.end_date).toLocaleDateString()}
      </p>

      <p className="text-green-600 font-semibold">
        {daysRemaining} days remaining
      </p>

      <a
        href="/pricing"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        Upgrade Plan
      </a>
    </div>
  );
}
