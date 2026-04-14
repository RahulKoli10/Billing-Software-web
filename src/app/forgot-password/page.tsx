"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(buildApiUrl("/api/auth/forgot-password"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      toast.success("Password reset email sent! Check your inbox.");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols Ascending:  -1 md:grid-cols-[1.2fr_1fr]">
        {/* LEFT FORM */}
        <div className="p-6 md:p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Forgot Password
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <Link href="/login" className="block text-blue-600 hover:text-blue-700 font-medium">
                Remember your password? Sign in
              </Link>
              <Link href="/signup" className="block text-gray-600 hover:text-gray-900 font-medium">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block relative">
          <Image
            src="/auth-bg.png"
            alt="Auth background"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}

