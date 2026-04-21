"use client";
import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

function Page() {
  return (
    <>
      <Navbar />

      <div className="bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-600 mb-6">
            About BissBill
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            BissBill is a smart and easy-to-use GST billing software built especially
            for small businesses in India.
          </p>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
          {[
            {
              title: "Built for Indian Businesses",
              desc: "Create GST invoices, manage stock, and track payments easily.",
            },
            {
              title: "Simple & Powerful",
              desc: "POS, barcode scanning, and WhatsApp sharing features.",
            },
            {
              title: "Free to Start",
              desc: "Start free and scale as your business grows.",
            },
            {
              title: "Grow Faster",
              desc: "Get insights and reports for better decisions.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Why Choose Section */}
        <section className="bg-white py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-10">
              Why Choose BissBill?
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                "GST billing software for small businesses",
                "Inventory management system",
                "POS billing for retail shops",
                "Barcode-enabled billing",
                "WhatsApp invoice sharing",
                "Works on Windows PCs",
              ].map((point, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gray-100 py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
              Our Vision
            </h2>
            <p className="text-gray-600 text-lg">
              We aim to empower every small business owner in India with smart
              technology that saves time, reduces errors, and increases profits.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Using BissBill Today 🚀
            </h2>
            <p className="text-gray-600 mb-6">
              Create invoices, manage inventory, and grow your business — all in one place.
            </p>
            <a
              href="/"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              Get Started Free
            </a>
          </motion.div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Page;