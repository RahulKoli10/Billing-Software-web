"use client";

import type { FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { buildApiUrl } from "@/lib/api";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isStrongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    if (!isStrongPassword) {
      setError("Password must be 8+ chars with uppercase, lowercase, number, symbol");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(buildApiUrl("/api/auth/reset-password"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setSuccess(true);
      toast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">Your password has been reset. Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        {/* LEFT FORM */}
        <div className="p-6 md:p-8">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Reset Password
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="New password (8+ chars)"
                  value={password}
onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    confirmPassword && !passwordsMatch 
                      ? "border-red-300 ring-red-500" 
                      : "border-gray-300"
                  }`}
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
                )}
                {password && !isStrongPassword && password.length >= 8 && (
                  <p className="text-sm text-orange-600 mt-1">
                    Password needs uppercase, lowercase, number, symbol
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !passwordsMatch || !isStrongPassword}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <Link href="/login" className="block text-blue-600 hover:text-blue-700 font-medium mb-4">
                Return to Sign in
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

