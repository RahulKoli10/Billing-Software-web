"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { buildApiUrl } from "@/lib/api";
import {
  clearWriterSessionToken,
  getWriterSessionToken,
  setWriterSessionToken,
  withWriterAuthHeaders,
  writerApiFetch,
} from "@/lib/writerApi";
import type { WriterAuthContextValue, WriterAuthState, WriterUser } from "@/types/writer";

const WriterAuthContext = createContext<WriterAuthContextValue | null>(null);

export function WriterAuthProvider({ children }: { children: ReactNode }) {
  const [writer, setWriter] = useState<WriterUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth({ showLoader = false }: { showLoader?: boolean } = {}): Promise<WriterAuthState> {
    if (showLoader) {
      setLoading(true);
    }

    if (!getWriterSessionToken()) {
      setWriter(null);
      setLoading(false);
      return { authenticated: false, writer: null };
    }

    try {
      const response = await writerApiFetch("/api/writer/auth/me", {
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      message?: string;
      token?: string;
      writer?: WriterUser;
    };

    if (!response.ok) {
      throw new Error(data?.message || "Login failed");
    }

    if (!data?.token) {
      throw new Error("Login token missing");
    }

    setWriterSessionToken(data.token);

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
        headers: withWriterAuthHeaders(),
      });
    } finally {
      clearWriterSessionToken();
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

