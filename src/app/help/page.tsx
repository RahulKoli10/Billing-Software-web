"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";
import { Icon } from "@iconify/react";

export default function HelpCenterPage() {
  const [openId, setOpenId] = useState<number | null>(null);
  const FAQS = [
    {
      id: 1,
      question: "What is BissBill and who is it best for?",
      answer:
        "BissBill is an all-in-one GST billing software designed specifically for small businesses in India. Whether you're a retail shop owner, wholesaler, or a beginner with no accounting knowledge, BissBill makes it easy to create GST invoices, manage inventory, track payments, and generate reports — all from one simple platform. It is the best GST billing software for small business India that requires zero technical expertise to get started.",
    },
    {
      id: 2,
      question: "Is BissBill really free? What features do I get for free?",
      answer:
        "Yes BissBill is free to start. When you sign up, you instantly get access to 45% of our core features including GST invoicing, basic inventory management, and payment tracking — with no credit card required and no hidden charges. It is one of the few free GST billing software options in India that actually gives you meaningful features without asking for payment upfront. You can upgrade anytime to unlock the full power of BissBill.",
    },
    {
      id: 3,
      question: "Can BissBill replace Tally for my small business?",
      answer:
        "Absolutely. BissBill is built as a modern, easy-to-use Tally alternative billing software for India. Unlike Tally, BissBill requires no training or accounting background — your staff can start billing from day one. It covers everything a small business needs — GST invoicing, inventory tracking, purchase management, reports, and multi-user access all in one place. If you're looking for a simpler, faster, and more affordable online billing software India, BissBill is the right switch.",
    },
    {
      id: 4,
      question: "Does BissBill support barcode scanning and WhatsApp invoice sharing?",
      answer:
        "Yes, both features are built right into BissBill. Our billing software with barcode scanner India support lets you scan products instantly at the counter for faster billing with zero manual entry errors. Once the invoice is ready, you can share it directly with your customer via WhatsApp, SMS, or Email in a single tap. BissBill is one of the very few billing software with WhatsApp invoice sharing available in India making it the perfect choice for retail shops and wholesalers who want fast, paperless billing.",
    },
    {
      id: 5,
      question: "Does BissBill work for retail shops and POS billing on PC or Windows?",
      answer:
        "Yes. BissBill is a complete POS billing software for retail shop India that works seamlessly on PC and Windows. Whether you run a grocery store, clothing shop, electronics store, or any other retail business, BissBill handles high-volume billing at the counter with speed and accuracy. It supports barcode scanners, thermal printers, and cash drawers making it the most reliable billing software for PC Windows India for retail owners who need a fast and dependable point-of-sale system.",
    },
     
  ];
  return (
    <main className="font-dm bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full bg-[#F3F6FB] pt-20  overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* LEFT CONTENT */}
          <div className="pb-10 lg:pt-15">
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Hello, How Can We Help You?
            </h1>

            <p className="mt-6 text-gray-500 text-lg max-w-xl leading-relaxed">
              Find instant answers to your questions about BissBill — India{`'`}
              s easiest GST billing software. Search from our help guides,
              tutorials, and support articles below.
            </p>

            {/* Search */}
            <div className="mt-10 flex max-w-md shadow-sm rounded-xl overflow-hidden">
              <input
                type="text"
                placeholder="Ask anything... e.g. How to create a GST invoice
"
                className="flex-1 px-6 py-4 bg-white border-none focus:outline-none text-gray-600"
              />
              <button className="bg-[#2D44E7] text-white px-8 py-4 font-medium hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE - Positioned to bleed off screen and bottom */}
          <div className="relative hidden lg:block h-full">
            <div className="absolute top-0 left-0 w-[140%] h-125 shadow-2xl rounded-tl-3xl border-t border-l border-white/50 overflow-hidden bg-white">
              <Image
                src="/heroBilling.png"
                alt="Help Center Dashboard"
                fill
                className="object-cover object-top-left"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-white text-black py-24">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-24 items-start">
          {/* LEFT INFO */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-10">
              Can{`'`}t find what you{`'`}re looking for? Our support team is here to
              help. Whether you have a question about GST invoicing, inventory
              setup, pricing plans, or anything else — just drop us a message
              and we{`'`}ll get back to you shortly.
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200 mb-10" />

            <div className="space-y-4 mb-12">
              <p className="text-xl text-black">
                <span className="font-medium">Email:</span>{" "}
                bissbill@novanectar.co.in
              </p>
              <p className="text-xl text-black">
                <span className="font-medium">Phone:</span> 91+ 89798 91708
              </p>
            </div>

            <div>
              <p className="font-bold text-lg mb-6">Follow Us On</p>
              <div className="flex gap-6 text-black">
                <a href="#" className="hover:text-blue-600 transition">
                  <Icon icon="mdi:linkedin" className="w-7 h-7" />
                </a>
                <a href="#" className="hover:text-blue-600 transition">
                  <Icon icon="ri:twitter-x-fill" className="w-7 h-7" />
                </a>
                <a href="#" className="hover:text-blue-600 transition">
                  <Icon icon="mdi:instagram" className="w-7 h-7" />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full">
            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Full Name"
                className="w-full bg-[#F3F4F6] rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full bg-[#F3F4F6] rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
              <input
                type="text"
                placeholder="What is your query about?"
                className="w-full bg-[#F3F4F6] rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700"
              />
              <textarea
                placeholder="Describe your issue or question in detail..."
                rows={6}
                className="w-full bg-[#F3F4F6] rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 resize-none"
              />
              <div className="flex justify-end lg:justify-start">
                <button
                  type="submit"
                  className="bg-[#1D2BFF] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQS SECTION */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          {/* FAQ Items */}
          <div className="space-y-6">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border rounded-xl px-6 py-5 transition-all duration-300"
                >
                  {/* Question */}
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-lg">
                      {faq.question}
                    </span>

                    <Icon
                      icon={isOpen ? "mdi:close" : "mdi:plus"}
                      width={20}
                      height={20}
                      className="text-gray-600 transition-transform duration-300"
                    />
                  </button>

                  {/* Answer Wrapper */}
                  <div
                    className={`
                    grid transition-all duration-500 ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-4"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }
                  `}
                  >
                    <div className="overflow-hidden">
                      {/* Divider */}
                      <div
                        className={`
                        h-px bg-blue-500 mb-4
                        transition-all duration-500 ease-in-out
                        ${isOpen ? "scale-x-100" : "scale-x-0"}
                        origin-left
                      `}
                      />

                      {/* Answer */}
                      <p
                        className={`
                        text-gray-600 text-lg leading-relaxed
                        transition-all duration-500 ease-in-out
                        ${isOpen ? "translate-y-0" : "-translate-y-2"}
                      `}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
