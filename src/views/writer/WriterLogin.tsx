"use client";

import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LockKeyhole, Mail, PenSquare } from "lucide-react";
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(124,111,247,0.24),_transparent_32%),linear-gradient(180deg,#f9f8ff_0%,#f2f1ff_45%,#ffffff_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_32px_80px_-30px_rgba(124,111,247,0.45)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-between p-8 sm:p-10 lg:p-14">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9d5ff] bg-[#f3f1ff] px-4 py-2 text-sm font-semibold text-[#6b5ee8]">
            <PenSquare className="h-4 w-4" />
            Writer Portal
          </div>

          <div className="mt-10 max-w-md">
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Sign in to manage your published voice.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              This area is reserved for content writers only. Use your writer account to access blogs, news, and profile tools.
            </p>
          </div>

          <div className="mt-10 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ece9ff] bg-[#faf9ff] p-4">
              Draft safely
            </div>
            <div className="rounded-2xl border border-[#ece9ff] bg-[#faf9ff] p-4">
              Publish faster
            </div>
            <div className="rounded-2xl border border-[#ece9ff] bg-[#faf9ff] p-4">
              Stay focused
            </div>
          </div>
        </section>

        <section className="flex items-center border-t border-[#efecff] bg-white px-6 py-8 sm:px-10 md:border-l md:border-t-0">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="rounded-[1.75rem] border border-[#e7e3ff] bg-white p-6 shadow-[0_24px_60px_-36px_rgba(124,111,247,0.55)] sm:p-8">
              <h2 className="text-2xl font-semibold text-slate-950">
                Writer login
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your writer credentials to continue.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <Mail className="h-4 w-4 text-[#7c6ff7]" />
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="writer@company.com"
                    required
                    className="w-full rounded-2xl border border-[#ddd8ff] bg-[#fbfaff] px-4 py-3 text-slate-900 outline-none transition focus:border-[#7c6ff7] focus:ring-4 focus:ring-[#7c6ff7]/15"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                    <LockKeyhole className="h-4 w-4 text-[#7c6ff7]" />
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full rounded-2xl border border-[#ddd8ff] bg-[#fbfaff] px-4 py-3 text-slate-900 outline-none transition focus:border-[#7c6ff7] focus:ring-4 focus:ring-[#7c6ff7]/15"
                  />
                </label>
              </div>

              {error ? (
                <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full rounded-2xl bg-[#7c6ff7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#6f61ef] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

