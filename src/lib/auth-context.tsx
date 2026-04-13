"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { buildApiUrl } from "@/lib/api";
import { AUTH_STATE_CHANGED_EVENT, notifyAuthStateChanged } from "@/lib/auth-events";

export type AuthUser = { id: number; name: string; email: string; role: string } | null;
type AuthState = { authenticated: boolean; user: AuthUser };

interface AuthContextValue {
  user: AuthUser;
  isLoggedIn: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(buildApiUrl("/api/auth/me"), {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      const data = await res.json();
      setIsLoggedIn(data.authenticated === true);
      setUser(data.user ?? null);
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    const res = await fetch(buildApiUrl("/api/auth/login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Login failed");
    }

    await checkAuth();
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(buildApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setIsLoggedIn(false);
    setUser(null);
    notifyAuthStateChanged();
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChanged = () => checkAuth();
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthChanged);
    window.addEventListener("focus", handleAuthChanged);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthChanged);
      window.removeEventListener("focus", handleAuthChanged);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

