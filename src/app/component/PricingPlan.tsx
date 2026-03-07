"use client";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PricingPlan = {
  id: number;
  name: string;
  monthly_price: number;
  yearly_discount: number;
  description: string;
  highlighted: boolean;
  is_active: boolean;
  sort_order: number;
};

export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const router = useRouter();
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [sortOrder, setSortOrder] = useState("");

  const handleChoosePlan = async (planId: number) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/subscription/start-trial",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan_id: planId }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(
        `Trial Started!\nLicense: ${data.licenseKey}\nExpires: ${new Date(
          data.expires_at,
        ).toLocaleDateString()}`,
      );

      router.push(`/checkout?planId=${planId}&billing=${billing}`);
    } catch (err) {
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await fetch(`${API_URL}/api/pricing`);
        if (!res.ok) throw new Error("Failed to fetch pricing");

        const data = await res.json();
        setPricingPlans(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPricing();
  }, []);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black">
            Flexible Pricing Plans
          </h2>
          <p className="mt-4 text-gray-700">
            Choose a plan that fits your business. Start free and upgrade
            anytime.
          </p>
        </div>

        {/* Toggle */}
        <div className="my-12 flex justify-center items-center gap-4 text-2xl">
          <span
            className={`transition-colors ${
              billing === "monthly"
                ? "font-semibold text-black"
                : "text-gray-400"
            }`}
          >
            Monthly
          </span>

          <button
            onClick={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
            role="switch"
            aria-checked={billing === "yearly"}
            className={`
    relative inline-flex h-7 w-14 items-center rounded-full
    transition-colors duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    ${billing === "monthly" ? "bg-gray-300" : "bg-blue-500"}
  `}
          >
            <span
              className={`
      inline-block h-5 w-5 rounded-full bg-white
      transform transition-transform duration-500 ease-in-out
      ${billing === "monthly" ? "translate-x-1" : "translate-x-8"}
    `}
            />
          </button>

          <span
            className={`transition-colors ${
              billing === "yearly"
                ? "font-semibold text-black"
                : "text-gray-400"
            }`}
          >
            Annually
          </span>
        </div>

        {/* Cards */}
        <div
          className="
    flex gap-6 overflow-x-auto pb-4
    md:grid md:grid-cols-2 md:overflow-visible
    lg:grid-cols-3
  "
        >
          {pricingPlans.map((plan) => {
            const monthlyPrice = plan.monthly_price;

            const yearlyMonthlyPrice = Math.round(
              (monthlyPrice * 12 * (1 - plan.yearly_discount / 100)) / 12,
            );

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8
                  transition-all duration-500 ease-in-out
                  ${
                    plan.highlighted
                      ? "border-[#7D9AEE] shadow-lg scale-[1.05] border-t-4"
                      : "border-[#7D9AEE]"
                  }
                `}
              >
                {/* Discount Badge */}
                <span
                  className={`
    absolute top-4 right-4
    rounded-full bg-blue-100
    px-3 py-1 text-xs font-medium text-blue-600
    transition-all duration-500 ease-in-out
    will-change-[opacity,transform]
    ${
      billing === "yearly"
        ? "opacity-100 translate-y-0 scale-100 blur-0"
        : "opacity-0 -translate-y-2 scale-90 blur-sm pointer-events-none"
    }
  `}
                >
                  {plan.yearly_discount}% OFF
                </span>

                {/* Title (Smooth transition) */}
                <div className="relative h-7 overflow-hidden">
                  <h3
                    className={`absolute inset-0 text-2xl font-semibold
                      transition-all duration-500 ease-in-out
                      ${
                        billing === "monthly"
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2"
                      }
                    `}
                  >
                    {plan.name}
                  </h3>

                  <h3
                    className={`
    absolute inset-0
    text-2xl font-semibold tracking-tight
    transition-all duration-500 ease-in-out
    will-change-[opacity,transform]
    ${
      billing === "yearly"
        ? "opacity-100 translate-y-0 scale-100 blur-0"
        : "opacity-0 translate-y-3 scale-95 blur-sm"
    }
  `}
                  >
                    {plan.name}
                  </h3>
                </div>

                <p className="mt-2 text-black">{plan.description}</p>

                {/* Price */}
                <div className="mt-6 flex items-end gap-2 h-10">
                  {/* Animated price wrapper */}
                  <div className="relative min-w-24 h-10 overflow-hidden">
                    {/* Monthly price */}
                    <span
                      className={`
        absolute inset-0
        text-3xl font-bold tabular-nums
        transition-all duration-500 ease-in-out
        ${
          billing === "monthly"
            ? "opacity-100 translate-y-0 scale-100 blur-0"
            : "opacity-0 -translate-y-3 scale-95 blur-sm"
        }
      `}
                    >
                      ₹{monthlyPrice}
                    </span>

                    {/* Yearly price (per month) */}
                    <span
                      className={`
        absolute inset-0
        text-3xl font-bold tabular-nums
        transition-all duration-500 ease-in-out
        ${
          billing === "yearly"
            ? "opacity-100 translate-y-0 scale-100 blur-0"
            : "opacity-0 translate-y-3 scale-95 blur-sm"
        }
      `}
                    >
                      ₹
                      {Math.round(
                        (monthlyPrice * 12 * (1 - plan.yearly_discount / 100)) /
                          12,
                      )}
                    </span>
                  </div>

                  {/* Label */}
                  <span className="text-gray-500 text-sm leading-none mb-1">
                    / month
                  </span>
                </div>

                {/* CTA */}
                <button
                  onClick={() =>
                    router.push(
                      `/checkout?planId=${plan.id}&billing=${billing}`,
                    )
                  }
                  className={`mt-6 w-full py-2 rounded-lg font-medium transition
                    ${
                      plan.highlighted
                        ? "bg-blue-600 text-white hover:bg-blue-950"
                        : "border border-blue-600 text-blue-600 hover:bg-blue-100"
                    }
                  `}
                >
                  Choose plan
                </button>

                {/* Note */}
                <p className="mt-6 text-sm text-gray-500">
                  48-month plan at ₹11,999 — save 50%.
                  <br />
                  Auto-renews at ₹499/month after the initial term.
                </p>

                <hr className="my-6 border-[#B4C7FB]" />

                {/* Features */}
                <ul className="space-y-3 text-sm text-black">
                  <li className="flex items-center gap-1">
                    <Icon
                      icon="streamline-ultimate:network-pin"
                      width={18}
                      height={18}
                      className="text-blue-600"
                    />
                    <span>Manage 1 Business</span>
                  </li>

                  <li className="flex items-center gap-1">
                    <Icon
                      icon="material-symbols:person-outline"
                      width={18}
                      height={18}
                      className="text-blue-600"
                    />
                    <span>Access for 1 User + 1 CA</span>
                  </li>

                  <li className="flex items-center gap-1">
                    <Icon
                      icon="hugeicons:android"
                      width={18}
                      height={18}
                      className="text-blue-600"
                    />
                    <span>Auto sync across unlimited devices</span>
                  </li>
                </ul>

                <hr className="my-6 border-[#B4C7FB]" />

                <ul
                  className="mt-6 max-h-48 overflow-y-auto space-y-2 text-sm text-gray-700 scrollbar-hide"
                  style={{
                    msOverflowStyle: "none" /* IE and Edge */,
                    scrollbarWidth: "none" /* Firefox */,
                  }}
                >
                  {/* Modern browsers (Chrome/Safari) hide via CSS: */}
                  <style>{`
    ul::-webkit-scrollbar { display: none; }
  `}</style>

                  {[
                    "Dashboard",
                    "Account Master",
                    "Items",
                    "Company",
                    "HSN",
                    "Manufacturer Name",
                    "Opening Balance",
                    "Sale Bill",
                    "Purchase Bill",
                    "Receipt",
                    "Payment",
                    "Ledger",
                    "Day Book",
                    "Sale Register (All)",
                    "Purchase Register (All)",
                    "GSTR 1",
                    "GSTR 2",
                    "GSTR 3B",
                    "GSTR9",
                    "Data Backup",
                    "Repair Data Base",
                    "Data Correction",
                    "Invoice Template",
                    "Import Pre-Design Template",
                    "New Financial Year",
                    "Multi Language",
                    "Mobile Apps",
                    "Category Master",
                  ].map((item) => (
                    <li key={item} className="flex items-center space-x-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {pricingPlans.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No pricing plans available
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
