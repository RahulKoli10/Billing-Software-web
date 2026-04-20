"use client";

import { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaPlus,
  FaMinus,
  FaCheckCircle,
} from "react-icons/fa";
import Footer from "../component/Footer";
import Navbar from "../component/Navbar";

export default function HelpCenterPage() {
  const [loaded, setLoaded] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setLoaded(true);
    });
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How long does the setup take?",
          a: "Most businesses are up and running in less than 10 minutes.",
        },
        {
          q: "Do I need a credit card to sign up?",
          a: "No. You can start for free without entering any card details.",
        },
      ],
    },
    {
      category: "Security & Privacy",
      questions: [
        {
          q: "Where is my data stored?",
          a: "Your data is stored securely with encryption and backups.",
        },
        {
          q: "Is the software GST compliant?",
          a: "Yes, it follows all latest GST rules.",
        },
      ],
    },
  ];

  return (
    <div className="bg-[#f1f5f9] min-h-screen font-sans text-slate-900">
      <Navbar />

      <main>
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12">
          <div
            className={`max-w-3xl transition-all duration-1000 ${
              loaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Let's solve your billing hurdles.
            </h1>

            <p className="text-gray-600 text-lg">
              Our team is ready to help you with GST billing, setup, and more.
            </p>
          </div>
        </section>

        {/* CONTACT FORM */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-12 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-4">
              <div className="bg-slate-900 text-white p-6 h-full rounded-lg">
                <h3 className="text-xl font-bold mb-4">Why talk to us?</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Fast response",
                    "Direct support",
                    "Easy onboarding",
                  ].map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <FaCheckCircle className="text-blue-400 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="lg:col-span-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-4">
                  Contact Support
                </h2>

                <form className="space-y-4">
                  <input
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-lg"
                  />
                  <input
                    placeholder="Email"
                    className="w-full p-3 border rounded-lg"
                  />
                  <textarea
                    placeholder="Your message"
                    className="w-full p-3 border rounded-lg"
                  />

                  <button className="bg-blue-600 text-white px-6 py-3 w-30 rounded-lg flex items-center gap-2">
                    Send <FaArrowRight />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">
              FAQs
            </h2>

            {faqs.map((group, gIdx) => (
              <div key={gIdx} className="mb-6">
                <h3 className="font-semibold mb-3">
                  {group.category}
                </h3>

                {group.questions.map((faq, i) => {
                  const id = `${gIdx}-${i}`;
                  const isOpen = activeFaq === id;

                  return (
                    <div
                      key={i}
                      className="border rounded-lg mb-2"
                    >
                      <button
                        onClick={() =>
                          setActiveFaq(isOpen ? null : id)
                        }
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
      </main>

      <Footer />
    </div>
  );
}