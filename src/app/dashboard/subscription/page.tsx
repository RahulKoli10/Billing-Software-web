"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { buildApiUrl } from "@/lib/api";
import {
  CalendarDays,
  CheckCheck,
  Copy,
  CreditCard,
  KeyRound,
  Layers3,
} from "lucide-react";

type SubscriptionHistoryItem = {
  id: number;
  plan_name: string;
  status: string;
  billing_cycle: string;
  start_date: string;
  end_date: string;
  license_key: string | null;
  amount: number | null;
  payment_date: string | null;
  payment_status: string | null;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatDate(value: string | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusTone(status: string) {
  if (status === "active") return "bg-emerald-100 text-emerald-700";
  if (status === "trial") return "bg-blue-100 text-blue-700";
  if (status === "expired") return "bg-rose-100 text-rose-700";
  if (status === "cancelled") return "bg-amber-100 text-amber-700";
  return "bg-slate-100 text-slate-700";
}

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedItems, setCopiedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/subscription/history"), {
        credentials: "include",
      });
      const data = await res.json();
      setSubscriptions(Array.isArray(data) ? data : []);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-500">
            Mentor Overview
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-black">
            Subscription History
          </h1>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-white"
            />
          ))}
        </div>
        <div className="h-56 animate-pulse rounded-3xl border border-slate-100 bg-white" />
      </div>
    );
  }

  if (!subscriptions.length) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-500">
          Mentor Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">
          Subscription History
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-500">
          Your subscription timeline will appear here once you start a trial or activate a paid plan.
        </p>
      </div>
    );
  }

  const activeCount = subscriptions.filter((sub) => sub.status === "active").length;
  const totalSpend = subscriptions.reduce(
    (sum, sub) => sum + Number(sub.amount || 0),
    0
  );
  const latestRenewal = subscriptions[0]?.payment_date || subscriptions[0]?.start_date;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-500">
            Mentor Overview
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">
            Subscription History
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Review your plan journey, renewal rhythm, and active license footprint in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <OverviewCard
          label="Plans on record"
          value={String(subscriptions.length)}
          detail="Total subscription entries tracked"
          icon={Layers3}
          accent="text-blue-600"
          bg="bg-blue-50"
        />
        <OverviewCard
          label="Currently active"
          value={String(activeCount)}
          detail="Plans still providing access"
          icon={KeyRound}
          accent="text-emerald-600"
          bg="bg-emerald-50"
        />
        <OverviewCard
          label="Latest renewal"
          value={formatDate(latestRenewal)}
          detail={`Total invested ${currency.format(totalSpend)}`}
          icon={CalendarDays}
          accent="text-violet-600"
          bg="bg-violet-50"
        />
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-x-auto">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-bold tracking-tight text-black">
            Plan Timeline
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A cleaner view of how each subscription moved through billing and access.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="grid gap-5 px-6 py-6 lg:grid-cols-[1.2fr_0.9fr_0.9fr]"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-black">
                    {sub.plan_name}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusTone(
                      sub.status
                    )}`}
                  >
                    {sub.status}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailPill
                    label="Billing cycle"
                    value={sub.billing_cycle}
                    icon={<CreditCard className="h-4 w-4 text-blue-600" />}
                  />
                  <DetailPill
                    label="License key"
                    value={sub.license_key || "Not assigned"}
                    icon={<KeyRound className="h-4 w-4 text-emerald-600" />}
                    mono
                    onCopy={
                      sub.license_key
                        ? () => handleCopy(sub.license_key as string, `license-${sub.id}`)
                        : undefined
                    }
                    copied={!!copiedItems[`license-${sub.id}`]}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Access Window
                </p>
                <div className="mt-4 space-y-3">
                  <TimelineRow label="Started" value={formatDate(sub.start_date)} />
                  <TimelineRow label="Ends" value={formatDate(sub.end_date)} />
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Payment Snapshot
                </p>
                <div className="mt-4 space-y-3">
                  <TimelineRow
                    label="Amount"
                    value={currency.format(Number(sub.amount || 0))}
                  />
                  <TimelineRow
                    label="Paid on"
                    value={formatDate(sub.payment_date)}
                  />
                  <TimelineRow
                    label="Payment status"
                    value={sub.payment_status || "Not available"}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  label,
  value,
  detail,
  icon: Icon,
  accent,
  bg,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof Layers3;
  accent: string;
  bg: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-black">
            {value}
          </p>
          <p className="mt-2 text-sm text-slate-500">{detail}</p>
        </div>
        <div className={`rounded-2xl p-3 ${bg}`}>
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
      </div>
    </div>
  );
}

function DetailPill({
  label,
  value,
  icon,
  mono = false,
  onCopy,
  copied = false,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  mono?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {label}
        </p>
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <p
          className={`min-w-0 flex-1 truncate text-sm font-semibold text-black ${
            mono ? "font-mono" : ""
          }`}
          title={value}
        >
          {value}
        </p>
        {onCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-white hover:text-blue-600"
            title="Copy to clipboard"
          >
            {copied ? (
              <CheckCheck className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function TimelineRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 pb-3 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </div>
  );
}
