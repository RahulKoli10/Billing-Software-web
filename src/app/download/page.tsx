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
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DownloadPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch all downloads on load
  

  const fetchDownloads = async (platform?: "windows" | "mac") => {
    try {
      setIsTransitioning(true); // start fade out

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

        setIsTransitioning(false); // fade in
      }, 200); // small delay for smoothness
    } catch (err) {
      console.error("Failed to fetch downloads", err);
      setLoading(false);
      setIsTransitioning(false);
    }
  };
  useEffect(() => {
    fetchDownloads();
  }, []);

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
      <section className="min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Billing Software for PC
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              Providing you a simple and efficient billing application for your
              PC to create professional invoices in seconds, track income &
              expenses easily.
            </p>

            {/* Platform Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => fetchDownloads("mac")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition ${
                  selectedPlatform === "mac"
                    ? "bg-black text-white"
                    : "border border-gray-400 hover:bg-gray-100"
                }`}
              >
                Download for Mac
                <Icon icon="mdi:download" width="18" />
              </button>

              <button
                onClick={() => fetchDownloads("windows")}
                className={`flex items-center gap-2 px-6 py-3 rounded-md transition ${
                  selectedPlatform === "windows"
                    ? "bg-black text-white"
                    : "border border-gray-400 hover:bg-gray-100"
                }`}
              >
                Download for Windows
                <Icon icon="mdi:download" width="18" />
              </button>

              {/* 🔥 Show All only if a platform is selected */}
              {selectedPlatform && (
                <button
                  onClick={() => fetchDownloads()}
                  className="text-sm text-blue-600 underline"
                >
                  Show All Downloads
                </button>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div
  className={`mt-16 transition-all duration-300 ease-in-out ${
    isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
  }`}
>

            {/* Header */}
            <div className="grid grid-cols-3 gap-4 text-sm font-semibold text-gray-500 border-b pb-3">
              <span>Date</span>
              <span>Additional Info</span>
              <span className="text-right">Downloads</span>
            </div>

            {/* Rows */}
            {loading ? (
              <p className="py-10 text-center text-gray-500">
                Loading downloads…
              </p>
            ) : (
              <div className="divide-y border-b">
                {downloads.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-3 gap-4 py-6 items-center"
                  >
                    {/* Date */}
                    <span className="text-gray-800 font-medium">
                      {new Date(item.release_date).toLocaleDateString()}
                    </span>

                    {/* Info */}
                    <div>
                      <p className="font-semibold text-gray-900">
                        File Name: {item.file_name}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Version: {item.version}
                      </p>
                    </div>

                    {/* Download */}
                    <div className="flex flex-col items-end gap-1">
                      <a
                        href={`${API_URL}${item.download_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black hover:text-blue-600"
                      >
                        <Icon
                          icon="ic:baseline-cloud-download"
                          width="30"
                          height="30"
                        />
                      </a>
                      <span className="text-sm text-gray-600">
                        {item.file_size}
                      </span>
                    </div>
                  </div>
                ))}

                {!downloads.length && !loading && (
                  <p className="py-10 text-center text-gray-500">
                    {selectedPlatform
                      ? `No ${selectedPlatform} downloads available`
                      : "No downloads available"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      {/*  hero2  */}

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 space-y-24">
          {/* WINDOWS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Works On Windows
              </h2>

              <ul className="space-y-3 text-gray-700">
                {features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 bg-black rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-8 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                Download for Windows
                <Icon icon="mdi:download" width="18" />
              </button>
            </div>

            {/* Image */}
            <div className="relative w-full h-80 md:h-105">
              <Image
                src="/windowDownload.png"
                alt="Windows Software"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* MAC */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="relative w-full h-80 md:h-105] order-2 lg:order-1">
              <Image
                src="/macDownload.png"
                alt="Mac Software"
                fill
                className="object-contain"
              />
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Works On Mac
              </h2>

              <ul className="space-y-3 text-gray-700">
                {features.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 bg-black rounded-full" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button className="mt-8 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                Download for Mac
                <Icon icon="mdi:download" width="18" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 ">
        <div className="max-w-7xl mx-auto px-5 py-8 rounded-xl">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12  ">
            {/* Left Content */}
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-black">
                Ready to Make Billing Effortless?
              </h2>

              <p className="mt-4 text-gray-700 leading-relaxed max-w-xl">
                Create professional GST invoices, track payments, manage
                inventory, and monitor your business — all from one simple,
                secure billing platform. No stress, just smart billing built for
                growing businesses.
              </p>

              <Link
                href="/signup"
                className="inline-flex items-center gap-1 mt-6 bg-[#0032FF  ] text-white px-6 py-3 rounded-lg font-medium bg-[#0032FF] hover:bg-blue-700 transition"
              >
                Start Free{" "}
                <Icon icon="line-md:arrow-right" width="20" height="20" />
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/billing-invoice.png"
                alt="Billing software dashboard preview"
                width={650}
                height={350}
                className="rounded-xl shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
