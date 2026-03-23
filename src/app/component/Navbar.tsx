"use client";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400" , "500",  "600", "700"],
});

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { buildApiUrl } from "@/lib/api";
import {
  AUTH_STATE_CHANGED_EVENT,
  notifyAuthStateChanged,
} from "@/lib/auth-events";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<null | { role: string }>(null);

  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const checkAuth = async () => {
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
      setAuthChecked(true);
    }
  };

  const linkClass = (path: string) =>
    `block font-medium transition ${
      pathname === path ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
    }`;

  /* AUTH CHECK */
  useEffect(() => {
    checkAuth();

    const handleAuthChanged = () => {
      checkAuth();
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthChanged);
    window.addEventListener("focus", handleAuthChanged);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthChanged);
      window.removeEventListener("focus", handleAuthChanged);
    };
  }, []);

  /*  CLOSE DROPDOWN ON OUTSIDE CLICK   */
  useEffect(() => {
    if (!menuOpen) return;

    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  /* = LOGOUT  */
  const handleLogout = async () => {
    try {
      await fetch(buildApiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } catch {}

    setIsLoggedIn(false);
    setUser(null);
    setMenuOpen(false);
    setOpen(false);
    notifyAuthStateChanged();
    router.push("/login");
  };

  if (!authChecked) return null;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
          <div className="flex items-center gap-2">
  <Image
    src="/logo.png"
    alt="Billing"
    width={40}
    height={20}
    priority
  />

  <h1
    className={`${montserrat.className} text-xl font-bold text-[#2B3282] tracking-tight`}
  >
    BissBill
  </h1>
</div>
          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex gap-8 text-base">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/download" className={linkClass("/download")}>
              Download
            </Link>
            <Link href="/plans-price" className={linkClass("/plans-price")}>
              Pricing
            </Link>
            <Link href="/features" className={linkClass("/features")}>
              Features
            </Link>
            <Link href="/blog" className={linkClass("/blog")}>
              Blog
            </Link>
            <Link href="/help" className={linkClass("/help")}>
              Help
            </Link>
          </nav>

          {/* RIGHT SIDE (DESKTOP) */}
          <div className="hidden md:flex items-center relative" ref={menuRef}>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="bg-[#0032FF] text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Log in / Sign up
              </Link>
            ) : (
              <>
                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="text-green-700 hover:text-blue-600"
                >
                  <Icon icon="qlementine-icons:user-24" width="25" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-white  rounded-lg shadow-lg">
                    <button
                      onClick={() => {
                        setMenuOpen(false);

                        if (user?.role === "superadmin") {
                          router.push("/dashboard/admin");
                        } else {
                          router.push("/dashboard/user");
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div> 
                )}
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button className="md:hidden text-2xl" onClick={() => setOpen(true)}>
            <Icon icon="solar:hamburger-menu-broken" width="24" />
          </button>
        </div>
      </div>

      {/* MOBILE BACKDROP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-1/2 bg-white z-50
        transform transition-transform duration-300 md:hidden
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="px-6 py-6 space-y-5">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className={linkClass("/")}
          >
            Home
          </Link>
          <Link
            href="/download"
            onClick={() => setOpen(false)}
            className={linkClass("/download")}
          >
            Download
          </Link>
          <Link
            href="/plans-price"
            onClick={() => setOpen(false)}
            className={linkClass("/plans-price")}
          >
            Pricing
          </Link>
          <Link
            href="/features"
            onClick={() => setOpen(false)}
            className={linkClass("/features")}
          >
            Features
          </Link>
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className={linkClass("/blog")}
          >
            Blog
          </Link>
          <Link
            href="/help"
            onClick={() => setOpen(false)}
            className={linkClass("/help")}
          >
            Help
          </Link>

          {!isLoggedIn ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block mt-6 bg-blue-600 text-white text-center py-2 rounded-md"
            >
              Log in / Sign up
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="mt-6 text-left text-red-600 font-medium"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
