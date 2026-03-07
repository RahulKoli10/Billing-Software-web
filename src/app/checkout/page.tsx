"use client";
export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const API = process.env.NEXT_PUBLIC_API_URL;

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayWindow extends Window {
  Razorpay: any;
}

interface Plan {
  name: string;
  monthly_price: number;
  yearly_discount: number;
}

export default function CheckoutPage() {
  const params = useSearchParams();
  const planId = params.get("planId");
  const billing = params.get("billing");

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);

  const GST_PERCENT = 18;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    business_name: "",
    gst_number: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* FETCH PLAN DETAILS */
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;

      try {
        const res = await fetch(`${API}/api/pricing/${planId}`);
        const data = await res.json();
        if (res.ok) setPlan(data);
      } catch (err) {
        toast.error("Failed to load plan details");
      }
    };

    fetchPlan();
  }, [planId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* PRICE CALCULATION */
  let basePrice = 0;

  if (plan) {
    if (billing === "yearly") {
      basePrice =
        plan.monthly_price *
        12 *
        (1 - plan.yearly_discount / 100);
    } else {
      basePrice = plan.monthly_price;
    }
  }

  const gstAmount = (basePrice * GST_PERCENT) / 100;
  const totalAmount = basePrice + gstAmount;

  /* PAYMENT HANDLER */
  const handlePayment = async () => {
    try {
      if (!planId || !billing) {
        toast.error("Invalid plan selection.");
        return;
      }

      if (
        !form.full_name ||
        !form.email ||
        !form.business_name ||
        !form.phone
      ) {
        toast.error("Please fill required fields.");
        return;
      }

      if (!accepted) {
        toast.error("Please accept Terms & Privacy Policy.");
        return;
      }

      setLoading(true);
      const loadingToast = toast.loading("Processing payment...");

      /* Save customer */
      const customerRes = await fetch(`${API}/api/customer`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!customerRes.ok) {
        const errData = await customerRes.json();
        throw new Error(errData.message);
      }

      /* Create Order */
      const res = await fetch(`${API}/api/subscription/create-order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: Number(planId),
          billing_cycle: billing,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      /* Load Razorpay */
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const rzp = new (window as unknown as RazorpayWindow).Razorpay({
          key: data.key,
          amount: data.amount,
          currency: "INR",
          order_id: data.orderId,

          handler: async function (response: RazorpayResponse) {
            const verifyRes = await fetch(
              `${API}/api/subscription/verify-payment`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...response,
                  plan_id: Number(planId),
                  billing_cycle: billing,
                }),
              }
            );

            toast.dismiss(loadingToast);

            if (!verifyRes.ok) {
              toast.error("Payment verification failed");
              setLoading(false);
              return;
            }

            toast.success("Subscription activated successfully!");
            setTimeout(() => {
              window.location.href = "/dashboard/subscription";
            }, 1500);
          },

          theme: {
            color: "#2563eb",
          },
        });

        rzp.open();
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed";
      toast.error(message);
      window.location.href = `/checkout?planId=${planId}&billing=${billing}`;
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black">
            Complete Your Setup
          </h2>
          <p className="mt-3 text-black">
            Tell us about your business before activating your subscription.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT FORM */}
          <div className="space-y-6">
            {Object.keys(form).map((key) => (
              <div key={key}>
                <label className="text-sm text-gray-700 capitalize">
                  {key.replace("_", " ")}
                </label>
                <input
                  name={key}
                  value={form[key as keyof typeof form]}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-2 transition"
                />
              </div>
            ))}

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={() => setAccepted(!accepted)}
                  className="mt-1"
                />
                <span>
                  I agree to the{" "}
                  <a href="/terms" className="underline text-blue-600">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="underline text-blue-600">
                    Privacy Policy
                  </a>.
                </span>
              </div>

              <p className="text-xs text-gray-500">
                Your business and billing information will be used for
                subscription activation, invoice generation and compliance.
                This information may appear on invoices issued by our company.
              </p>
            </div>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="border border-[#7D9AEE] rounded-2xl p-8 space-y-6">
            <h3 className="text-xl font-semibold text-black">
              Subscription Summary
            </h3>

            <div className="flex justify-between text-gray-600">
              <span>Plan</span>
              <span className="font-medium text-black">
                {plan?.name || "Loading..."}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Billing</span>
              <span className="font-medium text-black capitalize">
                {billing}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{basePrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>GST (18%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>

            <hr className="border-gray-200" />

            <div className="flex justify-between text-lg font-semibold text-black">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading || !plan}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
            >
              {loading ? "Processing..." : "Activate & Pay"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Secure payment powered by Razorpay
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
