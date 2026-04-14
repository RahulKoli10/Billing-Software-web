"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";
import { notifyAuthStateChanged } from "@/lib/auth-events";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Completing Google sign-in...");

  useEffect(() => {
    let cancelled = false;

    async function finalizeLogin() {
      try {
        const response = await fetch(buildApiUrl("/api/auth/me"), {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to verify session");
        }

        const data = await response.json();
        if (cancelled) {
          return;
        }

        if (data?.authenticated) {
          notifyAuthStateChanged();
          router.replace("/dashboard");
          router.refresh();
          return;
        }

        throw new Error("Google login did not create a valid session");
      } catch {
        if (!cancelled) {
          setStatus("Google sign-in failed. Redirecting to login...");
          setTimeout(() => {
            router.replace("/login?oauthError=session");
          }, 1200);
        }
      }
    }

    finalizeLogin();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <p className="text-sm text-gray-600">{status}</p>
    </main>
  );
}
