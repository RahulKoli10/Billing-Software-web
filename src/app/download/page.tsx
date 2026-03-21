"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import Link from "next/link";
import Image from "next/image";

type DownloadItem = {
  id: number;
  file_name: string;
  version: string;
  file_size: string;
  download_url: string;
  release_date: string;
  file_type?: "exe" | "clickonce";
  platform?: "windows" | "mac"; // ✅ important
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DownloadPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  /* ================= FETCH ================= */
  const fetchDownloads = async (platform?: "windows" | "mac") => {
    try {
      setIsTransitioning(true);

      setTimeout(async () => {
        setLoading(true);
        setSelectedPlatform(platform ?? null);

        const url = platform
          ? `${API_URL}/api/downloads?platform=${platform}`
          : `${API_URL}/api/downloads`;

        const res = await fetch(url);
        const data = await res.json();

        setDownloads(data);
        setLoading(false);
        setIsTransitioning(false);
      }, 200);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setIsTransitioning(false);
    }
  };

  useEffect(() => {
    fetchDownloads("windows"); // ✅ default
  }, []);

  /* ================= DOWNLOAD HANDLER ================= */
  const handleDownload = (item: DownloadItem) => {
    const url = `${API_URL}${item.download_url}`;

    if (item.file_type === "clickonce") {
      window.location.href = url;
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = item.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /* ================= FILTER ================= */
  const latestWindows = downloads.find((d) => d.platform === "windows");
  const latestMac = downloads.find((d) => d.platform === "mac");

  const features = [
    "Fast And Smooth Performance",
    "Offline Billing Without Internet",
    "Secure Local Data Storage",
    "Easy Installation Setup",
    "Stable And Reliable Desktop Use",
  ];

  return (
    <main className="font-dm bg-[#F3F6FB]">
      <Navbar />

      {/* ================= HERO ================= */}
      <section className="min-h-screen py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-black">
              Billing Software for PC
            </h1>

            <p className="mt-4 text-gray-600 text-sm md:text-lg">
              Simple and efficient billing software to manage invoices,
              payments, and inventory.
            </p>

            {/* PLATFORM BUTTONS */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => fetchDownloads("windows")}
                className={`px-5 py-2 rounded-md ${
                  selectedPlatform === "windows"
                    ? "bg-black text-white"
                    : "border border-gray-400 hover:bg-gray-100"
                }`}
              >
                Windows
              </button>

              <button
                onClick={() => fetchDownloads("mac")}
                className={`px-5 py-2 rounded-md ${
                  selectedPlatform === "mac"
                    ? "bg-black text-white"
                    : "border border-gray-400 hover:bg-gray-100"
                }`}
              >
                Mac
              </button>

              {selectedPlatform && (
                <button
                  onClick={() => fetchDownloads()}
                  className="text-sm text-blue-600 underline"
                >
                  Show All
                </button>
              )}
            </div>

            {/* ================= DOWNLOAD BUTTONS ================= */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {/* Windows */}
              <button
                onClick={() =>
                  latestWindows && handleDownload(latestWindows)
                }
                disabled={!latestWindows}
                className={`px-6 py-3 rounded-lg ${
                  latestWindows
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {latestWindows
                  ? `Download Windows (${latestWindows.version})`
                  : "Windows Not Available"}
              </button>

              {/* Mac */}
              <button
                onClick={() => latestMac && handleDownload(latestMac)}
                disabled={!latestMac}
                className={`px-6 py-3 rounded-lg ${
                  latestMac
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {latestMac
                  ? `Download Mac (${latestMac.version})`
                  : "Mac Coming Soon"}
              </button>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div
            className={`mt-16 transition-all duration-300 ${
              isTransitioning ? "opacity-0 translate-y-2" : "opacity-100"
            }`}
          >
            <div className="hidden md:grid grid-cols-3 text-sm font-semibold text-gray-500 border-b pb-3">
              <span>Date</span>
              <span>Details</span>
              <span className="text-right">Download</span>
            </div>

            {loading ? (
              <p className="py-10 text-center text-gray-500">Loading...</p>
            ) : (
              <div className="divide-y border-b">
                {downloads.map((item) => (
                  <div
                    key={item.id}
                    className="grid md:grid-cols-3 gap-4 py-5 items-center"
                  >
                    <span className="text-gray-800 text-sm">
                      {new Date(item.release_date).toLocaleDateString()}
                    </span>

                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.file_name}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Version: {item.version}
                      </p>
                    </div>

                    <div className="flex items-center md:justify-end gap-3">
                      <button
                        onClick={() => handleDownload(item)}
                        className="text-black hover:text-blue-600"
                      >
                        <Icon icon="ic:baseline-cloud-download" width="26" />
                      </button>
                      <span className="text-xs text-gray-500">
                        {item.file_size}
                      </span>
                    </div>
                  </div>
                ))}

                {!downloads.length && (
                  <p className="py-10 text-center text-gray-500">
                    No downloads available
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 space-y-16">
          {/* WINDOWS */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-black mb-6">
                Works On Windows
              </h2>

              <ul className="space-y-3 text-gray-700">
                {features.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 bg-black rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  latestWindows && handleDownload(latestWindows)
                }
                className="mt-6 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800"
              >
                Download for Windows
              </button>
            </div>

            <div className="relative w-full h-64 md:h-[420px]">
              <Image
                src="/windowDownload.png"
                alt="Windows Software"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* MAC */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative w-full h-64 md:h-[420px] order-2 lg:order-1">
              <Image
                src="/macDownload.png"
                alt="Mac Software"
                fill
                className="object-contain"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-2xl md:text-4xl font-bold text-black mb-6">
                Works On Mac
              </h2>

              <ul className="space-y-3 text-gray-700">
                {features.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-2 h-2 w-2 bg-black rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => latestMac && handleDownload(latestMac)}
                disabled={!latestMac}
                className={`mt-6 px-6 py-3 rounded-md ${
                  latestMac
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {latestMac ? "Download for Mac" : "Mac Coming Soon"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-5 py-8">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Ready to Make Billing Effortless?
              </h2>

              <p className="mt-4 text-gray-700">
                Start managing your business smarter today.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center gap-2 mt-6 bg-[#0032FF] text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Start Free <Icon icon="line-md:arrow-right" />
              </Link>
            </div>

            <div className="flex-1 flex justify-center">
              <Image
                src="/billing-invoice.png"
                alt="Preview"
                width={600}
                height={350}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}