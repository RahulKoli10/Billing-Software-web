"use client";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

type PricingPlan = {
  id: number;
  name: string;
  monthly_price: number;
  yearly_discount: number;
  description: string;
  highlighted: boolean;
  is_active: boolean;
};

export default function AdminPricingPage() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch("http://localhost:5000/api/pricing/admin", {
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
  const submitPlan = async () => {
    if (!name || !price) {
      alert("Name and price are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = editingId
        ? `http://localhost:5000/api/pricing/${editingId}`
        : "http://localhost:5000/api/pricing";

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
      const res = await fetch(`http://localhost:5000/api/pricing/${id}`, {
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
        `http://localhost:5000/api/pricing/${id}/status`,
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
    } catch (err) {
      alert("Enable / Disable failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (id: number, highlighted: boolean) => {
    setLoading(true);

    await fetch(`http://localhost:5000/api/pricing/${id}/featured`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ highlighted: !highlighted }),
    });

    await fetchPlans();
    setLoading(false);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Pricing Management</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>
      )}

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2
          className={`text-xl font-semibold mb-4 ${
            editingId ? "text-blue-600" : ""
          }`}
        >
          {editingId ? "Edit Pricing Plan" : "Create New Pricing Plan"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Plan name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded-md px-4 py-2"
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Monthly price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border rounded-md px-4 py-2"
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Yearly discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border rounded-md px-4 py-2"
            disabled={loading}
          />
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md px-4 py-2"
            disabled={loading}
          />
        </div>

        <label className="flex items-center gap-3 mt-4 text-sm font-medium">
          <input
            type="checkbox"
            checked={highlighted}
            onChange={() => setHighlighted(!highlighted)}
            disabled={loading}
            className="h-4 w-4 accent-blue-600"
          />
          Mark as featured plan
        </label>

        <div className="flex gap-3 mt-6">
          <button
            onClick={submitPlan}
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editingId ? "Update Plan" : "Create Plan"}
          </button>

          {editingId && (
            <button
              onClick={resetForm}
              disabled={loading}
              className="border px-6 py-2 rounded-md"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Plan</th>
              <th className="p-4">Price</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-t">
                <td className="p-4">
                  <div className="font-semibold flex items-center gap-2">
                    {plan.name}
                    {plan.highlighted && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {plan.description}
                  </div>
                </td>

                <td className="p-4 font-medium">
                  ₹{plan.monthly_price.toLocaleString()}
                </td>
                <td className="p-4">{plan.yearly_discount}%</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      plan.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {plan.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <div className="flex justify-end items-center gap-3">
                    <button
                      onClick={() => editPlan(plan)}
                      disabled={loading}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                      title="Edit"
                    >
                      <Icon icon="cuida:edit-outline" width="20" />
                    </button>

                    <button
                      onClick={() => toggleFeatured(plan.id, plan.highlighted)}
                      disabled={loading}
                      className={`p-2 rounded ${
                        plan.highlighted
                          ? "text-yellow-600 hover:bg-yellow-50"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      title="Feature"
                    >
                      <Icon icon="material-symbols:star-outline" width="20" />
                    </button>

                    <button
                      onClick={() => toggleActive(plan.id, plan.is_active)}
                      disabled={loading}
                      className="text-purple-600 hover:bg-purple-50 p-2 rounded"
                      title="Enable / Disable"
                    >
                      <Icon
                        icon="material-symbols:power-settings-new"
                        width="20"
                      />
                    </button>

                    <button
                      onClick={() => deletePlan(plan.id)}
                      disabled={loading}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
                      title="Delete"
                    >
                      <Icon icon="fluent:delete-20-regular" width="20" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {plans.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No pricing plans found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="md:hidden space-y-4">
  {plans.map((plan) => (
    <div
      key={plan.id}
      className="bg-white rounded-xl shadow p-4 space-y-3"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            {plan.name}
            {plan.highlighted && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                Featured
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500">{plan.description}</p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded ${
            plan.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {plan.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Pricing */}
      <div className="flex justify-between text-sm">
        <span>Monthly</span>
        <span className="font-medium">
          ₹{plan.monthly_price.toLocaleString()}
        </span>
      </div>

      <div className="flex justify-between text-sm">
        <span>Yearly Discount</span>
        <span>{plan.yearly_discount}%</span>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-3 border-t">
        <button
          onClick={() => editPlan(plan)}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>

        <button
          onClick={() => toggleFeatured(plan.id, plan.highlighted)}
          className="text-yellow-600 text-sm"
        >
          {plan.highlighted ? "Unfeature" : "Feature"}
        </button>

        <button
          onClick={() => toggleActive(plan.id, plan.is_active)}
          className="text-purple-600 text-sm"
        >
          {plan.is_active ? "Disable" : "Enable"}
        </button>

        <button
          onClick={() => deletePlan(plan.id)}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </main>
  );
}
