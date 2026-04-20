import React from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
function page() {
  return (
    <div className="bg-white text-gray-800">
        <Navbar />
      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About BissBill
        </h1>
        <p className="text-lg max-w-3xl mx-auto leading-relaxed">
          Empowering Indian businesses with smart, simple, and powerful{" "}
          <strong>GST Billing Software</strong> that saves time, reduces errors, 
          and helps you grow faster 🚀
        </p>
      </section>

      {/* Intro */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="text-lg leading-relaxed mb-6">
          BissBill is not just another <strong>billing software India</strong> — 
          it's a complete business solution built for modern entrepreneurs. 
          From creating GST-compliant invoices to managing inventory and sales, 
          our platform is designed to make your daily operations smooth and stress-free.
        </p>

        <p className="text-lg leading-relaxed">
          Whether you run a retail shop, wholesale business, or startup, our 
          <strong> GST invoice software</strong> ensures accuracy, speed, and simplicity 
          — even if you're just getting started.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-3">🎯 Our Mission</h2>
            <p className="leading-relaxed">
              To deliver the <strong>best GST billing software for small business India</strong> 
              that is powerful yet easy to use. We aim to provide an 
              <strong> easy GST billing software for beginners</strong> so anyone can manage 
              their business without confusion.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold mb-3">🌍 Our Vision</h2>
            <p className="leading-relaxed">
              To become India's most trusted <strong>online billing software India</strong> 
              and empower every small and medium business with digital tools that drive growth.
            </p>
          </div>

        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          What Makes BissBill Powerful?
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="p-5 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              📄 Smart GST Invoicing
            </h3>
            <p>
              Create professional invoices instantly with our advanced{" "}
              <strong>GST invoice software</strong>.
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              📦 Inventory Management
            </h3>
            <p>
              Track stock in real-time with our <strong>billing software with inventory</strong>.
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              🧾 Barcode Support
            </h3>
            <p>
              Fast billing using <strong>billing software with barcode scanner India</strong>.
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              💬 WhatsApp Integration
            </h3>
            <p>
              Send invoices instantly with <strong>billing software with WhatsApp invoice sharing</strong>.
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              💻 Windows Support
            </h3>
            <p>
              Smooth experience with <strong>billing software for PC Windows India</strong>.
            </p>
          </div>

          <div className="p-5 border rounded-xl hover:shadow-md transition">
            <h3 className="font-semibold text-lg mb-2">
              🏪 Retail POS System
            </h3>
            <p>
              Perfect <strong>POS billing software for retail shop India</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose */}
      <section className="bg-indigo-50 py-12 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">
          Why Businesses Choose BissBill?
        </h2>

        <p className="max-w-3xl mx-auto text-lg leading-relaxed">
          BissBill is a smart <strong>Tally alternative billing software India</strong> 
          designed for speed, simplicity, and scalability. Whether you're a beginner 
          or an experienced business owner, our platform helps you automate billing, 
          reduce errors, and focus on growth.
        </p>
      </section>

      {/* Closing */}
      <section className="max-w-5xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          🚀 Built for Indian Businesses
        </h2>
        <p className="text-lg leading-relaxed">
          With BissBill, you get more than just a <strong>free GST billing software</strong> — 
          you get a complete ecosystem to manage, grow, and scale your business in India.
        </p>
      </section>
    <Footer />
    </div>
  );
}

export default page;