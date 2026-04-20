"use client";

import { useState, useEffect } from "react";
import { FaArrowRight, FaPlus, FaMinus, FaLightbulb, FaShieldAlt, FaRocket, FaCheckCircle } from "react-icons/fa";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

<<<<<<< HEAD
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
      question:
        "Does BissBill support barcode scanning and WhatsApp invoice sharing?",
      answer:
        "Yes, both features are built right into BissBill. Our billing software with barcode scanner India support lets you scan products instantly at the counter for faster billing with zero manual entry errors. Once the invoice is ready, you can share it directly with your customer via WhatsApp, SMS, or Email in a single tap. BissBill is one of the very few billing software with WhatsApp invoice sharing available in India making it the perfect choice for retail shops and wholesalers who want fast, paperless billing.",
    },
    {
      id: 5,
      question:
        "Does BissBill work for retail shops and POS billing on PC or Windows?",
      answer:
        "Yes. BissBill is a complete POS billing software for retail shop India that works seamlessly on PC and Windows. Whether you run a grocery store, clothing shop, electronics store, or any other retail business, BissBill handles high-volume billing at the counter with speed and accuracy. It supports barcode scanners, thermal printers, and cash drawers making it the most reliable billing software for PC Windows India for retail owners who need a fast and dependable point-of-sale system.",
    },
  ];
=======
export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setLoaded(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  const faqs = [
    {
      category: "Getting Started",
      icon: <FaRocket />,
      questions: [
        {
          q: "How long does the setup take?",
          a: "Most businesses are up and running in less than 10 minutes. Our onboarding wizard handles the heavy lifting of GST and tax configuration for you."
        },
        {
          q: "Do I need a credit card to sign up?",
          a: "No. You can explore our platform and create your first few invoices completely free without entering any billing details."
        }
      ]
    },
    {
      category: "Security & Privacy",
      icon: <FaShieldAlt />,
      questions: [
        {
          q: "Where is my data stored?",
          a: "We use AES-256 encryption and store all data in Tier-4 data centers with 99.9% uptime guarantees and daily off-site backups."
        },
        {
          q: "Is the software GST compliant?",
          a: "Absolutely. We stay updated with the latest government regulations so your invoices are always legally sound."
        }
      ]
    }
  ];

>>>>>>> change-ui
  return (
    <div className="bg-[#f1f5f9] min-h-screen font-sans antialiased text-slate-900">
      
      <Navbar />

<<<<<<< HEAD
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
                src="/HeroBilling.jpeg"
                alt="Help Center Dashboard"
                width={1200}
                height={700}
                className="object-cover object-top-left"
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
              Can{`'`}t find what you{`'`}re looking for? Our support team is
              here to help. Whether you have a question about GST invoicing,
              inventory setup, pricing plans, or anything else — just drop us a
              message and we{`'`}ll get back to you shortly.
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
=======
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div className={`max-w-3xl transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 md:w-12 bg-blue-600"></span>
            <span className="text-blue-700 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Direct Support
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-950 mb-6 md:mb-8 leading-[1.1]">
            Let's solve your billing<br />
            <span className="text-blue-600 underline decoration-blue-100 underline-offset-4 md:underline-offset-8">
               hurdles.
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium">
            Stop searching for answers. Our senior engineers are ready to walk you through a personalized setup today.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 h-full rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Why talk to us?</h3>

              <ul className="space-y-4">
                {[
                  "Average response under 15 mins",
                  "Direct access to developers",
                  "Custom migration blueprints",
                  "No automated bot loops"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <FaCheckCircle className="text-blue-400 mt-1 shrink-0" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 border shadow-xl">
              <h2 className="text-2xl font-black mb-2">Ready to start?</h2>

              <form className="space-y-6">
                <input placeholder="Full Name" className="w-full p-4 border rounded-xl" />
                <input placeholder="Email" className="w-full p-4 border rounded-xl" />
                <textarea placeholder="Message" className="w-full p-4 border rounded-xl" />

                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 cursor-pointer">
                  Send Inquiry <FaArrowRight />
>>>>>>> change-ui
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* FAQS SECTION */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
=======
      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((group, gIdx) => (
            <div key={gIdx}>
              <h3 className="font-bold mb-4">{group.category}</h3>
>>>>>>> change-ui

              {group.questions.map((faq, i) => {
                const id = `${gIdx}-${i}`;
                const isOpen = activeFaq === id;

                return (
                  <div key={i} className="border rounded-xl mb-3">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : id)}
                      className="w-full flex justify-between p-4"
                    >
                      {faq.q}
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </button>

                    {isOpen && (
                      <div className="p-4 border-t text-gray-600">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <Footer />
<<<<<<< HEAD
    </main>
=======
    </div>
>>>>>>> change-ui
  );
}