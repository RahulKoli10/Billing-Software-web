"use client";
import { useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";
import { Card, Badge, Button } from "@/components/ui/atoms";
import { 
  Plus, 
  Search, 
  DollarSign,
  Zap,
  Edit2,
  Trash2,
  Star,
  Power,
  X
} from "lucide-react";

type PricingPlan = {
  id: number;
  name: string;
  monthly_price: number;
  yearly_discount: number;
  description: string;
  highlighted: boolean;
  is_active: boolean;
  created_at?: string;
};

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  /* FORM STATE */
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [highlighted, setHighlighted] = useState(false);

  /* FETCH */
  const fetchPlans = async () => {
    try {
      setError(null);
      const res = await fetch(buildApiUrl("/api/pricing/admin"), {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch pricing plans");

      const data = await res.json();
      setPlans(data);
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* RESET FORM */
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setDiscount("");
    setDescription("");
    setHighlighted(false);
  };

  /* CREATE / UPDATE */
  const submitPlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name || !price) {
      alert("Name and price are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingId
        ? buildApiUrl(`/api/pricing/${editingId}`)
        : buildApiUrl("/api/pricing");

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          monthly_price: Number(price),
          yearly_discount: Number(discount) || 0,
          description,
          highlighted,
          is_active: true,
        }),
      });

      if (!res.ok) throw new Error("Save failed");

      resetForm();
      await fetchPlans();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setLoading(false);
    }
  };

  /* EDIT */
  const editPlan = (plan: PricingPlan) => {
    document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
    setEditingId(plan.id);
    setName(plan.name);
    setPrice(String(plan.monthly_price));
    setDiscount(String(plan.yearly_discount));
    setDescription(plan.description);
    setHighlighted(plan.highlighted);
  };

  /* DELETE */
  const deletePlan = async (id: number) => {
    if (!confirm("Delete this pricing plan?")) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(`/api/pricing/${id}`), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Delete failed");

      await fetchPlans();
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete plan");
    } finally {
      setLoading(false);
    }
  };

  /* TOGGLE ACTIVE — SaaS SAFE */
  const toggleActive = async (id: number, active: boolean) => {
    setLoading(true);

    try {
      const res = await fetch(
        buildApiUrl(`/api/pricing/${id}/status`),
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ is_active: !active }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      await fetchPlans();
    } catch {
      alert("Enable / Disable failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: number, highlighted: boolean) => {
    setLoading(true);

    try {
      await fetch(buildApiUrl(`/api/pricing/${id}/featured`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ highlighted: !highlighted }),
      });

      await fetchPlans();
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold font-headline text-gray-900 tracking-tighter sm:text-3xl">Pricing Architect</h2>
          <p className="text-gray-500 font-medium">Design and deploy financial commitment structures.</p>
        </div>
        <Button size="sm" className="flex items-center gap-2 self-start sm:self-auto" onClick={() => { resetForm(); document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
          <Plus className="w-4 h-4" />
          Create New Plan
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center justify-between font-medium text-sm">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-6 order-2 lg:order-1">
          <Card className="overflow-hidden p-0">
             <div className="flex flex-col gap-4 border-b border-gray-100 bg-white p-4 sm:p-6 md:flex-row md:items-center md:justify-between">
              <h3 className="font-bold font-headline text-lg">Active Ledger</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Filter plans..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-gray-50 py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-blue-600/20 md:w-64" 
                />
              </div>
            </div>
            <div className="overflow-x-auto">
            <table className="min-w-[780px] w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Plan ID</th>
                  <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Architecture</th>
                  <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Recurring</th>
                  <th className="px-6 py-4 font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="group hover:bg-gray-50/80 transition-colors cursor-pointer">
                    <td className="px-6 py-5 font-mono text-xs font-bold text-blue-600">P-{plan.id}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{plan.name}</p>
                        {plan.highlighted && <span className="text-[10px] font-bold text-yellow-600 uppercase bg-yellow-50 px-1.5 py-0.5 rounded">Featured</span>}
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium line-clamp-1">{plan.description || "No description provided."}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-gray-900">₹{plan.monthly_price.toLocaleString()}/mo</p>
                      {plan.yearly_discount > 0 && <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">{plan.yearly_discount}% yearly save</p>}
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant={plan.is_active ? "success" : "neutral"}>
                        {plan.is_active ? "Active" : "Disabled"}
                      </Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleFeatured(plan.id, plan.highlighted)}
                          disabled={loading}
                          className={`p-2 rounded-lg transition-colors ${plan.highlighted ? 'text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                          title="Toggle Featured"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleActive(plan.id, plan.is_active)}
                          disabled={loading}
                          className={`p-2 rounded-lg transition-colors ${plan.is_active ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
                          title="Toggle Active Status"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => editPlan(plan)}
                          disabled={loading}
                          className="p-2 rounded-lg transition-colors text-blue-600 hover:bg-blue-50"
                          title="Edit Plan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deletePlan(plan.id)}
                          disabled={loading}
                          className="p-2 rounded-lg transition-colors text-red-600 hover:bg-red-50"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPlans.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">No plans found in ledger.</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6 order-1 lg:order-2">
          <Card 
            id="form-section" 
            title={editingId ? "Edit Tier Architecture" : "Structural Composition"} 
            subtitle={editingId ? `Modifying plan P-${editingId}` : "Create a new price tier layout"}
            className={editingId ? "border-blue-200 ring-4 ring-blue-50" : ""}
          >
            <form onSubmit={submitPlan} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Primary Label</label>
                <input 
                  type="text" 
                  placeholder="e.g. Nordic Enterprise" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-blue-600/20 transition-all outline-none" 
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Description</label>
                <textarea 
                  placeholder="Benefit summary..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  rows={2}
                  className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600/20 transition-all outline-none resize-none font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1 relative">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Monthly Base (₹)</label>
                  <DollarSign className="absolute left-3 top-8 text-gray-400 w-3 h-3" />
                  <input 
                    type="number" 
                    placeholder="0.00" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={loading}
                    required
                    min={0}
                    className="w-full bg-gray-50 border-none rounded-lg pl-8 pr-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-1.5">Yearly Disc (%)</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 20" 
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    disabled={loading}
                    min={0}
                    max={100}
                    className="w-full bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-bold text-green-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none" 
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={highlighted}
                  onChange={() => setHighlighted(!highlighted)}
                  disabled={loading}
                  className="h-4 w-4 accent-blue-600 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">Push to Spotlight</span>
                  <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">Mark as recommended</span>
                </div>
              </label>

              <div className="pt-4 flex gap-3">
                {editingId && (
                  <Button type="button" variant="outline" className="flex-1" onClick={resetForm} disabled={loading}>Clear</Button>
                )}
                <Button type="submit" className={editingId ? "flex-1" : "w-full"} disabled={loading}>
                  {loading ? "Processing..." : (editingId ? "Update Node" : "Phase Build")}
                </Button>
              </div>
            </form>
          </Card>

          <div className="p-6 rounded-2xl bg-gray-900 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <h4 className="text-lg font-bold font-headline leading-tight mb-2">Automated Revenue Protocol</h4>
              <p className="text-sm opacity-60 font-body mb-4">Leverage machine learning to optimize pricing tiers based on usage telemetry and user demand logic.</p>
              <button className="text-xs font-bold font-mono tracking-widest uppercase hover:text-blue-400 transition-colors">Initialize Sequence →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
