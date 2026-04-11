"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { buildApiUrl } from "@/lib/api";

declare global {
  interface RazorpayErrorResponse {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
    metadata?: {
      order_id?: string;
      payment_id?: string;
    };
  }

  interface RazorpayInstance {
    open: () => void;
    on: (event: string, handler: (response: { error: RazorpayErrorResponse }) => void) => void;
  }

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    handler: (response: RazorpayResponse) => Promise<void>;
    theme: {
      color: string;
    };
    modal?: {
      ondismiss?: () => void;
    };
  }

  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface Plan {
  name: string;
  monthly_price: number;
  yearly_discount: number;
}

async function readErrorMessage(
  response: Response,
  fallback = "Payment verification failed",
) {
  try {
    const data = await response.json();
    if (typeof data?.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {}

  return fallback;
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript() {
  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (typeof window.Razorpay === "function") {
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`
    );
    const script = existingScript || document.createElement("script");
    let settled = false;

    const finish = (loaded: boolean) => {
      if (settled) {
        return;
      }

      settled = true;
      window.clearTimeout(timeoutId);
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
      resolve(loaded);
    };

    const handleLoad = () => finish(typeof window.Razorpay === "function");
    const handleError = () => finish(false);
    const timeoutId = window.setTimeout(() => {
      finish(typeof window.Razorpay === "function");
    }, 10000);

    script.addEventListener("load", handleLoad, { once: true });
    script.addEventListener("error", handleError, { once: true });

    if (!existingScript) {
      script.src = RAZORPAY_SCRIPT_URL;
      script.async = true;
      document.body.appendChild(script);
    }
  });
}

function CheckoutForm() {
  const params = useSearchParams();
  const router = useRouter();

  const planId = params.get("planId");
  const billing = params.get("billing");
  const mode = params.get("mode");
  const isTrialMode = mode === "trial";

  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const GST_PERCENT = 18;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    business_name: "",
    gst_number: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
  });

  /* LOAD RAZORPAY SCRIPT */
  useEffect(() => {
    if (isTrialMode) {
      setScriptLoaded(false);
      return;
    }

    let active = true;

    loadRazorpayScript().then((loaded) => {
      if (active) {
        setScriptLoaded(loaded);
      }
    });

    return () => {
      active = false;
    };
  }, [isTrialMode]);

  /* FETCH PLAN */
  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;

      try {
        const res = await fetch(buildApiUrl(`/api/pricing/${planId}`));

        if (!res.ok) throw new Error("Failed to load plan");

        const data = await res.json();
        setPlan(data);
      } catch {
        toast.error("Failed to load plan details");
      }
    };

    fetchPlan();
  }, [planId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* PRICE CALCULATION */

  let basePrice = 0;

  if (plan) {
    basePrice =
      billing === "yearly"
        ? plan.monthly_price * 12 * (1 - plan.yearly_discount / 100)
        : plan.monthly_price;
  }

  const gstAmount = (basePrice * GST_PERCENT) / 100;
  const totalAmount = basePrice + gstAmount;

  const validateForm = () => {
    if (!planId || !billing) {
      toast.error("Invalid plan selection.");
      return false;
    }

    if (
      !form.full_name ||
      !form.email ||
      !form.business_name ||
      !form.phone ||
      !form.address
    ) {
      toast.error("Please fill required fields.");
      return false;
    }

    if (!accepted) {
      toast.error("Please accept Terms & Privacy Policy.");
      return false;
    }

    return true;
  };

  const saveCustomerDetails = async () => {
    const customerRes = await fetch(buildApiUrl("/api/customer"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!customerRes.ok) {
      const message = await readErrorMessage(
        customerRes,
        "Customer save failed",
      );
      throw new Error(message);
    }
  };

  const handleTrialStart = async () => {
    let loadingToast: string | number | undefined;

    try {
      if (!validateForm()) {
        return;
      }

      setLoading(true);
      loadingToast = toast.loading("Starting trial...");

      await saveCustomerDetails();

      const trialRes = await fetch(buildApiUrl("/api/subscription/start-trial"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: Number(planId),
          billing_cycle: billing,
        }),
      });

      const trialData = await trialRes.json();

      if (!trialRes.ok) {
        throw new Error(trialData.message || "Unable to start trial");
      }

      toast.dismiss(loadingToast);
      toast.success("Trial started", {
        description: `License: ${trialData.licenseKey}. Expires: ${new Date(
          trialData.expires_at,
        ).toLocaleDateString()}`,
      });

      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.dismiss(loadingToast);
      toast.error(message);
      setLoading(false);
    }
  };

  /* PAYMENT */

  const handlePayment = async () => {
    let loadingToast: string | number | undefined;
    let paymentCompleted = false;

    try {
      if (!validateForm()) {
        return;
      }

      const razorpayReady = scriptLoaded || (await loadRazorpayScript());

      if (!razorpayReady || typeof window.Razorpay !== "function") {
        toast.error("Payment system could not load. Please refresh and try again.");
        return;
      }

      setLoading(true);
      loadingToast = toast.loading("Processing payment...");

      /* SAVE CUSTOMER */

      await saveCustomerDetails();

      /* CREATE ORDER */

      const orderRes = await fetch(buildApiUrl("/api/subscription/create-order"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan_id: Number(planId),
          billing_cycle: billing,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.message);

      const rzp = new window.Razorpay({
        key: orderData.key,
        amount: orderData.amount,
        currency: "INR",
        order_id: orderData.orderId,

        handler: async function (response: RazorpayResponse) {
          try {
            paymentCompleted = true;
            const verifyRes = await fetch(
              buildApiUrl("/api/subscription/verify-payment"),
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
              const message = await readErrorMessage(verifyRes);
              throw new Error(message);
            }

            toast.success("Subscription activated successfully!");

            window.setTimeout(() => {
              router.push("/dashboard/subscription");
            }, 1500);
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Payment verification failed";

            toast.error(message);
            setLoading(false);
          }
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: () => {
            if (paymentCompleted) {
              return;
            }

            toast.dismiss(loadingToast);
            toast.error("Payment window closed before completion");
            setLoading(false);
          },
        },
      });

      rzp.on("payment.failed", (event) => {
        paymentCompleted = false;
        toast.dismiss(loadingToast);
        toast.error(
          event.error.description || "Payment failed. Please try again."
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Payment failed";

      toast.dismiss(loadingToast);
      toast.error(message);

      router.push(
        `/checkout?planId=${planId}&billing=${billing}${
          isTrialMode ? "&mode=trial" : ""
        }`,
      );

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
            {isTrialMode
              ? "Tell us about your business before starting your free trial."
              : "Tell us about your business before activating your subscription."}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* FORM */}

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
                  className="w-full border-b border-gray-300 focus:border-blue-600 outline-none py-2"
                />
              </div>
            ))}

            <div className="flex items-start gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
              />

              <span>
                I agree to the{" "}
                <a href="/terms" className="underline text-blue-600">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline text-blue-600">
                  Privacy Policy
                </a>
              </span>
            </div>
          </div>

          {/* SUMMARY */}

          <div className="border border-[#7D9AEE] rounded-2xl p-8 space-y-6">

            <h3 className="text-xl font-semibold">
              Subscription Summary
            </h3>

            <div className="flex justify-between">
              <span>Plan</span>
              <span>{plan?.name || "Loading..."}</span>
            </div>

            <div className="flex justify-between">
              <span>Billing</span>
              <span className="capitalize">{billing}</span>
            </div>

            {isTrialMode ? (
              <div className="rounded-lg bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
                No payment needed. Continue to activate your free trial.
              </div>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{basePrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST</span>
                  <span>₹{gstAmount.toFixed(2)}</span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </>
            )}

            <button
              onClick={isTrialMode ? handleTrialStart : handlePayment}
              disabled={loading || !plan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
            >
              {loading
                ? "Processing..."
                : isTrialMode
                  ? "Continue"
                  : "Activate & Pay"}
            </button>

            {!isTrialMode && (
              <p className="text-xs text-gray-400 text-center">
                Secure payment powered by Razorpay
              </p>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default function CheckoutContent() {
  return <CheckoutForm />;
}
