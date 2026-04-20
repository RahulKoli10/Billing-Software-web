"use client";

import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { featureItems } from "./featureData";

export default function FeaturePage() {
  return (
    <main className="font-dm">
      <Navbar />

      {/* Features Section */}
      <section className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="text-center max-w-4xl mx-auto text-black">
            <h2 className="text-3xl md:text-[42px] font-bold">
              Everything Your Business Needs to <br />Bill Smarter
            </h2>
            <p className="mt-4 text-base md:text-lg">
              From GST invoicing to inventory, payments to analytics — BissBill is the only GST billing software your business will ever need. Built for Indian small businesses, designed for simplicity.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureItems.map((item) => (
              <div
                key={item.slug}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition bg-white"
              >
                <h3 className="text-2xl font-semibold text-gray-900 font-open">
                  {item.title}
                </h3>

                <p className="mt-2 text-base">{item.cardDescription}</p>

                {/* Image */}
                <Link
                  href={`/features-details?feature=${item.slug}`}
                  className="block mt-4 rounded-lg border border-gray-100 overflow-hidden"
                >
                  <Image
                    src={item.src }
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-auto"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-5 py-8 rounded-xl bg-[#EFF1F8]">
          <div className="flex flex-col-reverse md:flex-row items-center gap-12">
            
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
                className="inline-flex items-center gap-1 mt-6 bg-[#0032FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Start Free
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