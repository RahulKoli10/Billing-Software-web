"use client";

import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";
import { ArrowUpRight, BadgeIndianRupee, ReceiptText, ShieldCheck } from "lucide-react";

type PaymentHistoryItem = {
  id: number;
  amount: number | null;
  payment_status: string | null;
  payment_date: string | null;
  plan_name?: string;
  status?: string;
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

function paymentTone(status: string | null) {
  if (status === "paid") return "bg-emerald-100 text-emerald-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (status === "failed") return "bg-rose-100 text-rose-700";
  if (status === "refunded") return "bg-slate-200 text-slate-700";
  return "bg-slate-100 text-slate-700";
}

export default function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(buildApiUrl("/api/subscription/history"), {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">
            Mentor Overview
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Purchase History
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

  if (!payments.length) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">
          Mentor Overview
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Purchase History
        </h1>
        <p className="mt-3 max-w-xl text-sm text-slate-500">
          Once payments are recorded, your billing trail and transaction status will appear here.
        </p>
      </div>
    );
  }

  const paidCount = payments.filter((item) => item.payment_status === "paid").length;
  const totalSpend = payments.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const latestPayment = payments[0]?.payment_date || null;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-500">
          Mentor Overview
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          Purchase History
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Track every payment touchpoint with clearer status language, spend totals, and recent billing momentum.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Transactions"
          value={String(payments.length)}
          detail="Every purchase attempt recorded"
          icon={ReceiptText}
          accent="text-blue-600"
          bg="bg-blue-50"
        />
        <MetricCard
          label="Successful payments"
          value={String(paidCount)}
          detail="Orders completed successfully"
          icon={ShieldCheck}
          accent="text-emerald-600"
          bg="bg-emerald-50"
        />
        <MetricCard
          label="Total billed"
          value={currency.format(totalSpend)}
          detail={`Latest payment ${formatDate(latestPayment)}`}
          icon={BadgeIndianRupee}
          accent="text-violet-600"
          bg="bg-violet-50"
        />
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5">
          <h2 className="text-lg font-black tracking-tight text-slate-900">
            Billing Timeline
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A sharper view of what you paid, when it happened, and how each charge resolved.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {payments.map((payment, index) => (
            <div
              key={payment.id}
              className="grid gap-5 px-6 py-6 md:grid-cols-[1.1fr_0.8fr_0.7fr]"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    {payment.plan_name || `Purchase #${index + 1}`}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${paymentTone(
                      payment.payment_status
                    )}`}
                  >
                    {payment.payment_status || "Unknown"}
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Recorded as part of your subscription billing activity.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Amount
                </p>
                <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                  {currency.format(Number(payment.amount || 0))}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  Billing event captured
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Date
                </p>
                <p className="mt-3 text-sm font-semibold text-slate-900">
                  {formatDate(payment.payment_date)}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Subscription status: {payment.status || "Not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
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
  icon: typeof ReceiptText;
  accent: string;
  bg: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">
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
