"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWriterAuth } from "@/context/WriterAuthContext";

export default function WriterLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { writer, loading, login } = useWriterAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && writer) {
      router.replace(searchParams?.get("next") || "/writer/dashboard");
    }
  }, [loading, router, searchParams, writer]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(email, password);
      router.replace(searchParams?.get("next") || "/writer/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white border border-[#ebebeb] rounded-[24px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden grid md:grid-cols-2">
        {/* Left Side: Brand Statement */}
        <section className="bg-[#f7f5f0] p-12 lg:p-16 flex flex-col justify-center border-r border-[#ebebeb]">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-[#1a1a1a] leading-[1.1]">
            Your stories, <br />
            beautifully crafted.
          </h1>
          <p className="mt-6 text-lg text-[#3d3d3d] leading-relaxed max-w-sm">
            Access the BISSBILL writer portal to manage your content and reach your audience.
          </p>
        </section>

        {/* Right Side: Login Form */}
        <section className="p-10 lg:p-16 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">Sign in</h2>
            <p className="mt-2 text-sm text-[#9a9a9a]">Enter your writer credentials to continue.</p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#3d3d3d]" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full h-11 px-4 rounded-[10px] border border-[#ebebeb] text-sm text-[#1a1a1a] outline-none transition focus:border-[#5b4ced] focus:ring-1 focus:ring-[#5b4ced]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#3d3d3d]" htmlFor="password">
                    Password
                  </label>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-4 rounded-[10px] border border-[#ebebeb] text-sm text-[#1a1a1a] outline-none transition focus:border-[#5b4ced] focus:ring-1 focus:ring-[#5b4ced]"
                />
              </div>

              {error && (
                <div className="p-3 rounded-[8px] bg-rose-50 border border-rose-100 text-xs font-medium text-rose-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 mt-2 bg-[#5b4ced] hover:bg-[#4a3ddb] text-white rounded-[10px] text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </form>
            
            <p className="mt-10 text-xs text-center text-[#9a9a9a]">
              Protected by BISSBILL Security.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

