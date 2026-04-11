"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";
import type { WriterAuthContextValue, WriterAuthState, WriterUser } from "@/types/writer";

const WriterAuthContext = createContext<WriterAuthContextValue | null>(null);

export function WriterAuthProvider({ children }: { children: ReactNode }) {
  const [writer, setWriter] = useState<WriterUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth({ showLoader = false }: { showLoader?: boolean } = {}): Promise<WriterAuthState> {
    if (showLoader) {
      setLoading(true);
    }

    try {
      const response = await fetch(buildApiUrl("/api/writer/auth/me"), {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.authenticated || !data?.writer) {
        setWriter(null);
        return { authenticated: false, writer: null };
      }

      setWriter(data.writer);
      return { authenticated: true, writer: data.writer };
    } catch {
      setWriter(null);
      return { authenticated: false, writer: null };
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const response = await fetch(buildApiUrl("/api/writer/auth/login"), {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    const authState = await checkAuth();

    if (!authState.authenticated) {
      throw new Error("Unable to load writer profile");
    }

    return authState.writer;
  }

  async function logout() {
    try {
      await fetch(buildApiUrl("/api/writer/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setWriter(null);
    }
  }

  useEffect(() => {
    void checkAuth({ showLoader: true });
  }, []);

  return (
    <WriterAuthContext.Provider
      value={{
        writer,
        loading,
        login,
        logout,
        refreshWriter: checkAuth,
      }}
    >
      {children}
    </WriterAuthContext.Provider>
  );
}

export function useWriterAuth(): WriterAuthContextValue {
  const context = useContext(WriterAuthContext);

  if (!context) {
    throw new Error("useWriterAuth must be used within WriterAuthProvider");
  }

  return context;
}

