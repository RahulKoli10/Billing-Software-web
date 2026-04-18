"use client";

import { useState, useEffect } from "react";
import { FaArrowRight, FaPlus, FaMinus, FaLightbulb, FaShieldAlt, FaRocket, FaCheckCircle } from "react-icons/fa";

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
        { q: "How long does the setup take?", a: "Most businesses are up and running in less than 10 minutes. Our onboarding wizard handles the heavy lifting of GST and tax configuration for you." },
        { q: "Do I need a credit card to sign up?", a: "No. You can explore our platform and create your first few invoices completely free without entering any billing details." }
      ]
    },
    {
      category: "Security & Privacy",
      icon: <FaShieldAlt />,
      questions: [
        { q: "Where is my data stored?", a: "We use AES-256 encryption and store all data in Tier-4 data centers with 99.9% uptime guarantees and daily off-site backups." },
        { q: "Is the software GST compliant?", a: "Absolutely. We stay updated with the latest government regulations so your invoices are always legally sound." }
      ]
    }
  ];

  return (
    <div className="bg-[#f1f5f9] min-h-screen font-sans antialiased text-slate-900">
      
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <div className={`max-w-3xl transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-8 md:w-12 bg-blue-600"></span>
            <span className="text-blue-700 font-bold uppercase tracking-widest text-[10px] md:text-xs">Direct Support</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-950 mb-6 md:mb-8 leading-[1.1]">
            Let's solve your <br />
            <span className="text-blue-600 underline decoration-blue-100 underline-offset-4 md:underline-offset-8">
              billing hurdles.
            </span>
          </h1>

          <p className="text-base md:text-xl text-slate-600 leading-relaxed font-medium">
            Stop searching for answers. Our senior engineers are ready to walk you through a personalized setup today.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Why talk to us?</h3>

              <ul className="space-y-4">
                {[
                  "Average response under 15 mins",
                  "Direct access to developers",
                  "Custom migration blueprints",
                  "No automated bot loops"
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <FaCheckCircle className="text-blue-400 mt-1" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 border shadow-xl">
              <h2 className="text-2xl font-black mb-2">Ready to start?</h2>
              <p className="text-sm text-slate-500 mb-8">Fill in your details and we'll reach out within the hour.</p>

              <form className="space-y-6">
                <input placeholder="Full Name" className="w-full p-4 border rounded-xl" />
                <input placeholder="Email" className="w-full p-4 border rounded-xl" />
                <textarea placeholder="Message" className="w-full p-4 border rounded-xl" />

                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl flex items-center gap-2">
                  Send Inquiry <FaArrowRight />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t">
        <div className="max-w-5xl mx-auto space-y-8">
          {faqs.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h3 className="font-bold mb-4">{group.category}</h3>

              {group.questions.map((faq, i) => {
                const id = `${groupIdx}-${i}`;
                const isOpen = activeFaq === id;

                return (
                  <div key={i} className="border rounded-xl mb-3">
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : id)}
                      className="w-full p-4 flex justify-between"
                    >
                      {faq.q}
                      {isOpen ? <FaMinus /> : <FaPlus />}
                    </button>

                    {isOpen && (
                      <div className="p-4 text-sm text-slate-600">
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
    </div>
  );
}