"use client";
import React from "react";
import Link from "next/link";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { FaRupeeSign, FaChartLine } from "react-icons/fa";
import { IoCubeSharp } from "react-icons/io5";
import { FaFileInvoiceDollar, FaBarcode, FaDesktop, FaWhatsapp } from "react-icons/fa";
import { FiZap, FiCloud, FiHeadphones } from "react-icons/fi"
import { BsFilePost } from "react-icons/bs";
import { GoShieldCheck } from "react-icons/go";
import { IoIosSpeedometer } from "react-icons/io";
function Page() {
  return (
    <>
      <Navbar />

      <div className="bg-gray-50 text-gray-900">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-6 py-16 text-center space-y-5">
          <h1 className="text-4xl md:text-7xl font-bold text-indigo-600">
            About BissBill
          </h1>
          <h2 className="text-3xl font-semibold">India’s Smart GST Billing Software</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            BissBill is a powerful and easy to use GST Billing Software designed specially for Indian small businesses. Our mission is simple to help shop owners, retailers and growing businesses manage billing, inventory and payments without complexity.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">We understand that most business owners don’t come from an accounting background. That’s why BissBill is built as an easy GST billing software for beginners where you can create invoices, track stock and manage your business in just a few clicks.</p>
        </section>

        {/* Features Section */}
        <div className="flex lg:flex-row flex-col justify-between gap-10 lg:p-20 p-10">
          <div className="lg:w-1/2">
            <img src="/aboutus1.png" alt="" className="rounded-xl" />
          </div>
          <div className="lg:w-1/2 space-y-5">
            <h1 className="text-3xl font-bold">Built for Indian Businesses</h1>
            <p className="text-lg">BissBill is more than just a tool it’s a complete billing software India solution that covers everything your business needs:</p>
            <ul className="space-y-5 font-bold">
              <li className="flex items-center gap-5"><FaFileInvoiceDollar className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Create GST-compliant invoices instantly with our GST invoice software</li>
              <li className="flex items-center gap-5"><IoCubeSharp className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Manage stock with billing software with inventory features</li>
              <li className="flex items-center gap-5"><FaRupeeSign className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Track payments and outstanding dues in real-time</li>
              <li className="flex items-center gap-5"><FaChartLine className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Access reports and insights to grow your business faster</li>
            </ul>
            <p className="text-lg">Whether you run a retail shop, wholesale business, or service company, BissBill works as a reliable online billing software India that simplifies your daily operations.</p>
          </div>
        </div>
        {/* Why Choose Section */}
        <section className="bg-white py-16 px-6">
          <div className="flex lg:flex-row flex-col-reverse items-center justify-between gap-5 lg:p-20 ">
            <div className="lg:w-1/2">
              <ul className="font-bold space-y-10">
                <li className="flex items-center gap-5"><FaFileInvoiceDollar className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Best GST billing software for small business India</li>
                <li className="flex items-center gap-5"><IoCubeSharp className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />GST billing software with inventory management</li>
                <li className="flex items-center gap-5"><FaBarcode className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Billing software with barcode scanner India</li>
                <li className="flex items-center gap-5"><FaWhatsapp className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Billing software with WhatsApp invoice sharing</li>
                <li className="flex items-center gap-5"><FaDesktop className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />Billing software for PC Windows India</li>
                <li className="flex items-center gap-5"><BsFilePost className="text-white text-2xl h-10 w-10 p-2 rounded-sm bg-indigo-600" />POS billing software for retail shop India</li>
              </ul>
            </div>
            <div className="lg:w-1/2">
              <img src="/aboutus2.png" alt="" className="rounded-xl" />
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gray-100 py-16 px-6 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center space-y-6">
            <img src="/vision.png" alt="" width={100} />
            <h2 className="text-3xl font-bold text-indigo-600 mb-6">
              Our Vision
            </h2>
            <p className="text-gray-600 text-lg">
              We aim to empower every small business owner in India with smart
              technology that saves time, reduces errors, and increases profits.
            </p>
            <h1 className="font-bold">"With BissBill, billing is not just faster — it’s smarter."</h1>
          </div>
        </section>
        <section className="p-10">
          <div className="flex lg:flex-row flex-col justify-center items-center gap-6 text-2xl">
            <div className="bg-indigo-100 p-10 w-60 flex flex-col gap-5 items-center text-sm rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <FiZap className="text-5xl" />
              <h1>Simple & Easy</h1>
            </div>
            <div className="bg-indigo-100 p-10 w-60 flex flex-col gap-5 items-center text-sm rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <IoIosSpeedometer className="text-5xl" />
              <h1>Fast & Efficient</h1>
            </div>
            <div className="bg-indigo-100 p-10 w-60 flex flex-col gap-5 items-center text-sm rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <GoShieldCheck className="text-5xl" />
              <h1>100% GST Compliants</h1>
            </div>
            <div className="bg-indigo-100 p-10 w-60 flex flex-col gap-5 items-center text-sm rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <FiCloud className="text-5xl" />
              <h1>Secure & Reliable</h1>
            </div>
            <div className="bg-indigo-100 p-10 w-60 flex flex-col gap-5 items-center text-sm rounded-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <FiHeadphones className="text-5xl" />
              <h1>Dedicated Supports</h1>
            </div>
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
            <Link href="/download">
              <button className="bg-indigo-600 text-white px-6 py-3 cursor-pointer rounded-lg font-semibold hover:bg-indigo-700 transition">
                Get Started Free
              </button>
            </Link>
          </motion.div>
        </section>
      </div>

      <Footer />
    </>
  );
}

export default Page;