"use client";
import { Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { buildApiUrl } from "@/lib/api";
import {
  notifyAuthStateChanged,
} from "@/lib/auth-events";
import { useAuth } from "@/lib/useAuth";

export default function Navbar() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const dashboardPath = user?.role === "superadmin" ? "/dashboard/admin" : "/dashboard";

  const linkClass = (path: string) =>
    `block font-medium transition ${pathname === path ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
    }`;

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
    } catch { }

    notifyAuthStateChanged();
    router.push("/login");
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* LOGO */}
            <Link href="/" className="">           
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
            </Link>
          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex gap-8 text-base">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/about" className={linkClass("/about")}>
              About Us
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
            {/* <Link href="/blog" className={linkClass("/blog")}>
              Blog
            </Link> */}
            <Link href="/help" className={linkClass("/help")}>
              Help
            </Link>
          </nav>

          {/* RIGHT SIDE (DESKTOP) */}
          <div className="hidden md:flex items-center relative" ref={menuRef}>
            {authLoading ? (
              <div className="h-9 w-28 bg-gray-100 rounded-md animate-pulse" />
            ) : !isLoggedIn ? (
              <Link
                href="/login"
                className="bg-[#0032FF] text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Log in / Sign up
              </Link>
            ) : (
              <>
                <Link
                  href={dashboardPath}
                  className="mr-3 hidden rounded-md bg-[#0032FF] px-4 py-2 text-white hover:bg-blue-700 lg:hidden"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => setMenuOpen((p) => !p)}
                  className="text-green-700 hover:text-blue-600 cursor-pointer"
                >
                  <Icon icon="qlementine-icons:user-24" width="25" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-12 w-44 bg-white  rounded-lg shadow-lg ">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        router.push(dashboardPath);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      Dashboard
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 cursor-pointer"
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
            href="/help"
            onClick={() => setOpen(false)}
            className={linkClass("/help")}
          >
            Help
          </Link>

          {authLoading ? (
            <div className="h-9 w-full bg-gray-100 rounded-md animate-pulse mt-6" />
          ) : !isLoggedIn ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="block mt-6 bg-blue-600 text-white text-center py-2 rounded-md"
            >
              Log in / Sign up
            </Link>
          ) : (
            <>
              <Link
                href={dashboardPath}
                onClick={() => setOpen(false)}
                className="mt-6 block rounded-md bg-[#0032FF] py-2 text-center font-medium text-white"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="mt-4 text-left text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
