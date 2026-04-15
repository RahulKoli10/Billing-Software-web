"use client";

import { useEffect, useState, type ComponentType } from "react";
import { buildApiUrl } from "@/lib/api";
import {
  IndianRupee,
  CreditCard,
  AlertCircle,
  FileText,
  Search,
} from "lucide-react";

//          TYPES         
type SaleItem = {
  id: number;
  invoice_no: string;
  customer_name: string;
  customer_mobile: string | null;
  customer_gstin: string | null;
  invoice_date: string;
  due_date: string | null;
  item_count: number | null;
  grand_total: number;
  net_amount: number;
  received_amount: number;
  balance_due: number;
  payment_status: string;
  payment_mode: string | null;
  payment_method: string | null;
};

type ApiSaleItem = Partial<SaleItem> & {
  id?: number | string;
  invoice_no?: string | null;
  customer_name?: string | null;
  customer_mobile?: string | null;
  customer_gstin?: string | null;
  invoice_date?: string | null;
  due_date?: string | null;
  item_count?: number | string | null;
  grand_total?: number | string | null;
  net_amount?: number | string | null;
  received_amount?: number | string | null;
  balance_due?: number | string | null;
  payment_status?: string | null;
  payment_mode?: string | null;
  payment_method?: string | null;
};

//          HELPERS         
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatDate = (date?: string | null) => {
  if (!date) {
    return "-";
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-IN");
};

const statusStyles: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700",
  partial: "bg-amber-100 text-amber-700",
  pending: "bg-rose-100 text-rose-700",
};

//          COMPONENT         
export default function SalesPage() {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/sales"), {
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "Failed to load sales");
      }

      const data = await res.json();
      setSales(
        Array.isArray(data)
          ? data.map((sale: ApiSaleItem) => ({
            id: Number(sale.id) || 0,
            invoice_no: sale.invoice_no || "-",
            customer_name: sale.customer_name || "-",
            customer_mobile: sale.customer_mobile || null,
            customer_gstin: sale.customer_gstin || null,
            invoice_date: sale.invoice_date || "",
            due_date: sale.due_date || null,
            item_count:
              sale.item_count === null || sale.item_count === undefined
                ? null
                : Number(sale.item_count),
            grand_total: Number(sale.grand_total ?? sale.net_amount ?? 0),
            net_amount: Number(sale.net_amount ?? 0),
            received_amount: Number(sale.received_amount ?? 0),
            balance_due: Number(sale.balance_due ?? 0),
            payment_status: String(sale.payment_status || "pending").toLowerCase(),
            payment_mode: sale.payment_mode || null,
            payment_method: sale.payment_method || null,
          }))
          : []
      );
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Failed to load sales");
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  //          FILTER         
  const filtered = sales.filter(
    (s) =>
      s.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
      s.customer_name.toLowerCase().includes(search.toLowerCase())
  );

  //          KPI         
  const total = filtered.reduce((sum, s) => sum + +s.net_amount, 0);
  const received = filtered.reduce((sum, s) => sum + +s.received_amount, 0);
  const pending = filtered.reduce((sum, s) => sum + +s.balance_due, 0);

  //          UI         
  return (
    <div className="space-y-6 sm:space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">
          Sales Dashboard
        </h1>
        <p className="text-slate-500 mt-1">
          Monitor invoices, payments, and pending dues
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search invoice or customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* KPI CARDS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={currency.format(total)}
          icon={IndianRupee}
        />

        <StatCard
          title="Received"
          value={currency.format(received)}
          icon={CreditCard}
        />

        <StatCard
          title="Pending"
          value={currency.format(pending)}
          icon={AlertCircle}
        />

        <StatCard
          title="Invoices"
          value={filtered.length}
          icon={FileText}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-215 w-full text-sm">

            {/* HEADER */}
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Invoice</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Mobile</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Paid</th>
                <th className="p-3 text-left">Due</th>
                <th className="p-3 text-left">Items</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Transaction </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-500">
                    No sales found
                  </td>
                </tr>
              ) : (
                filtered.map((sale) => (
                  <tr
                    key={sale.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="p-3">
                      {formatDate(sale.invoice_date)}
                    </td>
                    <td className="p-3 font-semibold">
                      {sale.invoice_no}
                    </td>
                    <td className="p-3">{sale.customer_name}</td>
                    <td className="p-3">{sale.customer_mobile || "-"}</td>


                    <td className="p-3">
                      {currency.format(sale.grand_total || sale.net_amount)}
                    </td>

                    <td className="p-3 text-emerald-600 font-medium">
                      {currency.format(sale.received_amount)}
                    </td>

                    <td className="p-3 text-rose-600 font-medium">
                      {currency.format(sale.balance_due)}
                    </td>

                    <td className="p-3">{sale.item_count ?? "-"}</td>

                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[sale.payment_status] ||
                          "bg-slate-100"
                          }`}
                      >
                        {sale.payment_status}
                      </span>
                    </td>

                    <td className="p-3">
                      {sale.payment_mode || sale.payment_method || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

//          CARD         
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">{title}</p>
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <p className="text-xl font-semibold mt-2">{value}</p>
    </div>
  );
}
