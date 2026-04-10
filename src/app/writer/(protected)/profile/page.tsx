"use client";

import { useWriterAuth } from "@/context/WriterAuthContext";

export default function WriterProfilePage() {
  const { writer } = useWriterAuth();

  return (
    <section className="rounded-[1.75rem] border border-[#e9e5ff] bg-white p-6 shadow-[0_24px_70px_-50px_rgba(124,111,247,0.55)]">
      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
        Profile
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#efecff] bg-[#faf9ff] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Name
          </p>
          <p className="mt-2 text-base font-medium text-slate-900">
            {writer?.name || "Writer"}
          </p>
        </div>
        <div className="rounded-2xl border border-[#efecff] bg-[#faf9ff] p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
            Email
          </p>
          <p className="mt-2 text-base font-medium text-slate-900">
            {writer?.email || "-"}
          </p>
        </div>
      </div>
    </section>
  );
}

