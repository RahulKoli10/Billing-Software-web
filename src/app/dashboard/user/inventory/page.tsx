"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type ComponentType,
} from "react";
import { Package, Search, Boxes, AlertTriangle, Tag } from "lucide-react";
import { buildApiUrl } from "@/lib/api";

type InventoryItem = {
  id: number;
  company_id: number | null;
  item_type: string | null;
  item_name: string;
  category: string | null;
  hsn_code: string | null;
  item_code: string | null;
  unit: string | null;
  sale_price: number;
  disc_sale_price: number;
  wholesale_price: number;
  purchase_price: number;
  tax_rate: string | null;
  opening_qty: number;
  min_stock: number;
  location: string | null;
  updated_at: string | null;
  user_id: number;
};

type ApiInventoryItem = Partial<InventoryItem> & {
  id?: number | string;
  company_id?: number | string | null;
  item_type?: string | null;
  item_name?: string | null;
  category?: string | null;
  hsn_code?: string | null;
  item_code?: string | null;
  unit?: string | null;
  sale_price?: number | string | null;
  disc_sale_price?: number | string | null;
  wholesale_price?: number | string | null;
  purchase_price?: number | string | null;
  tax_rate?: string | null;
  opening_qty?: number | string | null;
  min_stock?: number | string | null;
  location?: string | null;
  updated_at?: string | null;
  user_id?: number | string;
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleDateString("en-IN");
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    void fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch(buildApiUrl("/api/items"), {
        credentials: "include",
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message || "Failed to load inventory");
      }

      const data = await res.json();
      setItems(
        Array.isArray(data)
          ? data.map((item: ApiInventoryItem) => ({
            id: Number(item.id) || 0,
            company_id:
              item.company_id === null || item.company_id === undefined
                ? null
                : Number(item.company_id),
            item_type: item.item_type || null,
            item_name: item.item_name || "-",
            category: item.category || null,
            hsn_code: item.hsn_code || null,
            item_code: item.item_code || null,
            unit: item.unit || null,
            sale_price: Number(item.sale_price ?? 0),
            disc_sale_price: Number(item.disc_sale_price ?? 0),
            wholesale_price: Number(item.wholesale_price ?? 0),
            purchase_price: Number(item.purchase_price ?? 0),
            tax_rate: item.tax_rate || null,
            opening_qty: Number(item.opening_qty ?? 0),
            min_stock: Number(item.min_stock ?? 0),
            location: item.location || null,
            updated_at: item.updated_at || null,
            user_id: Number(item.user_id) || 0,
          }))
          : []
      );
      setError("");
    } catch (err) {
      console.error("Inventory Error:", err);
      setItems([]);
      setError(err instanceof Error ? err.message : "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredItems = items.filter((item) =>
    [
      item.item_name,
      item.item_code || "",
      item.category || "",
      item.hsn_code || "",
      item.location || "",
    ].some((value) => value.toLowerCase().includes(normalizedSearch))
  );

  const totalItems = filteredItems.length;
  const lowStockItems = filteredItems.filter(
    (item) => item.opening_qty <= item.min_stock
  ).length;
  const inventoryValue = filteredItems.reduce(
    (sum, item) => sum + item.sale_price * item.opening_qty,
    0
  );
  const categories = new Set(
    filteredItems.map((item) => item.category).filter(Boolean)
  ).size;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-black sm:text-3xl">
          Inventory Report
        </h1>
        <p className="mt-1 text-slate-500">
          Track products, stock levels, and selling prices from your items table.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search item name, code, category, HSN..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Items"
          value={<span className="text-xl font-semibold">{totalItems}</span>}
          icon={Boxes}
        />
        <StatCard title="Categories"
          value={<span className="text-xl font-semibold">{categories}</span>}
          icon={Tag}
        />
        <StatCard
          title="Low Stock"
          value={<span className="text-xl font-semibold">{lowStockItems}</span>}
          icon={AlertTriangle}
        />
        <StatCard
          title="Inventory Value"
          value={<span className="text-xl font-semibold">{currency.format(inventoryValue)}</span>}
          icon={Package}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-245 w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Unit</th>
                <th className="p-3 text-left">Sale Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Min Stock</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center">
                    Loading inventory...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-semibold text-black">
                        {item.item_name}
                      </div>
                      <div className="text-xs text-slate-500">
                        HSN: {item.hsn_code || "-"}
                      </div>
                    </td>
                    <td className="p-3">{item.item_code || "-"}</td>
                    <td className="p-3">{item.item_type || "-"}</td>
                    <td className="p-3">{item.category || "-"}</td>
                    <td className="p-3">{item.unit || "-"}</td>
                    <td className="p-3 font-medium">
                      {currency.format(item.sale_price)}
                    </td>
                    <td className="p-3">
                      <span
                        className={
                          item.opening_qty <= item.min_stock
                            ? "font-semibold text-rose-600"
                            : "font-medium text-emerald-600"
                        }
                      >
                        {item.opening_qty}
                      </span>
                    </td>
                    <td className="p-3">{item.min_stock}</td>
                    <td className="p-3">{item.location || "-"}</td>
                    <td className="p-3">{formatDate(item.updated_at)}</td>
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

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: React.ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <div className="mt-2">
        {value}
      </div>
    </div>
  );
}
