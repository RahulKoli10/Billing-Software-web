"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { buildApiUrl } from "@/lib/api";
import { notifyAuthStateChanged } from "@/lib/auth-events";

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const oauthError = searchParams.get("oauthError");
    if (!oauthError) {
      return;
    }

    setError("Google login failed. Please try again.");
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await fetch(buildApiUrl("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      notifyAuthStateChanged();
      router.replace("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">

        {/* LEFT FORM */}
        <div className="p-6 md:p-8">

          <h2 className="text-3xl font-bold text-center text-gray-900">
            Sign in
          </h2>

          <p className="text-gray-500 text-center mt-2">
            Welcome back! Please login to continue
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border px-4 py-2 pr-12 focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-500"
              >
                {showPassword ? (
                  <Icon icon="iconoir:eye" width="22" />
                ) : (
                  <Icon icon="iconoir:eye-off" width="22" />
                )}
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {/* OPTIONS */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep me logged in
              </label>

              <Link
                href="/forgot-password"
                className="text-blue-600"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-200" />
              OR
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* GOOGLE */}
            <button
              type="button"
              disabled={loading}
              onClick={() =>
                (window.location.href = buildApiUrl(
                  "/api/auth/google?redirect=%2Fauth%2Fcallback"
                ))
              }
              className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={18}
                height={18}
              />
              Continue with Google
            </button>
          </form>

          <p className="text-gray-600 mt-6 text-center">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-blue-600 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:block relative">
          <Image
            src="/auth-bg.png"
            alt="Auth Background"
            fill
            className="object-cover"
            priority
          />
        </div>

      </div>
    </div>
  );
}
