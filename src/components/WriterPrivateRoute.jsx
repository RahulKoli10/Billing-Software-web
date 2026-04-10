"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWriterAuth } from "@/context/WriterAuthContext";

export default function WriterPrivateRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { writer, loading } = useWriterAuth();

  useEffect(() => {
    if (!loading && !writer) {
      router.replace(`/writer/login?next=${encodeURIComponent(pathname || "/writer/dashboard")}`);
    }
  }, [loading, pathname, router, writer]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f3ff]">
        <div className="rounded-2xl border border-[#d9d5ff] bg-white px-6 py-5 text-sm font-semibold text-[#5f54c7] shadow-[0_24px_60px_-28px_rgba(124,111,247,0.45)]">
          Checking writer access...
        </div>
      </div>
    );
  }

  if (!writer) {
    return null;
  }

  return children;
}
