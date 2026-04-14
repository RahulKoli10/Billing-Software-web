"use client";

import type { ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";
import { toast } from "sonner";

type ApiError = {
  message?: string;
};

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const isStrongPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    // ✅ Compare passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!isStrongPassword) {
      setError("Password must be 8+ chars with uppercase, lowercase, number, symbol");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        buildApiUrl("/api/auth/register"),
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = (await res.json()) as ApiError;

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success(data.message || "Account created successfully");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        
        {/* LEFT FORM SECTION */}
        <div className="p-6 md:p-8">
          <h2 className="text-4xl font-bold text-gray-900 text-center">
            Sign up
          </h2>
          <p className="text-lg text-gray-500 mt-1 text-center">
            Create your account to continue
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded">
                {error}
              </div>
            )}

            {/* Name */}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-lg border px-4 py-2 focus:ring-2 ${
                  confirmPassword.length > 0
                    ? passwordsMatch
                      ? ""
                      : "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              {/* Live Match Indicator */}
              {confirmPassword.length > 0 && (
                <p
                  className={`text-sm mt-1 ${
                    passwordsMatch
                      ? ""
                      : "text-red-600"
                  }`}
                >
                  {passwordsMatch
                    ? ""
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className={`w-full py-2 rounded-lg font-medium transition ${
                loading || !passwordsMatch
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Signing up..." : "Sign up"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <div className="flex-1 h-px bg-gray-200" />
              OR
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={() =>
                (window.location.href =
                  buildApiUrl("/api/auth/google"))
              }
              className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                width={18}
                height={18}
              />
              Continue with Google
            </button>
          </form>

          <p className="text-lg text-gray-600 mt-6 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        {/* RIGHT IMAGE SECTION */}
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

